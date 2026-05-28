import { Suspense } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getListingBySlug, getListingDisabledRanges } from "@/lib/queries/listings"
import { BookingPanel } from "@/components/booking/booking-panel"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice, formatDate } from "@/lib/utils/format"
import { Badge } from "@/components/ui/badge"

interface Props {
  params: Promise<{ slug: string }>
}

async function ListingContent({ params }: Props) {
  const { slug } = await params
  const listing = await getListingBySlug(slug)
  if (!listing) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const disabledRanges = await getListingDisabledRanges(listing.id)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const images = listing.listing_images
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((img) => `${supabaseUrl}/storage/v1/object/public/listing-images/${img.storage_path}`)

  const coverImage = listing.cover_image_url
    ? `${supabaseUrl}/storage/v1/object/public/listing-images/${listing.cover_image_url}`
    : images[0] ?? null

  supabase.from("listings").update({ view_count: (listing.view_count ?? 0) + 1 }).eq("id", listing.id)

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left: images + details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Main image */}
        <div className="aspect-[16/9] relative rounded-xl overflow-hidden bg-muted">
          {coverImage ? (
            <Image src={coverImage} alt={listing.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <div key={i} className="relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border">
                <Image src={src} alt={`Zdjęcie ${i + 1}`} fill className="object-cover" sizes="80px" />
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div>
          {listing.categories && (
            <Badge variant="secondary" className="mb-2">{listing.categories.name}</Badge>
          )}
          <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
          <div className="flex items-center gap-1 text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span>{listing.city}</span>
          </div>
          <p className="text-muted-foreground whitespace-pre-line">{listing.description}</p>
        </div>

        {/* Rental terms */}
        <div className="rounded-xl border p-4 space-y-2">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Warunki wynajmu
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Min. czas</p>
              <p className="font-medium">{listing.min_rental_days ?? 1} dni</p>
            </div>
            {listing.max_rental_days && (
              <div>
                <p className="text-muted-foreground">Maks. czas</p>
                <p className="font-medium">{listing.max_rental_days} dni</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground">Kaucja</p>
              <p className="font-medium">
                {listing.deposit_cents ? formatPrice(listing.deposit_cents) : "Brak"}
              </p>
            </div>
          </div>
        </div>

        {/* Owner */}
        {listing.profiles && (
          <div className="rounded-xl border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-semibold shrink-0">
              {listing.profiles.full_name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="font-medium">{listing.profiles.full_name ?? "Anonimowy użytkownik"}</p>
              {listing.profiles.city && (
                <p className="text-sm text-muted-foreground">{listing.profiles.city}</p>
              )}
            </div>
            <p className="ml-auto text-xs text-muted-foreground">
              Od {formatDate(listing.created_at ?? new Date().toISOString())}
            </p>
          </div>
        )}
      </div>

      {/* Right: booking panel */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <BookingPanel
            listingId={listing.id}
            pricePerDay={listing.price_per_day_cents}
            depositCents={listing.deposit_cents ?? 0}
            minDays={listing.min_rental_days ?? 1}
            maxDays={listing.max_rental_days ?? null}
            disabledRanges={disabledRanges}
            isOwner={user?.id === listing.owner_id}
            isLoggedIn={!!user}
          />
        </div>
      </div>
    </div>
  )
}

function ListingPageSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="aspect-[16/9] rounded-xl" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-32 w-full" />
      </div>
      <div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  )
}

export default function ListingPage({ params }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/listings" className="text-sm text-muted-foreground hover:text-foreground">
          ← Powrót do ogłoszeń
        </Link>
      </div>
      <Suspense fallback={<ListingPageSkeleton />}>
        <ListingContent params={params} />
      </Suspense>
    </div>
  )
}
