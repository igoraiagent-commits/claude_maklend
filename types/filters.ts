export type ListingSort = "newest" | "price_asc" | "price_desc"

export interface ListingFilters {
  q?: string
  category?: string
  city?: string
  min?: number
  max?: number
  from?: string
  to?: string
  sort?: ListingSort
  page?: number
}
