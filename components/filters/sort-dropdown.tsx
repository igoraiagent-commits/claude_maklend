"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const OPTIONS = [
  { value: "newest", label: "Najnowsze" },
  { value: "price_asc", label: "Cena: rosnąco" },
  { value: "price_desc", label: "Cena: malejąco" },
]

export function SortDropdown() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get("sort") ?? "newest"

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    params.delete("page")
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
