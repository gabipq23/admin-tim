import {
  Modal,
  Form,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect, useState } from "react";
import type {
  IProduct,
  ProductDetail,
  ProductExtraGroup,
  ProductOfferConditionFile,
} from "@/interfaces/products";
import { ProductsService } from "@/services/products";

import ConfirmDeleteModal from "@/components/confirmDeleteModal";
import EditProductBL from "./EditProductBL";
import ProductBLInfoView from "./ProductBLInfoView";
import { type ExtraGroupFormValue } from "../components/ProductBLExtrasBuilder";
import { formatBRL, parseBRLInput } from "@/utils/formatBRL";
import { normalizeExtras } from "./productBL.helpers";

type ModalUploadFile = UploadFile & { isExisting?: boolean };

interface ProductFormDetail {
  title: string;
  description: string;
  highlight_top?: boolean;
  highlight_bottom?: boolean;
  images?: ModalUploadFile[];
}

interface ProductFormValues {
  name: string;
  pricing_base_monthly_original?: string | number;
  pricing_base_monthly: string | number;
  pricing_installation: string | number;
  badge?: string | null;
  offer_title: string;
  offer_subtitle?: string;
  client_type: "PF" | "PJ";
  uf?: string[];
  online: boolean;
  details?: ProductFormDetail[];
  offer_conditions?: ModalUploadFile[];
  extras_client?: ExtraGroupFormValue[];
  extras_non_client?: ExtraGroupFormValue[];
}

interface BLPJInfoModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  showEditProductLayout: boolean;
  setShowEditProductLayout: (value: boolean) => void;
  planData?: IProduct | null;
  removeProductBL: (id: number) => void;
  updateProductBL?: (payload: { id: number; values: Partial<IProduct> }) => Promise<unknown>;
  uploadProductConditionsBL?: (payload: { id: number; files: File[] }) => Promise<unknown>;
  uploadProductDetailsBL?: (payload: { id: number; detailIndex: number; files: File[] }) => Promise<unknown>;
  uploadProductExtrasBL: (payload: {
    id: number;
    extraId: string;
    files: File[];
  }) => Promise<unknown>;
}

function ProductBLInfoModal({
  isModalOpen,
  closeModal,
  planData,
  showEditProductLayout,
  setShowEditProductLayout,
  updateProductBL,
  removeProductBL,
  uploadProductConditionsBL,
  uploadProductDetailsBL,
  uploadProductExtrasBL,
}: BLPJInfoModalProps) {
  const [form] = Form.useForm();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const productService = new ProductsService();

  const getMonthlyOriginalPrice = (pricing: IProduct["pricing"]): number | undefined => {
    if (typeof pricing?.base_monthly === "number") return pricing.base_monthly;
    if (pricing?.base_monthly?.original_price === undefined) return undefined;
    return Number(pricing.base_monthly.original_price);
  };

  const getMonthlyCurrentPrice = (pricing: IProduct["pricing"]): number => {
    if (typeof pricing?.base_monthly === "number") return pricing.base_monthly;
    return Number(pricing?.base_monthly?.current_price ?? 0);
  };

  const getInstallationCurrentPrice = (pricing: IProduct["pricing"]): number => {
    if (typeof pricing?.installation === "number") return pricing.installation;
    return Number(pricing?.installation?.current_price ?? 0);
  };

  const resolveCreatedExtraId = (
    createdGroups: ProductExtraGroup[],
    formGroup: ExtraGroupFormValue,
    formGroupIndex: number,
  ): string | null => {
    if (formGroup.id?.trim() && createdGroups.some((group) => group.id === formGroup.id?.trim())) {
      return formGroup.id.trim();
    }

    const foundByLabelAndType = createdGroups.find(
      (group) =>
        group?.label?.trim() === formGroup.label?.trim()
        && group?.input_type === formGroup.input_type,
    );

    if (foundByLabelAndType?.id) {
      return foundByLabelAndType.id;
    }

    if (createdGroups[formGroupIndex]?.id) {
      return createdGroups[formGroupIndex].id;
    }

    return null;
  };

  useEffect(() => {
    if (planData && showEditProductLayout) {
      const offerConditionsFileList = (
        (planData.offer_conditions || []) as Array<
          ProductOfferConditionFile | string
        >
      ).map(
        (condition: ProductOfferConditionFile | string, idx: number) => {
          const conditionUrl =
            typeof condition === "string" ? condition : condition?.url;
          const fileName = conditionUrl?.split("/").pop() || `arquivo_${idx + 1}`;
          const ext = fileName.split(".").pop()?.toLowerCase();
          const conditionType =
            typeof condition !== "string" && condition?.type
              ? condition.type
              : ext === "pdf"
                ? "application/pdf"
                : ext === "zip"
                  ? "application/zip"
                  : "application/octet-stream";

          return {
            uid: `existing-offer-${idx}`,
            name: fileName,
            status: "done" as const,
            url: conditionUrl,
            type: conditionType,
            isExisting: true,
          };
        },
      );
      const details = ((planData.details || []) as ProductDetail[]).map((
        detail: ProductDetail,
      ) => ({
        description: detail.description,
        title: detail.title,
        highlight_top: detail.highlight_top,
        highlight_bottom: detail.highlight_bottom,
        images: Array.isArray(detail?.images)
          ? detail.images.map((imgUrl: string, idx: number) => ({
            uid: `existing-img-${detail.title}-${idx}`,
            name: imgUrl.split("/").pop() || `imagem_${idx + 1}`,
            status: "done" as const,
            url: imgUrl,
            isExisting: true,
          }))
          : [],
      }));

      form.setFieldsValue({
        name: planData.name,
        pricing_base_monthly_original: formatBRL(getMonthlyOriginalPrice(planData.pricing)),
        pricing_base_monthly: formatBRL(getMonthlyCurrentPrice(planData.pricing)),
        pricing_installation: formatBRL(getInstallationCurrentPrice(planData.pricing)),
        badge: planData.badge,
        offer_title: planData.offer_title,
        offer_subtitle: planData.offer_subtitle,
        client_type: planData.client_type,
        uf: planData.uf,
        online: planData.online,
        details,
        offer_conditions: offerConditionsFileList,
        extras_client: (planData.extras?.client || []).map((g) => ({
          id: g.id,
          input_type: g.input_type,
          label: g.label,
          images: Array.isArray(g.images)
            ? g.images.map((imgUrl: string, idx: number) => ({
              uid: `existing-extra-client-img-${g.id}-${idx}`,
              name: imgUrl.split("/").pop() || `imagem_${idx + 1}`,
              status: "done" as const,
              url: imgUrl,
              isExisting: true,
            }))
            : [],
          options: g.options,
        })),
        extras_non_client: (planData.extras?.non_client || []).map((g) => ({
          id: g.id,
          input_type: g.input_type,
          label: g.label,
          images: Array.isArray(g.images)
            ? g.images.map((imgUrl: string, idx: number) => ({
              uid: `existing-extra-nonclient-img-${g.id}-${idx}`,
              name: imgUrl.split("/").pop() || `imagem_${idx + 1}`,
              status: "done" as const,
              url: imgUrl,
              isExisting: true,
            }))
            : [],
          options: g.options,
        })),
      });
    }
  }, [planData, showEditProductLayout, form]);

  const handleSave = async () => {
    try {
      if (!planData) return;

      const values = (await form.validateFields()) as ProductFormValues;

      const existingConditions: ProductOfferConditionFile[] = [];
      const newConditionFiles: File[] = [];

      for (const file of (values.offer_conditions || [])) {
        if ((file as ModalUploadFile).isExisting && file.url) {
          existingConditions.push({
            url: file.url,
            type: file.type || "application/octet-stream",
          });
        } else if (file.originFileObj) {
          newConditionFiles.push(file.originFileObj);
        }
      }

      const details: ProductDetail[] = (values.details || []).map(
        (detail: ProductFormDetail) => ({
          title: detail.title,
          description: detail.description || "",
          highlight_top: detail.highlight_top || false,
          highlight_bottom: detail.highlight_bottom || false,
          images: Array.isArray(detail.images)
            ? detail.images
              .filter((img: ModalUploadFile) => img.isExisting && img.url)
              .map((img: ModalUploadFile) => img.url as string)
            : [],
        }),
      );

      const parsedOriginalPrice = parseBRLInput(values.pricing_base_monthly_original);
      const hasOriginalPrice = values.pricing_base_monthly_original !== undefined
        && values.pricing_base_monthly_original !== null
        && values.pricing_base_monthly_original !== "";

      const payload = {
        id: planData?.id,
        name: values.name,
        company: planData.company,
        business_partner: planData.business_partner,
        category: planData.category,
        client_type: values.client_type,
        uf: values.uf,
        landing_page: planData.landing_page,
        online: values.online ?? true,
        badge: values.badge,
        offer_title: values.offer_title,
        offer_subtitle: values.offer_subtitle,
        pricing: {
          base_monthly: {
            ...(hasOriginalPrice ? { original_price: parsedOriginalPrice } : {}),
            current_price: parseBRLInput(values.pricing_base_monthly),
          },
          installation: {
            current_price: parseBRLInput(values.pricing_installation),
          },
        },
        details,
        extras: {
          client: normalizeExtras(values.extras_client),
          non_client: normalizeExtras(values.extras_non_client),
        },
        offer_conditions: existingConditions,
      };

      if (updateProductBL && payload.id) {
        await updateProductBL({ id: payload.id, values: payload });
      }

      if (newConditionFiles.length > 0 && uploadProductConditionsBL && planData.id) {
        await uploadProductConditionsBL({ id: planData.id, files: newConditionFiles });
      }

      if (uploadProductDetailsBL && planData.id) {
        for (const [detailIndex, detail] of (values.details || []).entries()) {
          const newDetailFiles: File[] = (detail.images || [])
            .filter((img: ModalUploadFile) => !img.isExisting)
            .map((img: ModalUploadFile) => img.originFileObj as File)
            .filter(Boolean);

          if (newDetailFiles.length > 0) {
            await uploadProductDetailsBL({ id: planData.id, detailIndex, files: newDetailFiles });
          }
        }
      }

      if (uploadProductExtrasBL && planData.id) {
        const refreshedProduct = await productService.getProductById(planData.id);

        const processExtrasImages = async (
          groups: ExtraGroupFormValue[] = [],
          groupType: "client" | "non_client",
        ) => {
          const createdGroups: ProductExtraGroup[] = refreshedProduct?.extras?.[groupType] || [];

          for (const [groupIndex, group] of groups.entries()) {
            const groupId = resolveCreatedExtraId(createdGroups, group, groupIndex);
            const groupImages = (group.images || []) as Array<string | ModalUploadFile>;
            const newExtraFiles: File[] = groupImages
              .filter((img) => typeof img !== "string" && !img.isExisting && Boolean(img.originFileObj))
              .map((img) => (img as ModalUploadFile).originFileObj as File)
              .filter(Boolean);

            if (newExtraFiles.length > 0 && !groupId) {
              console.warn("Upload de extra ignorado por falta de extra_id na edicao", {
                groupIndex,
                label: group.label,
              });
              continue;
            }

            if (newExtraFiles.length > 0 && groupId) {
              await uploadProductExtrasBL({ id: planData.id, extraId: groupId, files: newExtraFiles });
            }
          }
        };
        await processExtrasImages(values.extras_client, "client");
        await processExtrasImages(values.extras_non_client, "non_client");
      }

      setShowEditProductLayout(false);
    } catch (error) {
      console.error("Erro ao validar formulário:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setShowEditProductLayout(false);
  };

  if (!planData) {
    return (
      <Modal
        centered
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={1100}
      >
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500">Nenhum plano selecionado</p>
        </div>
      </Modal>
    );
  }

  return (
    <>
      <Modal
        centered
        open={isModalOpen}
        onCancel={() => {
          closeModal();
          setShowEditProductLayout(false);
        }}
        footer={null}
        width={1100}
        title={showEditProductLayout ? "Editar Plano" : ""}
      >
        <div className="p-4">
          {!showEditProductLayout ? (
            <ProductBLInfoView planData={planData} setShowEditProductLayout={setShowEditProductLayout} setShowDeleteModal={setShowDeleteModal} />
          ) : (
            <EditProductBL handleCancel={handleCancel} handleSave={handleSave} form={form} />
          )}
        </div>
      </Modal>
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          removeProductBL(planData?.id);
          setShowDeleteModal(false);
          closeModal();
        }}
        message="Tem certeza que deseja excluir o plano"
        itemToDelete={planData?.name || planData?.id}
      />
    </>
  );
}

export default ProductBLInfoModal;
