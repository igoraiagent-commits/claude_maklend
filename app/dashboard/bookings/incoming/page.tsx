import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { getIncomingBookings } from "@/lib/queries/bookings"
import { BookingStatusBadge } from "@/components/booking/booking-status-badge"
import { BookingActions } from "@/components/booking/booking-actions"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice, formatDate } from "@/lib/utils/format"

async function IncomingBookingsList() {
  const bookings = await getIncomingBookings()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  if (bookings.length === 0) {
    return <p className="text-muted-foreground py-12 text-center">Brak zapytań</p>
  }

  return (
    <div className="space-y-4">
      {bookings.map((b) => {
        const listing = b.listings
        const renter = b.renter
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
              <p className="text-sm text-muted-foreground mb-1">
                Najemca: {renter?.full_name ?? "Anonim"}
              </p>
              <p className="text-sm">
                {formatDate(b.start_date)} — {formatDate(b.end_date)} · {b.days} dni
              </p>
              <p className="text-sm font-medium mt-1">{formatPrice(b.total_cents)}</p>
              {b.notes && (
                <p className="text-sm text-muted-foreground mt-1 italic">"{b.notes}"</p>
              )}
              <div className="mt-3">
                <BookingActions
                  bookingId={b.id}
                  status={b.status}
                  startDate={b.start_date}
                  isOwner={true}
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

export default function IncomingBookingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Zapytania o wynajem</h1>
      <Suspense fallback={<BookingsSkeleton />}>
        <IncomingBookingsList />
      </Suspense>
    </div>
  )
}
