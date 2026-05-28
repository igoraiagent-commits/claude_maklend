import Link from "next/link"

const NAV = [
  { href: "/dashboard", label: "Przegląd", exact: true },
  { href: "/dashboard/listings", label: "Moje ogłoszenia" },
  { href: "/dashboard/bookings", label: "Moje rezerwacje" },
  { href: "/dashboard/bookings/incoming", label: "Zapytania" },
  { href: "/dashboard/profile", label: "Profil" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <aside className="hidden md:block w-48 shrink-0">
          <nav className="space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">
          {/* Mobile nav */}
          <div className="md:hidden mb-6 flex gap-2 overflow-x-auto pb-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 px-3 py-1.5 text-sm rounded-full border hover:bg-muted transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
