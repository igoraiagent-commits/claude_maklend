"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cancelBooking, markBookingActive, markBookingCompleted } from "@/lib/actions/bookings"

interface Props {
  bookingId: string
  status: string
  startDate: string
  isOwner: boolean
}

export function BookingActions({ bookingId, status, startDate, isOwner }: Props) {
  const [loading, setLoading] = useState(false)

  const canCancel = status === "confirmed" && new Date(startDate) > new Date()
  const canMarkActive = isOwner && status === "confirmed"
  const canComplete = isOwner && status === "active"

  async function run(fn: () => Promise<{ error?: string }>, label: string) {
    setLoading(true)
    const res = await fn()
    setLoading(false)
    if (res.error) toast.error(res.error)
    else toast.success(label)
  }

  if (!canCancel && !canMarkActive && !canComplete) return null

  return (
    <div className="flex gap-2 flex-wrap">
      {canCancel && (
        <Button
          size="sm"
          variant="destructive"
          disabled={loading}
          onClick={() => run(() => cancelBooking(bookingId), "Rezerwacja anulowana")}
        >
          Anuluj
        </Button>
      )}
      {canMarkActive && (
        <Button
          size="sm"
          variant="secondary"
          disabled={loading}
          onClick={() => run(() => markBookingActive(bookingId), "Status: aktywna")}
        >
          Oznacz jako aktywną
        </Button>
      )}
      {canComplete && (
        <Button
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={() => run(() => markBookingCompleted(bookingId), "Wynajem zakończony")}
        >
          Zakończ
        </Button>
      )}
    </div>
  )
}
