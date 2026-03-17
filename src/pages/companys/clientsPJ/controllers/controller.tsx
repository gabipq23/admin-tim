import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { ClientsService } from "@/services/clients";
import { TableColumnsType, Tooltip } from "antd";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { useNavigate } from "react-router-dom";
import { formatCEP } from "@/utils/formatCEP";
import { capitalizeWords } from "@/utils/capitaliWords";
import { ICompany, ICompanyResponse } from "@/interfaces/consult";
import { useStyle } from "@/style/tableStyle";
import { toast } from "sonner";

const clietsService = new ClientsService();

export function useClientsController() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const filters = Object.fromEntries(params.entries());
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const navigate = useNavigate();
  const { styles } = useStyle();
  const parsedIsMei =
    filters.is_mei === "true" ? true : filters.is_mei === "false" ? false : undefined;
  const parsedCreditMin =
    filters.credit_min !== undefined && filters.credit_min !== ""
      ? Number(filters.credit_min)
      : undefined;
  const parsedCreditMax =
    filters.credit_max !== undefined && filters.credit_max !== ""
      ? Number(filters.credit_max)
      : undefined;

  function formatBRL(value: number | string | null | undefined) {
    if (value === null || value === undefined || value === "") return "";
    return `R$ ${Number(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}`;
  }
  const { data: clientsQuery, isFetching: isClientsFetching } =
    useQuery<ICompanyResponse>({
      refetchOnWindowFocus: false,
      queryKey: [
        "clients",
        filters.page || 1,
        filters.per_page || 100,
        filters.sort || "cnpj",
        filters.order || "desc",
        filters.cnpj || "",
        filters.rfb_status || "",
        filters.company_legal_name || "",
        parsedIsMei,
        filters.client_type || "",
        parsedCreditMin,
        parsedCreditMax,

      ],

      queryFn: async (): Promise<ICompanyResponse> => {
        const response = await clietsService.allCompanyList({
          page: filters.page || 1,
          per_page: filters.per_page || 100,
          cnpj: filters.cnpj || "",
          rfb_status: filters.rfb_status || "",
          company_legal_name: filters.company_legal_name || "",
          is_mei: parsedIsMei,
          client_type: filters.client_type || "",
          credit_min: parsedCreditMin,
          credit_max: parsedCreditMax,
          sort: filters.sort || "cnpj",
          order:
            filters.order === "asc" || filters.order === "desc"
              ? filters.order
              : "desc",
        });
        return response;
      },
    });


  const { mutate: removeClients } = useMutation({
    mutationFn: async ({ id }: { id: number }) =>
      clietsService.removeClient(id),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["clients"] }),
    onError: (error) => {
      toast.error("Houve um erro ao remover o cliente. Tente novamente");
      console.error(error.message);
    },
    onSuccess: () => {
      toast.success("Cliente removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const tableColumns: TableColumnsType<ICompany> = [
    {
      title: "CNPJ",
      dataIndex: "cnpj",
      key: "nr_cnpj",
      width: 140,
      render: (value) => {
        return value ? formatCNPJ(value) : "-";
      },
    },
    {
      title: "Nome do Gestor",
      dataIndex: "manager_name",
      key: "manager_name",
      width: 130,
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (
        <Tooltip
          placement="topLeft"
          title={capitalizeWords(value)}
          styles={{ body: { fontSize: "12px" } }}
        >
          {capitalizeWords(value) || "-"}
        </Tooltip>
      ),
    },
    {
      title: "Telefone do Gestor",
      dataIndex: "phone",
      key: "phone",
      width: 140,
      render: (value) => formatPhoneNumber(value) || "-",
    },
    {
      title: "E-mail do Gestor",
      dataIndex: "email",
      key: "email",
      width: 140,
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (
        <Tooltip
          placement="topLeft"
          title={value}
          styles={{ body: { fontSize: "12px" } }}
        >
          {value || "-"}
        </Tooltip>
      ),
    },
    {
      title: "Razão Social",
      key: "company_legal_name",
      width: 160,
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => {
        const razaoSocial = record.company_legal_name;
        return (
          <Tooltip
            placement="topLeft"
            title={capitalizeWords(String(razaoSocial ?? ""))}
            styles={{ body: { fontSize: "12px" } }}
          >
            {razaoSocial === "#NAME?"
              ? "-"
              : capitalizeWords(razaoSocial || "-")}
          </Tooltip>
        );
      },
    },
    {
      title: "Status RFB",
      dataIndex: "rfb_status",
      key: "rfb_status",
      width: 90,
      render: (value) =>
        value === "ATIVA"
          ? "Ativa"
          : value === "INAPTA"
            ? "Inapta"
            : value === "SUSPENSA"
              ? "Suspensa"
              : value === "BAIXADA"
                ? "Baixada"
                : "-",
    },

    {
      title: "MEI",
      dataIndex: "is_mei",
      key: "is_mei",
      width: 60,
      render: (value) => (value ? "Sim" : "Não"),
    },
    {
      title: "CEP",
      dataIndex: "zip_code",
      key: "zip_code",
      width: 90,
      render: (value) => formatCEP(value) || "-",
    },
    {
      title: "Endereço",
      key: "address",
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => {
        const endereco = record.address
          ;
        return (
          <Tooltip
            placement="topLeft"
            title={capitalizeWords(String(endereco ?? ""))}
            styles={{ body: { fontSize: "12px" } }}
          >
            {capitalizeWords(endereco || "-")}
          </Tooltip>
        );
      },
    },
    {
      title: "Complemento",
      dataIndex: "address_complement",
      key: "address_complement",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => {
        const complemento = record?.address_complement
          ;
        return (
          <Tooltip
            placement="topLeft"
            title={capitalizeWords(String(complemento ?? ""))}
            styles={{ body: { fontSize: "12px" } }}
          >
            {capitalizeWords(complemento || "-")}
          </Tooltip>
        );
      },
    },
    {
      title: "Nº Fachada",
      dataIndex: "address_number",
      key: "address_number",
      width: 95,
      render: (value) => value || "-",
    },
    {
      title: "Cidade",
      dataIndex: "city",
      key: "city",
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => {
        const cidade = record?.city;
        return (
          <Tooltip
            placement="topLeft"
            title={capitalizeWords(String(cidade ?? ""))}
            styles={{ body: { fontSize: "12px" } }}
          >
            {capitalizeWords(cidade || "-")}
          </Tooltip>
        );
      },
    },
    {
      title: "UF",
      dataIndex: "district",
      key: "district",
      width: 90,
      render: (value) => value || "-",
    },
    {
      title: "Crédito",
      key: "credit",
      width: 100,
      render: (_, record) => formatBRL(record.credit) ?? "-",
      sorter: true,
      sortOrder:
        filters.sort === "credit"
          ? filters.order === "asc"
            ? "ascend"
            : filters.order === "desc"
              ? "descend"
              : undefined
          : undefined,
      onHeaderCell: () => ({
        onClick: () => {
          const newOrder =
            filters.sort === "credit" && filters.order === "asc"
              ? "desc"
              : "asc";
          const params = new URLSearchParams(window.location.search);
          params.set("sort", "credit");
          params.set("order", newOrder);
          params.set("page", "1");
          navigate(`?${params.toString()}`);
        },
        style: { cursor: "pointer" },
      }),
    },

  ];

  const companies =
    clientsQuery?.clients?.filter((client) => client.client_type === "PJ") || [];


  return {
    removeClients,
    tableColumns,
    clientsQuery,
    isModalOpen,
    showModal,
    styles: { customTable: styles.customTable },
    companies,
    totalCompanies: clientsQuery?.total || 0,
    closeModal,
    isClientsFetching,
  };
}
