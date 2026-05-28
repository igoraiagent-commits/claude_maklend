"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createBooking(
  listingId: string,
  startDate: string,
  endDate: string,
  notes?: string
): Promise<{ error?: string; booking?: { id: string } }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Wymagane logowanie" }

  const { data, error } = await supabase.rpc("create_booking", {
    p_listing_id: listingId,
    p_start_date: startDate,
    p_end_date: endDate,
    p_notes: notes,
  })

  if (error) return { error: error.message }

  const result = data as { error?: string; booking?: { id: string } }
  if (result.error) return { error: result.error }

  revalidatePath("/dashboard/bookings")
  return { booking: result.booking }
}

export async function cancelBooking(bookingId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Brak autoryzacji" }

  const { data, error } = await supabase.rpc("cancel_booking", {
    p_booking_id: bookingId,
  })

  if (error) return { error: error.message }
  const result = data as { error?: string; ok?: boolean }
  if (result.error) return { error: result.error }

  revalidatePath("/dashboard/bookings")
  revalidatePath("/dashboard/bookings/incoming")
  return {}
}

export async function markBookingActive(bookingId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("mark_booking_active", {
    p_booking_id: bookingId,
  })
  if (error) return { error: error.message }
  const result = data as { error?: string }
  if (result.error) return { error: result.error }
  revalidatePath("/dashboard/bookings/incoming")
  return {}
}

export async function markBookingCompleted(bookingId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("mark_booking_completed", {
    p_booking_id: bookingId,
  })
  if (error) return { error: error.message }
  const result = data as { error?: string }
  if (result.error) return { error: result.error }
  revalidatePath("/dashboard/bookings/incoming")
  return {}
}
