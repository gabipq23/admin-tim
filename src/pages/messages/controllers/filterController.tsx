import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IContact, IFilters } from "@/interfaces/contacts";
import { useStyle } from "@/style/tableStyle";
import { tableColumns } from "../components/tableColumns";

function getFiltersFromURL(): {
  status?: string | undefined;
  page: number;
  per_page: number;
  data_to?: string | undefined;
  data_from?: string | undefined;

} {
  const params = new URLSearchParams(window.location.search);
  const data_to = params.get("data_to");
  const data_from = params.get("data_from");
  const status = params.get("status") || undefined;
  const page = parseInt(params.get("page") || "1", 10);
  const per_page = parseInt(params.get("per_page") || "10", 10);

  return {
    page,
    per_page,
    data_to: data_to || undefined,
    data_from: data_from || undefined,
    status,
  };
}

interface IContactControllerProps {
  totalContacts: number;
}

export function useContactFilterController({
  totalContacts,
}: IContactControllerProps) {
  const navigate = useNavigate();
  const filters = getFiltersFromURL();

  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);

  const currentPage = filters.page;
  const pageSize = filters.per_page;
  const totalItems = totalContacts || 0;

  const { handleSubmit, reset, control } = useForm<IFilters>({
    defaultValues: {
      data_from: "",
      data_to: "",
      status: "",
      page: 1,
      per_page: 10,
    },
    values: filters,
  });
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const onSubmit = (data: IFilters) => {
    const params = new URLSearchParams();

    if (data.data_from) params.set("data_from", data.data_from);
    if (data.data_to) params.set("data_to", data.data_to);
    if (data.status) params.set("status", data.status);
    params.set("page", "1");
    params.set("per_page", "10");

    navigate(`?${params.toString()}`);
    setIsFiltered(true);
  };

  const clearFilters = () => {
    reset();
    navigate("");
    setIsFiltered(false);
  };

  const { styles } = useStyle();

  return {
    isFiltered,
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedContact,
    setSelectedContact,
    currentPage,
    pageSize,
    totalItems,
    tableColumns,
    styles: { customTable: styles.customTable },
  };
}
