import { apiPurchase } from "@/configs/api";
import {
  MonthOffersResponse,
  UpdateMonthOfferData,
} from "@/interfaces/monthOffer";

export class OffersService {
  async allOffersFiltered({
    page,
    date_from,
    date_to,
    name,
    per_page,
  }: {
    page?: number;
    date_from?: string;
    date_to?: string;
    name?: string;
    per_page?: number;
  }): Promise<MonthOffersResponse> {
    const res = await apiPurchase.get(`/tim/offers`, {
      params: {
        pagina: page,
        date_from: date_from,
        date_to: date_to,
        name: name,
        por_pagina: per_page,
      },
    });

    return res.data;
  }

  async inputOffers(file: File, description: string): Promise<unknown> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);

    const response = await apiPurchase.post(`/tim/offers`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // aguardando infos
  async downloadOfferFile(id: number, fileName: string): Promise<void> {
    const response = await apiPurchase.get(`/tim/offers/${id}/download`);
    const downloadUrl = response.data.url || response.data;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", fileName);
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async updateOffers(id: number, data: UpdateMonthOfferData): Promise<unknown> {
    const response = await apiPurchase.put(`/tim/offers/${id}`, data);
    return response.data;
  }

  async removeOffers(id: number) {
    await apiPurchase.delete(`/tim/offers/${id}`);
  }
}
