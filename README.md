# AQI Tools Management

A mobile-first web application for managing AQI equipment service records.

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui-inspired components
- PostgreSQL + Prisma ORM
- Auth.js (NextAuth v5) with LINE Login

## Setup

### 1. Clone and install
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Fill in:
- `DATABASE_URL` — your PostgreSQL connection string
- `AUTH_SECRET` — run `openssl rand -base64 32` to generate
- `NEXTAUTH_URL` — your app URL (for example `http://localhost:3000`)
- `LINE_CLIENT_ID` / `LINE_CLIENT_SECRET` — from LINE Developers console

### 3. LINE Login Setup
1. Go to [LINE Developers](https://developers.line.biz/)
2. Create a new channel → **LINE Login**
3. Set callback URL: `http://localhost:3000/api/auth/callback/line`
4. Copy Channel ID and Channel Secret

### 4. Database setup
```bash
# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed with test data
npx prisma db seed

# View data
npx prisma studio
```

### 5. Run development server
```bash
npm run dev
```

Open http://localhost:3000

## Build
```bash
npm run build
npm start
```

## Features
- LINE OAuth authentication
- Equipment CRUD (add/edit/soft-delete)
- Service records per equipment
- Date-based service view with quick scheduling
- Server-side search and filtering
- Mobile-first, rounded flat UI
