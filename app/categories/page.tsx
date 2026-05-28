import { Suspense } from "react"
import { CategoryCard } from "@/components/listings/category-card"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoriesWithCount } from "@/lib/queries/categories"

async function CategoriesList() {
  const categories = await getCategoriesWithCount()
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} {...cat} />
      ))}
    </div>
  )
}

function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 15 }).map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Wszystkie kategorie</h1>
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesList />
      </Suspense>
    </div>
  )
}
