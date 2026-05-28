export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function formatDateRange(from: Date, to: Date): string {
  const fmt = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short" })
  return `${fmt.format(from)} — ${fmt.format(to)}`
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date)
}

export function toDateString(date: Date): string {
  return date.toISOString().split("T")[0]
}
