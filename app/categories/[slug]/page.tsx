import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getCategoryBySlug, getCategories } from "@/lib/queries/categories"
import { getListings } from "@/lib/queries/listings"
import { ListingGrid } from "@/components/listings/listing-grid"
import { FilterSidebar } from "@/components/filters/filter-sidebar"
import { MobileFilterSheet } from "@/components/filters/mobile-filter-sheet"
import { SortDropdown } from "@/components/filters/sort-dropdown"
import { parseSearchParams } from "@/lib/utils/filters"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function CategoryContent({ params, searchParams }: Props) {
  const { slug } = await params
  const rawParams = await searchParams
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const filters = parseSearchParams({ ...rawParams, category: slug })
  const [listings, categories] = await Promise.all([
    getListings(filters),
    getCategories(),
  ])

  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">{category.name}</h1>
        <div className="flex items-center gap-2">
          <MobileFilterSheet categories={categories} />
          <SortDropdown />
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterSidebar categories={categories} />
        </aside>
        <div className="flex-1 min-w-0">
          <ListingGrid listings={listings} emptyMessage={`Brak ogłoszeń w kategorii "${category.name}"`} />
        </div>
      </div>
    </>
  )
}

function PageSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
      ))}
    </div>
  )
}

export default function CategoryPage({ params, searchParams }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground">
          ← Wszystkie kategorie
        </Link>
      </div>
      <Suspense fallback={<PageSkeleton />}>
        <CategoryContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
