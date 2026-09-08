# MyPetNeeds — Medusa Ecommerce Store

**Gate 0 — Foundation** bootstrapped the baseline Medusa v2 environment from the official [Medusa DTC Starter](https://github.com/medusajs/dtc-starter). **Gate 1 — Commerce Foundation** configured the store as MyPetNeeds (US market, USD) and replaced the starter's clothing demo catalog with a MyPetNeeds pet-supplies development catalog. There is still no final branding, design system, or real supplier/inventory data — this is commerce configuration and development data only.

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

5. **Run migrations** (this also runs the starter's baseline migration seed — store/region/stock-location/demo-product data):
   ```bash
   cd apps/backend
   pnpm medusa db:migrate
   ```

6. **Create a Medusa Admin user:**
   ```bash
   pnpm medusa user -e you@example.com -p <your-password>
   ```

7. **Seed the MyPetNeeds development catalog** (configures the store as MyPetNeeds/US/USD, removes the starter's clothing demo catalog, and creates the MyPetNeeds product catalog — see [Gate 1 seed](#gate-1--commerce-foundation) below):
   ```bash
   pnpm --filter @dtc/backend seed
   ```

8. **Configure the storefront environment:**
   ```bash
   cp apps/storefront/.env.template apps/storefront/.env.local
   ```
   Start the backend (next step), log into Admin, go to **Settings → Publishable API Keys**, and copy the key into `apps/storefront/.env.local`:
   ```
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
   ```
   (The starter's baseline seed already creates a default publishable key tied to the default sales channel, so there's usually one waiting in Admin already. `NEXT_PUBLIC_DEFAULT_REGION` defaults to `us` to match the MyPetNeeds catalog's USD-only pricing.)

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

## Gate 1 — Commerce Foundation

`apps/backend/src/scripts/seed-mypetneeds.ts` (run via `pnpm --filter @dtc/backend seed`, or `medusa exec ./src/scripts/seed-mypetneeds.ts` from `apps/backend`) is an **idempotent** development seed — safe to re-run any time, including on a database that's already been seeded. Every step checks existing state first (by name, handle, or SKU) and only creates or changes what's missing, so re-running it makes no further changes once the store is configured. It:

- Renames the store to **MyPetNeeds** and sets **USD** as the default currency (EUR stays supported for the starter's original Europe region)
- Creates a **United States** region (USD) with a US tax region and the system/manual payment provider, alongside the starter's existing Europe region
- Repurposes the starter's single stock location as **MyPetNeeds Fulfillment Center** (Austin, TX) and adds a **United States** fulfillment service zone with a **Standard Shipping** option ($7 flat, usable in local checkout testing)
- Removes the starter's clothing demo catalog (products, categories, and their now-orphaned global "Size"/"Color" options) via `deleteProductsWorkflow` / `deleteProductCategoriesWorkflow` / `deleteProductOptionsWorkflow` — no raw SQL
- Creates the **Dogs**, **Cats**, and **Care & Travel** categories and a **New Arrivals** collection
- Creates 12 MyPetNeeds development products (16 variants total) with unique `MPN-*` SKUs, USD pricing, and 25 units of tracked inventory per variant at the MyPetNeeds Fulfillment Center — see the product list in [MEDUSA-LEARNING-JOURNAL.md](./MEDUSA-LEARNING-JOURNAL.md) or Admin's Products list

No product images are set — the storefront's existing placeholder-image component covers this until real product photography exists in a later gate.

## Environment files (not committed)

- `apps/backend/.env` — database URL, CORS origins, JWT/cookie secrets. Template: `apps/backend/.env.template`.
- `apps/storefront/.env.local` — publishable API key, backend URL, region, base URL. Template: `apps/storefront/.env.template`.

Both are covered by `.gitignore`. Never commit real secrets or API keys.

## Validation performed

**Gate 0:**
- `pnpm install` — clean install across the workspace
- `pnpm medusa db:migrate` — migrations + seed data applied to a fresh local PostgreSQL database
- `pnpm medusa user` — Admin user created
- Backend dev server boots and serves the Admin dashboard at `/app`; login verified
- Storefront dev server boots, renders the homepage, and successfully calls the Store API (regions, collections, product categories all returned `200`)
- PostgreSQL data verified to persist across a `brew services restart postgresql@16`
- `pnpm build` run for the backend as a type/build validation pass

**Gate 1:**
- `pnpm --filter @dtc/backend seed` run twice in a row — second run made zero changes, confirming idempotency
- `pnpm build` (backend and storefront) and `pnpm lint` (backend) — clean
- `pnpm lint` (storefront) — same pre-existing upstream errors as Gate 0 (unused vars/`any`/`@ts-ignore` in starter source under `src/lib/data/cart.ts` and `src/modules/layout/components/language-select/`); nothing new introduced
- Storefront `pnpm build` statically generated all category, collection, and product detail pages using live MyPetNeeds data from the backend
- Full storefront smoke test: browsed a category, opened a product, selected a variant, added to cart, and stepped through checkout up to (not including) placing an order — shipping and manual/system payment both resolved correctly
- Admin smoke test: logged in, confirmed the MyPetNeeds store name, all 12 products with correct SKUs/prices/inventory, categories, the United States region, and the MyPetNeeds Fulfillment Center

No automated test suite exists yet in either app (the backend's Jest config has no spec files, and the storefront ships without one) — this is a pre-existing starter condition, not something introduced here.

## Scope note

This repository holds commerce configuration and a development catalog only. No final branding/design system, Stripe integration, customer accounts, marketplace/vendor functionality, or custom Medusa modules have been added yet — that begins in a later gate.
