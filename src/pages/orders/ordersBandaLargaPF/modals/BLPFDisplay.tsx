import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { formatCEP } from "@/utils/formatCEP";
import { formatCPF } from "@/utils/formatCPF";
import {
  formatBrowserDisplay,
  formatDevice,
  formatOSDisplay,
  formatResolution,
} from "@/utils/formatClientEnvironment";
import DisplayGenerator from "@/components/displayGenerator";
import { Button, ConfigProvider, Form, Input } from "antd";
import { useEffect } from "react";
import { ExclamationOutlined } from "@ant-design/icons";
import { EmpresasDisplay } from "@/components/empresasDisplay";
import { PlanosTable } from "../../../../components/orders/PlanosTable";
import { OrderBandaLarga } from "@/interfaces/orderBandaLarga";
import { formatPaymentMethod } from "@/utils/formatPaymentMethod";
import { AvailabilityStatus, PAPStatus } from "../../../../components/orders/availabilityLayout";

interface OrderBandaLargaPFDisplayProps {
  localData: OrderBandaLarga;
  updateOrderData: any;
}

export function OrderBandaLargaPFDisplay({
  localData,
  updateOrderData,
}: OrderBandaLargaPFDisplayProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (localData) {
      form.setFieldsValue({
        consultant_observation: localData.consultant_observation || "",
      });
    }
  }, [localData, form]);

  const getAlertScenarios = (
    availability?: boolean | number,
    found_via_range?: boolean | null,
    single_zip_code?: boolean | null,
    status?: string,
  ) => {
    const scenarios: { color: string; content: React.ReactNode }[] = [];
    const noAvailability =
      availability === false || availability === null || availability === 0;
    const isCoveredByRange = Boolean(found_via_range);
    const hasUnicCep = Boolean(single_zip_code);

    if (status === "FECHADO" || status === "fechado") {
      if (noAvailability) {
        scenarios.push({
          color: "#ffeaea",
          content:
            "Não foi identificada disponibilidade no endereço fornecido.",
        });
      } else if (isCoveredByRange) {
        scenarios.push({
          color: "#fff6c7",
          content:
            "O número fornecido esta dentro de um range com disponibilidade.",
        });
      } else if (hasUnicCep) {
        scenarios.push({
          color: "#fff6c7",
          content: "CEP Único",
        });
      }
    }

    if (
      (status === "FECHADO" || status === "fechado") &&
      !hasUnicCep &&
      !isCoveredByRange &&
      !noAvailability
    ) {
      scenarios.push({
        color: "#e6ffed",
        content: "Esse pedido não possui travas",
      });
    }
    return scenarios;
  };

  const handleSaveObservacao = async () => {
    const values = await form.validateFields();

    if (
      values.consultant_observation
      &&
      values.consultant_observation.trim() !== ""
    ) {
      updateOrderData({
        id: localData?.id,
        data: { pedido: { consultant_observation: values.consultant_observation } },
      });
    }
  };
  return (
    <div>
      <div className="flex flex-col w-full gap-2">
        {/* Detalhes dos Planos */}
        <PlanosTable plans={Array.isArray(localData) ? localData : [localData]} />
      </div>

      {/* Seção de Disponibilidade */}
      <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3 w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-md p-4 flex flex-col items-center">
            <p className="text-[14px] font-medium text-neutral-700 ">
              Disponibilidade
            </p>
            <AvailabilityStatus localData={localData} />
          </div>
          <div className="bg-white rounded-md p-4 flex flex-col items-center">
            <p className="text-[14px] font-medium text-neutral-700 mb-2">PAP</p>
            <PAPStatus localData={localData} />
          </div>

        </div>
      </div>
      {/* Informacoes de Pagamento */}
      <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3 w-full">
        <div className="flex items-center mb-3">
          <h2 className="text-[14px] text-[#666666] font-medium">
            Informacoes de Pagamento
          </h2>
        </div>

        <div className="flex flex-col text-neutral-800 gap-4 rounded-lg">
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

              <DisplayGenerator
                title="Metodo de Pagamento:"
                value={formatPaymentMethod(localData.payment_method)}
              />
              <DisplayGenerator
                title="Nome do Banco:"
                value={localData.bank_name || "-"}
              />
              <DisplayGenerator
                title="Agencia:"
                value={localData.bank_branch || "-"}
              />
              <DisplayGenerator
                title="Numero da Conta:"
                value={localData.bank_account_number || "-"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Informações do Cliente */}
      <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3 w-full">
        <div className="flex items-center mb-3">
          <h2 className="text-[14px] text-[#666666] font-medium">
            Informações do Cliente
          </h2>
        </div>

        <div className="flex flex-col text-neutral-800 gap-4 rounded-lg">
          {/* Dados Pessoais */}
          <div className="bg-white rounded-md p-2">
            {localData.pf_temperature === 10 ? (
              <div className="flex bg-[#d63535] rounded-full w-10 h-10 items-center justify-center relative mr-3">
                <img
                  src={
                    localData.whatsapp?.avatar || "/assets/anonymous_avatar.png"
                  }
                  className="rounded-full w-10 h-10"
                />
                <div className="text-sm absolute -top-1 -right-1 flex items-center justify-center">
                  🔥
                </div>
              </div>
            ) : (
              <img
                src={
                  localData.whatsapp?.avatar || "/assets/anonymous_avatar.png"
                }
                className="h-10 w-10 rounded-full mr-3"
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <DisplayGenerator title="Nome:" value={localData.full_name} />
              <DisplayGenerator
                title="Nome (RFB):"
                value={localData.rfb_name}
              />
              <DisplayGenerator
                title="Gênero:"
                value={
                  localData.rfb_gender === "M"
                    ? "Masculino"
                    : localData.rfb_gender === "F"
                      ? "Feminino"
                      : "-"
                }
              />
              <DisplayGenerator title="CPF:" value={formatCPF(localData.cpf)} />

              <DisplayGenerator
                title="Data de Nascimento:"
                value={localData.birth_date}
              />
              <DisplayGenerator
                title="Data Nascimento (RFB):"
                value={localData.rfb_birth_date}
              />
              <DisplayGenerator
                title="Nome da Mãe:"
                value={localData.mother_full_name}
              />
              <DisplayGenerator
                title="Nome Mãe (RFB):"
                value={localData.rfb_mother_name}
              />
              <DisplayGenerator title="Email:" value={localData.email} />
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Telefone Principal */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500">
                  Telefone Principal
                </div>
                <div className="p-1 space-y-1">
                  <DisplayGenerator
                    title="Número:"
                    value={formatPhoneNumber(localData.phone)}
                  />
                  <DisplayGenerator
                    title="Anatel:"
                    value={
                      localData.phone_valid
                        ? "Sim"
                        : localData.phone_valid === null ||
                          localData.phone_valid === undefined
                          ? "-"
                          : "Não"
                    }
                  />
                  <DisplayGenerator
                    title="Operadora:"
                    value={localData.operator}
                  />
                  <DisplayGenerator
                    title="Portado:"
                    value={localData.portability}
                  />
                  <DisplayGenerator
                    title="Data da Portabilidade:"
                    value={
                      localData.portability_date
                        ? (localData.portability_date)
                        : "-"
                    }
                  />

                  {/* <DisplayGenerator
                    title="Status:"
                    value={localData.whatsapp?.recado}
                  /> */}
                  {/* <DisplayGenerator
                    title="Título WA:"
                    value={localData.nome_whatsapp}
                  /> */}
                </div>
              </div>

              {/* Telefone Adicional */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500">
                  Telefone Adicional
                </div>
                <div className="rounded p-1 space-y-1">
                  <DisplayGenerator
                    title="Número:"
                    value={formatPhoneNumber(localData.additional_phone || "")}
                  />
                  <DisplayGenerator
                    title="Anatel:"
                    value={
                      localData.additional_phone_valid
                        ? "Sim"
                        : localData.additional_phone_valid === null
                          ? "-"
                          : "Não"
                    }
                  />
                  <DisplayGenerator
                    title="Operadora:"
                    value={localData.additional_operator}
                  />{" "}
                  <DisplayGenerator
                    title="Portado:"
                    value={localData.additional_portability}
                  />
                  <DisplayGenerator
                    title="Data da Portabilidade:"
                    value={
                      localData.additional_portability_date
                        ? (localData.additional_portability_date)
                        : "-"
                    }
                  />
                  {/* <DisplayGenerator
                    title="WhatsApp:"
                    value={
                      localData.whatsapp?.is_comercial === true
                        ? "Business"
                        : localData.whatsapp?.is_comercial === false
                          ? "Messenger"
                          : "-"
                    }
                  /> */}
                </div>
              </div>
            </div>
          </div>

          {/* Informações Empresariais */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <DisplayGenerator
                title="Sócio:"
                value={localData.is_socio ? "Sim" : "Não"}
              />{" "}
              <EmpresasDisplay empresas={localData.company_partners} />
              <div className="md:col-span-2">
                <DisplayGenerator
                  title="MEI:"
                  value={localData.is_mei ? "Sim" : "Não"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3 w-full">
        <div className="flex items-center mb-3">
          <h2 className="text-[14px] text-[#666666] font-medium">Endereço</h2>
        </div>

        <div className="flex flex-col text-neutral-800 gap-4 rounded-lg">
          {/* Dados do Endereço */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <DisplayGenerator title="Rua:" value={localData.address} />
              <DisplayGenerator
                title="Número:"
                value={localData.address_number}
              />
              <DisplayGenerator
                title="Complemento:"
                value={localData.address_complement}
              />

              <DisplayGenerator title="Bairro:" value={localData.district} />
              <DisplayGenerator title="Cidade:" value={localData.city} />
              <DisplayGenerator title="UF:" value={localData.state} />
            </div>
          </div>

          {/* Detalhes Técnicos */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="space-y-2">
                <DisplayGenerator
                  title="Tipo:"
                  value={
                    localData.building_or_house === "building"
                      ? "Edifício"
                      : "Casa"
                  }
                />
                <DisplayGenerator
                  title="Andar:"
                  value={localData.address_floor}
                />
              </div>
              <div className="space-y-2">
                <DisplayGenerator
                  title="CEP:"
                  value={formatCEP(localData.zip_code)}
                />
                <DisplayGenerator
                  title="CEP único:"
                  value={localData.single_zip_code ? "Sim" : "Não"}
                />
              </div>
              <div className="space-y-2">
                <DisplayGenerator title="Lote:" value={localData.address_lot} />
                <DisplayGenerator
                  title="Quadra:"
                  value={localData.address_block}
                />
              </div>
              <div className="md:col-span-3">
                <DisplayGenerator
                  title="Ponto de Referência:"
                  value={localData.address_reference_point}
                />
              </div>
            </div>
          </div>
          {/* Detalhes Técnicos */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
              <DisplayGenerator
                title="Coordenadas:"
                value={
                  localData.geolocation
                    ?.latitude &&
                    localData.geolocation?.longitude
                    ? `${localData.geolocation.latitude}, ${localData.geolocation.longitude}`
                    : "-"
                }
              />

              <a
                href={localData.geolocation?.maps_link
                }
                target="_blank"
                style={{ color: "#0026d9", textDecoration: "underline" }}
                rel="noopener noreferrer"
              >
                Ver no Google Maps
              </a>

              <a
                href={localData.geolocation?.street_view_link
                }
                target="_blank"
                style={{ color: "#0026d9", textDecoration: "underline" }}
                rel="noopener noreferrer"
                className="text-[#0026d9]  underline"
              >
                Ver no Street View
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dados do Tráfego */}
      <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3 w-full">
        <div className="flex items-center mb-3">
          <h2 className="text-[14px] text-[#666666] font-medium">
            Dados do Tráfego
          </h2>
        </div>

        <div className="flex flex-col text-neutral-800 gap-4 rounded-lg">
          {/* Informações de Rede */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <DisplayGenerator title="IP:" value={localData.client_ip} />
              <DisplayGenerator title="Provedor:" value={localData.ip_isp} />
              <DisplayGenerator
                title="Tipo de acesso:"
                value={
                  localData.ip_access_type === "movel"
                    ? "Móvel"
                    : localData.ip_access_type === "fixo"
                      ? "Fixo"
                      : localData.ip_access_type === "hosting"
                        ? "Hosting"
                        : localData.ip_access_type === "proxy"
                          ? "Proxy"
                          : localData.ip_access_type === "local"
                            ? "Local"
                            : localData.ip_access_type === "desconhecido"
                              ? "Desconhecido"
                              : "-"
                }
              />
              <DisplayGenerator
                title="URL:"
                value={localData.url}
                maxLength={50}
              />
            </div>
          </div>

          {/* Informações do Dispositivo */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <DisplayGenerator
                title="Plataforma:"
                value={formatOSDisplay(localData.fingerprint?.os)}
              />
              <DisplayGenerator
                title="Dispositivo:"
                value={formatDevice(localData.fingerprint?.device || "-")}
              />
              <DisplayGenerator
                title="Browser:"
                value={formatBrowserDisplay(localData.fingerprint?.browser)}
              />
              <DisplayGenerator
                title="TimeZone:"
                value={localData.fingerprint?.timezone + " - " + localData.fingerprint?.timezone_name || "-"}
              />
              <DisplayGenerator
                title="Resolução:"
                value={formatResolution(
                  localData.fingerprint?.resolution || "-",
                )}
              />
              <DisplayGenerator
                title="ID Fingerprint:"
                value={localData.fingerprint_id || "-"}
              />
            </div>
          </div>
        </div>
      </div>
      {
        localData?.status === "FECHADO" || localData?.status === "fechado" &&
        getAlertScenarios(
          localData?.availability ?? undefined,
          localData?.found_via_range,
          localData?.single_zip_code,
          localData?.status,
        ).map((scenario, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 mb-3 rounded-[4px] p-3 w-full"
            style={{ backgroundColor: scenario.color }}
          >
            <div className="flex items-center">
              <h2 className="text-[14px] font-semibold">
                <ExclamationOutlined />
                <ExclamationOutlined /> ALERTA
                <ExclamationOutlined />
                <ExclamationOutlined />
              </h2>
            </div>
            <div className="flex flex-col text-neutral-800 gap-2 rounded-lg min-h-[50px] p-3">
              <div className="text-[14px] w-full text-neutral-700">
                {scenario.content}
              </div>
            </div>
          </div>
        ))
      }

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
            Button: {
              colorBorder: "#0026d9",
              colorText: "#0026d9",
              colorPrimary: "#0026d9",
              colorPrimaryHover: "#0026d9",
            },
          },
        }}
      >
        <div className="flex flex-col justify-center bg-neutral-100  text-[14px] rounded-[4px] ">
          <div className="p-4 pb-0">
            {" "}
            <p className="text-[15px]">Observação Consultor</p>
          </div>
          <Form form={form} layout="vertical">
            <div className="flex flex-col p-4 text-[14px] w-full text-neutral-700">
              <div className="min-w-[400px] max-w-full">
                {" "}
                <Form.Item
                  className="w-full "
                  name="consultant_observation"
                  style={{ marginBottom: 8 }}
                >
                  <Input.TextArea
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    className=" text-[16px] font-light text-[#353535] w-full"
                    placeholder="Adicione aqui uma observação sobre esse pedido..."
                  />
                </Form.Item>
              </div>
              <Button
                className="self-end"
                style={{
                  fontSize: "12px",
                  height: "25px",
                }}
                onClick={handleSaveObservacao}
              >
                Salvar
              </Button>
            </div>
          </Form>
        </div>
      </ConfigProvider>
    </div >
  );
}
