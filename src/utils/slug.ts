export function slugifyAnimeTitle(title: string, malId: number): string {
  const normalized = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)

  const base = normalized || "anime"

  return `${base}-${malId}`
}

export function quoteIlikePattern(value: string): string {
  const escaped = value.replace(/[%_\\,]/g, "\\$&").replace(/"/g, '""')

  return `"${escaped}"`
}
