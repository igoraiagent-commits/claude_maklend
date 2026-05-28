import { Suspense } from "react"
import Link from "next/link"
import { getMyListings } from "@/lib/queries/listings"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/utils/format"
import { ListingStatusActions } from "./listing-status-actions"

const STATUS_LABELS: Record<string, string> = {
  draft: "Szkic",
  published: "Opublikowane",
  paused: "Wstrzymane",
  archived: "Zarchiwizowane",
}

async function MyListingsList() {
  const listings = await getMyListings()

  if (listings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="mb-4">Nie masz jeszcze żadnych ogłoszeń</p>
        <Button asChild>
          <Link href="/dashboard/listings/new">Utwórz pierwsze ogłoszenie</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {listings.map((listing) => (
        <div key={listing.id} className="border rounded-xl p-4 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{listing.title}</h3>
              <Badge variant={listing.status === "published" ? "default" : "secondary"}>
                {STATUS_LABELS[listing.status] ?? listing.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {listing.city} · {formatPrice(listing.price_per_day_cents)}/dzień
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/listings/${listing.id}/edit`}>Edytuj</Link>
            </Button>
            <ListingStatusActions id={listing.id} status={listing.status} />
          </div>
        </div>
      ))}
    </div>
  )
}

function ListingsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  )
}

export default function MyListingsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Moje ogłoszenia</h1>
        <Button asChild size="sm">
          <Link href="/dashboard/listings/new">+ Nowe</Link>
        </Button>
      </div>
      <Suspense fallback={<ListingsSkeleton />}>
        <MyListingsList />
      </Suspense>
    </div>
  )
}
