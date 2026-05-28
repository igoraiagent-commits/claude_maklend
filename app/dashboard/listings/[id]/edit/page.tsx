import { Suspense } from "react"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getListingById } from "@/lib/queries/listings"
import { getCategories } from "@/lib/queries/categories"
import { ListingForm } from "@/components/forms/listing-form"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
}

async function EditFormLoader({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [listing, categories] = await Promise.all([
    getListingById(id),
    getCategories(),
  ])

  if (!listing || listing.owner_id !== user?.id) notFound()

  return (
    <>
      {listing.status === "published" && (
        <div className="flex justify-end mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href={`/listings/${listing.slug}`} target="_blank">Podgląd</Link>
          </Button>
        </div>
      )}
      <ListingForm
        categories={categories}
        listing={listing}
        existingImages={listing.listing_images}
      />
    </>
  )
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
    </div>
  )
}

export default function EditListingPage({ params }: Props) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edycja ogłoszenia</h1>
      <Suspense fallback={<FormSkeleton />}>
        <EditFormLoader params={params} />
      </Suspense>
    </div>
  )
}
