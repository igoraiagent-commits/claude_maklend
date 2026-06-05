"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroSearch() {
  const router = useRouter()
  const [q, setQ] = useState("")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set("q", q.trim())
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Szukaj: wiertarka, rower, namiot..."
          className="pl-10 h-12 text-base rounded-xl shadow-sm"
        />
      </div>
      <Button type="submit" size="lg" className="h-12 px-6 rounded-xl shrink-0">
        Szukaj
      </Button>
    </form>
  )
}
