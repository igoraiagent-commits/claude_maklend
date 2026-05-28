"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { X, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Props {
  listingId?: string
  value: string[]
  onChange: (paths: string[]) => void
  maxFiles?: number
}

export function ImageUploader({ listingId, value, onChange, maxFiles = 8 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    if (value.length + files.length > maxFiles) {
      toast.error(`Maksymalnie ${maxFiles} zdjęć`)
      return
    }

    setUploading(true)
    const supabase = createClient()
    const newPaths: string[] = []

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} — to nie jest zdjęcie`)
        continue
      }
      const ext = file.name.split(".").pop()
      const path = `listings/${listingId ?? "tmp"}/${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from("listing-images").upload(path, file, { upsert: false })
      if (error) {
        toast.error(`Błąd przesyłania: ${error.message}`)
      } else {
        newPaths.push(path)
      }
    }

    onChange([...value, ...newPaths])
    setUploading(false)
  }

  async function remove(path: string) {
    const supabase = createClient()
    await supabase.storage.from("listing-images").remove([path])
    onChange(value.filter((p) => p !== path))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {value.map((path) => (
          <div key={path} className="relative w-24 h-24 rounded-lg overflow-hidden border group">
            <Image
              src={`${supabaseUrl}/storage/v1/object/public/listing-images/${path}`}
              alt="Zdjęcie"
              fill
              className="object-cover"
              sizes="96px"
            />
            <button
              type="button"
              onClick={() => remove(path)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {value.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:border-foreground/40 transition-colors disabled:opacity-50"
          >
            <Upload className="h-5 w-5 mb-1" />
            <span className="text-xs">{uploading ? "..." : "Dodaj"}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="text-xs text-muted-foreground">
        {value.length} / {maxFiles} zdjęć. Pierwsze zdjęcie — okładka.
      </p>
    </div>
  )
}
