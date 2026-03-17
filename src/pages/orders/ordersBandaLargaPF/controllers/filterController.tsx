import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TableColumnsType } from "antd";
import { BandaLargaFilters, OrderBandaLargaPF } from "@/interfaces/bandaLargaPF";
import { useStyle } from "@/style/tableStyle";
import { useAllTableColumns } from "../components/tableColumns";

function getFiltersFromURL(): BandaLargaFilters {
  const params = new URLSearchParams(window.location.search);

  const page = parseInt(params.get("page") || "1", 10);
  const per_page = parseInt(params.get("per_page") || "20", 10);
  const data_to = params.get("data_ate") || undefined;
  const data_from = params.get("data_de") || undefined;
  const status = params.get("status") || undefined;


  return {
    page, per_page, data_to, data_from, status
  };
}

export function useAllOrdersFilterController() {
  const navigate = useNavigate();
  const filters = getFiltersFromURL();

  const [selectedBLOrder, setSelectedBLOrder] = useState<OrderBandaLargaPF | null>(null);
  const [isModalAvatarOpen, setIsModalAvatarOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const currentPage = filters.page;
  const pageSize = filters.per_page;

  const { handleSubmit, reset, control } = useForm<BandaLargaFilters>({
    defaultValues: {
      page: currentPage,
      per_page: filters.per_page,
      data_to: filters.data_to,
      data_from: filters.data_from,
      status: filters.status,
    },
  });

  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  const onSubmit = (data: BandaLargaFilters) => {
    const params = new URLSearchParams();

    if (data.page) params.set("page", String(data.page));
    if (data.per_page) params.set("per_page", String(data.per_page));
    if (data.data_to) params.set("data_ate", data.data_to);
    if (data.data_from) params.set("data_de", data.data_from);
    if (data.status) params.set("status", data.status);

    navigate(`?${params.toString()}`);
    setIsFiltered(true);
  };

  const clearFilters = () => {
    reset();
    navigate("");
    setIsFiltered(false);
  };

  const { styles } = useStyle();

  const allTableColumns: TableColumnsType<OrderBandaLargaPF> = useAllTableColumns({
    setSelectedAvatar,
    setIsModalAvatarOpen,
  });

  const alwaysVisibleKeys = ["consultant_observation", "whatsapp,avatar"];

  const allColumnOptions = allTableColumns
    .filter(
      (col) =>
        "dataIndex" in col &&
        !alwaysVisibleKeys.includes(String(col.dataIndex)),
    )
    .map((col) => ({
      label:
        typeof col.title === "function"
          ? String(col.key || ("dataIndex" in col ? col.dataIndex : ""))
          : String(col.title),
      value: String(col.key || ("dataIndex" in col ? col.dataIndex : "")),
    }));

  const selectableKeys = allTableColumns
    .filter(
      (col) =>
        "dataIndex" in col &&
        !alwaysVisibleKeys.includes(String(col.dataIndex)),
    )
    .map((col) => String(col.key || ("dataIndex" in col ? col.dataIndex : "")));

  const [visibleColumns, setVisibleColumns] =
    useState<string[]>(selectableKeys);
  const handleColumnsChange = (checkedValues: string[]) => {
    setVisibleColumns(checkedValues);
  };

  const columns = [
    ...allTableColumns.filter(
      (col) =>
        "dataIndex" in col && alwaysVisibleKeys.includes(String(col.dataIndex)),
    ),
    ...allTableColumns.filter(
      (col) =>
        "dataIndex" in col &&
        !alwaysVisibleKeys.includes(String(col.dataIndex)) &&
        visibleColumns.includes(
          String(col.key || ("dataIndex" in col ? col.dataIndex : "")),
        ),
    ),
  ];

  return {
    isFiltered,
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedBLOrder,
    setSelectedBLOrder,
    currentPage,
    pageSize,
    columns,
    styles: { customTable: styles.customTable },
    allColumnOptions,
    visibleColumns,
    handleColumnsChange,
    isModalAvatarOpen,
    setIsModalAvatarOpen,
    selectedAvatar,
  };
}
