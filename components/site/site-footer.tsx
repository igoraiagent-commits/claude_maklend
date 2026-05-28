import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t mt-auto py-8 text-sm text-muted-foreground">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 Maklend — wynajem rzeczy między ludźmi</p>
        <nav className="flex gap-4">
          <Link href="/categories" className="hover:text-foreground transition-colors">Kategorie</Link>
          <Link href="/listings" className="hover:text-foreground transition-colors">Ogłoszenia</Link>
          <Link href="/dashboard/listings/new" className="hover:text-foreground transition-colors">Dodaj ogłoszenie</Link>
        </nav>
      </div>
    </footer>
  )
}
