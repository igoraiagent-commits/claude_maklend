"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { listingSchema, type ListingFormValues } from "@/lib/validators/listing"
import { createListing, updateListing } from "@/lib/actions/listings"
import { ImageUploader } from "./image-uploader"
import type { Category } from "@/lib/queries/categories"
import type { ListingRow } from "@/lib/queries/listings"

interface Props {
  categories: Category[]
  listing?: ListingRow
  existingImages?: { storage_path: string }[]
}

export function ListingForm({ categories, listing, existingImages }: Props) {
  const router = useRouter()
  const [images, setImages] = useState<string[]>(
    existingImages?.map((i) => i.storage_path) ?? []
  )
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: listing?.title ?? "",
      description: listing?.description ?? "",
      category_id: listing?.category_id ?? "",
      price_per_day_cents: listing?.price_per_day_cents ?? 0,
      deposit_cents: listing?.deposit_cents ?? 0,
      city: "Wrocław",
      address_hint: listing?.address_hint ?? "",
      min_rental_days: listing?.min_rental_days ?? 1,
      max_rental_days: listing?.max_rental_days ?? undefined,
    },
  })

  async function onSubmit(values: ListingFormValues) {
    if (images.length === 0) {
      toast.error("Dodaj co najmniej jedno zdjęcie")
      return
    }
    setSubmitting(true)
    try {
      if (listing) {
        await updateListing(listing.id, values, images)
        toast.success("Ogłoszenie zaktualizowane")
      } else {
        const result = await createListing(values, images)
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success("Ogłoszenie utworzone")
          router.push("/dashboard/listings")
        }
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Błąd")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label className="mb-2 block">Zdjęcia (min. 1, maks. 8)</Label>
          <ImageUploader
            listingId={listing?.id}
            value={images}
            onChange={setImages}
            maxFiles={8}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tytuł</FormLabel>
              <FormControl><Input placeholder="Wiertarka Bosch, szlifierka, drabina..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opis</FormLabel>
              <FormControl>
                <Textarea placeholder="Szczegółowy opis stanu, wyposażenia i warunków wynajmu..." rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategoria</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Wybierz kategorię" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Miasto</FormLabel>
            <Select value="wroclaw" disabled>
              <SelectTrigger>
                <SelectValue>Wrocław</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wroclaw">Wrocław</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price_per_day_cents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cena za dzień (zł)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="50"
                    value={field.value ? field.value / 100 : ""}
                    onChange={(e) => field.onChange(Math.round(Number(e.target.value) * 100))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deposit_cents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kaucja (zł, 0 = bez kaucji)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={field.value ? field.value / 100 : ""}
                    onChange={(e) => field.onChange(Math.round(Number(e.target.value) * 100))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="min_rental_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min. dni wynajmu</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_rental_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maks. dni (opcjonalnie)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Bez limitu"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address_hint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wskazówka dotycząca adresu (niepubliczna)</FormLabel>
              <FormControl>
                <Input placeholder="Podana po potwierdzeniu rezerwacji" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Zapisywanie..." : listing ? "Zapisz zmiany" : "Utwórz ogłoszenie"}
        </Button>
      </form>
    </Form>
  )
}
