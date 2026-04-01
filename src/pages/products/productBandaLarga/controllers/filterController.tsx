import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useStyle } from "@/style/tableStyle";
import { useAllTableColumns } from "../components/productBLTableColumns";
import { TableColumnsType } from "antd";
import { IProduct } from "@/interfaces/products";
import { getFiltersFromURL, ProductBLFiltersFormValues } from "./filters";

export function useProductsBLFilterController(
  updateProductBL: (payload: { id: number; values: Partial<IProduct> }) => void,
) {
  const navigate = useNavigate();
  const filters = getFiltersFromURL();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const { handleSubmit, reset, control } = useForm<ProductBLFiltersFormValues>({
    defaultValues: filters,
  });
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const onSubmit = (data: ProductBLFiltersFormValues) => {
    const params = new URLSearchParams();

    if (data.online !== null) params.set("online", String(data.online));
    if (data.page) params.set("page", String(data.page));
    if (data.per_page) params.set("per_page", String(data.per_page));
    if (data.company) params.set("company", data.company);
    if (data.category) params.set("category", data.category);
    if (data.business_partner) params.set("business_partner", data.business_partner);
    if (data.landing_page) params.set("landing_page", data.landing_page);
    if (data.order) params.set("order", data.order);
    if (data.sort) params.set("sort", data.sort);
    if (data.client_type) params.set("client_type", data.client_type);
    if (data.uf) params.set("uf", data.uf);
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
      uf: null,
    });

    navigate("");
    setIsFiltered(false);
  };

  const { styles } = useStyle();

  const tableColumns: TableColumnsType<IProduct> = useAllTableColumns(
    updateProductBL,
  );

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
