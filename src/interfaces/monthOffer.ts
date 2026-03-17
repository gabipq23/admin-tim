export interface MonthOffer {
  id: number;
  company: string;
  name: string;
  description: string;
  link: string;
  data_upload: string;
}

export interface MonthOffersResponse {
  success: boolean;
  offers: MonthOffer[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface UpdateMonthOfferData {
  description?: string;
  name?: string;
  link?: string;
}
