export interface ProductPricing {
  base_monthly:
    | number
    | {
        original_price?: number;
        current_price: number;
      };
  installation:
    | number
    | {
        current_price: number;
      };
}

export interface ProductOfferConditionFile {
  url: string;
  type: string;
}

export interface ProductDetail {
  title: string;
  images: string[];
  description: string;
  highlight_top: boolean;
  highlight_bottom: boolean;
}

export interface ProductExtraOption {
  id: string;
  label: string;
  price: number;
  description: string | null;
  bonus?: {
    type: string;
    speed: number;
    description: string;
    price: number;
  };
}

export interface ProductExtraGroup {
  id: string;
  input_type: string;
  label: string;
  images: string[];
  options: ProductExtraOption[];
}

export interface ProductExtras {
  client: ProductExtraGroup[];
  non_client: ProductExtraGroup[];
}

export interface IProduct {
  id: number;
  uf: string[];
  company: string;
  business_partner: string;
  category: string;
  client_type: "PF" | "PJ";
  landing_page: string;
  name: string;
  online: boolean;
  offer_conditions: ProductOfferConditionFile[] | null;
  badge: string | null;
  offer_title: string;
  offer_subtitle: string;
  pricing: ProductPricing;
  details: ProductDetail[];
  extras: ProductExtras;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  success: boolean;
  products: IProduct[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
