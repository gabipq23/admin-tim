import { apiPurchase } from "@/configs/api";
import { IProduct, ProductsResponse } from "@/interfaces/products";
import { isAxiosError } from "axios";

export interface CreatedProductResponse {
  id: number;
}

export class ProductsService {
  async allProductsFiltered({
    page,
    per_page,
    online,
    company,
    category,
    business_partner,
    landing_page,
    order,
    sort,
    client_type,
  }: {
    page?: string | number;
    per_page?: string | number;
    online?: string;
    company?: string;
    category?: string;
    business_partner?: string;
    landing_page?: string;
    order?: string;
    sort?: string;
    client_type?: string;
  }): Promise<ProductsResponse> {
    const res = await apiPurchase.get(`/telecom-products`, {
      params: {
        page,
        per_page,
        online,
        company,
        category,
        business_partner,
        landing_page,
        order,
        sort,
        client_type,
      },
    });

    return res.data;
  }

  async createProduct(
    data: FormData | Record<string, unknown>,
  ): Promise<CreatedProductResponse> {
    const headers =
      data instanceof FormData
        ? {
            "Content-Type": "multipart/form-data",
          }
        : undefined;

    try {
      const response = await apiPurchase.post(`/telecom-products`, data, {
        headers,
      });

      const id = Number(response?.data?.product?.id);
      if (!Number.isFinite(id) || id <= 0) {
        throw new Error("Resposta de criacao sem id valido");
      }

      return { id };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error("Erro do backend - Status:", error.response?.status);
        console.error("Erro do backend - Data:", error.response?.data);
      }
      throw error;
    }
  }

  async uploadProductConditions(id: number, files: File[]): Promise<unknown> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const response = await apiPurchase.post(
        `/telecom-products/${id}/conditions`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error("Erro no upload - Status:", error.response?.status);
        console.error("Erro no upload - Data:", error.response?.data);
      }
      throw error;
    }
  }

  async updateProduct(
    id: number,
    data: Partial<IProduct> | Record<string, unknown>,
  ): Promise<unknown> {
    const response = await apiPurchase.put(`/telecom-products/${id}`, data);
    return response.data;
  }
  async removeProduct(id: number) {
    await apiPurchase.delete(`/telecom-products/${id}`);
  }
}
