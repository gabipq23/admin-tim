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
        "ordersBandaLargaPJ",
        filters.availability || true,
        filters.status_pos_venda || "",

        filters.plan || "",
        filters.fullname || "",
        filters.phone || "",
        filters.cnpj || "",
        filters.razaosocial || "",
        filters.ordernumber || "",
        filters.page || 1,
        filters.limit || 200,
        filters.data_de || undefined,
        filters.data_ate || undefined,
        filters.sort || "data_criacao",
        filters.status || "",
        filters.initial_status || "",

        filters.order || "desc",
      ],
      queryFn: async (): Promise<OrderBandaLargaPFResponse> => {
        const response = await bandaLargaService.allBandaLargaFiltered({
          availability:
            filters.availability === "true"
              ? true
              : filters.availability === "false"
                ? false
                : undefined,
          status_pos_venda: filters.status_pos_venda || "",

          plan: filters.plan || "",
          fullname: filters.fullname || "",
          phone: filters.phone || "",
          cnpj: filters.cnpj || "",
          razaosocial: filters.razaosocial || "",
          ordernumber: filters.ordernumber || "",
          page: filters.page || 1,
          limit: filters.limit || 200,
          data_de: filters.data_de || undefined,
          data_ate: filters.data_ate || undefined,
          status: filters.status || "",
          sort: filters.sort || "data_criacao",
          order:
            filters.order === "asc" || filters.order === "desc"
              ? filters.order
              : "desc",
          initial_status: filters.initial_status || "",
        });
        return response;
      },
    });

  const { mutate: updateBandaLargaOrder, isPending: isUpdatePurchaseFetching } =
    useMutation({
      mutationFn: async ({ id, data }: { id: number; data: any }) =>
        bandaLargaService.updateBandaLargaOrderInfo(id, data),
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["ordersBandaLargaPJ"] }),
      onSuccess: () => {
        toast.success("Pedido alterado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["ordersBandaLargaPJ"] });
      },
      onError: (error) => {
        toast.error("Houve um erro ao alterar o pedido. Tente novamente");
        console.error(error.message);
      },
    });
  // Remoção de pedido completo
  const {
    mutate: removeBandaLargaPJOrder,
    isPending: isRemoveBandaLargaPJOrderFetching,
  } = useMutation({
    mutationFn: async ({ id }: { id: number }) =>
      bandaLargaService.removeBandaLargaOrder(id),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["ordersBandaLargaPJ"] }),
    onError: (error) => {
      toast.error("Houve um erro ao remover o pedido. Tente novamente");
      console.error(error.message);
    },
    onSuccess: () => {
      toast.success("Pedido removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["ordersBandaLargaPJ"] });
    },
  });

  const { mutate: changeBandaLargaPJOrderStatus } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { status: string };
    }) => bandaLargaService.changeBandaLargaOrderStatus(id, data),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["ordersBandaLargaPJ"] }),
    onSuccess: () => {
      toast.success("Status do pedido alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["ordersBandaLargaPJ"] });
    },
    onError: (error) => {
      toast.error("Houve um erro ao alterar o status do pedido.");
      console.error(error.message);
    },
  });

  const updateDataIdVivoAndConsultorResponsavel = (
    id: string | undefined,
    values: any,
  ) => {
    if (!id) {
      toast.error("ID do pedido inválido.");
      return;
    }

    const dadosGerais = {
      pedido: {
        consultor_responsavel: values.consultor_responsavel,
        id_vivo_corp: values.id_vivo_corp,
        id_crm: values.id_crm,
        credito: values.credito,
      },
    };

    updateBandaLargaOrder({
      id: Number(id),
      data: dadosGerais,
    });
  };
  const orderBandaLargaPJ = ordersBandaLarga?.pedidos?.filter(
    (order: any) =>
      order.typeclient === "PJ" &&
      order.manager?.phone !== null &&
      order.manager?.phone !== "" &&
      order.manager?.phone !== undefined,
  );

  return {
    ordersBandaLarga,
    showModal,
    closeModal,
    isModalOpen,
    orderBandaLargaPJ,
    isLoading,
    updateBandaLargaOrder,
    isUpdatePurchaseFetching,
    removeBandaLargaPJOrder,
    isRemoveBandaLargaPJOrderFetching,
    changeBandaLargaPJOrderStatus,
    updateDataIdVivoAndConsultorResponsavel,
  };
}
