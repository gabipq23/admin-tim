import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Form,
  Select,
  DatePicker,
  Checkbox,
} from "antd";
import { FormInstance } from "antd/es/form";
import InputGenerator from "@/components/inputGenerator";
import { blueOutlineButtonClass } from "@/utils/buttonStyles";
import { OrderBandaLarga, PlanSelectedExtra } from "@/interfaces/orderBandaLarga";
import { formatCPF } from "@/utils/formatCPF";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

interface PlanOption {
  value: number | string;
  label: string;
  name: string;
  price: number;
  plan: {
    online?: boolean;
    extras?: {
      non_client?: PlanSelectedExtra[];
    };
  };
}

interface OrderBandaLargaPJEditProps {
  localData: OrderBandaLarga;
  form: FormInstance;
  onPlanChange: (planId: number) => void;
  planOptions: PlanOption[];
  handleSave: () => void;
  handleCancel: () => void;
  loading: boolean;
}

export function OrderBandaLargaPJEdit({
  localData,
  onPlanChange,
  planOptions,
  form,
  handleSave,
  handleCancel,
  loading,
}: OrderBandaLargaPJEditProps) {

  const [extrasOptions, setExtrasOptions] = useState<PlanSelectedExtra[]>([]);

  const handlePlanChange = useCallback((planId: number) => {
    onPlanChange(planId);
    const found = planOptions.find((p) => p.value === planId);
    if (found && found.plan && found.plan.online) {
      setExtrasOptions(found.plan.extras?.non_client || []);

    } else {
      setExtrasOptions([]);
    }
  }, [onPlanChange, planOptions]);


  useEffect(() => {
    const currentExtras = form.getFieldValue("selected_extras");
    if ((!currentExtras || currentExtras.length === 0) && localData.selected_extras && Array.isArray(localData.selected_extras)) {
      const selectedIds = localData.selected_extras.map((extra: PlanSelectedExtra) => extra.id);
      form.setFieldsValue({ selected_extras: selectedIds });
    }
  }, [localData, form]);
  return (
    <Form
      form={form}
      layout="vertical"
      className="flex flex-col h-full gap-4"
      onFinish={handleSave}
    >
      <div className="flex flex-col  w-full gap-2">
        {/* Detalhes dos Planos */}
        <div className="flex flex-col   bg-neutral-100 mb-3 rounded-[4px] p-3 ">
          <div className="flex items-center">
            <h2 className="text-[14px] text-[#666666]">Detalhes dos Planos</h2>
          </div>

          <div className="mt-4 flex w-full flex-col  text-neutral-700">
            {/* Header da tabela */}
            <div className="flex items-center  px-8 justify-between font-semibold text-[#666666] text-[14px]">
              <p className="w-72 text-center">Plano</p>
              <p className="w-28 text-center">Data Instalação 1</p>
              <p className="w-20 text-center">Período 1</p>
              <p className="w-28 text-center">Data Instalação 2</p>
              <p className="w-20 text-center">Período 2</p>
              <p className="w-20 text-center">Vencimento</p>
            </div>
            <hr className="border-t border-neutral-300 " />

            {/* Linha editável */}
            <div className="flex px-8 items-center justify-between py-4 pb-0 text-[14px]">
              {/* Plano */}
              <div className="w-72 flex justify-center">
                <Form.Item name="plan_id" className="mb-0">
                  <Select
                    size="small"
                    showSearch
                    placeholder="Selecione o plano"
                    className="min-w-72"
                    onChange={handlePlanChange}
                    options={planOptions}
                  />
                </Form.Item>
              </div>

              {/* Data Instalação 1 */}
              <div className="w-28 flex justify-center">
                <Form.Item
                  name="installation_preferred_date_one"
                  className="mb-0"
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="Data 1"
                    className="min-w-28 text-center"
                    size="small"
                    allowClear
                  />
                </Form.Item>
              </div>

              {/* Período 1 */}
              <div className="w-20  flex justify-center">
                <Form.Item
                  name="installation_preferred_period_one"
                  className="mb-0"
                >
                  <Select
                    size="small"
                    placeholder="Período 1"
                    className="min-w-22"
                  >
                    <Select.Option value="MANHA">MANHÃ</Select.Option>
                    <Select.Option value="TARDE">TARDE</Select.Option>
                    <Select.Option value="NOITE">NOITE</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Data Instalação 2 */}
              <div className="w-28 flex justify-center">
                <Form.Item
                  name="installation_preferred_date_two"
                  className="mb-0"
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="Data 2"
                    className="min-w-28 text-center"
                    size="small"
                    allowClear
                  />
                </Form.Item>
              </div>

              {/* Período 2 */}
              <div className="w-20 flex justify-center">
                <Form.Item
                  name="installation_preferred_period_two"
                  className="mb-0"
                >
                  <Select
                    size="small"
                    placeholder="Período 2"
                    className="min-w-22"
                  >
                    <Select.Option value="MANHA">MANHÃ</Select.Option>
                    <Select.Option value="TARDE">TARDE</Select.Option>
                    <Select.Option value="NOITE">NOITE</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Vencimento */}
              <div className="w-20 flex justify-center">
                <Form.Item name="due_day" className="mb-0">
                  <Select
                    size="small"
                    placeholder="Dia"
                    className="min-w-16"
                    showSearch
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <Select.Option key={day} value={day}>
                        {day}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <hr className="border-t border-neutral-300 mx-2" />
          </div>

          {extrasOptions.length > 0 && (
            <div className="mt-4 bg-neutral-50 rounded-md p-4">
              <div className="font-semibold text-[#666666] text-[14px] mb-2">Extras disponíveis</div>
              {/* Agrupa todos os checkboxes em um Checkbox.Group controlado por selected_extras */}
              <Form.Item name="selected_extras" valuePropName="value" className="mb-0">
                <Checkbox.Group style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {extrasOptions.map((extra, idx) => (
                    <Checkbox key={extra.id + '-' + idx} value={extra.id}>
                      <span className="font-medium text-sm">{extra.label}</span>
                      {extra.options && extra.options[0] && (
                        <>
                          &nbsp; R${extra.options[0].price} <span className="text-xs text-neutral-600">{extra.options[0].description}</span>
                        </>
                      )}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </Form.Item>
            </div>
          )}
        </div>
        {/* Seção de Disponibilidade */}
        <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3 pb-0 w-full">
          <div>
            <h2 className="text-[14px] text-[#666666]">Disponibilidade PAP</h2>
            <div className="flex gap-4 items-end w-full mt-2">
              <Form.Item name="availability_pap" className="mb-0">
                <Select
                  size="small"
                  placeholder="PAP"
                  className="min-w-[110px]"
                >
                  <Select.Option value={true}>Disponível</Select.Option>
                  <Select.Option value={false}>Indisponível</Select.Option>
                </Select>
              </Form.Item>

            </div>
          </div>
        </div>

        {/* Informações da Empresa */}
        <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3  w-full">
          <div className="flex items-center mb-1">
            <h2 className="text-[14px] text-[#666666]">
              Informações da Empresa
            </h2>
          </div>
          <div className="flex flex-col text-neutral-800  rounded-lg p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna 1 */}
              <div className="flex flex-col gap-1">
                <InputGenerator
                  title="CNPJ:"
                  formItemName="cnpj"
                  formItemValue={localData.cnpj || ""}
                  placeholder="CNPJ"
                />
              </div>

              {/* Coluna 2 */}
              <div className="flex flex-col gap-1">
                <InputGenerator
                  title="Razão Social:"
                  formItemName="company_legal_name"
                  formItemValue={localData.company_legal_name || ""}
                  placeholder="Razão Social"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Cliente */}
        <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3  w-full">
          <div className="flex items-center mb-1">
            <h2 className="text-[14px] text-[#666666]">
              Informações do Gestor
            </h2>
          </div>
          <div className="flex flex-col text-neutral-800  rounded-lg p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna 1 */}
              <div className="flex flex-col gap-1">
                <InputGenerator
                  title="Nome:"
                  formItemName="manager_name"
                  formItemValue={localData?.manager_name || ""}
                  placeholder="Nome"
                />
                <InputGenerator
                  title="CPF:"
                  formItemName="cpf"
                  formItemValue={formatCPF(localData?.cpf) || ""}
                  placeholder="CPF"
                />
              </div>

              {/* Coluna 2 */}
              <div className="flex flex-col gap-1">
                <InputGenerator
                  title="Telefone:"
                  formItemName="phone"
                  formItemValue={
                    formatPhoneNumber(localData?.phone) || ""
                  }
                  placeholder="Telefone"
                />
                <InputGenerator
                  title="Telefone adicional:"
                  formItemName="additional_phone"
                  formItemValue={
                    localData?.additional_phone
                      ? formatPhoneNumber(localData.additional_phone)
                      : ""
                  }
                  placeholder="Telefone adicional"
                />
                <InputGenerator
                  title="Email:"
                  formItemName="email"
                  formItemValue={localData?.email || ""}
                  placeholder="Email"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Informações de Endereço */}
        <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3  w-full">
          <div className="flex items-center mb-1">
            <h2 className="text-[14px] text-[#666666]">
              Informações de Endereço
            </h2>
          </div>

          <div className="flex flex-col text-neutral-800  rounded-lg p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna 1 */}
              <div className="flex flex-col gap-1">
                <InputGenerator
                  title="Endereço:"
                  formItemName="address"
                  formItemValue={localData.address || ""}
                  placeholder="Endereço"
                />
                <InputGenerator
                  title="Número:"
                  formItemName="address_number"
                  formItemValue={localData.address_number || ""}
                  placeholder="Número"
                />
                <InputGenerator
                  title="Complemento:"
                  formItemName="address_complement"
                  formItemValue={localData.address_complement || ""}
                  placeholder="Complemento"
                />
                <InputGenerator
                  title="Andar:"
                  formItemName="address_floor"
                  formItemValue={localData.address_floor || ""}
                  placeholder="Andar"
                />
                <InputGenerator
                  title="Lote:"
                  formItemName="address_lot"
                  formItemValue={localData.address_lot || ""}
                  placeholder="Lote"
                />

                <InputGenerator
                  title="Quadra:"
                  formItemName="address_block"
                  formItemValue={localData.address_block || ""}
                  placeholder="Quadra"
                />

                <InputGenerator
                  title="Ponto de Referência"
                  formItemName="address_reference_point"
                  formItemValue={localData.address_reference_point || ""}
                  placeholder="Ponto de Referência"
                />
              </div>

              {/* Coluna 2 */}
              <div className="flex flex-col gap-1">
                <div className="flex h-9 gap-4 text-[14px] w-full text-neutral-700">
                  <div className="flex ">
                    <p>
                      <strong>Tipo:</strong>
                    </p>
                  </div>
                  <div className="flex flex-1">
                    <Form.Item name="building_or_house" className="mb-0 ">
                      <Select
                        placeholder="Tipo de imóvel"
                        className="min-w-[150px]"
                        size="small"
                      >
                        <Select.Option value={"building"}>
                          Edifício
                        </Select.Option>
                        <Select.Option value={"house"}>Casa</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                </div>

                <InputGenerator
                  title="Bairro:"
                  formItemName="district"
                  formItemValue={localData.district || ""}
                  placeholder="Bairro"
                />

                <InputGenerator
                  title="Cidade:"
                  formItemName="city"
                  formItemValue={localData.city || ""}
                  placeholder="Cidade"
                />

                <InputGenerator
                  title="UF:"
                  formItemName="state"
                  formItemValue={localData.state || ""}
                  placeholder="UF"
                />

                <InputGenerator
                  title="CEP:"
                  formItemName="zip_code"
                  formItemValue={localData.zip_code
                    || ""}
                  placeholder="CEP"
                />
                <div className="flex h-9 gap-4 text-[14px] w-full text-neutral-700">
                  <div className="flex ">
                    <p>
                      <strong>CEP único:</strong>
                    </p>
                  </div>
                  <div className="flex flex-1">
                    <Form.Item name="single_zip_code" className="mb-0 ">
                      <Select
                        placeholder="CEP único"
                        className="min-w-[150px]"
                        size="small"
                      >
                        <Select.Option value={1}>Sim</Select.Option>
                        <Select.Option value={0}>Não</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex justify-end gap-4 z-10"
        style={{
          position: "sticky",
          bottom: -1,
          left: 0,
          right: 0,
          paddingTop: "8px",
          paddingBottom: "8px",
          background: "#ffffff",
        }}
      >
        <Button
          onClick={handleCancel}
          className={blueOutlineButtonClass}
          style={{
            fontSize: "14px",
          }}
        >
          Cancelar
        </Button>
        <Button
          htmlType="submit"
          loading={loading}
          className={blueOutlineButtonClass}
          style={{
            fontSize: "14px",
          }}
        >
          Salvar
        </Button>
      </div>
    </Form>
  );
}
