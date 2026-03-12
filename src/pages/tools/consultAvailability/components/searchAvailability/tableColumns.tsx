import { ISearchAvailabilityResponse } from "@/interfaces/availability";
import { formatCEP } from "@/utils/formatCEP";
import { Tooltip, type TableColumnsType } from "antd";

export const tableColumns: TableColumnsType<ISearchAvailabilityResponse> = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80,
  },
  {
    title: "UF",
    dataIndex: "UF",
    key: "UF",
    width: 50,
    render: (uf) => uf || "-",
  },
  {
    title: "Cidade",
    dataIndex: "CIDADE",
    key: "CIDADE",
    width: 120,
    ellipsis: {
      showTitle: false,
    },
    render: (cidade) => (
      <Tooltip
        placement="topLeft"
        title={cidade}
        styles={{ body: { fontSize: "12px" } }}
      >
        {cidade}
      </Tooltip>
    ),
  },

  {
    title: "Bairro",
    dataIndex: "BAIRRO",
    key: "BAIRRO",
    width: 120,
    ellipsis: {
      showTitle: false,
    },
    render: (bairro) => (
      <Tooltip
        placement="topLeft"
        title={bairro}
        styles={{ body: { fontSize: "12px" } }}
      >
        {bairro || "-"}
      </Tooltip>
    ),
  },
  {
    title: "CEP",
    dataIndex: "CEP",
    key: "CEP",
    width: 90,
    render: (cep) => formatCEP(cep) || "-",
  },
  {
    title: "Logradouro",
    dataIndex: "LOGRADOURO",
    key: "LOGRADOURO",
    width: 180,
    ellipsis: {
      showTitle: false,
    },
    render: (logradouro) => (
      <Tooltip
        placement="topLeft"
        title={logradouro}
        styles={{ body: { fontSize: "12px" } }}
      >
        {logradouro}
      </Tooltip>
    ),
  },
  {
    title: "Número",
    dataIndex: "NUM",
    key: "NUM",
    width: 120,
    ellipsis: {
      showTitle: false,
    },
    render: (numero) => (
      <Tooltip
        placement="topLeft"
        title={numero}
        styles={{ body: { fontSize: "12px" } }}
      >
        {numero}
      </Tooltip>
    ),
  },

  {
    title: "Território",
    dataIndex: "TERRITORIO",
    key: "TERRITORIO",
    width: 140,
    ellipsis: {
      showTitle: false,
    },
    render: (territorio) => (
      <Tooltip
        placement="topLeft"
        title={territorio}
        styles={{ body: { fontSize: "12px" } }}
      >
        {territorio || "-"}
      </Tooltip>
    ),
  },
  {
    title: "Armário",
    dataIndex: "ARMARIO",
    key: "ARMARIO",
    width: 120,
    render: (armario) => armario || "-",
  },

  {
    title: "Tipo",
    dataIndex: "TIPO",
    key: "TIPO",
    width: 100,
    render: (tipo) => tipo || "-",
  },
];
