import { blueOutlineButtonClass } from "@/utils/buttonStyles";
import {
    Button,
    Form,
    Select,
} from "antd";
import { useState } from "react";
import type { FormInstance } from "antd";
import { ProductBLDetailFields } from "../components/ProductBLDetailFields";
import { ProductBLExtrasFields } from "../components/ProductBLExtrasFields";
import { ProductBLHeaderPricingFields } from "../components/ProductBLHeaderPricingFields";

export default function EditProductBL({ handleCancel, handleSave, form }: { handleCancel: () => void; handleSave: () => void; form: FormInstance }) {
    const [activeExtrasTab, setActiveExtrasTab] = useState<"non_client" | "client">("non_client");
    return (
        <>
            <Form form={form} layout="vertical" className="space-y-2 ">
                <div className="max-h-[460px] overflow-y-auto scrollbar-thin">
                    <ProductBLHeaderPricingFields />

                    <div className="bg-neutral-50 p-2 rounded-lg mb-4">
                        <div className="grid grid-cols-1 w-full gap-4">
                            <Form.Item
                                label="Status"
                                name="online"
                                rules={[{ required: true, message: "Status é obrigatório" }]}
                            >
                                <Select placeholder="Selecione o status">
                                    <Select.Option value={true}>Online</Select.Option>
                                    <Select.Option value={false}>Offline</Select.Option>
                                </Select>
                            </Form.Item>
                        </div>
                    </div>

                    {/* Características do Plano */}
                    <ProductBLDetailFields />

                    {/* EXTRAS */}
                    <ProductBLExtrasFields activeTab={activeExtrasTab} onTabChange={setActiveExtrasTab} />
                </div>

                {/* Botões de Ação */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        onClick={handleCancel}
                        className={blueOutlineButtonClass}
                        variant="outlined"
                        style={{
                            fontSize: "14px",
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSave}
                        style={{ backgroundColor: "#0026d9", borderColor: "#0026d9" }}
                    >
                        Salvar
                    </Button>
                </div>
            </Form>
        </>
    )
}