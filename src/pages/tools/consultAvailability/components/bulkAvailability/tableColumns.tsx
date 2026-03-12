import { IBulkAvailabilityResult } from "@/interfaces/availability";
import { formatCEP } from "@/utils/formatCEP";
import { Tooltip, type TableColumnsType } from "antd";

export const tableColumns: TableColumnsType<IBulkAvailabilityResult> = [
  // {
  //   title: "Linha",
  //   dataIndex: "linha",
  //   width: 60,
  // },
  {
    title: "CEP",
    dataIndex: "cep",
    width: 90,
    render: (cep) => formatCEP(cep) || "-",
  },
  {
    title: "Número",
    dataIndex: "numero",
    width: 80,
    ellipsis: {
      showTitle: false,
    },
    render: (numero) => (
      <Tooltip
        placement="topLeft"
        title={numero}
        styles={{ body: { fontSize: "12px" } }}
      >
        {numero || "-"}
      </Tooltip>
    ),
  },
  {
    title: "Disponibilidade",
    dataIndex: "disponibilidade",
    width: 120,
    render: (value: boolean) => <span>{value ? "Sim" : "Não"}</span>,
  },
  {
    title: "UF",
    dataIndex: "uf",
    width: 50,
    render: (uf) => uf || "-",
  },
  {
    title: "Cidade",
    dataIndex: "cidade",
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
        {cidade || "-"}
      </Tooltip>
    ),
  },
  {
    title: "Bairro",
    dataIndex: "bairro",
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
    title: "Logradouro",
    dataIndex: "logradouro",
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
        {logradouro || "-"}
      </Tooltip>
    ),
  },
  {
    title: "Endereço Completo",
    dataIndex: "endereco_completo",
    width: 200,
    ellipsis: {
      showTitle: false,
    },
    render: (endereco) => (
      <Tooltip
        placement="topLeft"
        title={endereco}
        styles={{ body: { fontSize: "12px" } }}
      >
        {endereco || "-"}
      </Tooltip>
    ),
  },
  {
    title: "Armário",
    dataIndex: "armario",
    width: 120,
    render: (armario) => armario || "-",
  },
  {
    title: "Tipo",
    dataIndex: "tipo",
    width: 100,
    render: (tipo) => tipo || "-",
  },
  {
    title: "Território",
    dataIndex: "territorio",
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
    title: "Via Range",
    dataIndex: "encontrado_via_range",
    width: 100,
    render: (value: boolean) => (value ? "Sim" : "Não"),
  },
  {
    title: "Range Min",
    dataIndex: "range_min",
    width: 100,
    render: (range, record) =>
      record.encontrado_via_range ? range || "-" : "-",
  },
  {
    title: "Range Max",
    dataIndex: "range_max",
    width: 100,
    render: (range, record) =>
      record.encontrado_via_range ? range || "-" : "-",
  },
];
