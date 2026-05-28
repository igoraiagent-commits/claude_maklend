import Link from "next/link"
import {
  Wrench, Laptop, Camera, Leaf, Home, PartyPopper,
  Bike, Car, Music, Package,
} from "lucide-react"
import type { LucideProps } from "lucide-react"

const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  wrench: Wrench,
  laptop: Laptop,
  camera: Camera,
  leaf: Leaf,
  home: Home,
  "party-popper": PartyPopper,
  bike: Bike,
  car: Car,
  music: Music,
  package: Package,
}

interface Props {
  slug: string
  name: string
  description?: string | null
  icon?: string | null
  count: number
}

export function CategoryCard({ slug, name, description, icon, count }: Props) {
  const Icon = (icon && ICONS[icon]) ? ICONS[icon] : Package

  return (
    <Link href={`/categories/${slug}`} className="group block">
      <div className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-medium mb-1">{name}</h3>
        {description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{description}</p>}
        <p className="text-xs text-muted-foreground">{count} ogłoszeń</p>
      </div>
    </Link>
  )
}
