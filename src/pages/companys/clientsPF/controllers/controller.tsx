import { ICompany } from "@/interfaces/consult";
import { useState } from "react";

import { createStyles } from "antd-style";
import { TableColumnsType, Tooltip } from "antd";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { useNavigate } from "react-router-dom";

import { capitalizeWords } from "@/utils/capitaliWords";

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

  const tableColumns: TableColumnsType<ICompany> = [
    {
      title: "CPF",
      dataIndex: "nr_cnpj",
      key: "nr_cnpj",
      width: 140,
      render: (value) => {
        return value ? formatCNPJ(value) : "-";
      },
    },
    {
      title: "Nome ",
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
      title: "Data de Nascimento",
      dataIndex: "data_nascimento",
      width: 160,
    },
    {
      title: "Nome da Mãe",
      dataIndex: "nome_mae",
      width: 140,
    },
    {
      title: "Telefone ",
      dataIndex: "telefone_gestor",
      key: "telefone_gestor",
      width: 140,
      render: (value) => formatPhoneNumber(value) || "-",
    },
    {
      title: "E-mail ",
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
      title: "CEP",
      dataIndex: "cep",
      width: 100,
    },
    {
      title: "Rua",
      dataIndex: "rua",
      width: 140,
    },
    {
      title: "Nº Fachada",
      dataIndex: "numero_fachada",
      width: 100,
    },
    {
      title: "Complemento",
      dataIndex: "complemento",
      width: 120,
    },
    {
      title: "Lote",
      dataIndex: "lote",
      width: 80,
    },
    {
      title: "Quadra",
      dataIndex: "quadra",
      width: 80,
    },
    {
      title: "Casa ou edifício",
      dataIndex: "casa_edificio",
      width: 120,
    },
    {
      title: "Bairro",
      dataIndex: "bairro",
      width: 120,
    },
    {
      title: "Ponto de referência",
      dataIndex: "ponto_referencia",
      width: 140,
    },

    {
      title: "Cidade",
      dataIndex: "cidade",
      width: 120,
    },
    {
      title: "UF",
      dataIndex: "uf",
      width: 60,
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
  ];

  return {
    tableColumns,

    isModalOpen,
    showModal,
    styles: { customTable: styles.customTable },

    closeModal,
  };
}
