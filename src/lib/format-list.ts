export function formatList(items: string[]) {
  if (items.length <= 1) {
    return items[0] ?? "The listed destinations";
  }

  if (items.length === 2) {
    return items.join(" and ");
  }

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}
