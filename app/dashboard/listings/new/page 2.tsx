import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategories } from "@/lib/queries/categories"
import { ListingForm } from "@/components/forms/listing-form"

async function ListingFormLoader() {
  const categories = await getCategories()
  return <ListingForm categories={categories} />
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-28 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export default function NewListingPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Nowe ogłoszenie</h1>
      <Suspense fallback={<FormSkeleton />}>
        <ListingFormLoader />
      </Suspense>
    </div>
  )
}
