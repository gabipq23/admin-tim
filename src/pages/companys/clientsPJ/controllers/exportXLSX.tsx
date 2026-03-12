import { formatBRL } from "@/utils/formatBRL";
import * as XLSX from "xlsx";

export const handleExportXLSX = ({
  companies,
  selectedRowKeys,
  visibleColumns,
  tableColumns,
}: any) => {
  const selectedRows = companies.filter((row: any) =>
    selectedRowKeys.includes(row.id)
  );

  const exportColumns = tableColumns.filter((col: any) =>
    visibleColumns.includes(col.key as string)
  );

  const exportData = selectedRows.map((row: any) => {
    const obj: Record<string, any> = {};

    exportColumns.forEach((col: any) => {
      if (col.key === "total_linhas") {
        obj[col.title as string] = Array.isArray(row.credito_cliente?.telefones)
          ? row.credito_cliente.telefones.length
          : "-";
      } else if (col.key === "num_linhas_elegiveis") {
        obj[col.title as string] = Array.isArray(row.credito_cliente?.telefones)
          ? row.credito_cliente.telefones.filter(
              (t: any) => t.elegiveis === true
            ).length
          : "-";
      } else if (col.key === "credito") {
        obj[col.title as string] = formatBRL(row.credito_cliente?.credito);
      } else if (col.key === "linhas_mvivo") {
        if (
          !Array.isArray(row.credito_cliente?.telefones) ||
          row.credito_cliente.telefones.length === 0
        ) {
          obj[col.title as string] = "-";
        } else {
          const telefones = row.credito_cliente.telefones;
          const visiblePhones = telefones
            .map((t: any) => `${t.telefone}${t.M ? ` - M: ${t.M}` : ""}`)
            .join(", ");
          obj[col.title as string] = visiblePhones;
        }
      } else if (col.key === "opcao_pelo_mei") {
        obj[col.title as string] =
          row.opcao_pelo_mei === true || row.opcao_pelo_mei === "1"
            ? "Sim"
            : "Não";
      } else {
        obj[col.title as string] =
          row[col.dataIndex as keyof typeof row] ??
          row[col.key as keyof typeof row] ??
          "-";
      }
    });

    return obj;
  });

  const sheet = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Clientes");
  XLSX.writeFile(wb, "clientes.xlsx");
};
