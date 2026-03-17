import { OrderBandaLargaPFResponse } from "@/interfaces/bandaLargaPF";
import { BandaLargaService } from "@/services/bandaLarga";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function useAllOrdersController() {
  const bandaLargaService = new BandaLargaService();
  const queryClient = useQueryClient();
  const params = new URLSearchParams(window.location.search);
  const filters = Object.fromEntries(params.entries());

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data: ordersBandaLarga, isLoading } =
    useQuery<OrderBandaLargaPFResponse>({
      refetchOnWindowFocus: false,
      queryKey: [
        "ordersBandaLargaPF",
        filters.page,
        filters.per_page,
        filters.data_to,
        filters.data_from,
        filters.status,
        filters.availability,
        filters.cpf,
        filters.cnpj,
        filters.phone,
        filters.after_sales_status,
        filters.order,
        filters.sort,
        filters.order_number

      ],
      queryFn: async (): Promise<OrderBandaLargaPFResponse> => {
        const response = await bandaLargaService.allBandaLargaFiltered({
          page: filters.page,
          per_page: filters.per_page,
          data_to: filters.data_to,
          data_from: filters.data_from,
          status: filters.status,
          availability: filters.availability,
          cpf: filters.cpf,
          cnpj: filters.cnpj,
          phone: filters.phone,
          after_sales_status: filters.after_sales_status,
          order: filters.order,
          sort: filters.sort,
          order_number: filters.order_number

        });

        return response;
      },
    });

  const { mutate: updateBandaLargaOrder, isPending: isUpdatePurchaseFetching } =
    useMutation({
      mutationFn: async ({ id, data }: { id: number; data: any }) =>
        bandaLargaService.updateBandaLargaOrderInfo(id, data),
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["ordersBandaLargaPF"] }),
      onSuccess: () => {
        toast.success("Pedido alterado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["ordersBandaLargaPF"] });
      },
      onError: (error) => {
        toast.error("Houve um erro ao alterar o pedido. Tente novamente");
        console.error(error.message);
      },
    });

  const {
    mutate: removeBandaLargaOrder,
    isPending: isRemoveBandaLargaOrderFetching,
  } = useMutation({
    mutationFn: async ({ id }: { id: number }) =>
      bandaLargaService.removeBandaLargaOrder(id),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["ordersBandaLargaPF"] }),
    onError: (error) => {
      toast.error("Houve um erro ao remover o pedido. Tente novamente");
      console.error(error.message);
    },
    onSuccess: () => {
      toast.success("Pedido removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["ordersBandaLargaPF"] });
    },
  });

  const { mutate: changeBandaLargaOrderStatus } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { status: string };
    }) => bandaLargaService.changeBandaLargaOrderStatus(id, data),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["ordersBandaLargaPF"] }),
    onSuccess: () => {
      toast.success("Status do pedido alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["ordersBandaLargaPF"] });
    },
    onError: (error) => {
      toast.error("Houve um erro ao alterar o status do pedido.");
      console.error(error.message);
    },
  });

  const orderBandaLargaPF = ordersBandaLarga?.orders?.filter(
    (order) => order.client_type === "PF"
  );

  const updateDataIdCRMAndConsultorResponsavel = (
    id: string | undefined,
    values: any,
  ) => {
    if (!id) {
      toast.error("ID do pedido inválido.");
      return;
    }

    const dadosGerais = {
      responsible_consultant: values.responsible_consultant,
      corporate_id: values.corporate_id,
      crm_id: values.crm_id,
      credit: values.credit,

    };

    updateBandaLargaOrder({
      id: Number(id),
      data: dadosGerais,
    });
  };

  return {
    ordersBandaLarga,
    showModal,
    closeModal,
    isModalOpen,
    orderBandaLargaPF,
    isLoading,
    updateBandaLargaOrder,
    isUpdatePurchaseFetching,
    removeBandaLargaOrder,
    isRemoveBandaLargaOrderFetching,
    changeBandaLargaOrderStatus,
    updateDataIdCRMAndConsultorResponsavel
  };
}
