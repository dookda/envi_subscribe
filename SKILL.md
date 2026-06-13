---
name: envi-dashboard
description: Expert context for the Envi Dashboard project — Next.js config, basePath prefix, database schema, .env variables, Docker services, IoT API parameter codes, and alert pipeline. Use when working in the envi_dashboard repo.
---

# Envi Dashboard — Architecture & Best Practices

**App:** Envir Service · Environmental Quality Control Terminal  
**Stack:** Next.js 15 · Prisma v6 · PostgreSQL · Docker Compose · Auth.js v5 · LINE API  
**Root:** `/Users/sakdahomhuan/Dev/envi_dashboard`

---

## 1. Next.js `basePath` — The Golden Rule

This app is mounted at `/air` (set in `web/next.config.ts`).

**Rule:** Next.js injects `basePath` automatically into every `<Link>`, `redirect()`, and `router.push()`. You must never add it yourself.

```ts
// WRONG — double-prefixes to /air/air/dashboard
<Link href="/air/dashboard">

// CORRECT — Next.js adds /air automatically
<Link href="/dashboard">
redirect('/dashboard')
router.push('/stations')
```

**Exception — Auth.js bypasses the Next.js router**, so its paths need the full prefix:
```ts
pages: { signIn: '/air/login' }
redirectTo: '/air/dashboard'
callbackUrl: '/air/dashboard'
SessionProvider basePath="/air/api/auth"
```

**Client-side `fetch` also needs the full path** because `fetch` is not routed through Next.js:
```ts
fetch('/air/api/stations')
fetch('/air/api/readings/sync', { method: 'POST' })
```

> **Why it matters:** Forgetting this causes silent 404s or redirect loops that are hard to trace. Treat `/air/` as a deployment-time concern (like a CDN prefix), not an app-level concern.

---

## 2. Next.js 15 — Dynamic Route Params Are Promises

`params` in Next.js 15 App Router is a `Promise`, not a plain object.

```tsx
// WRONG (Next.js 13/14 style)
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params; // TypeError at runtime
}

// CORRECT — use React.use() in client components
import { use } from 'react';
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
}

// CORRECT — await in server components
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

> **Why it matters:** The error is a cryptic type mismatch, not "params is a Promise". Always type it correctly from the start.

---

## 3. Environment Variables — One File, Two Contexts

**Pattern:** Single `.env` at the **project root** shared by all services. Never create `web/.env`.

```
# Local dev — DB on localhost
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/envi_db

# Docker — hostname is the Compose service name
DATABASE_URL=postgresql://postgres:postgres@db:5432/envi_db
```

The difference between local and Docker is only the **hostname** (`localhost` vs the Compose service name `db`). Keep one variable; switch by context.

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres — `localhost:5432` locally, `db:5432` in Docker |
| `AUTH_SECRET` | Auth.js signing secret |
| `AUTH_GOOGLE_CLIENT_ID` / `AUTH_GOOGLE_CLIENT_SECRET` | Google OAuth |
| `NEXTAUTH_URL` / `AUTH_URL` | `http://localhost:3000/air/api/auth` |
| `AUTH_TRUST_HOST` | `true` in Docker (set in `docker-compose.yml`, not `.env`) |
| `APP_KEY` / `APP_SECRET` | IoT API credentials (SHA1 auth) |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Messaging API |
| `NEXT_PUBLIC_BASE_PATH` | `/air` — exposed to browser for static asset paths |

**`NEXT_PUBLIC_*` rule:** Only variables prefixed `NEXT_PUBLIC_` are available in the browser bundle. Use them for things like image base paths:
```tsx
<img src={`${process.env.NEXT_PUBLIC_BASE_PATH}/logo.png`} />
```

---

## 4. Database — Prisma Without a Migrations Folder

This project uses `db/init.sql` (raw SQL) as the schema source of truth for fresh installs, plus manual `ALTER TABLE` for live changes. There is no `prisma/migrations/` folder.

**Why:** Docker mounts `init.sql` on first run. Running `prisma migrate dev` requires a direct DB connection from the host machine, which is not available in this setup.

**Workflow for adding a column:**

```bash
# 1. Add the field to web/prisma/schema.prisma
# 2. Add the column DDL to db/init.sql (for future fresh installs)
# 3. Apply to the running container immediately:
docker exec envi_db psql -U postgres -d envi_db \
  -c 'ALTER TABLE "Reading" ADD COLUMN IF NOT EXISTS "col" DOUBLE PRECISION NOT NULL DEFAULT 0;'
# 4. Regenerate the Prisma client:
cd web && npx prisma generate
```

> **Key constraint:** `prisma generate` must run after every schema change — otherwise TypeScript types won't include the new field.

---

## 5. Docker Compose — Healthcheck-Based Startup Order

**Problem:** A worker/cron container that calls a web API will fail if it starts before the web server is ready. `depends_on: service_started` (the default) only waits for the container process to exist, not for the app inside to respond.

**Solution:** Add a `healthcheck` to the API service, then use `condition: service_healthy`:

```yaml
services:
  web:
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3000/air/api/stations || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  cron:
    depends_on:
      web:
        condition: service_healthy   # waits until the app actually responds
```

> **Apply to any project** where a consumer service (cron, worker, migrator) depends on an HTTP API being live before it starts.

---

## 6. Auth.js v5 with Next.js `basePath`

Auth.js does **not** read `basePath` from `next.config.ts`. Next.js strips the prefix before Auth.js sees the request, so Auth.js always sees paths without `/air`.

```ts
// auth.ts — do NOT set basePath here
export const { handlers, auth } = NextAuth({
  // basePath intentionally omitted — Next.js handles stripping it
  pages: { signIn: '/air/login' },   // full path required here (bypasses router)
});

// layout.tsx
<SessionProvider basePath="/air/api/auth">  // full path required here
```

**Middleware matcher** — write without the basePath (Next.js strips it before matching):
```ts
matcher: ['/((?!_next/static|_next/image|favicon.ico|login|api/auth).*)']
```

---

## 7. IoT Sensor API — SHA1 Auth Pattern

The HJ212-2017 API uses a time-based SHA1 signature. Regenerate headers on every request — signatures expire immediately.

```ts
function buildHeaders() {
  const timestamp = Date.now().toString();
  const rand = crypto.randomBytes(10).toString('hex').toUpperCase().slice(0, 10);
  const signature = crypto.createHash('sha1')
    .update(`${timestamp}_${rand}_${APP_SECRET}`)
    .digest('hex').toUpperCase();
  return { appkey: APP_KEY, timestamp, rand, signature };
}
// Usage: POST /api/hj212/querystatus.do?sn=<serial>&tp=2011
```

**Parameter code → DB field mapping** (`web/src/lib/enviApi.ts` `CODE_MAP`):

| Code | Parameter | Unit | DB field |
|------|-----------|------|----------|
| `a34004` | PM2.5 | µg/m³ | `pm25` |
| `a34002` | PM10 | µg/m³ | `pm10` |
| `a34001` | TSP | µg/m³ | `tsp` |
| `a01007` | Wind Speed | km/h | `windSpeed` |
| `a01008` | Wind Direction | ° | `windDirection` |
| `a01001` | Temperature | °C | `temperature` |
| `a01002` | Humidity | % | `humidity` |
| `a01006` | Atm. Pressure | hPa | *(not mapped)* |

> **Pattern:** Keep a single `CODE_MAP` as the source of truth. All parsing, debug pages, and sync routes derive from it — never hardcode codes elsewhere.

---

## 8. Air Quality Thresholds — Single Source of Truth

All threshold logic lives in `web/src/lib/airQuality.ts`. Never duplicate in components.

| Pollutant | Good (green) | Moderate (yellow) | Unhealthy (red) |
|-----------|-------------|-------------------|-----------------|
| PM2.5 | ≤ 20 µg/m³ | ≤ 37.5 µg/m³ | > 37.5 µg/m³ |
| PM10 | ≤ 50 µg/m³ | ≤ 100 µg/m³ | > 100 µg/m³ |
| TSP | ≤ 100 µg/m³ | ≤ 200 µg/m³ | > 200 µg/m³ |

**Pattern:** `getStatus(level)` returns `{ bgColor, textColor, label }` for inline dynamic coloring:
```tsx
const s = getStatus(pm25Level(r.pm25));
<div style={{ background: s.bgColor, color: s.textColor }}>{r.pm25}</div>
```

---

## 9. Route Map & Key Files

| Browser URL | File |
|-------------|------|
| `/air/dashboard` | `src/app/dashboard/page.tsx` |
| `/air/detail/[id]` | `src/app/detail/[id]/page.tsx` |
| `/air/stations` | `src/app/stations/page.tsx` |
| `/air/admin` | `src/app/admin/page.tsx` |
| `/air/debug` | `src/app/debug/page.tsx` |
| `/air/api/stations` | `src/app/api/stations/route.ts` |
| `/air/api/readings` | `src/app/api/readings/route.ts` |
| `/air/api/readings/sync` | `src/app/api/readings/sync/route.ts` |
| `/air/api/alert` | `src/app/api/alert/route.ts` |
| `/air/api/admin/config` | `src/app/api/admin/config/route.ts` |
| `/air/api/debug` | `src/app/api/debug/route.ts` |

---

## 10. Common Commands

```bash
# Start all services
docker compose up -d

# Rebuild web after code changes
docker compose up -d --build web

# View cron sync logs
docker compose logs -f cron

# Connect to DB
docker exec -it envi_db psql -U postgres -d envi_db

# Clear stale readings (e.g. after fixing parameter code mapping)
docker exec envi_db psql -U postgres -d envi_db -c 'TRUNCATE TABLE "Reading";'
```
