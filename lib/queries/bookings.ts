import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/types/db"

export type BookingRow = Tables<"bookings">

export type BookingWithListing = BookingRow & {
  listings: {
    id: string
    slug: string
    title: string
    cover_image_url: string | null
    city: string
  } | null
  renter: { id: string; full_name: string | null; avatar_url: string | null } | null
}

export async function getMyBookings(): Promise<BookingWithListing[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("bookings")
    .select(`*, listings(id, slug, title, cover_image_url, city), renter:profiles!bookings_renter_id_fkey(id, full_name, avatar_url)`)
    .eq("renter_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as BookingWithListing[]
}

export async function getIncomingBookings(): Promise<BookingWithListing[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("bookings")
    .select(`*, listings(id, slug, title, cover_image_url, city), renter:profiles!bookings_renter_id_fkey(id, full_name, avatar_url)`)
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as BookingWithListing[]
}
