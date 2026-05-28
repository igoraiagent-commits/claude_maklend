import { Badge } from "@/components/ui/badge"

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  confirmed: { label: "Potwierdzona", variant: "default" },
  active: { label: "Aktywna", variant: "secondary" },
  completed: { label: "Zakończona", variant: "outline" },
  cancelled: { label: "Anulowana", variant: "destructive" },
}

export function BookingStatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] ?? { label: status, variant: "outline" as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
