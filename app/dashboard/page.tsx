import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getMyListings } from "@/lib/queries/listings"
import { getMyBookings, getIncomingBookings } from "@/lib/queries/bookings"

async function DashboardStats() {
  const [myListings, myBookings, incoming] = await Promise.all([
    getMyListings(),
    getMyBookings(),
    getIncomingBookings(),
  ])

  const published = myListings.filter((l) => l.status === "published").length
  const activeBookings = myBookings.filter((b) => ["confirmed", "active"].includes(b.status)).length
  const pendingIncoming = incoming.filter((b) => b.status === "confirmed").length

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
      <div className="rounded-xl border p-4">
        <p className="text-2xl font-bold">{published}</p>
        <p className="text-sm text-muted-foreground">Aktywnych ogłoszeń</p>
      </div>
      <div className="rounded-xl border p-4">
        <p className="text-2xl font-bold">{activeBookings}</p>
        <p className="text-sm text-muted-foreground">Moich rezerwacji</p>
      </div>
      <div className="rounded-xl border p-4">
        <p className="text-2xl font-bold">{pendingIncoming}</p>
        <p className="text-sm text-muted-foreground">Nowych zapytań</p>
      </div>
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Panel</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/dashboard/listings/new">+ Nowe ogłoszenie</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/bookings/incoming">Zobacz zapytania</Link>
        </Button>
      </div>
    </div>
  )
}
