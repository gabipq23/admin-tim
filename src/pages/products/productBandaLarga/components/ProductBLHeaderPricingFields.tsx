import { UF_OPTIONS } from "@/utils/ufOptions";
import {
    ExclamationCircleOutlined,
    FilePdfOutlined,
    FileZipOutlined,
    UploadOutlined,
    DownOutlined,
} from "@ant-design/icons";
import {
    Button,
    Checkbox,
    Dropdown,
    Form,
    Input,
    Select,
    Tooltip,
    Upload,
} from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";

export function ProductBLHeaderPricingFields() {
    const form = Form.useFormInstance();

    const selectedUFs = Form.useWatch("uf", form) || [];
    const allUFValues = UF_OPTIONS.map((uf) => uf.value);
    const isAllSelected = allUFValues.length > 0 && selectedUFs.length === allUFValues.length;

    const handleSelectAll = (e: CheckboxChangeEvent) => {
        if (e.target.checked) {
            form?.setFieldValue("uf", allUFValues);
        } else {
            form?.setFieldValue("uf", []);
        }
    };

    const handleUFChange = (values: string[]) => {
        form?.setFieldValue("uf", values);
    };

    return (
        <>
            {/* HEADER DO PLANO */}
            <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 w-full gap-4 mb-4">
                    <Form.Item
                        label="Nome"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Nome do plano é obrigatório",
                            },
                        ]}
                    >
                        <Input placeholder="Digite o nome do plano" />
                    </Form.Item>

                    <Form.Item label="Informações adicionais" name="badge">
                        <Input placeholder="Ex: Recomendado" />
                    </Form.Item>


                </div>

                <div className="grid grid-cols-2 w-full gap-4 mb-4">
                    <Form.Item
                        label="Título da Oferta"
                        name="offer_title"
                        rules={[{ required: true, message: "Título da oferta é obrigatório" }]}
                    >
                        <Input placeholder="Ex: Internet para jogar sem travar" />
                    </Form.Item>

                    <Form.Item label="Subtítulo da Oferta" name="offer_subtitle">
                        <Input placeholder="Ex: Mais velocidade, estabilidade e benefícios" />
                    </Form.Item>

                </div>
                <div className="grid grid-cols-3 w-full gap-4 mb-4">
                    <Form.Item
                        label="Tipo de Cliente"
                        name="client_type"
                        rules={[
                            {
                                required: true,
                                message: "Tipo de cliente é obrigatório",
                            },
                        ]}
                    >
                        <Select placeholder="Selecione o tipo">
                            <Select.Option value="PF">Pessoa Física (PF)</Select.Option>
                            <Select.Option value="PJ">Pessoa Jurídica (PJ)</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="UF"
                        name="uf"
                        rules={[{ required: true, message: "Seleção de UF é obrigatória" }]}
                    >
                        <Dropdown
                            popupRender={() => (
                                <div
                                    style={{
                                        width: 315,
                                        background: "#fff",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: 8,
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                        padding: 12,
                                        maxHeight: 240,
                                        overflowY: "auto",
                                        scrollbarWidth: "none",
                                        msOverflowStyle: "none",
                                    }}
                                >
                                    <style>
                                        {
                                            `
                                            .hide-scrollbar-uf::-webkit-scrollbar {
                                                display: none;
                                            }
                                            `
                                        }
                                    </style>
                                    <div className="hide-scrollbar-uf">
                                        <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #e5e7eb" }}>
                                            <Checkbox
                                                checked={isAllSelected}
                                                onChange={handleSelectAll}
                                                style={{ fontWeight: 500 }}
                                            >
                                                Selecionar Todos
                                            </Checkbox>
                                        </div>
                                        <Checkbox.Group
                                            options={UF_OPTIONS}
                                            value={selectedUFs}
                                            onChange={handleUFChange}
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 8,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            trigger={["click"]}
                        >
                            <Button style={{ width: "100%" }}>
                                Selecionar UF <DownOutlined />
                            </Button>
                        </Dropdown>
                    </Form.Item>
                    <Form.Item
                        label={
                            <>
                                Condições da Oferta (PDF ou ZIP)
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
                            beforeUpload={() => false}
                            multiple
                            accept=".pdf,.zip"
                            action={undefined}
                            listType="text"
                            maxCount={5}
                            showUploadList={{
                                showRemoveIcon: true,
                                showPreviewIcon: false,
                                showDownloadIcon: false,
                            }}
                            iconRender={(file) => {
                                if (file.type === "application/pdf") return <FilePdfOutlined />;
                                if (
                                    file.type === "application/zip" ||
                                    file.name.endsWith(".zip")
                                ) {
                                    return <FileZipOutlined />;
                                }
                                return <UploadOutlined />;
                            }}
                        >
                            <Button icon={<UploadOutlined />}>
                                Selecionar Arquivos
                            </Button>
                        </Upload>
                    </Form.Item>
                </div>
            </div>

            {/* PREÇOS */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 pb-0 mb-6">
                {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Preços
                </h3> */}
                <div className="grid grid-cols-3 w-full gap-4 mb-1">
                    <Form.Item
                        label="Preço Inicial (R$)"
                        name="pricing_base_monthly_original"
                    >
                        <Input inputMode="decimal" placeholder="Ex: 369,99" />
                    </Form.Item>

                    <Form.Item
                        label="Preço Atual (R$)"
                        name="pricing_base_monthly"
                        rules={[{ required: true, message: "Preço atual obrigatório" }]}
                    >
                        <Input inputMode="decimal" placeholder="Ex: 300,99" />
                    </Form.Item>

                    <Form.Item label="Instalação (R$)" name="pricing_installation">
                        <Input inputMode="decimal" placeholder="Ex: 49,90" />
                    </Form.Item>
                </div>
            </div>
        </>
    );
}
