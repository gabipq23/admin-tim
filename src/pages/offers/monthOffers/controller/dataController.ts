import { OffersService } from "@/services/offers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { MonthOffer, UpdateMonthOfferData } from "@/interfaces/monthOffer";

export function useMonthOffersController() {
  const offersService = new OffersService();
  const queryClient = useQueryClient();
  const params = new URLSearchParams(window.location.search);
  const filters = Object.fromEntries(params.entries());

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data: offers, isLoading } = useQuery<MonthOffer[]>({
    refetchOnWindowFocus: false,
    queryKey: [
      "offers",
      filters.pagina || 1,
      filters.dataDe || undefined,
      filters.dataAte || undefined,
      filters.nome || "",
    ],
    queryFn: async (): Promise<MonthOffer[]> => {
      const response = await offersService.allOffersFiltered({
        pagina: filters.pagina ? Number(filters.pagina) : undefined,
        dataDe: filters.dataDe || undefined,
        dataAte: filters.dataAte || undefined,
        nome: filters.nome || undefined,
      });

      return response;
    },
  });
  const { mutate: createMonthOffers, isPending: isUploadPending } = useMutation(
    {
      mutationFn: async ({
        file,
        descricao,
      }: {
        file: File;
        descricao: string;
      }) => offersService.inputOffers(file, descricao),
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["offers"] }),
      onSuccess: () => {
        toast.success("Arquivo enviado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["offers"] });
      },
      onError: (error: any) => {
        toast.error("Erro ao enviar arquivo. Tente novamente");
        console.error(error.message);
      },
    }
  );

  const { mutate: downloadFile, isPending: isDownloadPending } = useMutation({
    mutationFn: async ({ id, fileName }: { id: number; fileName: string }) =>
      offersService.downloadOfferFile(id, fileName),
    onSuccess: () => {
      toast.success("Download iniciado!");
    },
    onError: (error: any) => {
      toast.error("Erro ao baixar arquivo. Tente novamente");
      console.error(error.message);
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
