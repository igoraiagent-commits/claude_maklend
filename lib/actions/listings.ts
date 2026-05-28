"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { generateSlug } from "@/lib/utils/slug"
import type { ListingFormValues } from "@/lib/validators/listing"

export async function createListing(values: ListingFormValues, imageUrls: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Brak autoryzacji")

  const slug = generateSlug(values.title)

  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
      owner_id: user.id,
      category_id: values.category_id,
      title: values.title,
      slug,
      description: values.description,
      price_per_day_cents: values.price_per_day_cents,
      deposit_cents: values.deposit_cents ?? 0,
      city: values.city,
      address_hint: values.address_hint,
      min_rental_days: values.min_rental_days ?? 1,
      max_rental_days: values.max_rental_days ?? null,
      cover_image_url: imageUrls[0] ?? null,
      status: "draft",
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  if (imageUrls.length > 0) {
    await supabase.from("listing_images").insert(
      imageUrls.map((path, i) => ({
        listing_id: listing.id,
        storage_path: path,
        position: i,
      }))
    )
  }

  revalidatePath("/dashboard/listings")
  redirect(`/dashboard/listings/${listing.id}/edit`)
}

export async function updateListing(id: string, values: ListingFormValues, imageUrls: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Brak autoryzacji")

  const { error } = await supabase
    .from("listings")
    .update({
      category_id: values.category_id,
      title: values.title,
      description: values.description,
      price_per_day_cents: values.price_per_day_cents,
      deposit_cents: values.deposit_cents ?? 0,
      city: values.city,
      address_hint: values.address_hint,
      min_rental_days: values.min_rental_days ?? 1,
      max_rental_days: values.max_rental_days ?? null,
      cover_image_url: imageUrls[0] ?? null,
    })
    .eq("id", id)
    .eq("owner_id", user.id)

  if (error) throw new Error(error.message)

  if (imageUrls.length > 0) {
    await supabase.from("listing_images").delete().eq("listing_id", id)
    await supabase.from("listing_images").insert(
      imageUrls.map((path, i) => ({
        listing_id: id,
        storage_path: path,
        position: i,
      }))
    )
  }

  revalidatePath("/dashboard/listings")
  revalidatePath(`/dashboard/listings/${id}/edit`)
}

export async function publishListing(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Brak autoryzacji")

  const { error } = await supabase
    .from("listings")
    .update({ status: "published" })
    .eq("id", id)
    .eq("owner_id", user.id)

  if (error) throw new Error(error.message)
  revalidatePath("/dashboard/listings")
  revalidatePath("/listings")
}

export async function pauseListing(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Brak autoryzacji")

  const { error } = await supabase
    .from("listings")
    .update({ status: "paused" })
    .eq("id", id)
    .eq("owner_id", user.id)

  if (error) throw new Error(error.message)
  revalidatePath("/dashboard/listings")
}

export async function archiveListing(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Brak autoryzacji")

  const { error } = await supabase
    .from("listings")
    .update({ status: "archived" })
    .eq("id", id)
    .eq("owner_id", user.id)

  if (error) throw new Error(error.message)
  revalidatePath("/dashboard/listings")
}
