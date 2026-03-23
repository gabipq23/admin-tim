export interface ProductPricing {
  base_monthly: number;
  installation: number;
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
}

export interface ProductExtraGroup {
  id: string;
  input_type: string;
  label: string;
  options: ProductExtraOption[];
}

export interface ProductExtras {
  client: ProductExtraGroup[];
  non_client: ProductExtraGroup[];
}

export interface Product {
  id: number;
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
  products: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
