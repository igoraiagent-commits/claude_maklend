import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/types/db"

export type Category = Tables<"categories">

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")

  if (error) throw error
  return data ?? []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()
  return data
}

export async function getCategoriesWithCount(): Promise<(Category & { count: number })[]> {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")

  if (!categories) return []

  const { data: counts } = await supabase
    .from("listings")
    .select("category_id")
    .eq("status", "published")

  const countMap: Record<string, number> = {}
  for (const row of counts ?? []) {
    countMap[row.category_id] = (countMap[row.category_id] ?? 0) + 1
  }

  return categories.map((c) => ({ ...c, count: countMap[c.id] ?? 0 }))
}
