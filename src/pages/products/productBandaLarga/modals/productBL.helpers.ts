import type { ProductExtraGroup } from "@/interfaces/products";
import { type ExtraGroupFormValue } from "../components/ProductBLExtrasBuilder";
import { generateIdFromLabel } from "@/utils/generateId";

export const normalizeExtras = (
  groups: ExtraGroupFormValue[] = [],
): ProductExtraGroup[] => {
  return groups
    .filter((group) => group?.input_type && group?.label)
    .map((group) => ({
      id: generateIdFromLabel(group.label),
      input_type: group.input_type!,
      label: group.label!,
      options: (group.options || [])
        .filter((option) => option?.label)
        .map((option) => ({
          id: generateIdFromLabel(option.label),
          label: option.label!,
          price: Number(option.price || 0),
          description: option.description || null,
          bonus: {
            type: option.bonus?.type || "",
            speed: Number(option.bonus?.speed || 0),
            description: option.bonus?.description || "",
            price: Number(option.bonus?.price || 0),
          },
        })),
    }));
};
