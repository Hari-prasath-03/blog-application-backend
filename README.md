# Rival Assessment Backend

NestJS + Prisma + PostgreSQL backend for authentication, user management, private blog management, and public blog feed endpoints.

## Tech Stack

- **Framework**: NestJS 11 (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma 7 + `@prisma/adapter-pg`
- **Auth**: JWT access/refresh flow with Passport
- **Validation**: `class-validator` + global `ValidationPipe`
- **API Docs**: Swagger at `/api/docs`

---

## Setup Instructions

### 1) Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 14+

### 2) Install dependencies

```bash
pnpm install
```

### 3) Create environment file

Create `.env` in project root:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rival_assessment
PORT=8080
NODE_ENV=development

JWT_SECRET=replace-with-strong-secret
JWT_EXPIRES=3600
JWT_REFRESH_SECRET=replace-with-strong-refresh-secret

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

### 4) Run database migrations

```bash
pnpm prisma migrate deploy
```

For local schema changes during development:

```bash
pnpm prisma migrate dev
```

### 5) Start the API

```bash
# development
pnpm dev

# production build
pnpm build
pnpm start:prod
```

### 6) Verify app is running

- API base URL: `http://localhost:8080/api/v1`
- Swagger docs: `http://localhost:8080/api/docs`

### 7) Run tests

```bash
pnpm test
pnpm test:e2e
```

---

## Architecture Explanation

### High-level structure

- `src/main.ts`
  - App bootstrap
  - Global route prefix: `/api/v1`
  - Global validation and CORS
  - Swagger setup
- `src/app.module.ts`
  - Root module wiring: `AuthModule`, `UsersModule`, `BlogsModule`, `PublicModule`, `PrismaModule`
- `src/prisma`
  - Prisma client lifecycle (`connect/disconnect`) and DB access
- `src/common`
  - Cross-cutting concerns: guards, decorators, request typing
- `src/modules/*`
  - Feature modules with clear controller/service split

### Request flow

1. Request enters controller (`auth`, `users`, `blogs`, or `public`).
2. Guards/decorators enforce auth and role checks where needed.
3. DTO validation runs through global `ValidationPipe`.
4. Service performs domain logic and reads/writes via `PrismaService`.
5. Response DTO shape is returned.

### Data model (Prisma)

- `User`
  - identity, role, credentials, refresh token
- `Blog`
  - author-owned content with `isPublished` + `publishedAt`
- `Like`
  - unique per `(userId, blogId)`
- `Comment`
  - user comment on blog with paging support

### API boundaries

- **Private API** (`/blogs`, `/users`) requires JWT auth.
- **Public API** (`/public`) serves published content only.
- **Auth API** (`/auth`) handles register/login/refresh/logout.

---

## Tradeoffs Made

- **Monolithic module design** over microservices
  - Faster delivery and simpler local development
  - Tradeoff: tighter coupling at scale

- **Prisma ORM** over raw SQL
  - Faster iteration and type-safe queries
  - Tradeoff: less control for highly specialized query tuning

- **JWT stateless auth** over server sessions
  - Scales horizontally more easily
  - Tradeoff: token revocation/rotation complexity

- **Feature-first module layout** over layered-by-type layout
  - Better ownership and maintainability per domain
  - Tradeoff: some shared logic may be duplicated early

- **Single PostgreSQL database**
  - Operational simplicity
  - Tradeoff: eventual read/write scaling pressure

---

## What I Would Improve Next

- **Refresh token handling hardening**
  - Ensure storage/validation strategy is consistent and secure (hashing + rotation + reuse detection)

- **Rate limiting and abuse protection**
  - Add throttling for auth and public-feed endpoints

- **Observability**
  - Add structured logging, tracing, and metrics (latency/error/throughput)

- **Error handling consistency**
  - Standardize error response envelope across all modules

- **Performance and query optimization**
  - Add targeted indexes and response caching for public feed/blog-by-slug reads

- **Security posture**
  - Add secrets management, stricter CORS by environment, and dependency vulnerability scanning in CI

---

## How I’d Scale This to 1M Users

### 1) App/API layer

- Run multiple stateless API instances behind a load balancer.
- Enable autoscaling on CPU/RPS/latency.
- Keep app instances disposable (12-factor style config).

### 2) Data layer

- Use managed PostgreSQL with:
  - read replicas for heavy public-read traffic
  - connection pooling (e.g., PgBouncer)
  - backup + PITR strategy
- Partition high-growth tables (comments/likes) when needed.

### 3) Caching strategy

- Add Redis for:
  - hot public feed pages
  - blog-by-slug cache
  - short-lived auth/session metadata
- Use cache-aside with clear TTL/invalidation rules.

### 4) Async/event processing

- Offload non-critical work to queues/workers:
  - notifications
  - analytics pipelines
  - search indexing

### 5) Search and content delivery

- Add dedicated search engine for full-text blog search.
- Use CDN for static assets/media.

### 6) Reliability & operations

- Add SLOs and alerting for p95 latency/error rate.
- Implement zero-downtime DB migrations and blue/green or canary deployments.
- Run load tests regularly and capacity-plan before expected spikes.

---

## Useful Commands

```bash
pnpm dev
pnpm build
pnpm start:prod
pnpm lint
pnpm test
pnpm test:e2e
```
