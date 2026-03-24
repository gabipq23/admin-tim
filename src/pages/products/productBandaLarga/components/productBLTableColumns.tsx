
import { IProduct } from "@/interfaces/products";
import { blueOutlineButtonClass } from "@/utils/buttonStyles";
import { ConfigProvider, Switch, TableColumnsType, Tooltip } from "antd";

export const useAllTableColumns = (updateProductBL: (payload: { id: number; values: Partial<IProduct> }) => void): TableColumnsType<IProduct> => {

    return [
        {
            title: "Id",
            dataIndex: "id",
            width: 100,
        },

        {
            title: "Plano",
            dataIndex: "name",
            width: 100,
        },
        {
            title: "Valor ",
            dataIndex: ["pricing", "base_monthly"],
            width: 140,
            render: (_value, record) =>
                `R$ ${record?.pricing?.base_monthly?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                })}`,
        },
        { title: " Tipo", dataIndex: "client_type", width: 100 },

        {
            title: "",
            dataIndex: "online",
            width: 50,
            render: (_value, record) => (
                <ConfigProvider
                    theme={{
                        components: {
                            Switch: { colorPrimary: "#0026d9", colorPrimaryHover: "#550088" },
                        },
                    }}
                >
                    <Tooltip
                        title="Ative ou desative o aparelho da plataforma"
                        placement="top"
                        styles={{ body: { fontSize: "12px" } }}
                    >
                        <Switch
                            className={blueOutlineButtonClass}
                            size="small"
                            checked={!!record.online}
                            onChange={(checked) => {
                                updateProductBL({ id: record.id, values: { online: checked } });
                            }}
                        />
                    </Tooltip>
                </ConfigProvider>
            ),
        },
    ];


}