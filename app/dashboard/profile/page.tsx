import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/forms/profile-form"
import { Skeleton } from "@/components/ui/skeleton"

async function ProfileLoader() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single()

  if (!profile) return null
  return <ProfileForm profile={profile} />
}

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Mój profil</h1>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileLoader />
      </Suspense>
    </div>
  )
}
