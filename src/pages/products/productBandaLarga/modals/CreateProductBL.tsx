import {
    Modal,
    Form,
    Button,
} from "antd";
import { useEffect, useState } from "react";
import { parseBRLInput } from "@/utils/formatBRL";
import { ProductsService, type CreatedProductResponse } from "@/services/products";
import type { ProductExtraGroup } from "@/interfaces/products";
import type { ExtraGroupFormValue } from "../components/ProductBLExtrasBuilder";
import { normalizeExtras } from "./productBL.helpers";
import { ProductBLDetailFields } from "../components/ProductBLDetailFields";
import { ProductBLExtrasFields } from "../components/ProductBLExtrasFields";
import { ProductBLHeaderPricingFields } from "../components/ProductBLHeaderPricingFields";

type UploadFormFile = {
    originFileObj?: File;
};

type DetailFormValue = {
    title: string;
    description?: string;
    images?: UploadFormFile[];
    highlight_top?: boolean;
    highlight_bottom?: boolean;
};

type CreateProductBLFormValues = {
    company?: string;
    business_partner?: string;
    category?: string;
    client_type?: string;
    uf?: string[];
    landing_page?: string;
    name?: string;
    online?: boolean;
    badge?: string;
    offer_title?: string;
    offer_subtitle?: string;
    pricing_base_monthly_original?: string | number;
    pricing_base_monthly?: string | number;
    pricing_installation?: string | number;
    offer_conditions?: UploadFormFile[];
    details?: DetailFormValue[];
    extras_client?: ExtraGroupFormValue[];
    extras_non_client?: ExtraGroupFormValue[];
};

type CreateProductBLProps = {
    createProductBL: (planData: Record<string, unknown>) => Promise<CreatedProductResponse>;
    uploadProductConditionsBL: (payload: {
        id: number;
        files: File[];
    }) => Promise<unknown>;
    uploadProductDetailsBL: (payload: {
        id: number;
        detailIndex: number;
        files: File[];
    }) => Promise<unknown>;
    uploadProductExtrasBL: (payload: {
        id: number;
        extraId: string;
        files: File[];
    }) => Promise<unknown>;
    showCreateModal: boolean;
    setShowCreateModal: (value: boolean) => void;
};

export default function CreateProductBL({
    createProductBL,
    uploadProductConditionsBL,
    uploadProductDetailsBL,
    uploadProductExtrasBL,
    showCreateModal,
    setShowCreateModal,
}: CreateProductBLProps) {
    const [form] = Form.useForm<CreateProductBLFormValues>();
    const [activeExtrasTab, setActiveExtrasTab] = useState<"non_client" | "client">("non_client");
    const productService = new ProductsService();

    useEffect(() => {
        if (showCreateModal) {
            form.resetFields();
            form.setFieldsValue({
                online: true,
                category: "Banda Larga",
            });
            setActiveExtrasTab("non_client");
        }
    }, [showCreateModal, form]);

    const resolveCreatedExtraId = (
        createdGroups: ProductExtraGroup[],
        formGroup: ExtraGroupFormValue,
        formGroupIndex: number,
    ): string | null => {
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

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const detailsArr = Array.isArray(values.details) ? [...values.details] : [];
            const detailsWithoutImages = detailsArr.map((detail) => ({
                title: detail.title,
                description: detail.description || "",
                images: [],
                highlight_top: detail.highlight_top || false,
                highlight_bottom: detail.highlight_bottom || false,
            }));

            const extras = {
                non_client: normalizeExtras(values.extras_non_client),
                client: normalizeExtras(values.extras_client),

            };

            const parsedOriginalPrice = parseBRLInput(values.pricing_base_monthly_original);
            const hasOriginalPrice = values.pricing_base_monthly_original !== undefined
                && values.pricing_base_monthly_original !== null
                && values.pricing_base_monthly_original !== "";

            const payload = {
                company: "TIM",
                business_partner: "TIM",
                category: "Banda Larga",
                landing_page: "banda_larga",
                client_type: values.client_type || "",
                uf: Array.isArray(values.uf) ? values.uf : [],
                name: values.name || "",
                online: values.online ?? true,
                badge: values.badge || null,
                offer_title: values.offer_title || "",
                offer_subtitle: values.offer_subtitle || "",
                pricing: {
                    base_monthly: {
                        ...(hasOriginalPrice ? { original_price: Number(parsedOriginalPrice) } : {}),
                        current_price: Number(parseBRLInput(values.pricing_base_monthly)),
                    },
                    installation: {
                        current_price: Number(parseBRLInput(values.pricing_installation)),
                    },
                },
                details: detailsWithoutImages,
                extras: extras,
                offer_conditions: [],
            };

            const createdProduct = await createProductBL(payload);
            const createdProductId = createdProduct.id;

            if (Number.isFinite(createdProductId) && createdProductId > 0) {
                for (const [detailIndex, detail] of (values.details || []).entries()) {
                    const detailFiles: File[] = (detail.images || [])
                        .map((fileObj: UploadFormFile) => fileObj?.originFileObj)
                        .filter((file: File | undefined): file is File => Boolean(file));

                    if (detailFiles.length > 0) {
                        await uploadProductDetailsBL({
                            id: createdProductId,
                            detailIndex,
                            files: detailFiles,
                        });
                    }
                }
            }

            const offerConditionFiles: File[] = (values.offer_conditions || [])
                .map((fileObj: UploadFormFile) => fileObj?.originFileObj)
                .filter((file: File | undefined): file is File => Boolean(file));

            if (offerConditionFiles.length > 0 && Number.isFinite(createdProductId) && createdProductId > 0) {
                await uploadProductConditionsBL({
                    id: createdProductId,
                    files: offerConditionFiles,
                });
            }

            if (Number.isFinite(createdProductId) && createdProductId > 0) {
                const createdProductData = await productService.getProductById(createdProductId);

                const uploadExtrasImages = async (
                    extrasArr: ExtraGroupFormValue[] | undefined,
                    groupType: "client" | "non_client",
                ) => {
                    if (!Array.isArray(extrasArr)) return;

                    const createdGroups: ProductExtraGroup[] = createdProductData?.extras?.[groupType] || [];

                    for (const [extraIndex, extra] of extrasArr.entries()) {
                        const extraId = resolveCreatedExtraId(createdGroups, extra, extraIndex);
                        const extraImages = (extra.images || []) as Array<string | { originFileObj?: File }>;
                        const files: File[] = extraImages
                            .flatMap((fileObj) =>
                                typeof fileObj === "string" || !fileObj?.originFileObj
                                    ? []
                                    : [fileObj.originFileObj],
                            )
                            .filter((file: File | undefined): file is File => Boolean(file));

                        if (files.length > 0 && !extraId) {
                            console.warn("Nao foi possivel resolver extra_id para upload na criacao", {
                                groupType,
                                extraIndex,
                                label: extra.label,
                            });
                            continue;
                        }

                        if (files.length > 0 && extraId) {
                            await uploadProductExtrasBL({
                                id: createdProductId,
                                extraId,
                                files,
                            });
                        }
                    }
                };
                await uploadExtrasImages(values.extras_client, "client");
                await uploadExtrasImages(values.extras_non_client, "non_client");
            }

            setShowCreateModal(false);
            form.resetFields();
        } catch (error) {
            console.error("Erro ao validar formulario:", error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setShowCreateModal(false);
    };

    return (
        <Modal
            centered
            open={showCreateModal}
            onCancel={handleCancel}
            footer={null}
            width={1100}
            title="Criar Novo Plano"
        >
            <div className="p-4">
                <Form form={form} layout="vertical" className="space-y-2">
                    <div className="max-h-[520px] overflow-y-auto scrollbar-thin">
                        <ProductBLHeaderPricingFields />

                        <ProductBLDetailFields />

                        <ProductBLExtrasFields activeTab={activeExtrasTab} onTabChange={setActiveExtrasTab} />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button onClick={handleCancel}>Cancelar</Button>
                        <Button
                            type="primary"
                            onClick={handleSave}
                            style={{ backgroundColor: "#0026d9", borderColor: "#0026d9" }}
                        >
                            Criar Plano
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
}
