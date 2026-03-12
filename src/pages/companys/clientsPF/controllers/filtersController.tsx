import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ICompany, ICompanyFilter } from "@/interfaces/consult";

function getFiltersFromURL(): {
  nr_cnpj: string | null;
  nm_cliente: string | null;
  situacao_cadastral?: string | null;
  opcao_pelo_mei?: string | null;
  porte?: string | null;
  credito_min?: string | number | undefined;
  credito_max?: string | number | undefined;
  M_min?: string | number | undefined;
  M_max?: string | number | undefined;
  quantidade_telefones_min?: string | number | undefined;
  quantidade_telefones_max?: string | number | undefined;
  credito_equipamentos_min?: string | number | undefined;
  credito_equipamentos_max?: string | number | undefined;
  marca?: string | null;
  modelo?: string | null;
  page: number;
  limit: number;
  sort?: string | null;
  order?: "asc" | "desc" | null;
} {
  const params = new URLSearchParams(window.location.search);
  const nr_cnpj = params.get("nr_cnpj") || null;
  const nm_cliente = params.get("nm_cliente") || null;
  const situacao_cadastral = params.get("situacao_cadastral") || null;
  const opcao_pelo_mei = params.get("opcao_pelo_mei") || null;
  const porte = params.get("porte") || null;
  const credito_min_param = params.get("credito_min");
  const credito_min = credito_min_param
    ? parseInt(credito_min_param, 10)
    : undefined;

  const credito_max_param = params.get("credito_max");
  const credito_max = credito_max_param
    ? parseInt(credito_max_param, 10)
    : undefined;

  const M_min_param = params.get("M_min");
  const M_min = M_min_param ? parseInt(M_min_param, 10) : undefined;

  const M_max_param = params.get("M_max");
  const M_max = M_max_param ? parseInt(M_max_param, 10) : undefined;

  const quantidade_telefones_min_param = params.get("quantidade_telefones_min");
  const quantidade_telefones_min = quantidade_telefones_min_param
    ? parseInt(quantidade_telefones_min_param, 10)
    : undefined;

  const quantidade_telefones_max_param = params.get("quantidade_telefones_max");
  const quantidade_telefones_max = quantidade_telefones_max_param
    ? parseInt(quantidade_telefones_max_param, 10)
    : undefined;

  const credito_equipamentos_min_param = params.get("credito_equipamentos_min");
  const credito_equipamentos_min = credito_equipamentos_min_param
    ? parseInt(credito_equipamentos_min_param, 10)
    : undefined;

  const credito_equipamentos_max_param = params.get("credito_equipamentos_max");
  const credito_equipamentos_max = credito_equipamentos_max_param
    ? parseInt(credito_equipamentos_max_param, 10)
    : undefined;
  const marca = params.get("marca") || null;
  const modelo = params.get("modelo") || null;
  const sort = params.get("sort") || null;
  const order = params.get("order") as "asc" | "desc" | null;
  const page = parseInt(params.get("page") || "1", 10);
  const limit = parseInt(params.get("limit") || "100", 10);

  return {
    nr_cnpj,
    nm_cliente,
    situacao_cadastral,
    opcao_pelo_mei,
    porte,
    credito_min,
    credito_max,
    M_min,
    M_max,
    quantidade_telefones_min,
    quantidade_telefones_max,
    credito_equipamentos_min,
    credito_equipamentos_max,
    marca,
    modelo,
    page,
    limit,
    sort,
    order,
  };
}

export function useClientsFilterController() {
  const navigate = useNavigate();
  const filters = getFiltersFromURL();

  const [selectedClient, setSelectedClient] = useState<ICompany | null>(null);

  const currentPage = filters.page;
  const pageSize = filters.limit;

  const { handleSubmit, reset, control } = useForm<ICompanyFilter>({
    defaultValues: filters,
  });
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const onSubmit = (data: ICompanyFilter) => {
    const params = new URLSearchParams();
    if (data.nr_cnpj) {
      const cnpjSemMascara = data.nr_cnpj.replace(/\D/g, "");
      params.set("nr_cnpj", cnpjSemMascara);
    }
    params.set("page", "1");
    params.set("limit", "100");
    if (data.nm_cliente) params.set("nm_cliente", data.nm_cliente);
    if (data.situacao_cadastral)
      params.set("situacao_cadastral", data.situacao_cadastral);
    if (data.opcao_pelo_mei) params.set("opcao_pelo_mei", data.opcao_pelo_mei);
    if (data.porte) params.set("porte", data.porte);
    if (data.credito_min)
      params.set("credito_min", data.credito_min.toString());
    if (data.credito_max)
      params.set("credito_max", data.credito_max.toString());
    if (data.M_min) params.set("M_min", data.M_min.toString());
    if (data.M_max) params.set("M_max", data.M_max.toString());
    if (data.quantidade_telefones_min)
      params.set(
        "quantidade_telefones_min",
        data.quantidade_telefones_min.toString()
      );
    if (data.quantidade_telefones_max)
      params.set(
        "quantidade_telefones_max",
        data.quantidade_telefones_max.toString()
      );
    if (data.credito_equipamentos_min)
      params.set(
        "credito_equipamentos_min",
        data.credito_equipamentos_min.toString()
      );
    if (data.credito_equipamentos_max)
      params.set(
        "credito_equipamentos_max",
        data.credito_equipamentos_max.toString()
      );
    if (data.marca) params.set("marca", data.marca);
    if (data.modelo) params.set("modelo", data.modelo);
    if (data.sort) params.set("sort", data.sort);

    navigate(`?${params.toString()}`);
    setIsFiltered(true);
  };

  const clearFilters = () => {
    reset({
      nr_cnpj: "",
      nm_cliente: "",
      situacao_cadastral: "",
      opcao_pelo_mei: "",
      porte: "",
      credito_min: undefined,
      credito_max: undefined,
      M_min: undefined,
      M_max: undefined,
      quantidade_telefones_min: undefined,
      quantidade_telefones_max: undefined,
      credito_equipamentos_min: undefined,
      credito_equipamentos_max: undefined,
      marca: "",
      modelo: "",
      page: 1,
      limit: 100,
    });
    navigate("");
    setIsFiltered(false);
  };

  return {
    isFiltered,
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedClient,
    setSelectedClient,
    currentPage,
    pageSize,
  };
}
