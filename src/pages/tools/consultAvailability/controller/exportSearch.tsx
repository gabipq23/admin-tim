import { useMutation } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { ConsultAvailabilityService } from "@/services/consultAvailability";

export function useExportAvailabilityController() {
  const consultAvailabilityService = new ConsultAvailabilityService();

  const exportMutation = useMutation({
    mutationFn: async (params: {
      uf?: string;
      cidade?: string;
      bairro?: string | string[];
      cep?: string;
      numero?: string;
      total: number;
      visibleColumns?: string[];
      allTableColumns?: any[];
    }) => {
      const allData: any[] = [];
      const batchSize = 500;
      const totalPages = Math.ceil(params.total / batchSize);
      for (let page = 1; page <= totalPages; page++) {
        const response = await consultAvailabilityService.searchAvailability(
          params.cep,
          params.numero,
          params.uf,
          params.bairro,
          params.cidade,
          batchSize,
          page
        );

        if (response.dados && response.dados.length > 0) {
          allData.push(...response.dados);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      return {
        dados: allData,
        filtros: {
          uf: params.uf,
          cidade: params.cidade,
          bairro: params.bairro,
          cep: params.cep,
          numero: params.numero,
        },
        visibleColumns: params.visibleColumns,
        allTableColumns: params.allTableColumns,
      };
    },
    onSuccess: (data) => {
      exportToXLSX(
        data.dados,
        data.filtros,
        data.visibleColumns,
        data.allTableColumns
      );
    },
  });

  return {
    exportData: exportMutation.mutate,
    isExporting: exportMutation.isPending,
    exportError: exportMutation.error,
  };
}
function exportToXLSX(
  dados: any[],
  filtros: any,
  visibleColumns?: string[],
  allTableColumns?: any[]
) {
  try {
    const workbook = XLSX.utils.book_new();

    const exportColumns = allTableColumns
      ? allTableColumns.filter((col) =>
          visibleColumns?.includes(col.key as string)
        )
      : allTableColumns || [];

    const exportData = dados.map((item) => {
      const obj: Record<string, any> = {};

      if (exportColumns.length > 0) {
        exportColumns.forEach((col) => {
          const title =
            typeof col.title === "function"
              ? String(col.key)
              : String(col.title);
          const dataIndex = col.dataIndex || col.key;
          obj[title] = item[dataIndex] || "-";
        });
      } else {
        obj.ID = item.id || "";
        obj.UF = item.UF || "";
        obj.Cidade = item.CIDADE || "";
        obj.Bairro = item.BAIRRO || "";
        obj.CEP = item.CEP || "";
        obj.Logradouro = item.LOGRADOURO || "";
        obj.Número = item.NUM || "";
        obj.Território = item.TERRITORIO || "";
        obj.Armário = item.ARMARIO || "N/A";
        obj.Tipo = item.TIPO || "N/A";
      }

      return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Disponibilidade");

    const fileName = generateFileName(filtros);
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error("❌ Erro ao exportar dados:", error);
  }
}

function generateFileName(filtros: any): string {
  const date = new Date().toISOString().split("T")[0];
  const time = new Date()
    .toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", "");

  let fileName = `disponibilidade_${date}_${time}`;

  if (filtros.uf) fileName += `_${filtros.uf}`;
  if (filtros.cidade) fileName += `_${filtros.cidade.replace(/\s+/g, "_")}`;
  if (filtros.bairro) {
    const bairroStr = Array.isArray(filtros.bairro)
      ? filtros.bairro.join("-")
      : filtros.bairro;
    fileName += `_${bairroStr.replace(/\s+/g, "_")}`;
  }

  return `${fileName}.xlsx`;
}

export function useExportAvailabilityCSVController() {
  const consultAvailabilityService = new ConsultAvailabilityService();

  const exportMutation = useMutation({
    mutationFn: async (params: {
      uf?: string;
      cidade?: string;
      bairro?: string | string[];
      cep?: string;
      numero?: string;
      total: number;
      visibleColumns?: string[];
      allTableColumns?: any[];
    }) => {
      const allData: any[] = [];
      const batchSize = 500;
      const totalPages = Math.ceil(params.total / batchSize);
      for (let page = 1; page <= totalPages; page++) {
        const response = await consultAvailabilityService.searchAvailability(
          params.cep,
          params.numero,
          params.uf,
          params.bairro,
          params.cidade,
          batchSize,
          page
        );

        if (response.dados && response.dados.length > 0) {
          allData.push(...response.dados);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      return {
        dados: allData,
        filtros: {
          uf: params.uf,
          cidade: params.cidade,
          bairro: params.bairro,
          cep: params.cep,
          numero: params.numero,
        },
        visibleColumns: params.visibleColumns,
        allTableColumns: params.allTableColumns,
      };
    },
    onSuccess: (data) => {
      exportToCSV(
        data.dados,
        data.filtros,
        data.visibleColumns,
        data.allTableColumns
      );
    },
  });

  return {
    exportDataCSV: exportMutation.mutate,
    isExportingCSV: exportMutation.isPending,
    exportErrorCSV: exportMutation.error,
  };
}

function exportToCSV(
  dados: any[],
  filtros: any,
  visibleColumns?: string[],
  allTableColumns?: any[]
) {
  try {
    const exportColumns = allTableColumns
      ? allTableColumns.filter((col) =>
          visibleColumns?.includes(col.key as string)
        )
      : allTableColumns || [];

    const exportData = dados.map((item) => {
      const obj: Record<string, any> = {};

      if (exportColumns.length > 0) {
        exportColumns.forEach((col) => {
          const title =
            typeof col.title === "function"
              ? String(col.key)
              : String(col.title);
          const dataIndex = col.dataIndex || col.key;
          obj[title] = item[dataIndex] || "-";
        });
      } else {
        obj.ID = item.id || "";
        obj.UF = item.UF || "";
        obj.Cidade = item.CIDADE || "";
        obj.Bairro = item.BAIRRO || "";
        obj.CEP = item.CEP || "";
        obj.Logradouro = item.LOGRADOURO || "";
        obj.Número = item.NUM || "";
        obj.Território = item.TERRITORIO || "";
        obj.Armário = item.ARMARIO || "N/A";
        obj.Tipo = item.TIPO || "N/A";
      }

      return obj;
    });

    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(","),
      ...exportData.map((row) =>
        headers
          .map((header) => {
            const value = (row as any)[header];
            return typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(",")
      ),
    ].join("\n");
    const BOM = "\uFEFF";
    const finalContent = BOM + csvContent;

    const blob = new Blob([finalContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = generateFileNameCSV(filtros);
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ Erro ao exportar dados CSV:", error);
  }
}

function generateFileNameCSV(filtros: any): string {
  const date = new Date().toISOString().split("T")[0];
  const time = new Date()
    .toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", "");

  let fileName = `disponibilidade_${date}_${time}`;

  if (filtros.uf) fileName += `_${filtros.uf}`;
  if (filtros.cidade) fileName += `_${filtros.cidade.replace(/\s+/g, "_")}`;
  if (filtros.bairro) {
    const bairroStr = Array.isArray(filtros.bairro)
      ? filtros.bairro.join("-")
      : filtros.bairro;
    fileName += `_${bairroStr.replace(/\s+/g, "_")}`;
  }

  return `${fileName}.csv`;
}

export function useExportAvailabilityTXTController() {
  const consultAvailabilityService = new ConsultAvailabilityService();

  const exportMutation = useMutation({
    mutationFn: async (params: {
      uf?: string;
      cidade?: string;
      bairro?: string | string[];
      cep?: string;
      numero?: string;
      total: number;
      visibleColumns?: string[];
      allTableColumns?: any[];
    }) => {
      const allData: any[] = [];
      const batchSize = 500;
      const totalPages = Math.ceil(params.total / batchSize);
      for (let page = 1; page <= totalPages; page++) {
        const response = await consultAvailabilityService.searchAvailability(
          params.cep,
          params.numero,
          params.uf,
          params.bairro,
          params.cidade,
          batchSize,
          page
        );

        if (response.dados && response.dados.length > 0) {
          allData.push(...response.dados);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      return {
        dados: allData,
        filtros: {
          uf: params.uf,
          cidade: params.cidade,
          bairro: params.bairro,
          cep: params.cep,
          numero: params.numero,
        },
        visibleColumns: params.visibleColumns,
        allTableColumns: params.allTableColumns,
      };
    },
    onSuccess: (data) => {
      exportToTXT(
        data.dados,
        data.filtros,
        data.visibleColumns,
        data.allTableColumns
      );
    },
  });

  return {
    exportDataTXT: exportMutation.mutate,
    isExportingTXT: exportMutation.isPending,
    exportErrorTXT: exportMutation.error,
  };
}

function exportToTXT(
  dados: any[],
  filtros: any,
  visibleColumns?: string[],
  allTableColumns?: any[]
) {
  try {
    const exportColumns = allTableColumns
      ? allTableColumns.filter((col) =>
          visibleColumns?.includes(col.key as string)
        )
      : allTableColumns || [];

    let txtContent = "";

    dados.forEach((item, index) => {
      const values: string[] = [];

      if (exportColumns.length > 0) {
        exportColumns.forEach((col) => {
          const dataIndex = col.dataIndex || col.key;
          const value = item[dataIndex] || "";
          values.push(String(value));
        });
      } else {
        values.push(
          item.id || "",
          item.UF || "",
          item.CIDADE || "",
          item.BAIRRO || "",
          item.CEP || "",
          item.LOGRADOURO || "",
          item.NUM || "",
          item.TERRITORIO || "",
          item.ARMARIO || "",
          item.TIPO || ""
        );
      }

      txtContent += values.join(",");
      if (index < dados.length - 1) {
        txtContent += ",";
      }
    });

    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = generateFileNameTXT(filtros);
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ Erro ao exportar dados TXT:", error);
  }
}

function generateFileNameTXT(filtros: any): string {
  const date = new Date().toISOString().split("T")[0];
  const time = new Date()
    .toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", "");

  let fileName = `disponibilidade_${date}_${time}`;

  if (filtros.uf) fileName += `_${filtros.uf}`;
  if (filtros.cidade) fileName += `_${filtros.cidade.replace(/\s+/g, "_")}`;
  if (filtros.bairro) {
    const bairroStr = Array.isArray(filtros.bairro)
      ? filtros.bairro.join("-")
      : filtros.bairro;
    fileName += `_${bairroStr.replace(/\s+/g, "_")}`;
  }

  return `${fileName}.txt`;
}
