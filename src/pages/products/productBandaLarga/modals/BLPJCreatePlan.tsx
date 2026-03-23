import { customLocale } from "@/utils/customLocale";
import {
  ExclamationCircleOutlined,
  FilePdfOutlined,
  FileZipOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  Tooltip,
  ConfigProvider,
  Checkbox,
  Select,
} from "antd";
import { useEffect } from "react";

interface BLPJCreatePlanProps {
  createPlanBL: (planData: any) => void;
  showCreateModal: boolean;
  setShowCreateModal: (value: boolean) => void;
}

export default function BLPJCreatePlan({
  createPlanBL,
  showCreateModal,
  setShowCreateModal,
}: BLPJCreatePlanProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (showCreateModal) {
      form.resetFields();
    }
  }, [showCreateModal, form]);
  function getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      let offerConditions: string[] = [];
      if (values.offer_conditions && Array.isArray(values.offer_conditions)) {
        offerConditions = await Promise.all(
          values.offer_conditions.map(async (fileObj: any) => {
            const file = fileObj.originFileObj;
            if (file) {
              return await getBase64(file);
            }
            return "";
          }),
        );
      }

      // Processa detalhes e imagens
      const details = await Promise.all(
        (values.details || []).map(async (detail: any) => {
          let images: string[] = [];
          if (detail.images && Array.isArray(detail.images)) {
            images = await Promise.all(
              detail.images.map(async (fileObj: any) => {
                const file = fileObj.originFileObj;
                if (file) {
                  return await getBase64(file);
                }
                return "";
              }),
            );
          }
          return {
            title: detail.title,
            description: detail.description,
            images,
            highlight_top: detail.highlight_top || false,
            highlight_bottom: detail.highlight_bottom || false,
          };
        }),
      );

      const newPlan = {
        id: Date.now().toString(),
        plan_name: values.plan_name,
        plan_price_to: values.plan_price_to,
        plan_price_from: values.plan_price_from,
        plan_speed: values.plan_speed,
        plan_badge: values.plan_badge || "",
        type_client: values.type_client,
        online: true,
        offer_conditions: offerConditions,
        details,
        created_at: new Date().toLocaleString("pt-BR"),
        updated_at: new Date().toLocaleString("pt-BR"),
      };

      createPlanBL(newPlan);
      setShowCreateModal(false);
      form.resetFields();
    } catch (error) {
      console.error("Erro ao validar formulário:", error);
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
            {/* Informações Básicas */}
            <div className="bg-neutral-50 p-2 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Informações Básicas
              </h3>

              <div className="grid grid-cols-4 w-full gap-4">
                <Form.Item
                  label="Nome do Plano"
                  name="plan_name"
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Nome do plano é obrigatório",
                    },
                  ]}
                >
                  <Input placeholder="Digite o nome do plano" />
                </Form.Item>
                <Form.Item
                  className="flex-1"
                  label="Preço Atual (R$)"
                  name="plan_price_to"
                  rules={[{ required: true, message: "Preço é obrigatório" }]}
                >
                  <Input placeholder="Ex: 99.90" />
                </Form.Item>
                <Form.Item
                  className="flex-1"
                  label="Preço Inicial (R$)"
                  name="plan_price_from"
                >
                  <Input placeholder="Ex: 99.90" />
                </Form.Item>
                <Form.Item
                  label="Tipo de Cliente"
                  name="type_client"
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Tipo de cliente é obrigatório",
                    },
                  ]}
                >
                  <Select placeholder="Selecione o tipo">
                    <Select.Option value="PF">Pessoa Física (PF)</Select.Option>
                    <Select.Option value="PJ">
                      Pessoa Jurídica (PJ)
                    </Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="grid grid-cols-3 w-full gap-4">
                <Form.Item
                  className="flex-1"
                  label="Informações adicionais"
                  name="plan_badge"
                >
                  <Input placeholder="Ex: Somente no site" />
                </Form.Item>
                <Form.Item
                  className="flex-1"
                  label="Velocidade"
                  name="plan_speed"
                  rules={[
                    { required: true, message: "Velocidade é obrigatória" },
                  ]}
                >
                  <Input placeholder="Ex: 100 Mbps" />
                </Form.Item>

                {/* Upload de condições da oferta */}
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                    Condições da Oferta
                    <Tooltip
                      className="cursor-pointer"
                      title="Arquivos com no máximo 10MB."
                      placement="top"
                      styles={{ body: { fontSize: "12px" } }}
                    >
                      <span className="text-red-400 text-[12px] cursor-pointer ml-1">
                        <ExclamationCircleOutlined />
                      </span>
                    </Tooltip>
                  </h4>
                  <Form.Item
                    name="offer_conditions"
                    valuePropName="fileList"
                    getValueFromEvent={(e) =>
                      Array.isArray(e) ? e : e && e.fileList
                    }
                  >
                    <Upload
                      multiple
                      accept=".pdf,.zip"
                      action={undefined}
                      beforeUpload={() => false}
                      showUploadList={{
                        showRemoveIcon: true,
                        showPreviewIcon: false,
                        showDownloadIcon: false,
                      }}
                      iconRender={(file) => {
                        if (file.type === "application/pdf")
                          return <FilePdfOutlined />;
                        if (
                          file.type === "application/zip" ||
                          file.name.endsWith(".zip")
                        )
                          return <FileZipOutlined />;
                        return <UploadOutlined />;
                      }}
                    >
                      <Button icon={<UploadOutlined />}>
                        Adicionar arquivos PDF ou ZIP
                      </Button>
                    </Upload>
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* Características do Plano */}
            <div className="bg-neutral-50 p-2 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Características do Plano
              </h3>

              <Form.List name="details">
                {(fields, { add, remove }) => (
                  <div className="grid grid-cols-2 gap-2">
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        key={key}
                        className="border border-gray-200 rounded-lg p-4 mb-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-gray-700">
                            Característica {name + 1}
                          </h4>
                          <Button
                            type="text"
                            danger
                            size="small"
                            onClick={() => remove(name)}
                          >
                            Remover
                          </Button>
                        </div>

                        <div className="flex flex-col gap-4">
                          <Form.Item
                            {...restField}
                            name={[name, "title"]}
                            label="Título"
                            rules={[
                              {
                                required: true,
                                message: "Título é obrigatório",
                              },
                            ]}
                          >
                            <Input placeholder="Ex: Velocidade" />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, "description"]}
                            label="Descrição"
                          >
                            <Input placeholder="Ex: 100 Mbps de download" />
                          </Form.Item>

                          <ConfigProvider
                            locale={customLocale}
                            theme={{
                              components: {
                                Checkbox: {
                                  colorPrimary: "#660099",
                                  colorPrimaryHover: "#660099",
                                  borderRadius: 4,
                                  controlInteractiveSize: 18,
                                  lineWidth: 2,
                                },
                              },
                            }}
                          >
                            <div className="flex gap-2">
                              <Form.Item
                                {...restField}
                                name={[name, "highlight_top"]}
                                valuePropName="checked"
                                initialValue={false}
                              >
                                <Checkbox>Selo Compacto</Checkbox>
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                name={[name, "highlight_bottom"]}
                                valuePropName="checked"
                                initialValue={false}
                              >
                                <Checkbox> Selo Destaque</Checkbox>
                              </Form.Item>
                            </div>
                          </ConfigProvider>
                          <Form.Item
                            {...restField}
                            name={[name, "images"]}
                            valuePropName="fileList"
                            getValueFromEvent={(e) =>
                              Array.isArray(e) ? e : e && e.fileList
                            }
                          >
                            <Upload
                              multiple
                              action={undefined}
                              beforeUpload={() => false}
                              showUploadList={{
                                showRemoveIcon: true,
                                showPreviewIcon: false,
                                showDownloadIcon: false,
                              }}
                            >
                              <Button icon={<UploadOutlined />}>
                                Adicionar imagens
                              </Button>
                            </Upload>
                          </Form.Item>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      className="mb-4"
                    >
                      + Adicionar Característica
                    </Button>
                  </div>
                )}
              </Form.List>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={handleCancel}>Cancelar</Button>
            <Button
              type="primary"
              onClick={handleSave}
              style={{ backgroundColor: "#660099", borderColor: "#660099" }}
            >
              Criar Plano
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
