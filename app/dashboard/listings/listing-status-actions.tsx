"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { publishListing, pauseListing, archiveListing } from "@/lib/actions/listings"

export function ListingStatusActions({ id, status }: { id: string; status: string }) {
  const [loading, setLoading] = useState(false)

  async function run(fn: () => Promise<void>, label: string) {
    setLoading(true)
    try {
      await fn()
      toast.success(label)
    } catch {
      toast.error("Błąd")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-1">
      {status === "draft" && (
        <Button size="sm" disabled={loading} onClick={() => run(() => publishListing(id), "Opublikowano")}>
          Opublikuj
        </Button>
      )}
      {status === "published" && (
        <Button size="sm" variant="outline" disabled={loading} onClick={() => run(() => pauseListing(id), "Wstrzymano")}>
          Wstrzymaj
        </Button>
      )}
      {status === "paused" && (
        <Button size="sm" disabled={loading} onClick={() => run(() => publishListing(id), "Opublikowano")}>
          Wznów
        </Button>
      )}
      {status !== "archived" && (
        <Button size="sm" variant="ghost" disabled={loading} onClick={() => run(() => archiveListing(id), "Przeniesiono do archiwum")}>
          Archiwum
        </Button>
      )}
    </div>
  )
}
