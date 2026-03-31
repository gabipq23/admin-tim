import { Button, Form, Input, Select, Tooltip, Upload } from "antd";
import { useState } from "react";

import type { ProductExtraGroup } from "@/interfaces/products";
import { ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import InputTypeTooltipContent from "@/components/InputTypeTooltipContent";

export type ExtraOptionFormValue = {
    id?: string;
    label?: string;
    price?: number;
    description?: string | null;
    bonus?: {
        type?: string;
        speed?: number;
        description?: string;
        price?: number;
    };
};

export type ExtraGroupFormValue = {
    id?: string;
    input_type?: ProductExtraGroup["input_type"];
    label?: string;
    images?: string[];
    options?: ExtraOptionFormValue[];
};

interface ProductExtrasProps {
    fieldName: string;
    groupButtonLabel?: string;
    groupPlaceholder?: string;
}

export function ProductExtras({
    fieldName,
    groupButtonLabel = "+ Grupo",
    groupPlaceholder = "Ex: Opcoes adicionais",
}: ProductExtrasProps) {
    const [bonusVisible, setBonusVisible] = useState<Record<string, boolean>>({});

    const handleToggleBonus = (optionKey: string) => {
        setBonusVisible((prev) => ({ ...prev, [optionKey]: !prev[optionKey] }));
    };

    return (
        <Form.List name={fieldName}>
            {(groupFields, { add: addGroup, remove: removeGroup }) => (
                <div className="space-y-3">
                    {groupFields.map(({ key, name, ...restField }) => (
                        <div key={key} className="border border-gray-200 rounded-lg p-3">
                            <div className="grid grid-cols-2 gap-2">
                                <Form.Item
                                    {...restField}
                                    name={[name, "input_type"]}
                                    label={<h3 className=" mb-4 flex items-center gap-2">
                                        Tipo
                                        <Tooltip
                                            className="cursor-pointer"
                                            title={<InputTypeTooltipContent />}
                                            placement="top"
                                            styles={{ body: { fontSize: "12px" } }}
                                        >
                                            <span className="text-red-500 text-[12px] cursor-pointer">
                                                <ExclamationCircleOutlined />
                                            </span>
                                        </Tooltip>
                                    </h3>}
                                    rules={[{ required: true, message: "Tipo obrigatório" }]}
                                >
                                    <Select placeholder="Selecione o tipo">
                                        <Select.Option value="radio">Radio</Select.Option>
                                        <Select.Option value="checkbox">Switch</Select.Option>
                                        <Select.Option value="checkbox_group">
                                            Grupo de Checkbox
                                        </Select.Option>
                                        <Select.Option value="select">Select</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, "label"]}
                                    label="Título"

                                >
                                    <Input placeholder={groupPlaceholder} />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, "description"]}
                                    label="Descrição"
                                >
                                    <Input placeholder={groupPlaceholder} />
                                </Form.Item>
                            </div>
                            <Form.Item
                                {...restField}
                                name={[name, "images"]}
                                label="Imagens"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
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
                            <p style={{ marginBottom: "8px" }}>Opções</p>
                            <Form.List name={[name, "options"]}>

                                {(optionFields, { add: addOption, remove: removeOption }) => (
                                    <div className="space-y-2">
                                        {optionFields.map(
                                            ({ key: optionKey, name: optionName, ...optionRest }) => {
                                                const bonusKey = String(optionKey);
                                                const isBonusVisible = bonusVisible[bonusKey];
                                                return (
                                                    <div key={optionKey} className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-2 flex flex-col gap-2">
                                                        <div className="flex flex-col md:flex-row gap-2 w-full">
                                                            <Form.Item
                                                                {...optionRest}
                                                                name={[optionName, "label"]}
                                                                className="flex-1"
                                                                rules={[{ required: true, message: "Título obrigatório" }]}
                                                            >
                                                                <Input placeholder="Título" />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...optionRest}
                                                                name={[optionName, "price"]}
                                                                className="w-36"
                                                                rules={[{ required: false }]}
                                                            >
                                                                <Input inputMode="decimal" placeholder="Preço" />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...optionRest}
                                                                name={[optionName, "description"]}
                                                                className="flex-1"
                                                                rules={[{ required: false }]}
                                                            >
                                                                <Input placeholder="Descrição" />
                                                            </Form.Item>
                                                            <Button danger onClick={() => removeOption(optionName)} className="w-8">
                                                                <span aria-label="Remover opção" title="Remover opção">✕</span>
                                                            </Button>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                type={isBonusVisible ? "default" : "dashed"}
                                                                size="small"
                                                                onClick={() => handleToggleBonus(bonusKey)}
                                                                className="!px-2 !py-0 h-7"
                                                            >
                                                                {isBonusVisible ? "Ocultar bônus" : "Adicionar bônus"}
                                                            </Button>
                                                        </div>
                                                        {isBonusVisible && (
                                                            <div className="flex flex-col md:flex-row gap-2 mt-2 bg-gray-50 rounded p-2 w-full shadow-inner">
                                                                <Form.Item
                                                                    {...optionRest}
                                                                    name={[optionName, "bonus", "type"]}
                                                                    label="Tipo do Bônus"
                                                                    className="w-56"
                                                                    rules={[{ required: false }]}
                                                                >
                                                                    <Input placeholder="Tipo do bônus" />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...optionRest}
                                                                    name={[optionName, "bonus", "speed"]}
                                                                    label="Velocidade"
                                                                    className="w-36"
                                                                    rules={[{ required: false }]}
                                                                >
                                                                    <Input inputMode="numeric" placeholder="Velocidade" />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...optionRest}
                                                                    name={[optionName, "bonus", "description"]}
                                                                    label="Descrição do Bônus"
                                                                    className="flex-1"
                                                                    rules={[{ required: false }]}
                                                                >
                                                                    <Input placeholder="Descrição" />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...optionRest}
                                                                    name={[optionName, "bonus", "price"]}
                                                                    label="Preço do Bônus"
                                                                    className="w-36"
                                                                    rules={[{ required: false }]}
                                                                >
                                                                    <Input inputMode="decimal" placeholder="Preço" />
                                                                </Form.Item>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            },
                                        )}
                                        <Button type="dashed" onClick={() => addOption()} block>
                                            + Opção
                                        </Button>
                                    </div>
                                )}
                            </Form.List>

                            <Button danger type="text" onClick={() => removeGroup(name)}>
                                Remover grupo
                            </Button>
                        </div>
                    ))}
                    <Button type="dashed" onClick={() => addGroup()} block>
                        {groupButtonLabel}
                    </Button>
                </div>
            )}
        </Form.List>
    );
}