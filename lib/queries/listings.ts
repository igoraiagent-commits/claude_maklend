import { createClient } from "@/lib/supabase/server"
import { buildListingsQuery } from "@/lib/utils/filters"
import type { ListingFilters } from "@/types/filters"
import type { Tables } from "@/types/db"

export type ListingRow = Tables<"listings">

export type ListingCard = {
  id: string
  slug: string
  title: string
  city: string
  price_per_day_cents: number
  deposit_cents: number | null
  cover_image_url: string | null
  min_rental_days: number | null
  max_rental_days: number | null
  created_at: string | null
  categories: { id: string; slug: string; name: string; icon: string | null } | null
  profiles: { id: string; full_name: string | null; avatar_url: string | null } | null
}

export type ListingDetail = ListingRow & {
  categories: { id: string; slug: string; name: string; icon: string | null } | null
  profiles: { id: string; full_name: string | null; avatar_url: string | null; city: string | null } | null
  listing_images: { id: string; storage_path: string; position: number | null }[]
}

export async function getListings(filters: ListingFilters): Promise<ListingCard[]> {
  const supabase = await createClient()
  const query = buildListingsQuery(supabase, filters)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as ListingCard[]
}

export async function getListingBySlug(slug: string): Promise<ListingDetail | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("listings")
    .select(`*, categories(id, slug, name, icon), profiles(id, full_name, avatar_url, city), listing_images(id, storage_path, position)`)
    .eq("slug", slug)
    .eq("status", "published")
    .single()
  return data as ListingDetail | null
}

export async function getListingById(id: string): Promise<ListingDetail | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("listings")
    .select(`*, categories(id, slug, name, icon), profiles(id, full_name, avatar_url, city), listing_images(id, storage_path, position)`)
    .eq("id", id)
    .single()
  return data as ListingDetail | null
}

export async function getFeaturedListings(): Promise<ListingCard[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("listings")
    .select(`id, slug, title, city, price_per_day_cents, deposit_cents, cover_image_url, min_rental_days, max_rental_days, created_at, categories(id, slug, name, icon), profiles(id, full_name, avatar_url)`)
    .eq("status", "published")
    .order("view_count", { ascending: false })
    .limit(8)
  return (data ?? []) as unknown as ListingCard[]
}

export async function getMyListings(): Promise<ListingRow[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getListingDisabledRanges(listingId: string): Promise<{ start_date: string; end_date: string }[]> {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]
  const { data } = await supabase
    .from("bookings")
    .select("start_date, end_date")
    .eq("listing_id", listingId)
    .in("status", ["confirmed", "active"])
    .gte("end_date", today)
  return data ?? []
}
