import { apiPurchase } from "@/configs/api";
import { OrderBandaLargaResponse } from "@/interfaces/orderBandaLarga";

export class BandaLargaService {
  async allBandaLargaFiltered({
    page,
    per_page,
    data_to,
    data_from,
    status,
    availability,
    cpf,
    cnpj,
    phone,
    after_sales_status,
    order,
    sort,
    order_number,
    type_client,
    client_type,
  }: {
    page?: string | number;
    per_page?: string | number;
    data_to?: string;
    data_from?: string;
    status?: string;
    availability?: string;
    cpf?: string;
    cnpj?: string;
    phone?: string;
    after_sales_status?: string;
    order?: string;
    sort?: string;
    order_number?: string;
    type_client?: string;
    client_type?: string;
  }): Promise<OrderBandaLargaResponse> {
    const clientTypeFilter = type_client || client_type;

    const res = await apiPurchase.get(`/telecom/tim/orders`, {
      params: {
        page,
        per_page,
        data_to,
        data_from,
        status,
        availability,
        cpf,
        cnpj,
        phone,
        after_sales_status,
        order,
        sort,
        order_number,
        type_client: clientTypeFilter,
        client_type: clientTypeFilter,
      },
    });

    return res.data;
  }

  async updateBandaLargaOrderInfo(id: number, data: any): Promise<any> {
    const response = await apiPurchase.put(`/telecom/tim/orders/${id}`, data);
    return response.data;
  }
  async removeBandaLargaOrder(id: number) {
    await apiPurchase.delete(`/telecom/tim/orders/${id}`);
  }

  async changeBandaLargaOrderStatus(id: number, data: { status: string }) {
    await apiPurchase.patch(`/telecom/tim/orders/${id}/status`, data);
  }
}
