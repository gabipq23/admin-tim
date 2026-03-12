import { useMutation } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { IBulkAvailabilityResult } from "@/interfaces/availability";
import { useBulkAvailabilityStore } from "../context/bulkAvailabilityContext";
import { ConsultAvailabilityService } from "@/services/consultAvailability";

export function useExportBulkAvailabilityController() {
  const originalDados = useBulkAvailabilityStore(
    (state) => state.originalDados,
  );
  const consultAvailabilityService = new ConsultAvailabilityService();

  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await consultAvailabilityService.consultAvailabilityBulk(
        originalDados,
        originalDados.length,
        1,
      );
      return response.resultados;
    },
    onSuccess: (data) => {
      exportToXLSX(data);
    },
  });

  return {
    exportData: () => exportMutation.mutate(),
    isExporting: exportMutation.isPending,
    exportError: exportMutation.error,
  };
}

function exportToXLSX(dados: IBulkAvailabilityResult[]) {
  try {
    const workbook = XLSX.utils.book_new();

    const exportData = dados.map((item) => ({
      CEP: item.cep || "",
      Número: item.numero || "",
      Disponibilidade: item.disponibilidade ? "Sim" : "Não",
      UF: item.uf || "",
      Cidade: item.cidade || "",
      Bairro: item.bairro || "",
      Logradouro: item.logradouro || "",
      "Endereço Completo": item.endereco_completo || "",
      Armário: item.armario || "",
      Tipo: item.tipo || "",
      Território: item.territorio || "",
      "Via Range": item.encontrado_via_range ? "Sim" : "Não",
      "Range Min": item.encontrado_via_range ? item.range_min || "" : "",
      "Range Max": item.encontrado_via_range ? item.range_max || "" : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Consulta Massa");

    const fileName = generateFileName();
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error("❌ Erro ao exportar dados:", error);
  }
}

function generateFileName(): string {
  const date = new Date().toISOString().split("T")[0];
  const time = new Date()
    .toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", "");

  return `consulta_massa_${date}_${time}.xlsx`;
}

export function useExportBulkAvailabilityCSVController() {
  const originalDados = useBulkAvailabilityStore(
    (state) => state.originalDados,
  );
  const consultAvailabilityService = new ConsultAvailabilityService();

  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await consultAvailabilityService.consultAvailabilityBulk(
        originalDados,
        originalDados.length,
        1,
      );
      return response.resultados;
    },
    onSuccess: (data) => {
      exportToCSV(data);
    },
  });

  return {
    exportDataCSV: () => exportMutation.mutate(),
    isExportingCSV: exportMutation.isPending,
    exportErrorCSV: exportMutation.error,
  };
}

function exportToCSV(dados: IBulkAvailabilityResult[]) {
  try {
    const exportData = dados.map((item) => ({
      CEP: item.cep || "",
      Número: item.numero || "",
      Disponibilidade: item.disponibilidade ? "Sim" : "Não",
      UF: item.uf || "",
      Cidade: item.cidade || "",
      Bairro: item.bairro || "",
      Logradouro: item.logradouro || "",
      "Endereço Completo": item.endereco_completo || "",
      Armário: item.armario || "",
      Tipo: item.tipo || "",
      Território: item.territorio || "",
      "Via Range": item.encontrado_via_range ? "Sim" : "Não",
      "Range Min": item.encontrado_via_range ? item.range_min || "" : "",
      "Range Max": item.encontrado_via_range ? item.range_max || "" : "",
    }));

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
          .join(","),
      ),
    ].join("\n");
    const BOM = "\uFEFF";
    const finalContent = BOM + csvContent;

    const blob = new Blob([finalContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = generateFileNameCSV();
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ Erro ao exportar dados CSV:", error);
  }
}

function generateFileNameCSV(): string {
  const date = new Date().toISOString().split("T")[0];
  const time = new Date()
    .toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", "");

  return `consulta_massa_${date}_${time}.csv`;
}
