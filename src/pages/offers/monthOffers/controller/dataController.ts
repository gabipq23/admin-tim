import { OffersService } from "@/services/offers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  MonthOffersResponse,
  UpdateMonthOfferData,
} from "@/interfaces/monthOffer";

export function useMonthOffersController() {
  const offersService = new OffersService();
  const queryClient = useQueryClient();
  const params = new URLSearchParams(window.location.search);
  const filters = Object.fromEntries(params.entries());

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data: offers, isLoading } = useQuery<MonthOffersResponse>({
    refetchOnWindowFocus: false,
    queryKey: [
      "offers",
      filters.page || 1,
      filters.per_page || 10,
      filters.date_from || undefined,
      filters.date_to || undefined,
      filters.name || "",
    ],
    queryFn: async (): Promise<MonthOffersResponse> => {
      const response = await offersService.allOffersFiltered({
        page: filters.page ? Number(filters.page) : undefined,
        per_page: filters.per_page ? Number(filters.per_page) : undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
        name: filters.name || undefined,
      });

      return response;
    },
  });
  const { mutate: createMonthOffers, isPending: isUploadPending } = useMutation(
    {
      mutationFn: async ({
        file,
        description,
      }: {
        file: File;
        description: string;
      }) => offersService.inputOffers(file, description),
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["offers"] }),
      onSuccess: () => {
        toast.success("Arquivo enviado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["offers"] });
      },
      onError: (error: unknown) => {
        toast.error("Erro ao enviar arquivo. Tente novamente");
        console.error(error);
      },
    },
  );

  const { mutate: downloadFile, isPending: isDownloadPending } = useMutation({
    mutationFn: async ({ id, fileName }: { id: number; fileName: string }) =>
      offersService.downloadOfferFile(id, fileName),
    onSuccess: () => {
      toast.success("Download iniciado!");
    },
    onError: (error: unknown) => {
      toast.error("Erro ao baixar arquivo. Tente novamente");
      console.error(error);
    },
  });

  const { mutate: updateMonthOffer, isPending: isUpdateOfferFetching } =
    useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: number;
        data: UpdateMonthOfferData;
      }) => offersService.updateOffers(id, data),
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["offers"] }),
      onSuccess: () => {
        toast.success("Descrição alterada com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["offers"] });
      },
      onError: (error) => {
        toast.error("Houve um erro ao alterar a descrição. Tente novamente");
        console.error(error.message);
      },
    });

  const { mutate: removeOffers, isPending: isRemoveOffersFetching } =
    useMutation({
      mutationFn: async ({ id }: { id: number }) =>
        offersService.removeOffers(id),
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["offers"] }),
      onError: (error) => {
        toast.error("Houve um erro ao remover a oferta. Tente novamente");
        console.error(error.message);
      },
      onSuccess: () => {
        toast.success("Oferta removida com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["offers"] });
      },
    });

  return {
    offers,
    isLoading,
    isModalOpen,
    showModal,
    closeModal,
    updateMonthOffer,
    isUpdateOfferFetching,
    removeOffers,
    isRemoveOffersFetching,
    createMonthOffers,
    isUploadPending,
    downloadFile,
    isDownloadPending,
  };
}
