import { IProduct, ProductsResponse } from "@/interfaces/products";
import { ProductsService } from "@/services/products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getFiltersFromURL } from "./filters";

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
  const filters = getFiltersFromURL();
  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : "Erro desconhecido";

  const { data: productBLQuery, isFetching: productBLQueryFetching } =
    useQuery<ProductsResponse>({
      refetchOnWindowFocus: false,
      queryKey: [
        "productBL",
        filters.page || 1,
        filters.per_page || 20,
        filters.online === null ? "" : String(filters.online),
        filters.company || "",
        filters.category || "",
        filters.business_partner || "",
        filters.landing_page || "",
        filters.order || "",
        filters.sort || "",
        filters.client_type || "",
        filters.uf || "",
      ],
      queryFn: async (): Promise<ProductsResponse> => {
        const response = await productBLService.allProductsFiltered({
          page: 1,
          per_page: 100,
          online: filters.online === null ? undefined : String(filters.online),
          company: filters.company ?? undefined,
          category: filters.category ?? undefined,
          business_partner: filters.business_partner ?? undefined,
          landing_page: filters.landing_page ?? undefined,
          order: filters.order ?? undefined,
          sort: filters.sort ?? undefined,
          client_type: filters.client_type ?? undefined,
          uf: filters.uf ?? undefined,
        });
        return response;
      },
    });

  const { mutateAsync: updateProductBL } = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: number;
      values: Partial<IProduct>;
    }) => productBLService.updateProduct(id, values),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["productBL"] }),
    onSuccess: () => {
      toast.success("Produto alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["productBL"] });
    },
    onError: (error: unknown) => {
      toast.error("Houve um erro ao alterar o produto. Tente novamente");
      console.error(getErrorMessage(error));
    },
  });

  const { mutateAsync: createProductBL } = useMutation({
    mutationFn: async (data: FormData | Record<string, unknown>) =>
      productBLService.createProduct(data),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["productBL"] }),
    onSuccess: () => {
      toast.success("Produto criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["productBL"] });
    },
    onError: (error: unknown) => {
      toast.error("Houve um erro ao criar o produto. Tente novamente");
      console.error(getErrorMessage(error));
    },
  });

  const { mutateAsync: uploadProductConditionsBL } = useMutation({
    mutationFn: async ({ id, files }: { id: number; files: File[] }) =>
      productBLService.uploadProductConditions(id, files),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["productBL"] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productBL"] });
    },
    onError: (error: unknown) => {
      toast.error("Houve um erro ao enviar os documentos de condição.");
      console.error(getErrorMessage(error));
    },
  });

  const { mutateAsync: uploadProductDetailsBL } = useMutation({
    mutationFn: async ({
      id,
      detailIndex,
      files,
    }: {
      id: number;
      detailIndex: number;
      files: File[];
    }) => productBLService.uploadProductDetails(id, detailIndex, files),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["productBL"] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productBL"] });
    },
    onError: (error: unknown) => {
      toast.error("Houve um erro ao enviar as imagens dos detalhes.");
      console.error(getErrorMessage(error));
    },
  });

  const { mutateAsync: uploadProductExtrasBL } = useMutation({
    mutationFn: async ({
      id,
      extraId,
      files,
    }: {
      id: number;
      extraId: string;
      files: File[];
    }) => productBLService.uploadProductExtras(id, extraId, files),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["productBL"] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productBL"] });
    },
    onError: (error: unknown) => {
      toast.error("Houve um erro ao enviar as imagens dos extras.");
      console.error(getErrorMessage(error));
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
    onError: (error: unknown) => {
      toast.error("Houve um erro ao remover o produto. Tente novamente");
      console.error(getErrorMessage(error));
    },
  });

  const productsBL = (productBLQuery?.products || []).filter(
    (product) =>
      product.company === "TIM" && product.category === "Banda Larga",
  );

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
    uploadProductConditionsBL,
    uploadProductDetailsBL,
    uploadProductExtrasBL,
  };
}
