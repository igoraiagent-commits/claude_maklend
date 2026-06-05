"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { publishListing, pauseListing, archiveListing, deleteListing } from "@/lib/actions/listings"

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

  async function handleDelete() {
    setLoading(true)
    const result = await deleteListing(id)
    setLoading(false)
    if (result.error) toast.error(result.error)
    else toast.success("Ogłoszenie usunięte")
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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive" disabled={loading}>
            Usuń
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć ogłoszenie?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna. Ogłoszenie oraz wszystkie jego zdjęcia zostaną trwale usunięte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
