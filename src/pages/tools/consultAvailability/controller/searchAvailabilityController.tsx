import { ISearchAvailabilityResponse } from "@/interfaces/availability";
import { ConsultAvailabilityService } from "@/services/consultAvailability";
import { useStyle } from "@/style/tableStyle";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { tableColumns } from "../components/searchAvailability/tableColumns";

export function useSearchAvailabilityController({
  uf,
  cidade,
  limite,
  cep,
  numero,
  bairro,
  page,
}: {
  uf?: string;
  cidade?: string;
  limite?: number;
  cep?: string;
  numero?: string;
  bairro?: string | string[];
  page?: number;
}) {
  const consultAvailabilityService = new ConsultAvailabilityService();

  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useQuery<ISearchAvailabilityResponse>({
    refetchOnWindowFocus: false,
    queryKey: [
      "searchAvailability",
      uf,
      cidade,
      limite,
      cep,
      numero,
      bairro,
      page,
    ],
    queryFn: async (): Promise<ISearchAvailabilityResponse> => {
      const response = await consultAvailabilityService.searchAvailability(
        cep,
        numero,
        uf,
        bairro,
        cidade,
        limite,
        page,
      );
      return response;
    },
    enabled: !!uf,
  });

  const { styles } = useStyle();

  const defaultVisible = tableColumns.map((col) => col.key as string);
  const [visibleColumns, setVisibleColumns] =
    useState<string[]>(defaultVisible);

  const allColumnOptions = tableColumns.map((col) => ({
    label:
      typeof col.title === "function" ? String(col.key) : String(col.title),
    value: String(col.key),
  }));

  const handleColumnsChange = (checkedValues: string[]) => {
    setVisibleColumns(checkedValues);
  };

  const filteredTableColumns = tableColumns.filter((col) =>
    visibleColumns.includes(col.key as string),
  );

  return {
    styles,
    tableColumns: filteredTableColumns,
    allTableColumns: tableColumns,
    searchData,
    isSearchLoading,
    searchError,
    refetchSearch,
    visibleColumns,
    allColumnOptions,
    handleColumnsChange,
  };
}

export function useGetAllCidadesController(uf: string) {
  const consultAvailabilityService = new ConsultAvailabilityService();

  const { data, isLoading, error, refetch } = useQuery<any>({
    refetchOnWindowFocus: false,
    queryKey: ["getAllCidades", uf],
    queryFn: async (): Promise<any> => {
      const response = await consultAvailabilityService.getAllCidades(uf);
      return response;
    },
    enabled: !!uf,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

export function useGetAllBairrosController(uf: string, cidade: string) {
  const consultAvailabilityService = new ConsultAvailabilityService();

  const { data, isLoading, error, refetch } = useQuery<any>({
    refetchOnWindowFocus: false,
    queryKey: ["getAllBairros", uf, cidade],
    queryFn: async (): Promise<any> => {
      const response = await consultAvailabilityService.getAllBairros(
        uf,
        cidade,
      );
      return response;
    },
    enabled: !!uf && !!cidade,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
