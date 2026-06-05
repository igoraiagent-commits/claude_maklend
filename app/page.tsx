import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ListingGrid } from "@/components/listings/listing-grid"
import { CategoryCard } from "@/components/listings/category-card"
import { Skeleton } from "@/components/ui/skeleton"
import { getFeaturedListings } from "@/lib/queries/listings"
import { getCategoriesWithCount } from "@/lib/queries/categories"
import { HeroSearch } from "@/components/site/hero-search"
import { Search, ShieldCheck, Star, Users } from "lucide-react"

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
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20 px-4 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

        <div className="container mx-auto text-center max-w-2xl relative">
          <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Wynajem między ludźmi
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight tracking-tight">
            Wynajmij, czego <br className="hidden sm:block" />
            <span className="text-primary">potrzebujesz</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            Narzędzia, sprzęt sportowy, elektronika i wiele więcej — za ułamek ceny zakupu
          </p>

          {/* Search bar */}
          <HeroSearch />

          <p className="mt-4 text-sm text-muted-foreground">
            Masz coś do wynajęcia?{" "}
            <Link href="/dashboard/listings/new" className="text-primary hover:underline font-medium">
              Dodaj ogłoszenie →
            </Link>
          </p>
        </div>
      </section>

      {/* Stats trust strip */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Ogłoszenia w Wrocławiu</p>
                <p className="text-xs text-muted-foreground">Sprzęt blisko Ciebie</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Bezpieczne rezerwacje</p>
                <p className="text-xs text-muted-foreground">Potwierdzenie online</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Zarabiaj na sprzęcie</p>
                <p className="text-xs text-muted-foreground">Wynajmuj rzeczy, które masz</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-2">Jak to działa?</h2>
        <p className="text-center text-muted-foreground mb-12">Wynajęcie zajmuje mniej niż minutę</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg">
              1
            </div>
            <h3 className="font-semibold text-base">Znajdź ogłoszenie</h3>
            <p className="text-sm text-muted-foreground">
              Wyszukaj potrzebny sprzęt lub przeglądaj kategorie dostępne we Wrocławiu
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg">
              2
            </div>
            <h3 className="font-semibold text-base">Zarezerwuj termin</h3>
            <p className="text-sm text-muted-foreground">
              Wybierz daty, sprawdź cenę i wyślij prośbę o rezerwację do właściciela
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg">
              3
            </div>
            <h3 className="font-semibold text-base">Odbierz i korzystaj</h3>
            <p className="text-sm text-muted-foreground">
              Po potwierdzeniu rezerwacji umów się na odbiór i ciesz się sprzętem
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Kategorie</h2>
            <Link href="/categories" className="text-sm text-primary hover:underline">Wszystkie kategorie</Link>
          </div>
          <Suspense fallback={<CategoriesSkeleton />}>
            <CategoriesSection />
          </Suspense>
        </div>
      </section>

      {/* Featured listings */}
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedSection />
      </Suspense>
    </div>
  )
}
