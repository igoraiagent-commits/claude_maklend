import { Suspense } from "react"
import { ListingGrid } from "@/components/listings/listing-grid"
import { FilterSidebar } from "@/components/filters/filter-sidebar"
import { MobileFilterSheet } from "@/components/filters/mobile-filter-sheet"
import { SortDropdown } from "@/components/filters/sort-dropdown"
import { getListings } from "@/lib/queries/listings"
import { getCategories } from "@/lib/queries/categories"
import { parseSearchParams } from "@/lib/utils/filters"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function ListingsContent({ searchParams }: Props) {
  const params = await searchParams
  const filters = parseSearchParams(params)
  const [listings, categories] = await Promise.all([
    getListings(filters),
    getCategories(),
  ])

  return (
    <>
      <div className="flex items-center gap-2 mb-6 justify-end">
        <MobileFilterSheet categories={categories} />
        <SortDropdown />
      </div>
      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterSidebar categories={categories} />
        </aside>
        <div className="flex-1 min-w-0">
          <ListingGrid listings={listings} />
        </div>
      </div>
    </>
  )
}

function ListingsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
      ))}
    </div>
  )
}

export default function ListingsPage({ searchParams }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Ogłoszenia</h1>
      <Suspense fallback={<ListingsSkeleton />}>
        <ListingsContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
