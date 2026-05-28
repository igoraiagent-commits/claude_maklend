import { z } from "zod"

export const listingSchema = z.object({
  title: z.string().min(5, "Minimum 5 znaków").max(120, "Maksimum 120 znaków"),
  description: z.string().min(20, "Minimum 20 znaków").max(3000),
  category_id: z.string().uuid("Wybierz kategorię"),
  price_per_day_cents: z.number().int().min(100, "Minimalna cena — 1 zł"),
  deposit_cents: z.number().int().min(0),
  city: z.literal("Wrocław"),
  address_hint: z.string().max(200).optional(),
  min_rental_days: z.number().int().min(1),
  max_rental_days: z.number().int().min(1).nullable().optional(),
})

export type ListingFormValues = z.infer<typeof listingSchema>
