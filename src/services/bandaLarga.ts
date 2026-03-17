import { apiPurchase } from "@/configs/api";
import { OrderBandaLargaPFResponse } from "@/interfaces/bandaLargaPF";

export class BandaLargaService {
  async allBandaLargaFiltered({
    page,
    per_page,
    data_to,
    data_from,
    status,
  }: {
    page?: string | number;
    per_page?: string | number;
    data_to?: string;
    data_from?: string;
    status?: string;
  }): Promise<OrderBandaLargaPFResponse> {
    const res = await apiPurchase.get(`/tim/orders`, {
      params: {
        page,
        per_page,
        data_to,
        data_from,
        status,
      },
    });

    return res.data;
  }

  async updateBandaLargaOrderInfo(id: number, data: any): Promise<any> {
    const response = await apiPurchase.put(`/tim/orders/${id}`, data);
    return response.data;
  }
  async removeBandaLargaOrder(id: number) {
    await apiPurchase.delete(`/tim/orders/${id}`);
  }

  async changeBandaLargaOrderStatus(id: number, data: { status: string }) {
    await apiPurchase.patch(`/tim/orders/${id}/status`, data);
  }
}
