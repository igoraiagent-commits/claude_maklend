import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { getMyBookings } from "@/lib/queries/bookings"
import { BookingStatusBadge } from "@/components/booking/booking-status-badge"
import { BookingActions } from "@/components/booking/booking-actions"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice, formatDate } from "@/lib/utils/format"

async function MyBookingsList() {
  const bookings = await getMyBookings()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="mb-4">Nie masz jeszcze żadnych rezerwacji</p>
        <Link href="/listings" className="text-primary hover:underline">Przeglądaj ogłoszenia</Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((b) => {
        const listing = b.listings
        const coverUrl = listing?.cover_image_url
          ? `${supabaseUrl}/storage/v1/object/public/listing-images/${listing.cover_image_url}`
          : null

        return (
          <div key={b.id} className="border rounded-xl p-4 flex gap-4">
            {coverUrl && (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                <Image src={coverUrl} alt={listing?.title ?? ""} fill className="object-cover" sizes="80px" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <Link href={`/listings/${listing?.slug}`} className="font-medium hover:underline truncate">
                  {listing?.title}
                </Link>
                <BookingStatusBadge status={b.status} />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{listing?.city}</p>
              <p className="text-sm">
                {formatDate(b.start_date)} — {formatDate(b.end_date)} · {b.days} dni
              </p>
              <p className="text-sm font-medium mt-1">{formatPrice(b.total_cents)}</p>
              <div className="mt-3">
                <BookingActions
                  bookingId={b.id}
                  status={b.status}
                  startDate={b.start_date}
                  isOwner={false}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function BookingsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
  )
}

export default function MyBookingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Moje rezerwacje</h1>
      <Suspense fallback={<BookingsSkeleton />}>
        <MyBookingsList />
      </Suspense>
    </div>
  )
}
