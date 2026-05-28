import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ListingGrid } from "@/components/listings/listing-grid"
import { CategoryCard } from "@/components/listings/category-card"
import { Skeleton } from "@/components/ui/skeleton"
import { getFeaturedListings } from "@/lib/queries/listings"
import { getCategoriesWithCount } from "@/lib/queries/categories"

async function CategoriesSection() {
  const categories = await getCategoriesWithCount()
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {categories.slice(0, 10).map((cat) => (
        <CategoryCard key={cat.id} {...cat} />
      ))}
    </div>
  )
}

function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>
  )
}

async function FeaturedSection() {
  const featured = await getFeaturedListings()

  if (featured.length === 0) {
    return (
      <section className="container mx-auto px-4 py-8 pb-16 text-center text-muted-foreground">
        <p className="mb-4">Nie ma jeszcze ogłoszeń. Bądź pierwszy!</p>
        <Button asChild>
          <Link href="/dashboard/listings/new">Dodaj ogłoszenie</Link>
        </Button>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-8 pb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Popularne ogłoszenia</h2>
        <Link href="/listings" className="text-sm text-primary hover:underline">Wszystkie ogłoszenia</Link>
      </div>
      <ListingGrid listings={featured} />
    </section>
  )
}

function FeaturedSkeleton() {
  return (
    <section className="container mx-auto px-4 py-8 pb-16">
      <Skeleton className="h-8 w-64 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Wynajem rzeczy między ludźmi</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Znajdź i wynajmij narzędzia, sprzęt, akcesoria sportowe i wiele innych rzeczy w swojej okolicy
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/listings">Znajdź rzecz</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard/listings/new">Dodaj ogłoszenie</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Kategorie</h2>
          <Link href="/categories" className="text-sm text-primary hover:underline">Wszystkie kategorie</Link>
        </div>
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesSection />
        </Suspense>
      </section>

      {/* Featured listings */}
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedSection />
      </Suspense>
    </div>
  )
}
