# MyPetNeeds — Medusa Ecommerce Store

**Gate 0 — Foundation.** This is the baseline Medusa v2 ecommerce environment for MyPetNeeds, bootstrapped from the official [Medusa DTC Starter](https://github.com/medusajs/dtc-starter). It is intentionally unbranded and unmodified beyond what's needed to run locally — no MyPetNeeds branding, catalog, or custom modules yet.

See [MEDUSA-LEARNING-JOURNAL.md](./MEDUSA-LEARNING-JOURNAL.md) for Nick's learning notes on how the pieces fit together.

## What's in here

```
mypetneeds-store/
  apps/
    backend/      # Medusa v2 backend — commerce API, Admin dashboard, PostgreSQL access
    storefront/    # Next.js 15 storefront — the customer-facing shop
  package.json     # workspace root (pnpm + turbo scripts)
  pnpm-workspace.yaml
  pnpm-lock.yaml
```

- **`apps/backend`** is the Medusa server: the commerce engine (products, carts, orders, customers, pricing, etc.), the REST/Admin API, and the Medusa Admin dashboard UI (served at `/app`). It talks to PostgreSQL for all persistent data.
- **`apps/storefront`** is the Next.js app customers actually browse and buy from. It's a client of the backend's Store API — it holds no product/order data of its own.

## Prerequisites

| Requirement | Version used in this repo |
|---|---|
| Node.js | **22.23.2** (pinned via [Volta](https://volta.sh), see below) |
| pnpm | **10.11.1** (pinned via the `packageManager` field + Corepack) |
| PostgreSQL | 16.x (installed locally via Homebrew: `postgresql@16`) |
| Git | any recent version |

### Node & pnpm pinning

This repo pins its own toolchain so `pnpm dev` uses the same versions everywhere, regardless of what Node is installed globally on your machine:

- **Node** is pinned in `package.json` under `"volta": { "node": "22.23.2" }`. If you have [Volta](https://volta.sh) installed (`brew install volta`, then follow its shell setup instructions once), `cd`-ing into this repo automatically gives you Node 22.23.2 on `PATH`.
- **pnpm** is pinned via `"packageManager": "pnpm@10.11.1"` in `package.json`. Node's built-in [Corepack](https://nodejs.org/api/corepack.html) reads this field automatically — run `corepack enable` once per machine, and `pnpm` will always resolve to 10.11.1 inside this repo.

If you don't want to install Volta, any Node satisfying `^20.19.0 || >=22.12.0` will run the backend; Node ≤24 is required for the storefront (Next.js starter constraint).

## Local environment setup

1. **Install PostgreSQL** (if you don't have it):
   ```bash
   brew install postgresql@16
   brew services start postgresql@16
   ```

2. **Create the database:**
   ```bash
   createdb medusa-backend
   ```

3. **Install dependencies from the repo root:**
   ```bash
   pnpm install
   ```

4. **Configure the backend environment.** Copy the template and set your database URL:
   ```bash
   cp apps/backend/.env.template apps/backend/.env
   ```
   Edit `apps/backend/.env` and set:
   ```
   DATABASE_URL=postgres://<your-local-user>@localhost:5432/medusa-backend
   ```
   (No password is needed with Homebrew's default local "trust" auth. `.env` is git-ignored — never commit it.)

5. **Run migrations** (this also seeds baseline store/region/product data):
   ```bash
   cd apps/backend
   pnpm medusa db:migrate
   ```

6. **Create a Medusa Admin user:**
   ```bash
   pnpm medusa user -e you@example.com -p <your-password>
   ```

7. **Configure the storefront environment:**
   ```bash
   cp apps/storefront/.env.template apps/storefront/.env.local
   ```
   Start the backend (next step), log into Admin, go to **Settings → Publishable API Keys**, and copy the key into `apps/storefront/.env.local`:
   ```
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
   ```
   (The DTC Starter's seed data already creates a default publishable key tied to the default sales channel, so there's usually one waiting in Admin already.)

## Running it

From the repo root, start both apps at once:

```bash
pnpm dev
```

Or run them individually:

```bash
pnpm --filter @dtc/backend dev      # Medusa backend + Admin
pnpm --filter @dtc/storefront dev   # Next.js storefront
```

### Local URLs

| App | URL |
|---|---|
| Storefront | http://localhost:8000 |
| Medusa backend (API) | http://localhost:9000 |
| Medusa Admin dashboard | http://localhost:9000/app |

## Environment files (not committed)

- `apps/backend/.env` — database URL, CORS origins, JWT/cookie secrets. Template: `apps/backend/.env.template`.
- `apps/storefront/.env.local` — publishable API key, backend URL, region, base URL. Template: `apps/storefront/.env.template`.

Both are covered by `.gitignore`. Never commit real secrets or API keys.

## Validation performed for Gate 0

- `pnpm install` — clean install across the workspace
- `pnpm medusa db:migrate` — migrations + seed data applied to a fresh local PostgreSQL database
- `pnpm medusa user` — Admin user created
- Backend dev server boots and serves the Admin dashboard at `/app`; login verified
- Storefront dev server boots, renders the homepage, and successfully calls the Store API (regions, collections, product categories all returned `200`)
- PostgreSQL data verified to persist across a `brew services restart postgresql@16`
- `pnpm build` run for the backend as a type/build validation pass (see repo history / CI for current results)

## Scope note

Gate 0 is a clean, unmodified baseline only. No MyPetNeeds branding, catalog, Stripe integration, marketplace/vendor functionality, or custom Medusa modules have been added yet — that begins in a later gate.
