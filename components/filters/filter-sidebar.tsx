"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { formatPrice } from "@/lib/utils/format"
import type { Category } from "@/lib/queries/categories"

const MAX_PRICE = 50000_00

interface Props {
  categories: Category[]
}

export function FilterSidebar({ categories }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [q, setQ] = useState(searchParams.get("q") ?? "")
  const [price, setPrice] = useState<[number, number]>([
    Number(searchParams.get("min") ?? 0),
    Number(searchParams.get("max") ?? MAX_PRICE),
  ])
  const [category, setCategory] = useState(searchParams.get("category") ?? "")

  useEffect(() => {
    setQ(searchParams.get("q") ?? "")
    setPrice([
      Number(searchParams.get("min") ?? 0),
      Number(searchParams.get("max") ?? MAX_PRICE),
    ])
    setCategory(searchParams.get("category") ?? "")
  }, [searchParams])

  function apply() {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (category) params.set("category", category)
    if (price[0] > 0) params.set("min", String(price[0]))
    if (price[1] < MAX_PRICE) params.set("max", String(price[1]))
    const sort = searchParams.get("sort")
    if (sort) params.set("sort", sort)
    router.replace(`${pathname}?${params.toString()}`)
  }

  function reset() {
    setQ("")
    setCategory("")
    setPrice([0, MAX_PRICE])
    router.replace(pathname)
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">Szukaj</Label>
        <Input
          placeholder="Czego szukasz?"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
        />
      </div>

      <div>
        <Label className="mb-2 block">Kategoria</Label>
        <div className="space-y-1">
          <button
            onClick={() => setCategory("")}
            className={`w-full text-left text-sm px-2 py-1 rounded transition-colors ${!category ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            Wszystkie
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.slug)}
              className={`w-full text-left text-sm px-2 py-1 rounded transition-colors ${category === c.slug ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Miasto</Label>
        <p className="text-sm px-2 py-1.5 rounded-md bg-muted text-muted-foreground">Wrocław</p>
      </div>

      <div>
        <Label className="mb-2 block">
          Cena za dzień: {formatPrice(price[0])} — {price[1] >= MAX_PRICE ? "dowolna" : formatPrice(price[1])}
        </Label>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={100_00}
          value={price}
          onValueChange={(v) => setPrice(v as [number, number])}
          className="mt-2"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={apply} className="flex-1">Zastosuj</Button>
        <Button onClick={reset} variant="outline">Resetuj</Button>
      </div>
    </div>
  )
}
