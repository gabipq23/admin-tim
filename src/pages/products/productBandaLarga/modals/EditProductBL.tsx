import { blueOutlineButtonClass } from "@/utils/buttonStyles";
import {
    Button,
    Form,
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