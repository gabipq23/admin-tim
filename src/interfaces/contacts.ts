export interface IContact {
  id: number;
  company: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: string;
  status_message: string;
  cnpj?: string;
  total?: string;
}

export interface IContactResponse {
  success: boolean;
  messages: IContact[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  assunto_enum?: string[];
}
export interface IFilters {
  cnpj?: string | null;
  nome?: string | null;
  email?: string | null;
  status_mensagem?: string | null;
  data_de?: string | null;
  data_ate?: string | null;
  assunto?: string | null;
  sort?: string | null;
  order?: "asc" | "desc" | null;
}
