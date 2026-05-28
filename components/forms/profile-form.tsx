"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { profileSchema, type ProfileFormValues } from "@/lib/validators/profile"
import { updateProfile } from "@/lib/actions/profile"
import type { Tables } from "@/types/db"

export function ProfileForm({ profile }: { profile: Tables<"profiles"> }) {
  const [loading, setLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile.full_name ?? "",
      city: profile.city ?? "",
      phone: profile.phone ?? "",
      bio: profile.bio ?? "",
    },
  })

  async function onSubmit(values: ProfileFormValues) {
    setLoading(true)
    const result = await updateProfile(values)
    setLoading(false)
    if (result.error) toast.error(result.error)
    else toast.success("Profil zaktualizowany")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imię i nazwisko</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Miasto</FormLabel>
              <FormControl><Input placeholder="Wrocław" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <FormControl><Input placeholder="+48..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>O sobie</FormLabel>
              <FormControl><Textarea rows={3} placeholder="Kilka słów o sobie..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Zapisywanie..." : "Zapisz"}
        </Button>
      </form>
    </Form>
  )
}
