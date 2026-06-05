import { Suspense } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/logout-button"
import { Search, Handshake } from "lucide-react"

async function UserNav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return (
      <>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/listings/new">+ Dodaj</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">Panel</Link>
        </Button>
        <LogoutButton />
      </>
    )
  }

  return (
    <>
      <Button asChild variant="ghost" size="sm">
        <Link href="/auth/login">Zaloguj się</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/auth/sign-up">Zarejestruj się</Link>
      </Button>
    </>
  )
}

export function SiteHeader() {
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Handshake className="h-4 w-4" />
          </div>
          Maklend
        </Link>

        <Link
          href="/listings"
          className="hidden sm:flex items-center gap-2 flex-1 max-w-sm border rounded-lg px-3 py-2 text-sm text-muted-foreground hover:border-foreground/30 transition-colors"
        >
          <Search className="h-4 w-4" />
          Szukaj ogłoszeń...
        </Link>

        <nav className="flex items-center gap-2 ml-auto">
          <Link href="/categories" className="hidden md:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors">
            Kategorie
          </Link>
          <Link href="/listings" className="hidden md:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors mr-2">
            Ogłoszenia
          </Link>
          <Suspense>
            <UserNav />
          </Suspense>
        </nav>
      </div>
    </header>
  )
}
