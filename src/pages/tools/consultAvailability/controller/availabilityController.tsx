import { IAvailability } from "@/interfaces/availability";
import { ConsultAvailabilityService } from "@/services/consultAvailability";
import { useQuery } from "@tanstack/react-query";

export function useConsultAvailabilityController(cep: string, numero: string) {
  const consultAvailabilityService = new ConsultAvailabilityService();

  const { data, isLoading, error, refetch } = useQuery<IAvailability>({
    refetchOnWindowFocus: false,
    queryKey: ["consultAvailability", cep, numero],
    queryFn: async (): Promise<IAvailability> => {
      const response = await consultAvailabilityService.consultAvailability(
        cep,
        numero
      );
      return response;
    },
    enabled: !!cep,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
