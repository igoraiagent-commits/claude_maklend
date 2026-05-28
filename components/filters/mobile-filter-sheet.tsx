"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import { FilterSidebar } from "./filter-sidebar"
import type { Category } from "@/lib/queries/categories"

export function MobileFilterSheet({ categories }: { categories: Category[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtry
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtry</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FilterSidebar categories={categories} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
