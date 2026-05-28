import { ListingCard } from "./listing-card"
import type { ListingCard as ListingCardType } from "@/lib/queries/listings"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Props {
  listings: ListingCardType[]
  emptyMessage?: string
}

export function ListingGrid({ listings, emptyMessage }: Props) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg mb-4">{emptyMessage ?? "Nie znaleziono ogłoszeń"}</p>
        <Button asChild variant="outline">
          <Link href="/listings">Wyczyść filtry</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
