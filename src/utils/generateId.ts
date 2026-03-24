export function generateIdFromLabel(label?: string): string {
  if (!label) return "";

  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/\s+/g, "_") // Espaços para underscores
    .replace(/[^a-z0-9_]/g, ""); // Remove caracteres especiais
}
