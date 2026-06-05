# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js with Turbopack)
npm run build    # Production build
npm run lint     # ESLint check
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=   # sb_publishable_... format (not anon key)
```

## Architecture

**Maklend** is a peer-to-peer rental marketplace for Wrocław, Poland. Polish UI (`pl-PL`), PLN currency, city locked to Wrocław.

### Next.js 16 — Critical Suspense Pattern

This project uses Next.js 16 with Partial Prerender. Any access to `cookies()`, `params`, `searchParams`, or `createClient()` from `@/lib/supabase/server` triggers `connection()` and will cause a "blocking route" error if called outside a Suspense boundary.

**The required pattern for every dynamic page:**
```tsx
// Page component — NOT async, passes Promise props directly
export default function SomePage({ params, searchParams }: Props) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Content params={params} searchParams={searchParams} />
    </Suspense>
  )
}

// Inner component — async, awaits everything inside Suspense
async function Content({ params, searchParams }: Props) {
  const { id } = await params        // await here, not in page
  const supabase = await createClient()
  // ... data fetching
}
```

### Middleware

Next.js 16 uses `proxy.ts` (not `middleware.ts`) at the root, exporting a `proxy` function. It calls `supabase.auth.getClaims()` (JWT-only, no network) and redirects unauthenticated users away from `/dashboard` and `/protected`.

### Supabase

- **Server client**: `@/lib/supabase/server` — async `createClient()`, uses `cookies()`, server-only
- **Client**: `@/lib/supabase/client` — sync `createClient()`, browser-only
- **Auth**: Uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (new format). Never use `service_role` key client-side.
- **Storage**: `listing-images` bucket; paths follow `listings/{listingId}/{uuid}.{ext}`; new listings upload to `listings/tmp/` before the ID is known

### Data Layer

```
lib/
  actions/      # "use server" mutations (createListing, createBooking, updateProfile, etc.)
  queries/      # Read-only Supabase queries returning typed results
  validators/   # Zod schemas (listing, profile) — error messages in Polish
  utils/
    format.ts   # formatPrice (PLN, pl-PL), formatDate, toDateString
    slug.ts     # generateSlug — transliterates Cyrillic + nanoid suffix
    filters.ts  # parseSearchParams, buildListingsQuery
```

Prices are stored as **integer cents** throughout. Always divide by 100 to display, multiply by 100 on input.

### Database Schema (key tables)

- `profiles` — auto-created via trigger on `auth.users` insert; linked 1:1 to `auth.users`
- `listings` — status: `draft | published | paused | archived`; `owner_id` FK to `profiles`
- `listing_images` — `storage_path` (relative, no base URL), `position` for ordering
- `bookings` — status: `confirmed | active | completed | cancelled`; date overlap prevented by DB function `create_booking`
- `categories` — `slug` and `icon` (lucide icon name string)

### Forms

- React Hook Form + `@hookform/resolvers` v5 (required for Zod v4 compatibility)
- `ListingForm` at `components/forms/listing-form.tsx` — handles both create and edit
- `ImageUploader` uploads directly to Supabase Storage from the browser before form submission
- City field is hardcoded to `Wrocław` (disabled select in UI, `z.literal("Wrocław")` in validator)

### Component Structure

- `components/site/` — `SiteHeader` (contains async `UserNav` inside `<Suspense>`), `SiteFooter`
- `components/listings/` — `ListingCard`, `ListingGrid`, `CategoryCard`
- `components/booking/` — `BookingPanel` (date picker + price calc), `BookingActions`, `BookingStatusBadge`
- `components/filters/` — `FilterSidebar`, `MobileFilterSheet`, `SortDropdown` (all client components using `useSearchParams`)
- `components/forms/` — `ListingForm`, `ImageUploader`, `ProfileForm`
- UI primitives from shadcn/ui in `components/ui/`

### Types

`types/db.ts` — generated Supabase TypeScript types. Use `Tables<"table_name">` helper. Regenerate with:
```bash
supabase gen types typescript --project-id klvyhksuhfuednaxmoep > types/db.ts
```
