import { Button, Form, Input, Select } from "antd";
import type { ProductExtraGroup } from "@/interfaces/products";

export type ExtraOptionFormValue = {
    id?: string;
    label?: string;
    price?: number;
    description?: string | null;
};

export type ExtraGroupFormValue = {
    id?: string;
    input_type?: ProductExtraGroup["input_type"];
    label?: string;
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
                                    label="Tipo"
                                    rules={[{ required: true, message: "Tipo obrigatorio" }]}
                                >
                                    <Select placeholder="Selecione o tipo">
                                        <Select.Option value="checkbox">Checkbox</Select.Option>
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
                                    rules={[{ required: true, message: "Título obrigatorio" }]}
                                >
                                    <Input placeholder={groupPlaceholder} />
                                </Form.Item>
                            </div>

                            <Form.List name={[name, "options"]}>
                                {(optionFields, { add: addOption, remove: removeOption }) => (
                                    <div className="space-y-2">
                                        {optionFields.map(
                                            ({ key: optionKey, name: optionName, ...optionRest }) => (
                                                <div key={optionKey} className="grid grid-cols-3 gap-2">
                                                    <Form.Item
                                                        {...optionRest}
                                                        name={[optionName, "label"]}
                                                        rules={[{ required: true, message: "Título obrigatorio" }]}
                                                    >
                                                        <Input placeholder="Título" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...optionRest}
                                                        name={[optionName, "price"]}
                                                        rules={[{ required: false }]}
                                                    >
                                                        <Input inputMode="decimal" placeholder="Preco" />
                                                    </Form.Item>
                                                    <div className="flex gap-1">
                                                        <Form.Item
                                                            {...optionRest}
                                                            name={[optionName, "description"]}
                                                            className="flex-1"
                                                            rules={[{ required: false }]}
                                                        >
                                                            <Input placeholder="Descricao" />
                                                        </Form.Item>
                                                        <Button danger onClick={() => removeOption(optionName)}>
                                                            X
                                                        </Button>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                        <Button type="dashed" onClick={() => addOption()} block>
                                            + Opcao
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