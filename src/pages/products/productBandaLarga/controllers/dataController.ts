import { ProductsResponse } from "@/interfaces/products";
import { ProductsService } from "@/services/products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function useProductBLController() {
  const productBLService = new ProductsService();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEditProductLayout, setShowEditProductLayout] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setShowEditProductLayout(false);
    setIsModalOpen(false);
  };
  const params = new URLSearchParams(window.location.search);
  const filters = Object.fromEntries(params.entries());

  const { data: productBLQuery, isFetching: productBLQueryFetching } =
    useQuery<ProductsResponse>({
      refetchOnWindowFocus: false,
      queryKey: [
        "productBL",
        filters.page || 1,
        filters.per_page || 20,
        filters.online || "",
        filters.company || "",
        filters.category || "",
        filters.business_partner || "",
        filters.landing_page || "",
        filters.order || "",
        filters.sort || "",
        filters.client_type || "",
      ],
      queryFn: async (): Promise<ProductsResponse> => {
        const response = await productBLService.allProductsFiltered({
          page: 1,
          per_page: 100,
          online: filters.online,
          company: filters.company,
          category: filters.category,
          business_partner: filters.business_partner,
          landing_page: filters.landing_page,
          order: filters.order,
          sort: filters.sort,
          client_type: filters.client_type,
        });
        return response;
      },
    });

  const { mutate: updateProductBL } = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: any }) =>
      productBLService.updateProduct(id, values),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["productBL"] }),
    onSuccess: () => {
      toast.success("Produto alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["productBL"] });
    },
    onError: (error) => {
      toast.error("Houve um erro ao alterar o produto. Tente novamente");
      console.error(error.message);
    },
  });

  const { mutate: createProductBL } = useMutation({
    mutationFn: async (data: any) => productBLService.createProduct(data),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["productBL"] }),
    onSuccess: () => {
      toast.success("Produto criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["productBL"] });
    },
    onError: (error: any) => {
      toast.error("Houve um erro ao criar o produto. Tente novamente");
      console.error(error.message);
    },
  });

  const { mutate: removeProductBL } = useMutation({
    mutationFn: async (id: number) => productBLService.removeProduct(id),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["productBL"] }),
    onSuccess: () => {
      toast.success("Produto removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["productBL"] });
    },
    onError: (error: any) => {
      toast.error("Houve um erro ao remover o produto. Tente novamente");
      console.error(error.message);
    },
  });

  const productsBL = productBLQuery?.products || [];

  return {
    isModalOpen,
    showModal,
    closeModal,
    showEditProductLayout,
    setShowEditProductLayout,
    productBLQueryFetching,
    productBLQuery,
    productsBL,
    updateProductBL,
    removeProductBL,
    createProductBL,
  };
}
