import { ConsultAvailabilityService } from "@/services/consultAvailability";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function useConsultAvailabilityBulkController() {
  const consultAvailabilityService = new ConsultAvailabilityService();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (params: {
      dados: Array<{ cep: string; numero?: string }>;
      limite?: number;
      page?: number;
    }) => {
      const response = await consultAvailabilityService.consultAvailabilityBulk(
        params.dados,
        params.limite,
        params.page
      );
      return response;
    },
    onSuccess: (data) => {
      navigate("/admin/resultado-disponibilidade-massa", {
        state: data,
      });
    },
    onError: (error) => {
      console.error("Erro na consulta em massa:", error);
    },
  });

  return {
    consultBulk: mutation.mutate,
    isConsulting: mutation.isPending,
    error: mutation.error,
  };
}
