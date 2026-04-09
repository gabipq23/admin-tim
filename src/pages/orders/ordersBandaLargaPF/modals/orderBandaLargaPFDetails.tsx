import { ConfigProvider, Modal, Form } from "antd";
import { useState, useEffect } from "react";
import { OrderBandaLargaPFDisplay } from "./BLPFDisplay";
import { OrderBandaLargaPFEdit } from "./BLPFEdit";
import HeaderInputs from "../../../../components/orders/headerInputs";
import dayjs from "dayjs";
import ConfirmDeleteModal from "@/components/confirmDeleteModal";
import FooterButtons from "@/components/orders/footerButtons";
import { generatePDF } from "../controllers/exportPDF";
import { OrderBandaLarga } from "@/interfaces/orderBandaLarga";

export function OrderBandaLargaPFDetailsModal({
  isModalOpen,
  closeModal,
  selectedId,
  updateOrderData,
  removeOrderData,
  isRemoveOrderFetching,
  changeBandaLargaOrderStatus,
  planBLPFStock,
  statusOptions,
  updateDataIdCRMAndConsultorResponsavel
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedId: OrderBandaLarga | null;
  updateOrderData?: (params: { id: number; data: any }) => void;
  removeOrderData: any;
  isRemoveOrderFetching: boolean;
  changeBandaLargaOrderStatus: any;
  planBLPFStock: any;
  statusOptions: string[] | undefined;
  updateDataIdCRMAndConsultorResponsavel: any
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localData, setLocalData] = useState<OrderBandaLarga | null>(null);
  const [form] = Form.useForm();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [consultor, setConsultor] = useState<string>("");
  const [idVivo, setIdVivo] = useState<string>("");
  const [idCRM, setIdCRM] = useState<string>("");
  const [idCORP, setIdCORP] = useState<string>("");
  const [credito, setCredito] = useState<number | string>(0);

  useEffect(() => {
    if (selectedId) {
      setLocalData(selectedId);
    }
  }, [selectedId]);

  const planOptions = Array.isArray(planBLPFStock)
    ? planBLPFStock
      .filter((plan: any) => plan.client_type === 'PF' && plan.online === true && plan.uf.includes(localData?.state || ""))
      .map((plan: any) => ({
        value: plan.id,
        label: plan.name + " " + plan.pricing?.base_monthly?.current_price,
        name: plan.name + " " + plan.pricing?.base_monthly?.current_price,
        price: plan.pricing?.base_monthly?.current_price,
        plan,
      }))
    : [];


  const handlePlanChange = (planId: number) => {
    const selectedPlan = planOptions.find((plan) => plan.value === planId);
    if (selectedPlan) {
      form.setFieldsValue({
        plan_name: selectedPlan.name,
        value: selectedPlan.value,
        id: localData?.plan?.id || "",
      });

      setLocalData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          plan: {
            name: selectedPlan.name,
            value: parseFloat(selectedPlan.value),
            id: selectedPlan.value,
          },
          price_summary: {
            ...prev.price_summary,
            plan_price: selectedPlan.price,
          },
        };
      });
    }
  };

  useEffect(() => {
    setConsultor(localData?.responsible_consultant
      || "");

    setIdCORP(localData?.corporate_id ? String(localData.corporate_id) : "");
    setIdCRM(localData?.crm_id ? String(localData.crm_id) : "");
    setCredito(localData?.credit || 0);
  }, [selectedId, localData]);

  useEffect(() => {
    if (localData && isEditing) {
      const addressComplement = localData.address_complement || null;

      form.setFieldsValue({
        plan_id: localData.plan?.id || "",
        plan_name: localData.plan?.name || "",
        plan_value: localData.plan?.value?.toString() || "",
        full_name: localData.full_name,
        cpf: localData.cpf,
        birth_date: localData.birth_date,
        mother_full_name: localData.mother_full_name,
        phone: localData.phone,
        additional_phone: localData.additional_phone,
        email: localData.email,
        address: localData.address,
        address_number: localData.address_number,
        address_complement: {
          lot: addressComplement?.lot || localData.address_lot || "",
          block: addressComplement?.block || localData.address_block || "",
          floor: addressComplement?.floor || localData.address_floor || "",
          square: addressComplement?.square || localData.address_block || "",
          unit_type: addressComplement?.unit_type || "",
          unit_number: addressComplement?.unit_number || "",
          building_or_house: addressComplement?.building_or_house || localData.building_or_house || "house",
          home_complement: addressComplement?.home_complement || "",
          reference_point: addressComplement?.reference_point || localData.address_reference_point || "",
        }, address_lot: localData.address_lot,
        address_floor: localData.address_floor,
        address_block: localData.address_block,
        building_or_house: localData.building_or_house,
        district: localData.district,
        city: localData.city,
        state: localData.state,
        zip_code: localData.zip_code,
        single_zip_code: localData.single_zip_code,
        installation_preferred_date_one:
          localData.installation_preferred_date_one
            ? dayjs(localData.installation_preferred_date_one, "DD/MM/YYYY")
            : null,

        installation_preferred_date_two:
          localData.installation_preferred_date_two
            ? dayjs(localData.installation_preferred_date_two, "DD/MM/YYYY")
            : null,

        installation_preferred_period_one:
          localData.installation_preferred_period_one,

        installation_preferred_period_two:
          localData.installation_preferred_period_two,
        wants_esim: localData.wants_esim,
        line_number_informed: localData.line_number_informed,
        line_action: localData.line_action,
        address_reference_point: localData.address_reference_point,
        due_day: localData.due_day,
        accept_offers: localData.accept_offers,
        terms_accepted: localData.terms_accepted,
        url: localData.url,
        status: localData.status,
      });
    }
  }, [localData, isEditing, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const addressComplement = {
        lot: values.address_complement?.lot ?? null,
        block:
          values.address_complement?.block ??
          values.address_complement?.square ??
          null,
        floor: values.address_complement?.floor ?? null,
        square: values.address_complement?.square ?? null,
        unit_type: values.address_complement?.unit_type ?? null,
        unit_number: values.address_complement?.unit_number ?? null,
        building_or_house:
          values.address_complement?.building_or_house ||
          localData?.address_complement?.building_or_house ||
          localData?.building_or_house ||
          "house",
        home_complement: values.address_complement?.home_complement ?? null,
        reference_point: values.address_complement?.reference_point ?? null,
      };

      const normalizedValues = {
        ...values,
        full_name: values.full_name,
        birth_date: values.birth_date,
        mother_full_name: values.mother_full_name,
        additional_phone: values.additional_phone,
        address_number: values.address_number,
        address_complement: addressComplement,
        address_lot: addressComplement.lot,
        address_reference_point: addressComplement.reference_point,
        wants_esim: values.wants_esim,
        line_number_informed: values.line_number_informed,
        line_action: values.line_action,
        address_floor: addressComplement.floor,
        address_block: addressComplement.square,
        building_or_house: addressComplement.building_or_house,
        zip_code: values.zip_code,
        single_zip_code: values.single_zip_code,
        due_day: typeof values.due_day === "number" ? String(values.due_day) : values.due_day,
      };

      const selectedExtrasIds = Array.isArray(values.selected_extras) ? values.selected_extras : [];
      const extraOptions = values.extra_option || {};
      const selectedPlanObj = planBLPFStock.find((plan: any) => plan.id === values.plan_id);
      let selected_extras: import("@/interfaces/orderBandaLarga").PlanSelectedExtra[] = [];
      if (selectedPlanObj && selectedPlanObj.extras) {
        const extrasArr = selectedPlanObj.extras.non_client as import("@/interfaces/orderBandaLarga").PlanSelectedExtra[] || [];
        selected_extras = extrasArr
          .map(function (extra) {
            const extraTyped = extra as import("@/interfaces/orderBandaLarga").PlanSelectedExtra;
            if (extraTyped.input_type === 'checkbox' && selectedExtrasIds.includes(extraTyped.id)) {
              return extraTyped;
            }
            if (extraTyped.input_type === 'radio' && extraOptions[extraTyped.id]) {
              const chosenOption = (extraTyped.options as import("@/interfaces/orderBandaLarga").PlanExtraOption[]).find(function (o) {
                return o.id === extraOptions[extraTyped.id];
              });
              if (chosenOption) {
                return {
                  ...extraTyped,
                  options: [chosenOption],
                };
              }
            }
            return null;
          })
          .filter((x): x is import("@/interfaces/orderBandaLarga").PlanSelectedExtra => x != null) as import("@/interfaces/orderBandaLarga").PlanSelectedExtra[];
      }

      let selectedPlan = planBLPFStock.find(
        (plan: any) => plan.id === normalizedValues.plan_id,
      );
      if (!selectedPlan && localData?.plan) {
        selectedPlan = localData.plan;
      }
      if (normalizedValues.installation_preferred_date_one) {
        normalizedValues.installation_preferred_date_one = dayjs(
          normalizedValues.installation_preferred_date_one,
        ).format("DD/MM/YYYY");
      }
      if (normalizedValues.installation_preferred_date_two) {
        normalizedValues.installation_preferred_date_two = dayjs(
          normalizedValues.installation_preferred_date_two,
        ).format("DD/MM/YYYY");
      }
      const formattedData: any = {
        ...normalizedValues,
        selected_extras,
      };

      if (selectedPlan && selectedPlan.id) {
        formattedData.plan = {
          id: selectedPlan.id,
          name: selectedPlan.plan_name || selectedPlan.name,
          speed: selectedPlan.plan_speed || selectedPlan.speed,
          value: selectedPlan.plan_price_to || selectedPlan.price,
          original_value: selectedPlan.price_summary?.plan_price || selectedPlan.original_price || selectedPlan.original_value,
        };
        formattedData.itens = [
          {
            plan: {
              id: selectedPlan.id,
              name: selectedPlan.plan_name || selectedPlan.name,
              price: selectedPlan.plan_price_to || selectedPlan.price,
              speed: selectedPlan.plan_speed || selectedPlan.speed,
            },
          },
        ];
        let extras_price = 0;
        (selected_extras as import("@/interfaces/orderBandaLarga").PlanSelectedExtra[]).forEach((extra) => {
          if (Array.isArray(extra.options)) {
            (extra.options as import("@/interfaces/orderBandaLarga").PlanExtraOption[]).forEach((opt) => {
              if (typeof opt.price === 'number') extras_price += opt.price;
              if (opt.bonus && typeof opt.bonus.price === 'number') extras_price += opt.bonus.price;
            });
          }
        });

        let original_price = 0;
        if (selectedPlan.pricing && selectedPlan.pricing.base_monthly && typeof selectedPlan.pricing.base_monthly.current_price === 'number') {
          original_price = selectedPlan.pricing.base_monthly.current_price;
        } else {
          original_price = selectedPlan.price_summary?.plan_price || selectedPlan.original_price || selectedPlan.price || 0;
        }
        const total_monthly = original_price + extras_price;

        formattedData.price_summary = {
          extras_price,
          total_monthly,
          original_price,
        };
      }

      if (updateOrderData && localData && localData.id) {
        await updateOrderData({
          id: localData.id,
          data: formattedData,
        });

        setLocalData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            ...normalizedValues,
            selected_extras,
            price_summary: formattedData.price_summary,
            plan: {
              ...prev.plan,
              ...formattedData.plan,
            },
          };
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Erro ao validar campos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (selectedId) {
      setLocalData(selectedId);
    }
    form.resetFields();
  };

  if (!localData) return null;

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            hoverBorderColor: "#0026d9",
            activeBorderColor: "#0026d9",
            activeShadow: "none",
            colorBorder: "#bfbfbf",
            colorTextPlaceholder: "#666666",
          },
          Select: {
            hoverBorderColor: "#0026d9",
            activeBorderColor: "#0026d9",
            activeOutlineColor: "none",
            colorBorder: "#bfbfbf",
            colorTextPlaceholder: "#666666",
          },
          Button: {
            colorBorder: "#0026d9",
            colorText: "#0026d9",
            colorPrimary: "#0026d9",
            colorPrimaryHover: "#0026d9",
          },
        },
      }}
    >
      <Modal
        centered
        title={
          <HeaderInputs
            updateOrderData={updateOrderData}
            localData={localData}
            setLocalData={setLocalData}
            selectedId={selectedId}
            statusOptions={statusOptions}
            changeBandaLargaOrderStatus={changeBandaLargaOrderStatus}
            consultor={consultor}
            setConsultor={setConsultor}
            idVivo={idVivo}
            setIdVivo={setIdVivo}
            idCRM={idCRM}
            setIdCRM={setIdCRM}
            credito={credito}
            setCredito={setCredito}
            idCORP={idCORP}
            setIdCORP={setIdCORP}
            updateDataIdCRMAndConsultorResponsavel={updateDataIdCRMAndConsultorResponsavel}
          />
        }
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={1200}
      >
        <div className="text-[#666666] mt-4 h-[460px] overflow-y-auto scrollbar-thin">
          {isEditing ? (
            <OrderBandaLargaPFEdit
              localData={localData}
              form={form}
              onPlanChange={handlePlanChange}
              planOptions={planOptions}
              handleSave={handleSave}
              handleCancel={handleCancel}
              loading={loading}
            />
          ) : (
            <OrderBandaLargaPFDisplay
              localData={localData}
              updateOrderData={updateOrderData}
            />
          )}
        </div>
        <div className="mt-4 flex gap-4 justify-end">
          {!isEditing && (
            <FooterButtons
              onGeneratePDF={() => generatePDF(localData)}
              onEdit={() => setIsEditing(true)}
              onDelete={() => setShowDeleteModal(true)}
            />
          )}
        </div>
      </Modal>
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          removeOrderData({ id: selectedId?.id });
          closeModal();
        }}
        isLoading={isRemoveOrderFetching}
        message="Tem certeza que deseja excluir o pedido"
        itemToDelete={selectedId?.ordernumber || selectedId?.id}
      />
    </ConfigProvider>
  );
}
