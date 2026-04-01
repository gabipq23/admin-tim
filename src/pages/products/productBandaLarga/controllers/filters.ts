export interface ProductBLFiltersFormValues {
  online: boolean | null;
  company: string | null;
  category: string | null;
  business_partner: string | null;
  landing_page: string | null;
  order: string | null;
  sort: string | null;
  client_type: string | null;
  page: number;
  per_page: number;
  uf: string | null;
}

export function getFiltersFromURL(): ProductBLFiltersFormValues {
  const params = new URLSearchParams(window.location.search);
  const onlineParam = params.get("online");

  return {
    online:
      onlineParam === "true" ? true : onlineParam === "false" ? false : null,
    company: params.get("company"),
    category: params.get("category"),
    business_partner: params.get("business_partner"),
    landing_page: params.get("landing_page"),
    order: params.get("order"),
    sort: params.get("sort"),
    client_type: params.get("client_type"),
    uf: params.get("uf"),
    page: params.get("page") ? parseInt(params.get("page")!, 10) : 1,
    per_page: params.get("per_page")
      ? parseInt(params.get("per_page")!, 10)
      : 20,
  };
}
