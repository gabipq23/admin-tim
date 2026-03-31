import React, { useState } from "react";
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
import { OrderBandaLarga } from "@/interfaces/orderBandaLarga";

interface OrderBandaLargaPFEditProps {
  localData: OrderBandaLarga;
  form: FormInstance;
  onPlanChange: (planId: number) => void;
  planOptions: any;
  handleSave: () => void;
  handleCancel: () => void;
  loading: boolean;
}

export function OrderBandaLargaPFEdit({
  localData,
  onPlanChange,
  planOptions,
  form,
  handleSave,
  handleCancel,
  loading,
}: OrderBandaLargaPFEditProps) {
  // Estado para extras dinâmicos
  const [extrasOptions, setExtrasOptions] = useState<any[]>([]);

  // Atualiza extras ao trocar plano
  const handlePlanChange = (planId: number) => {
    onPlanChange(planId);
    const found = planOptions.find((p: any) => p.value === planId);
    if (found && found.plan && found.plan.online) {
      setExtrasOptions(found.plan.extras?.non_client || []);
      form.setFieldsValue({ selected_extras: [] });
    } else {
      setExtrasOptions([]);
      form.setFieldsValue({ selected_extras: [] });
    }
  };

  // Inicializa extras se já houver plano selecionado
  React.useEffect(() => {
    if (form.getFieldValue("plan_id")) {
      handlePlanChange(form.getFieldValue("plan_id"));
    }
    // eslint-disable-next-line
  }, []);
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
              <p className="w-66 text-center">Plano</p>
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
              <div className="w-66 flex justify-center">
                <Form.Item name="plan_id" className="mb-0">
                  <Select
                    size="small"
                    showSearch
                    placeholder="Selecione o plano"
                    className="min-w-64"
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
                  {extrasOptions.map((extra) => (
                    <Checkbox key={extra.id} value={extra.id}>
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

        {/* Detalhes adicionais em lista */}
        {/* <div className="mt-4  rounded-md p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex h-9 gap-4 text-[14px] w-full text-neutral-700">
              <div className="flex">
                <p><strong>Escolha:</strong></p>
              </div>
              <div className="flex flex-1">
                <Form.Item name="line_action" className="mb-0">
                  <Select
                    size="small"
                    placeholder="Selecione"
                    className="min-w-[200px]"
                  >
                    <Select.Option value="new_number">Novo Número</Select.Option>
                    <Select.Option value="port_in_to_vivo">Portabilidade para Vivo</Select.Option>
                    <Select.Option value="keep_vivo_number">Manter Número Vivo</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            <InputGenerator
              title="Número Informado:"
              formItemName="line_number_informed"
              formItemValue={localData.line_number_informed || ""}
              placeholder="Número"
            />

            <div className="flex h-9 gap-4 text-[14px] w-full text-neutral-700">
              <div className="flex">
                <p><strong>eSIM:</strong></p>
              </div>
              <div className="flex flex-1">
                <Form.Item name="wants_esim" className="mb-0">
                  <Select
                    size="small"
                    placeholder="Selecione"
                    className="min-w-[150px]"
                  >
                    <Select.Option value={true}>Sim</Select.Option>
                    <Select.Option value={false}>Não</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
          </div>
        </div> */}


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

        {/* Informações do Cliente */}
        <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3  w-full">
          <div className="flex items-center mb-1">
            <h2 className="text-[14px] text-[#666666]">
              Informações do Cliente
            </h2>
          </div>
          <div className="flex flex-col text-neutral-800  rounded-lg p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna 1 */}
              <div className="flex flex-col gap-1">
                <InputGenerator
                  title="Nome Completo:"
                  formItemName="full_name"
                  formItemValue={localData.full_name || ""}
                  placeholder="Nome completo"
                />

                <InputGenerator
                  title="CPF:"
                  formItemName="cpf"
                  formItemValue={localData.cpf || ""}
                  placeholder="CPF"
                />
                <InputGenerator
                  title="Data de Nascimento:"
                  formItemName="birth_date"
                  formItemValue={localData.birth_date || ""}
                  placeholder="Data de nascimento"
                />
                <InputGenerator
                  title="Email:"
                  formItemName="email"
                  formItemValue={localData.email || ""}
                  placeholder="Email"
                />
              </div>

              {/* Coluna 2 */}
              <div className="flex flex-col gap-1">
                <InputGenerator
                  title="Nome da Mãe:"
                  formItemName="mother_full_name"
                  formItemValue={localData.mother_full_name || ""}
                  placeholder="Nome da mãe"
                />

                <InputGenerator
                  title="Telefone:"
                  formItemName="phone"
                  formItemValue={localData.phone || ""}
                  placeholder="Telefone"
                />

                <InputGenerator
                  title="Telefone Adicional:"
                  formItemName="additional_phone"
                  formItemValue={localData.additional_phone || ""}
                  placeholder="Telefone"
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
