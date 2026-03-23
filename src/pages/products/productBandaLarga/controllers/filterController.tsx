import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TableColumnsType, } from "antd";
import { useStyle } from "@/style/tableStyle";

function getFiltersFromURL(): {
  online: boolean | null;
  company: string | null;
  category: string | null;
  business_partner: string | null;
  landing_page: string | null;
  order: string | null;
  sort: string | null;
  client_type: string | null;
  page: number;
  per_page: number;
} {
  const params = new URLSearchParams(window.location.search);
  const online = params.get("online") === "true" ? true : null;
  const company = params.get("company");
  const category = params.get("category");
  const business_partner = params.get("business_partner");
  const landing_page = params.get("landing_page");
  const order = params.get("order");
  const sort = params.get("sort");
  const client_type = params.get("client_type");
  const page = params.get("page") ? parseInt(params.get("page")!, 10) : 1;
  const per_page = params.get("per_page")
    ? parseInt(params.get("per_page")!, 10)
    : 20;

  return {
    online,
    company,
    category,
    business_partner,
    landing_page,
    order,
    sort,
    client_type,
    page,
    per_page,
  };
}

export function useProductsBLFilterController() {
  const navigate = useNavigate();
  const filters = getFiltersFromURL();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const { handleSubmit, reset, control } = useForm<any>({
    defaultValues: filters,
  });
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const onSubmit = (data: any) => {
    const params = new URLSearchParams();

    if (data.online) params.set("online", data.online);
    if (data.page) params.set("page", data.page);
    if (data.per_page) params.set("per_page", data.per_page);
    if (data.company) params.set("company", data.company);
    if (data.category) params.set("category", data.category);
    if (data.business_partner) params.set("business_partner", data.business_partner);
    if (data.landing_page) params.set("landing_page", data.landing_page);
    if (data.order) params.set("order", data.order);
    if (data.sort) params.set("sort", data.sort);
    if (data.client_type) params.set("client_type", data.client_type);
    navigate(`?${params.toString()}`);
    setIsFiltered(true);
  };

  const clearFilters = () => {
    reset({
      page: 1,
      per_page: 20,
      online: null,
      company: null,
      category: null,
      business_partner: null,
      landing_page: null,
      order: null,
      sort: null,
      client_type: null,
    });

    navigate("");
    setIsFiltered(false);
  };

  const { styles } = useStyle();

  const tableColumns: TableColumnsType<any> = [
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

    // {
    //   title: "",
    //   dataIndex: "online",
    //   width: 50,
    //   render: (_value, record) => (
    //     <ConfigProvider
    //       theme={{
    //         components: {
    //           Switch: { colorPrimary: "#660099", colorPrimaryHover: "#550088" },
    //         },
    //       }}
    //     >
    //       <Tooltip
    //         title="Ative ou desative o aparelho da plataforma"
    //         placement="top"
    //         styles={{ body: { fontSize: "12px" } }}
    //       >
    //         <Switch
    //           size="small"
    //           checked={!!record.online}
    //           onChange={(checked) => {
    //             changePlanStatus({ id: record.id, online: checked });
    //           }}
    //         />
    //       </Tooltip>
    //     </ConfigProvider>
    //   ),
    // },
  ];

  return {
    isFiltered,
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedProductId,
    setSelectedProductId,
    tableColumns,
    styles: { customTable: styles.customTable },
  };
}
