# Jordan Bailey Brand App

Next.js brand app for Jordan Bailey with reels, bilingual positioning, direct contact actions, booking intake, and production-ready deployment support.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` and fill in the values you need.

Current environment variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `BOOKING_FROM_EMAIL`
- `BOOKING_TO_EMAIL`

## Supabase

Supabase is installed and ready through [lib/supabase.ts](./lib/supabase.ts).

- `createSupabaseBrowserClient()` for client components
- `createSupabaseServerClient()` for server-side reads with the anon key
- `createSupabaseAdminClient()` for privileged server-only work with the service role key

## Scripts

```bash
npm run dev
npm run lint
npm run build
```
