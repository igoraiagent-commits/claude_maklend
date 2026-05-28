import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"
import { formatPrice } from "@/lib/utils/format"
import type { ListingCard } from "@/lib/queries/listings"

interface Props {
  listing: ListingCard
}

export function ListingCard({ listing }: Props) {
  const imageUrl = listing.cover_image_url
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${listing.cover_image_url}`
    : null

  return (
    <Link href={`/listings/${listing.slug}`} className="group block">
      <div className="rounded-xl overflow-hidden border bg-card hover:shadow-md transition-shadow">
        <div className="aspect-[4/3] relative bg-muted overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl">
              📦
            </div>
          )}
          {listing.categories && (
            <span className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full">
              {listing.categories.name}
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm line-clamp-2 mb-1">{listing.title}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{listing.city}</span>
          </div>
          <p className="text-sm font-semibold">
            {formatPrice(listing.price_per_day_cents)}
            <span className="text-muted-foreground font-normal"> / dzień</span>
          </p>
        </div>
      </div>
    </Link>
  )
}
