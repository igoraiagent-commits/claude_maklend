"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { ProfileFormValues } from "@/lib/validators/profile"

export async function updateProfile(values: ProfileFormValues): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Brak autoryzacji" }

  const { error } = await supabase
    .from("profiles")
    .update(values)
    .eq("id", user.id)

  if (error) return { error: error.message }
  revalidatePath("/dashboard/profile")
  return {}
}
