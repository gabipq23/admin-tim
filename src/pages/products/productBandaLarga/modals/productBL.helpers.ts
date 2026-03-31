import type { ProductExtraGroup } from "@/interfaces/products";
import { type ExtraGroupFormValue } from "../components/ProductBLExtrasBuilder";

export const normalizeExtras = (
  groups: ExtraGroupFormValue[] = [],
): ProductExtraGroup[] => {
  return groups
    .filter((group) => group?.input_type && group?.label)
    .map((group) => ({
      id: group.id ?? "",
      input_type: group.input_type!,
      label: group.label!,
      images: Array.isArray(group.images)
        ? group.images
            .map((img: any) =>
              typeof img === "string"
                ? img
                : img && typeof img === "object" && img.url
                  ? img.url
                  : null,
            )
            .filter(Boolean)
        : [],
      options: (group.options || [])
        .filter((option) => option?.label)
        .map((option) => {
          const bonus = {
            type: option.bonus?.type || "",
            speed: Number(option.bonus?.speed || 0),
            description: option.bonus?.description || "",
            price: Number(option.bonus?.price || 0),
          };
          const hasBonus = !!(
            bonus.type ||
            bonus.speed ||
            bonus.description ||
            bonus.price
          );
          const base = {
            id: option.id ?? "",
            label: option.label!,
            price: Number(option.price || 0),
            description: option.description || null,
          };
          return hasBonus ? { ...base, bonus } : base;
        }),
    }));
};
