import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Segmented, Tooltip } from "antd";
import { ProductExtras } from "./ProductBLExtrasBuilder";

type ExtrasTab = "non_client" | "client";

interface ProductBLExtrasFieldsProps {
    activeTab: ExtrasTab;
    onTabChange: (tab: ExtrasTab) => void;
}

export function ProductBLExtrasFields({ activeTab, onTabChange }: ProductBLExtrasFieldsProps) {
    return (
        <div className="bg-neutral-50 p-4 rounded-lg mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                Extras
                <Tooltip
                    className="cursor-pointer"
                    title="Se este produto não tiver diferença entre as opções de extras para cliente e não cliente, preencha apenas o cenário de Não-clientes. Se houver diferença, preencha os dois cenários."
                    placement="top"
                    styles={{ body: { fontSize: "12px" } }}
                >
                    <span className="text-red-500 text-[12px] cursor-pointer">
                        <ExclamationCircleOutlined />
                    </span>
                </Tooltip>
            </h3>

            <div className="mb-4">
                <Segmented
                    value={activeTab}
                    onChange={(value) => onTabChange(value as ExtrasTab)}
                    options={[
                        { label: "Para Não-clientes", value: "non_client" },
                        { label: "Para Clientes", value: "client" },
                    ]}
                    style={{ width: "100%" }}
                />
            </div>

            {activeTab === "non_client" && (
                <ProductExtras
                    fieldName="extras_non_client"
                    groupButtonLabel="+ Adicionar Grupo"
                    groupPlaceholder="Ex: Deixe seu pacote mais completo"
                />
            )}
            {activeTab === "client" && (
                <ProductExtras
                    fieldName="extras_client"
                    groupButtonLabel="+ Adicionar Grupo"
                    groupPlaceholder="Ex: O dobro de canais"
                />
            )}
        </div>
    );
}
