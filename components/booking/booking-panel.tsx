"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPrice, toDateString } from "@/lib/utils/format"
import { createBooking } from "@/lib/actions/bookings"
import type { DateRange } from "react-day-picker"
import { addDays, eachDayOfInterval, parseISO } from "date-fns"

interface Props {
  listingId: string
  pricePerDay: number
  depositCents: number
  minDays: number
  maxDays: number | null
  disabledRanges: { start_date: string; end_date: string }[]
  isOwner: boolean
  isLoggedIn: boolean
}

export function BookingPanel({
  listingId,
  pricePerDay,
  depositCents,
  minDays,
  maxDays,
  disabledRanges,
  isOwner,
  isLoggedIn,
}: Props) {
  const router = useRouter()
  const [range, setRange] = useState<DateRange | undefined>()
  const [loading, setLoading] = useState(false)

  const disabledDays = disabledRanges.flatMap(({ start_date, end_date }) =>
    eachDayOfInterval({ start: parseISO(start_date), end: parseISO(end_date) })
  )

  const days =
    range?.from && range?.to
      ? Math.round((range.to.getTime() - range.from.getTime()) / 86400000) + 1
      : 0

  const total = days * pricePerDay
  const validRange = days >= minDays && (maxDays === null || days <= maxDays)

  async function handleBook() {
    if (!range?.from || !range?.to || !validRange) return
    setLoading(true)
    const result = await createBooking(
      listingId,
      toDateString(range.from),
      toDateString(range.to),
    )
    setLoading(false)

    if (result.error) {
      const msgs: Record<string, string> = {
        dates_overlap: "Te daty są już zarezerwowane",
        below_min_days: `Minimalny czas wynajmu: ${minDays} dni`,
        above_max_days: `Maksymalny czas wynajmu: ${maxDays} dni`,
        start_date_in_past: "Data początkowa już minęła",
        cannot_book_own_listing: "Nie możesz zarezerwować własnego ogłoszenia",
      }
      toast.error(msgs[result.error] ?? result.error)
    } else {
      toast.success("Rezerwacja potwierdzona!")
      router.push("/dashboard/bookings")
    }
  }

  if (isOwner) {
    return (
      <div className="rounded-xl border p-4 bg-muted text-sm text-muted-foreground text-center">
        To jest Twoje ogłoszenie
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border p-4 text-center space-y-3">
        <p className="text-sm text-muted-foreground">Zaloguj się, aby zarezerwować</p>
        <Button asChild className="w-full">
          <a href="/auth/login">Zaloguj się</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border p-4 space-y-4">
      <p className="font-semibold">
        {formatPrice(pricePerDay)}
        <span className="text-muted-foreground font-normal text-sm"> / dzień</span>
      </p>

      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        disabled={[{ before: addDays(new Date(), 1) }, ...disabledDays]}
        numberOfMonths={1}
        className="rounded-md border p-0"
      />

      {days > 0 && (
        <>
          <Separator />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>{formatPrice(pricePerDay)} × {days} dni</span>
              <span>{formatPrice(total)}</span>
            </div>
            {depositCents > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Kaucja</span>
                <span>{formatPrice(depositCents)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Łącznie</span>
              <span>{formatPrice(total + depositCents)}</span>
            </div>
            {!validRange && (
              <p className="text-destructive text-xs">
                {days < minDays
                  ? `Minimum ${minDays} dni`
                  : `Maksimum ${maxDays} dni`}
              </p>
            )}
          </div>
        </>
      )}

      <Button
        className="w-full"
        disabled={!range?.from || !range?.to || !validRange || loading}
        onClick={handleBook}
      >
        {loading ? "Przetwarzanie..." : "Zarezerwuj"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Płatność gotówką przy odbiorze
      </p>
    </div>
  )
}
