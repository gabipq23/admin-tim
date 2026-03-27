import { apiPurchase } from "@/configs/api";
import { isAxiosError } from "axios";

export class ProductExtrasService {
  async uploadExtraImage(
    extra_id: string,
    file: File,
  ): Promise<{ url?: string }> {
    const formData = new FormData();
    formData.append("extra_id", extra_id);
    formData.append("file", file);

    try {
      const response = await apiPurchase.post(
        `/telecom-products/${extra_id}/extras-images`,
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
        console.error(
          "Erro no upload de imagem do extra - Status:",
          error.response?.status,
        );
        console.error(
          "Erro no upload de imagem do extra - Data:",
          error.response?.data,
        );
      }
      throw error;
    }
  }
}
