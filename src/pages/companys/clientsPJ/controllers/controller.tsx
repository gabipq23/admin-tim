import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { ClientsService } from "@/services/clients";
import { createStyles } from "antd-style";
import { TableColumnsType, Tooltip } from "antd";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { useNavigate } from "react-router-dom";
import { formatCEP } from "@/utils/formatCEP";
import { capitalizeWords } from "@/utils/capitaliWords";
import { ICompany, ICompanyResponse } from "@/interfaces/consult";

const clietsService = new ClientsService();
const useStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      .ant-table-container .ant-table-body,
      .ant-table-container .ant-table-content {
        scrollbar-width: thin;
        scrollbar-color: #eaeaea transparent;
        scrollbar-gutter: stable;
      }
      /* Diminui fonte do header */
      .ant-table-thead > tr > th {
        font-size: 12px !important;
      }
      /* Diminui fonte do body */
      .ant-table-tbody > tr > td {
        font-size: 12px !important;
      }
      /* Cor de fundo do header */
      .ant-table-thead > tr > th {
        background: #e9e9e9 !important;
      }
      /* Cor de fundo do body */
      .ant-table-tbody > tr > td {
        background: #fff !important;
      }
      /* Destaca a linha ao passar o mouse (mantém o efeito padrão do Ant Design) */
      .ant-table-tbody > tr.ant-table-row:hover > td {
        background: #e9e9e9 !important;
      }
      .ant-table-pagination {
        display: flex;
        justify-content: center;
        margin-top: 16px; /* opcional: dá um espaçamento
        colorText: "#0026d9",
        colorTextActive: "#550088", */
      }
    `,
  };
});
export function useClientsController() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const filters = Object.fromEntries(params.entries());
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const navigate = useNavigate();
  const { styles } = useStyle();

  function formatBRL(value: any) {
    if (value === null || value === undefined || value === "") return "";
    return `R$ ${Number(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}`;
  }
  const { data: clientsQuery, isFetching: isClientsFetching } =
    useQuery<ICompanyResponse>({
      refetchOnWindowFocus: false,
      queryKey: [
        "consult",
        filters.page || 1,
        filters.limit || 100,
        filters.nr_cnpj || "",
        filters.nm_cliente || "",
        filters.situacao_cadastral || "",
        filters.opcao_pelo_mei || "",
        filters.porte || "",
        filters.credito_min || 0,
        filters.credito_max || 0,
        filters.M_min || 0,
        filters.M_max || 0,
        filters.quantidade_telefones_min || 0,
        filters.quantidade_telefones_max || 0,
        filters.credito_equipamentos_min || 0,
        filters.credito_equipamentos_max || 0,
        filters.marca || "",
        filters.modelo || "",
        filters.sort || "nm_cliente",
        filters.order || "desc",
      ],

      queryFn: async (): Promise<ICompanyResponse> => {
        const response = await clietsService.allCompanyList({
          page: filters.page || 1,
          limit: filters.limit || 100,
          nr_cnpj: filters.nr_cnpj || "",
          nm_cliente: filters.nm_cliente || "",
          situacao_cadastral: filters.situacao_cadastral || "",
          opcao_pelo_mei: filters.opcao_pelo_mei || "",
          porte: filters.porte || "",
          credito_min: filters.credito_min || "",
          credito_max: filters.credito_max || "",
          M_min: filters.M_min || 0,
          M_max: filters.M_max || 0,
          quantidade_telefones_min: filters.quantidade_telefones_min || 0,
          quantidade_telefones_max: filters.quantidade_telefones_max || 0,
          credito_equipamentos_min: filters.credito_equipamentos_min || 0,
          credito_equipamentos_max: filters.credito_equipamentos_max || 0,
          marca: filters.marca || "",
          modelo: filters.modelo || "",
          sort: filters.sort || "nm_cliente",
          order:
            filters.order === "asc" || filters.order === "desc"
              ? filters.order
              : "desc",
        });
        return response;
      },
    });

  const allBrandsQuery = useQuery<string[]>({
    queryKey: ["brands"],
    queryFn: async (): Promise<string[]> => {
      const response = await clietsService.allBrandsList();
      return response;
    },
  });

  const tableColumns: TableColumnsType<ICompany> = [
    {
      title: "CNPJ",
      dataIndex: "nr_cnpj",
      key: "nr_cnpj",
      width: 140,
      render: (value) => {
        return value ? formatCNPJ(value) : "-";
      },
    },
    {
      title: "Nome do Gestor",
      dataIndex: "nome_gestor",
      key: "nome_gestor",
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
      dataIndex: "telefone_gestor",
      key: "telefone_gestor",
      width: 140,
      render: (value) => formatPhoneNumber(value) || "-",
    },
    {
      title: "E-mail do Gestor",
      dataIndex: "email_gestor",
      key: "email_gestor",
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
      // credito_cliente.razao_social
      key: "nm_cliente",
      width: 160,
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => {
        const razaoSocial = record.credito_cliente?.razao_social;
        return (
          <Tooltip
            placement="topLeft"
            title={capitalizeWords(razaoSocial)}
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
      dataIndex: "situacao_cadastral",
      key: "situacao_cadastral",
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
      title: "Porte",
      dataIndex: "porte",
      key: "porte",
      width: 120,
      render: (value) =>
        value === "MICRO EMPRESA"
          ? "Micro Empresa"
          : value === "EMPRESA DE PEQUENO PORTE"
            ? "Pequeno Porte"
            : value === "DEMAIS"
              ? "Demais"
              : "-",
    },
    {
      title: "MEI",
      dataIndex: "opcao_pelo_mei",
      key: "opcao_pelo_mei",
      width: 60,
      render: (value) => (value ? "Sim" : "Não"),
    },
    {
      title: "CEP",
      dataIndex: "nr_cep",
      key: "nr_cep",
      width: 90,
      render: (value) => formatCEP(value) || "-",
    },
    {
      title: "Endereço",
      // credito_cliente.endereco
      key: "endereco",
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => {
        const endereco = record.credito_cliente?.endereco;
        return (
          <Tooltip
            placement="topLeft"
            title={capitalizeWords(endereco)}
            styles={{ body: { fontSize: "12px" } }}
          >
            {capitalizeWords(endereco || "-")}
          </Tooltip>
        );
      },
    },
    {
      title: "Complemento",
      dataIndex: "complemento",
      key: "complemento",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => {
        const complemento = record?.complemento;
        return (
          <Tooltip
            placement="topLeft"
            title={capitalizeWords(complemento)}
            styles={{ body: { fontSize: "12px" } }}
          >
            {capitalizeWords(complemento || "-")}
          </Tooltip>
        );
      },
    },
    {
      title: "Nº Fachada",
      dataIndex: "numero_fachada",
      key: "numero_fachada",
      width: 95,
      render: (value) => value || "-",
    },
    {
      title: "Cidade",
      dataIndex: "cidade",
      key: "cidade",
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => {
        const cidade = record?.cidade;
        return (
          <Tooltip
            placement="topLeft"
            title={capitalizeWords(cidade)}
            styles={{ body: { fontSize: "12px" } }}
          >
            {capitalizeWords(cidade || "-")}
          </Tooltip>
        );
      },
    },
    {
      title: "UF",
      dataIndex: "uf",
      key: "uf",
      width: 90,
      render: (value) => value || "-",
    },
    {
      title: "Crédito",
      key: "credito",
      width: 100,
      render: (_, record) => formatBRL(record.credito_cliente?.credito) ?? "-",
      sorter: true,
      sortOrder:
        filters.sort === "credito"
          ? filters.order === "asc"
            ? "ascend"
            : filters.order === "desc"
              ? "descend"
              : undefined
          : undefined,
      onHeaderCell: () => ({
        onClick: () => {
          const newOrder =
            filters.sort === "credito" && filters.order === "asc"
              ? "desc"
              : "asc";
          const params = new URLSearchParams(window.location.search);
          params.set("sort", "credito");
          params.set("order", newOrder);
          params.set("page", "1");
          navigate(`?${params.toString()}`);
        },
        style: { cursor: "pointer" },
      }),
    },
    {
      title: "Total de linhas",
      key: "total_linhas",
      width: 120,
      render: (_, record) => {
        if (!Array.isArray(record.credito_cliente?.telefones)) return "-";
        const count = record.credito_cliente?.telefones.length;
        return count;
      },
    },
    {
      title: "Aparelhos",
      key: "marcas_modelos",
      width: 300,
      render: (_, record) => {
        const aparelhos = record.marcas_modelos;
        if (!Array.isArray(aparelhos) || aparelhos.length === 0) return "-";

        const tooltipContent = aparelhos
          .map(
            (item) =>
              `${item.marca ? capitalizeWords(item.marca) : ""}${item.marca && item.modelo ? " - " : ""
              }${item.modelo ? capitalizeWords(item.modelo) : ""}`
          )
          .join("\n");

        const visibleAparelhos = aparelhos.slice(0, 1);

        return (
          <Tooltip
            placement="topLeft"
            title={
              <div style={{ whiteSpace: "pre-line", fontSize: "12px" }}>
                {tooltipContent}
              </div>
            }
            styles={{ body: { fontSize: "12px" } }}
          >
            <div>
              {visibleAparelhos.map((item, idx) => (
                <div key={idx}>
                  {item.marca ? capitalizeWords(item.marca) : ""}
                  {item.marca && item.modelo ? " - " : ""}
                  {item.modelo ? capitalizeWords(item.modelo) : ""}
                </div>
              ))}
              {aparelhos.length > 1 && (
                <div style={{ color: "#888", fontSize: 12 }}>
                  +{aparelhos.length - 1} outros
                </div>
              )}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Numero de linhas elegíveis",
      key: "num_linhas_elegiveis",
      width: 180,
      render: (_, record) => {
        if (!Array.isArray(record.credito_cliente?.telefones)) return "-";
        const count = record.credito_cliente?.telefones.filter(
          (t) => t.elegiveis === true
        ).length;
        return count;
      },
    },

    {
      title: "Linhas + MVivo",
      key: "linhas_mvivo",
      width: 160,
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => {
        const telefones = record.credito_cliente?.telefones;
        if (!Array.isArray(telefones) || telefones.length === 0) return "-";

        const cleanPhone = (tel: string | null | undefined) =>
          typeof tel === "string" && tel.startsWith("55")
            ? tel.slice(2)
            : tel || "";
        const tooltipContent = telefones
          .map(
            (t) =>
              `${formatPhoneNumber(cleanPhone(t.telefone))}${t.M ? ` - M: ${t.M}` : ""
              }`
          )
          .join("\n");

        const visiblePhones = telefones.slice(0, 1);

        return (
          <Tooltip
            placement="topLeft"
            title={
              <div style={{ whiteSpace: "pre-line", fontSize: "12px" }}>
                {tooltipContent}
              </div>
            }
            styles={{ body: { fontSize: "12px" } }}
          >
            <div>
              {visiblePhones.map((t, idx) => (
                <div key={idx}>
                  {formatPhoneNumber(cleanPhone(t.telefone))}{" "}
                  {t.M ? `- M: ${t.M}` : ""}
                </div>
              ))}
              {telefones.length > 1 && (
                <div style={{ color: "#888", fontSize: 12 }}>
                  +{telefones.length - 1} outros
                </div>
              )}
            </div>
          </Tooltip>
        );
      },
    },
  ];

  return {
    brands: allBrandsQuery.data || [],
    tableColumns,
    clientsQuery,
    isModalOpen,
    showModal,
    styles: { customTable: styles.customTable },
    companies: clientsQuery?.empresas,
    totalCompanies: clientsQuery?.total || 0,
    closeModal,
    isClientsFetching,
  };
}
