import { ConfigProvider, Modal, Form } from "antd";
import { useState, useEffect } from "react";
import { OrderBandaLargaPF } from "@/interfaces/bandaLargaPF";
import { OrderBandaLargaPFDisplay } from "./BLPFDisplay";
import { OrderBandaLargaPFEdit } from "./BLPFEdit";
import HeaderInputs from "./headerInputs";
import dayjs from "dayjs";
import ConfirmDeleteModal from "@/components/confirmDeleteModal";
import FooterButtons from "@/components/orders/footerButtons";
import { generatePDF } from "../controllers/exportPDF";

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
  selectedId: OrderBandaLargaPF | null;
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
  const [localData, setLocalData] = useState<OrderBandaLargaPF | null>(null);
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
      .filter((plan: any) => plan.client_type === 'PF')
      .map((plan: any) => ({
        value: plan.id,
        label: plan.name,
        name: plan.name,
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
        address_complement: localData.address_complement,
        address_lot: localData.address_lot,
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

      const normalizedValues = {
        ...values,
        full_name: values.full_name,
        birth_date: values.birth_date,
        mother_full_name: values.mother_full_name,
        additional_phone: values.additional_phone,
        address_number: values.address_number,
        address_complement: values.address_complement,
        address_lot: values.address_lot,
        address_reference_point: values.address_reference_point,
        wants_esim: values.wants_esim,
        line_number_informed: values.line_number_informed,
        line_action: values.line_action,
        address_floor: values.address_floor,
        address_block: values.address_block,
        building_or_house: values.building_or_house,
        zip_code: values.zip_code,
        single_zip_code: values.single_zip_code,
        due_day: values.due_day,
      };

      // --- ADAPTAÇÃO DOS EXTRAS ---
      const selectedExtrasIds = values.selected_extras || [];
      const extraOptions = values.extra_option || {};
      const selectedPlanObj = planBLPFStock.find((plan: any) => plan.id === values.plan_id);
      let selected_extras = [];
      if (selectedPlanObj && selectedPlanObj.extras) {
        const extrasArr = selectedPlanObj.extras.non_client || [];
        selected_extras = extrasArr
          .map((extra: any) => {
            // Se for múltipla opção (radio), pega a opção escolhida
            if (extra.options && extra.options.length > 1 && extraOptions[extra.id]) {
              const opt = extra.options.find((o: any) => o.id === extraOptions[extra.id]);
              if (opt) {
                return {
                  id: extra.id,
                  label: opt.label,
                  price: opt.price,
                  description: opt.description,
                  bonus: opt.bonus,
                };
              }
              return null;
            }
            // Se for checkbox simples
            if (selectedExtrasIds.includes(extra.id) && extra.options && extra.options.length === 1) {
              const opt = extra.options[0];
              return {
                id: extra.id,
                label: opt.label,
                price: opt.price,
                description: opt.description,
                bonus: opt.bonus,
              };
            }
            return null;
          })
          .filter(Boolean);
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
        formattedData.price_summary = {
          ...localData?.price_summary,
          plan_price: selectedPlan.plan_price_to || selectedPlan.price,
        };
      }

      if (updateOrderData && localData && localData.id) {
        await updateOrderData({
          id: localData.id,
          data: formattedData,
        });

        setLocalData((prev) =>
          prev
            ? {
              ...prev,
              ...normalizedValues,
            }
            : null,
        );
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
            colorPrimaryHover: "#883fa2",
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
