import {
  Modal,
  Divider,
  Button,
  Form,
  Input,
  InputNumber,
  Upload,
  Tooltip,
  ConfigProvider,
  Checkbox,
  Select,
} from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect, useState } from "react";
import type {
  Product,
  ProductDetail,
  ProductOfferConditionFile,
} from "@/interfaces/products";
import { customLocale } from "@/utils/customLocale";
import ConfirmDeleteModal from "@/components/confirmDeleteModal";

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
  pricing_base_monthly: number;
  pricing_installation: number;
  badge?: string | null;
  offer_title: string;
  offer_subtitle?: string;
  client_type: "PF" | "PJ";
  online: boolean;
  details?: ProductFormDetail[];
  offer_conditions?: ModalUploadFile[];
}

interface BLPJInfoModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  showEditProductLayout: boolean;
  setShowEditProductLayout: (value: boolean) => void;
  planData?: Product | null;
  removeProductBL: (id: number) => void;
  updateProductBL?: (payload: { id: number; values: Partial<Product> }) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const getFileTypeFromName = (filename?: string): string => {
  if (!filename) return "application/octet-stream";
  const extension = filename.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return "application/pdf";
    case "zip":
      return "application/zip";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    default:
      return "application/octet-stream";
  }
};

const getFileNameFromUrl = (url: string, fallback: string) => {
  try {
    const parsed = new URL(url);
    const name = parsed.pathname.split("/").pop();
    return name || fallback;
  } catch {
    const name = url.split("/").pop();
    return name || fallback;
  }
};

const handleDownloadFile = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function ProductBLInfoModal({
  isModalOpen,
  closeModal,
  planData,
  showEditProductLayout,
  setShowEditProductLayout,
  updateProductBL,
  removeProductBL,
}: BLPJInfoModalProps) {
  const [form] = Form.useForm();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
          const conditionType =
            typeof condition === "string"
              ? getFileTypeFromName(condition)
              : condition?.type || getFileTypeFromName(conditionUrl);

          return {
            uid: `existing-offer-${idx}`,
            name: conditionUrl
              ? getFileNameFromUrl(conditionUrl, `arquivo_${idx + 1}`)
              : `arquivo_${idx + 1}`,
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
        pricing_base_monthly: Number(planData.pricing?.base_monthly),
        pricing_installation: Number(planData.pricing?.installation),
        badge: planData.badge,
        offer_title: planData.offer_title,
        offer_subtitle: planData.offer_subtitle,
        client_type: planData.client_type,
        online: planData.online,
        details,
        offer_conditions: offerConditionsFileList,
      });
    }
  }, [planData, showEditProductLayout, form]);

  const handleSave = async () => {
    try {
      if (!planData) return;

      const values = (await form.validateFields()) as ProductFormValues;

      const offerConditionsPromises = (values.offer_conditions || []).map(
        async (file: ModalUploadFile) => {
          if (file.isExisting && file.url) {
            return {
              url: file.url,
              type: file.type || getFileTypeFromName(file.name),
            };
          }
          if (file.originFileObj) {
            const base64 = await fileToBase64(file.originFileObj);
            return {
              url: base64,
              type:
                file.originFileObj.type ||
                file.type ||
                getFileTypeFromName(file.name),
            };
          }
          return null;
        },
      );

      const offer_conditions = (
        await Promise.all(offerConditionsPromises)
      ).filter(
        (condition): condition is ProductOfferConditionFile => Boolean(condition),
      );

      const detailsPromises = (values.details || []).map(
        async (detail: ProductFormDetail): Promise<ProductDetail> => {
          const imagesPromises = Array.isArray(detail.images)
            ? detail.images.map(async (img: ModalUploadFile) => {
              if (img.isExisting && img.url) {
                return img.url;
              }
              if (img.originFileObj) {
                return await fileToBase64(img.originFileObj);
              }
              return null;
            })
            : [];

          const images = (await Promise.all(imagesPromises)).filter(
            (image): image is string => Boolean(image),
          );

          return {
            title: detail.title,
            description: detail.description || "",
            images,
            highlight_top: detail.highlight_top || false,
            highlight_bottom: detail.highlight_bottom || false,
          };
        },
      );

      const details = await Promise.all(detailsPromises);

      const payload = {
        id: planData?.id,
        name: values.name,
        company: planData.company,
        business_partner: planData.business_partner,
        category: planData.category,
        client_type: values.client_type,
        landing_page: planData.landing_page,
        online: values.online ?? true,
        badge: values.badge,
        offer_title: values.offer_title,
        offer_subtitle: values.offer_subtitle,
        pricing: {
          base_monthly: values.pricing_base_monthly,
          installation: values.pricing_installation,
        },
        details,
        extras: planData.extras || { client: [], non_client: [] },
        offer_conditions,
      };

      if (updateProductBL && payload.id) {
        updateProductBL({ id: payload.id, values: payload });
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
            <>
              <div className="max-h-[520px] overflow-y-auto scrollbar-thin">
                {/* Header do Plano */}
                <div className="bg-neutral-100 p-6 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {planData.name} - {planData.client_type}
                      </h2>
                    </div>
                    <div className="">
                      <div className="text-sm text-gray-500">Valor atual</div>

                      <div className="text-3xl flex  font-bold text-neutral-700">
                        R$ {planData.pricing?.base_monthly}{" "}
                        <div className="text-sm flex self-end pb-1 text-gray-500">
                          /mês
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <div className="text-sm text-gray-500">Instalação</div>

                      <div className="text-3xl flex  font-bold text-neutral-700">
                        R$ {planData.pricing?.installation}{" "}
                        <div className="text-sm flex self-end pb-1 text-gray-500">
                          única
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-gray-700 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <WifiOutlined className="text-blue-500" />
                      <span className="font-semibold">{planData.offer_title}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-3 text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{planData.badge}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{planData.offer_subtitle}</p>

                  {planData.offer_conditions &&
                    planData.offer_conditions.length > 0 && (
                      <div className="">
                        <div className="flex flex-wrap gap-2">
                          {planData.offer_conditions.map((
                            condition: ProductOfferConditionFile | string,
                            idx: number,
                          ) => {
                            const conditionUrl =
                              typeof condition === "string"
                                ? condition
                                : condition?.url;

                            if (!conditionUrl) return null;

                            return (
                              <a
                                style={{ color: "#660099" }}
                                key={idx}
                                href={conditionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={`arquivo_${idx + 1}`}
                                className="text-purple-600 underline text-xs"
                              >
                                <DownloadOutlined /> arquivo {idx + 1}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>

                {/* Detalhes do Plano */}
                <div className="flex flex-col gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Características do Plano
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {planData.details?.map((detail: ProductDetail, index: number) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-4 px-2"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold w-3/4 text-gray-800 mb-2">
                                {detail.title}
                              </h4>

                              <div className="w-1/4 flex flex-col gap-1">
                                {detail.highlight_top && (
                                  <p className="text-[10px]  text-center rounded-lg bg-[#660099] text-neutral-100 shadow-md">
                                    Selo Compacto
                                  </p>
                                )}
                                {detail.highlight_bottom && (
                                  <p className="text-[10px] text-center rounded-lg bg-[#660099] text-neutral-100 shadow-md">
                                    Selo Destaque
                                  </p>
                                )}
                              </div>
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed">
                              {detail.description}
                            </p>

                            {/* Links das imagens */}
                            {Array.isArray(detail.images) &&
                              detail.images.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {detail.images.map((imgUrl: string, idx: number) => (
                                    <a
                                      style={{ color: "#660099" }}
                                      key={idx}
                                      href={imgUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      download={`imagem_${idx + 1}.jpg`}
                                      className="text-blue-600 underline text-xs"
                                    >
                                      <DownloadOutlined /> imagem {idx + 1}
                                    </a>
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Divider />
              </div>

              <div className="mt-4 gap-4 flex justify-end">
                <Button
                  onClick={() => setShowEditProductLayout(true)}
                  color="purple"
                  variant="outlined"
                  style={{
                    color: "#660099",
                    fontSize: "14px",
                  }}
                >
                  Editar plano
                </Button>

                <Button
                  onClick={() => setShowDeleteModal(true)}
                  color="red"
                  variant="outlined"
                >
                  Deletar
                </Button>
              </div>
            </>
          ) : (
            <Form form={form} layout="vertical" className="space-y-2 ">
              <div className="max-h-[460px] overflow-y-auto scrollbar-thin">
                {/* Informações Básicas */}
                <div className="bg-neutral-50 p-2 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Informações Básicas
                  </h3>

                  <div className="grid grid-cols-4 w-full gap-4">
                    <Form.Item
                      label="Nome do Plano"
                      name="name"
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
                      label="Preço Mensal (R$)"
                      name="pricing_base_monthly"
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="0.00"
                        min={0}
                        step={0.01}
                        parser={(value) =>
                          Number(value?.replace(/[^\d.]/g, ""))
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      className="flex-1"
                      label="Taxa de Instalação (R$)"
                      name="pricing_installation"
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="0.00"
                        min={0}
                        step={0.01}
                        parser={(value) =>
                          Number(value?.replace(/[^\d.]/g, ""))
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      label="Tipo de Cliente"
                      name="client_type"
                      className="flex-1"
                      rules={[
                        {
                          required: true,
                          message: "Tipo de cliente é obrigatório",
                        },
                      ]}
                    >
                      <Select placeholder="Selecione o tipo">
                        <Select.Option value="PF">
                          Pessoa Física (PF)
                        </Select.Option>
                        <Select.Option value="PJ">
                          Pessoa Jurídica (PJ)
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="grid grid-cols-4 w-full gap-4 ">
                    <Form.Item
                      label="Status"
                      name="online"
                      rules={[
                        {
                          required: true,
                          message: "Status é obrigatório",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Selecione o status"
                        onChange={(value) => {
                          form.setFieldsValue({
                            online: value === true || value === "true",
                          });
                        }}
                      >
                        <Select.Option value={true}>Online</Select.Option>
                        <Select.Option value={false}>Offline</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      className="flex-1"
                      label="Informações adicionais"
                      name="badge"
                    >
                      <Input placeholder="Ex: Somente no site" />
                    </Form.Item>
                    <Form.Item
                      className="flex-1"
                      label="Título da Oferta"
                      name="offer_title"
                      rules={[
                        {
                          required: true,
                          message: "Título da oferta é obrigatório",
                        },
                      ]}
                    >
                      <Input placeholder="Ex: Internet para jogar sem travar" />
                    </Form.Item>
                    <Form.Item
                      className="flex-1"
                      label="Subtítulo da Oferta"
                      name="offer_subtitle"
                    >
                      <Input placeholder="Ex: Mais velocidade, estabilidade e benefícios" />
                    </Form.Item>
                    <Form.Item
                      label={
                        <>
                          Arquivos PDF ou ZIP{" "}
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
                        </>
                      }
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
                          showDownloadIcon: true,
                        }}
                        itemRender={(_, file, __, actions) => (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "4px 0",
                            }}
                          >
                            <span style={{ color: "#660099" }}>
                              {file.name}
                            </span>
                            <Button
                              type="text"
                              icon={<DownloadOutlined size={12} />}
                              onClick={() =>
                                handleDownloadFile(
                                  file.url || file.thumbUrl || "",
                                  file.name || "arquivo.pdf",
                                )
                              }
                              style={{ marginLeft: 4 }}
                            />
                            <Button
                              type="text"
                              icon={
                                <span style={{ fontSize: 12 }}>
                                  <DeleteOutlined />
                                </span>
                              }
                              onClick={() => actions.remove()}
                              style={{ marginLeft: 4 }}
                            />
                          </div>
                        )}
                      >
                        <Button icon={<UploadOutlined />}>
                          Adicionar PDF ou ZIP
                        </Button>
                      </Upload>
                    </Form.Item>
                  </div>
                </div>

                {/* Características do Plano */}
                <div className="bg-neutral-50 p-2 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Características do Plano
                  </h3>

                  <Form.List name="details">
                    {(fields, { add }) => (
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
                                label="Imagens"
                                valuePropName="fileList"
                                getValueFromEvent={(e) =>
                                  Array.isArray(e) ? e : e && e.fileList
                                }
                              >
                                <Upload
                                  multiple
                                  accept="image/*"
                                  action={undefined}
                                  beforeUpload={() => false}
                                  listType="picture-card"
                                  showUploadList={{
                                    showRemoveIcon: true,
                                    showPreviewIcon: false,
                                    showDownloadIcon: true,
                                  }}
                                  onDownload={(file) => {
                                    // Usa handleDownloadFile para baixar com nome correto
                                    handleDownloadFile(
                                      file.url || file.thumbUrl || "",
                                      file.type?.includes("pdf")
                                        ? "arquivo.pdf"
                                        : "imagem.jpg",
                                    );
                                  }}
                                  onPreview={(file) => {
                                    if (file.url) {
                                      window.open(file.url, "_blank");
                                    }
                                  }}
                                >
                                  <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                  </div>
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
                <Button
                  onClick={handleCancel}
                  color="purple"
                  variant="outlined"
                  style={{
                    color: "#660099",
                    fontSize: "14px",
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="primary"
                  onClick={handleSave}
                  style={{ backgroundColor: "#660099", borderColor: "#660099" }}
                >
                  Salvar
                </Button>
              </div>
            </Form>
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
