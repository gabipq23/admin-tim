import { apiPurchase } from "@/configs/api";
import { IContactResponse } from "src/interfaces/contacts";

export class ContactService {
  async allContacts({
    data_to,
    data_from,
    page,
  }: {
    page?: number | string;
    data_to?: string;
    data_from?: string;
  }): Promise<IContactResponse> {
    const res = await apiPurchase.get(`/messages`, {
      params: {
        page,
        data_to,
        data_from,
      },
    });
    return res.data;
  }

  async changeContactStatus({
    id,
    status_mensagem,
  }: {
    id: number;
    status_mensagem: "LIDA" | "RESPONDIDA";
  }) {
    return apiPurchase.patch(`/messages/${id}/status`, {
      status_mensagem: status_mensagem,
    });
  }

  async removeContact(id: number) {
    await apiPurchase.delete(`/messages/${id}`);
  }
}
