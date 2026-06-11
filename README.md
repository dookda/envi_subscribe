# AQI Tools Management

A mobile-first web application for managing AQI equipment service records.

## Layout
- `nextjs/` contains the Next.js app, UI components, auth, and Prisma client/server actions.
- `postgres/` contains the PostgreSQL schema, seed file, and Prisma config.
- `docker-compose.yml` starts the Next.js app and PostgreSQL together.

## Run With Docker
```bash
docker compose up --build
```

The app will be available at http://localhost:3000 and PostgreSQL at `localhost:5432`.

## Local Workflow
Run app and database commands from `nextjs/`.

```bash
cd nextjs
npm install
npm run dev
```

```bash
npm run db:migrate -- --name init
npm run db:seed
npm run db:studio
```

## Features
- LINE OAuth authentication
- Equipment CRUD (add/edit/soft-delete)
- Service records per equipment
- Date-based service view with quick scheduling
- Server-side search and filtering
- Mobile-first, rounded flat UI
