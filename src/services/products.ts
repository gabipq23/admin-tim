import { apiPurchase } from "@/configs/api";
import { ProductsResponse } from "@/interfaces/products";

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

  async createProduct(data: any): Promise<any> {
    const response = await apiPurchase.post(`/telecom-products`, data);
    return response.data;
  }

  async updateProduct(id: number, data: any): Promise<any> {
    const response = await apiPurchase.put(`/telecom-products/${id}`, data);
    return response.data;
  }
  async removeProduct(id: number) {
    await apiPurchase.delete(`/telecom-products/${id}`);
  }
}
