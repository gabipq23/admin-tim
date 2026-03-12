import { ConfigProvider, Modal, Form } from "antd";
import { useState, useEffect } from "react";
import { OrderBandaLargaPJDisplay } from "./BLPJDisplay";
import { OrderBandaLargaPJEdit } from "./BLPJEdit";
import { OrderBandaLargaPJ } from "@/interfaces/bandaLargaPJ";
import dayjs from "dayjs";

import HeaderInputs from "./headerInputs";

import ConfirmDeleteModal from "@/components/confirmDeleteModal";
import FooterButtons from "@/components/orders/footerButtons";
import { generatePDF } from "../controllers/exportPDF";

export function OrderBandaLargaPJDetailsModal({
  isModalOpen,
  closeModal,
  selectedId,
  updateOrderData,
  updateDataIdVivoAndConsultorResponsavel,
  removeBandaLargaPJOrder,
  isRemoveBandaLargaPJOrderFetching,
  changeBandaLargaPJOrderStatus,
  statusOptions,
  planBLPJStock,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedId: OrderBandaLargaPJ | null;
  updateOrderData?: (params: { id: number; data: any }) => void;
  updateDataIdVivoAndConsultorResponsavel: any;
  removeBandaLargaPJOrder: any;
  isRemoveBandaLargaPJOrderFetching: boolean;
  changeBandaLargaPJOrderStatus: any;
  statusOptions: string[] | undefined;
  planBLPJStock: any;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localData, setLocalData] = useState<OrderBandaLargaPJ | null>(null);
  const [form] = Form.useForm();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [consultor, setConsultor] = useState<string>("");
  const [idVivo, setIdVivo] = useState<string>("");
  const [idCRM, setIdCRM] = useState<number>(0);
  const [credito, setCredito] = useState<number | string>(0);

  useEffect(() => {
    if (selectedId) {
      setLocalData(selectedId);
    }
  }, [selectedId]);

  const planOptions = Array.isArray(planBLPJStock)
    ? planBLPJStock.map((plan: any) => ({
      value: plan.id,
      label: `${plan.plan_name} ${plan.plan_speed ? "- " + plan.plan_speed : ""
        } - R$ ${plan.plan_price_to}`,
      name: plan.plan_name,
      price: plan.plan_price_to,
      speed: plan.plan_speed,
    }))
    : [];

  const handlePlanChange = (planId: number) => {
    const selectedPlan = planOptions.find((plan) => plan.value === planId);
    if (selectedPlan) {
      form.setFieldsValue({
        plan_name: selectedPlan.name,
        plan_price: selectedPlan.price,
        id: localData?.plan?.id || "",
      });

      setLocalData((prev) =>
        prev
          ? {
            ...prev,
            plan: {
              name: selectedPlan.name,
              price: parseFloat(selectedPlan.price),
              speed: selectedPlan.speed,
              id: selectedPlan.value,
            },
          }
          : null,
      );
    }
  };

  useEffect(() => {
    setConsultor(localData?.consultor_responsavel || "");
    setIdVivo(localData?.id_vivo_corp || "");
    setIdCRM(localData?.id_crm || 0);
    setCredito(localData?.credito || 0);
  }, [selectedId, localData]);

  useEffect(() => {
    if (localData && isEditing) {
      form.setFieldsValue({
        plan_id: localData.plan?.id || "",
        plan_name: localData.plan?.name || "",
        plan_price: localData.plan?.price?.toString() || "",
        fullname: localData.fullname,

        cnpj: localData.cnpj,
        razaosocial: localData.razaosocial,

        phone: localData.phone,
        phoneAdditional: localData.phoneAdditional,

        address: localData.address,
        addressnumber: localData.addressnumber,
        addresscomplement: localData.addresscomplement,
        addresslot: localData.addresslot,
        addressblock: localData.addressblock,
        buildingorhouse: localData.buildingorhouse,
        district: localData.district,
        city: localData.city,
        state: localData.state,
        cep: localData.cep,
        addressreferencepoint: localData.addressreferencepoint,

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
        dueday: localData.dueday,
        accept_offers: localData.accept_offers,
        terms_accepted: localData.terms_accepted,
        status: localData.status,
        url: localData.url,
        manager: {
          cpf: localData.manager?.cpf,
          email: localData.manager?.email,
          name: localData.manager?.name,
          phone: localData.manager?.phone,
          hasLegalAuthorization: localData.manager?.hasLegalAuthorization,
        },
      });
    }
  }, [localData, isEditing, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const selectedPlan = planBLPJStock.find(
        (plan: any) => plan.id === values.plan_id,
      );
      if (values.installation_preferred_date_one) {
        values.installation_preferred_date_one = dayjs(
          values.installation_preferred_date_one,
        ).format("DD/MM/YYYY");
      }
      if (values.installation_preferred_date_two) {
        values.installation_preferred_date_two = dayjs(
          values.installation_preferred_date_two,
        ).format("DD/MM/YYYY");
      }
      if (updateOrderData && localData && localData.id) {
        const formattedData = {
          pedido: { ...values },
          itens: [
            {
              plan: {
                id: selectedPlan.id,
                name: selectedPlan.plan_name,
                price: selectedPlan.plan_price_to,
                speed: selectedPlan.plan_speed,
              },
            },
          ],
        };

        await updateOrderData({
          id: localData.id,
          data: formattedData,
        });

        setLocalData((prev) => (prev ? { ...prev, ...values } : null));
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
            statusOptions={statusOptions}
            localData={localData}
            setLocalData={setLocalData}
            selectedId={selectedId}
            updateDataIdVivoAndConsultorResponsavel={
              updateDataIdVivoAndConsultorResponsavel
            }
            changeBandaLargaPJOrderStatus={changeBandaLargaPJOrderStatus}
            consultor={consultor}
            setConsultor={setConsultor}
            idVivo={idVivo}
            setIdVivo={setIdVivo}
            idCRM={idCRM}
            setIdCRM={setIdCRM}
            credito={credito}
            setCredito={setCredito}
          />
        }
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={1200}
      >
        <div className="text-[#666666] mt-4 h-[460px] overflow-y-auto scrollbar-thin">
          {isEditing ? (
            <OrderBandaLargaPJEdit
              localData={localData}
              form={form}
              onPlanChange={handlePlanChange}
              planOptions={planOptions}
              handleSave={handleSave}
              handleCancel={handleCancel}
              loading={loading}
            />
          ) : (
            <OrderBandaLargaPJDisplay
              updateOrderData={updateOrderData}
              localData={localData}
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
          removeBandaLargaPJOrder({ id: selectedId?.id });
          closeModal();
        }}
        isLoading={isRemoveBandaLargaPJOrderFetching}
        message="Tem certeza que deseja excluir o pedido"
        itemToDelete={selectedId?.ordernumber || selectedId?.id}
      />
    </ConfigProvider>
  );
}
