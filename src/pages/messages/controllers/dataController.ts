import { ContactService } from "@/services/contact";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { IContactResponse } from "src/interfaces/contacts";

export function useContactsController() {
  const contactService = new ContactService();
  const params = new URLSearchParams(window.location.search);
  const filters = Object.fromEntries(params.entries());
  const queryClient = useQueryClient();

  const { data: contactsQuery, isFetching: isContactFetching } =
    useQuery<IContactResponse>({
      refetchOnWindowFocus: false,
      queryKey: ["messages", filters.page, filters.data_to, filters.data_from],
      queryFn: async (): Promise<IContactResponse> => {
        const response = await contactService.allContacts({
          page: filters.page,
          data_to: filters.data_to,
          data_from: filters.data_from,
        });
        return response;
      },
    });

  const { mutate: changeContactStatus } = useMutation({
    mutationFn: async ({
      id,
      status_mensagem,
    }: {
      id: number;
      status_mensagem: "LIDA" | "RESPONDIDA";
    }) => {
      const response = await contactService.changeContactStatus({
        id,
        status_mensagem,
      });
      return response;
    },
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["contacts"] }),
    onSuccess: () => {
      toast.success("Status alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
    onError: (error) => {
      toast.error("Houve um erro ao alterar o status. Tente novamente");
      console.error(error.message);
    },
  });

  const { mutate: removeContact } = useMutation({
    mutationFn: async ({ id }: { id: number }) =>
      contactService.removeContact(id),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["contacts"] }),
    onError: (error) => {
      toast.error("Houve um erro ao remover o contato. Tente novamente");
      console.error(error.message);
    },
    onSuccess: () => {
      toast.success("Contato removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });

  const [removeContactIds, setRemoveContactIds] = useState([] as number[]);

  const removeContacts = () => {
    for (const id of removeContactIds) {
      removeContact({ id });
    }
  };

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const contacts =
    contactsQuery?.messages?.filter((contact) => contact.company === "VR") ||
    [];

  return {
    changeContactStatus,
    contactsQuery,
    contacts,
    totalContacts: contactsQuery?.pagination?.total || 0,
    isModalOpen,
    showModal,
    closeModal,
    isLoading: isContactFetching,
    setRemoveContactIds,
    removeContacts,
  };
}
