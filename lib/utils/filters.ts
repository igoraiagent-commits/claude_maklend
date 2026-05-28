import type { ListingFilters, ListingSort } from "@/types/filters"

const PAGE_SIZE = 24

export function parseSearchParams(params: Record<string, string | string[] | undefined>): ListingFilters {
  const get = (key: string) => {
    const v = params[key]
    return Array.isArray(v) ? v[0] : v
  }

  return {
    q: get("q") || undefined,
    category: get("category") || undefined,
    city: get("city") || undefined,
    min: get("min") ? Number(get("min")) : undefined,
    max: get("max") ? Number(get("max")) : undefined,
    from: get("from") || undefined,
    to: get("to") || undefined,
    sort: (get("sort") as ListingSort) || "newest",
    page: get("page") ? Number(get("page")) : 1,
  }
}

export function buildListingsQuery(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  filters: ListingFilters,
) {
  let query = supabase
    .from("listings")
    .select(
      `id, slug, title, city, price_per_day_cents, deposit_cents, cover_image_url, min_rental_days, max_rental_days, created_at,
       categories(id, slug, name, icon),
       profiles(id, full_name, avatar_url)`,
    )
    .eq("status", "published")

  if (filters.q) {
    query = query.textSearch("search_tsv", filters.q, { type: "websearch" })
  }

  if (filters.category) {
    query = query.eq("categories.slug", filters.category)
  }

  if (filters.city) {
    query = query.ilike("city", `%${filters.city}%`)
  }

  if (filters.min !== undefined) {
    query = query.gte("price_per_day_cents", filters.min)
  }

  if (filters.max !== undefined) {
    query = query.lte("price_per_day_cents", filters.max)
  }

  if (filters.sort === "price_asc") {
    query = query.order("price_per_day_cents", { ascending: true })
  } else if (filters.sort === "price_desc") {
    query = query.order("price_per_day_cents", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const page = filters.page ?? 1
  const from = (page - 1) * PAGE_SIZE
  query = query.range(from, from + PAGE_SIZE - 1)

  return query
}
