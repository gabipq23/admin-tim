import { customLocale } from "@/utils/customLocale";
import { UploadOutlined } from "@ant-design/icons";
import {
    Button,
    Checkbox,
    ConfigProvider,
    Form,
    Input,
    Upload,
} from "antd";

export function ProductBLDetailFields() {
    return (
        <div className="bg-neutral-50 p-2 rounded-lg mb-4">
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
                                        rules={[{ required: true, message: "Título é obrigatório" }]}
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
                                                    colorPrimary: "#0026d9",
                                                    colorPrimaryHover: "#0026d9",
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
                                                <Checkbox>Selo Destaque</Checkbox>
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
                                                showDownloadIcon: false,
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
    );
}
