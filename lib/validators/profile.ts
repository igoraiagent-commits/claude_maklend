import { z } from "zod"

export const profileSchema = z.object({
  full_name: z.string().min(2, "Minimum 2 znaki").max(100),
  city: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  bio: z.string().max(500).optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
