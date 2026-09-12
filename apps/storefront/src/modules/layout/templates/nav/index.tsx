import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { ShoppingBag } from "@medusajs/icons"
import { HttpTypes, StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import User from "@modules/common/icons/user"
import CartButton from "@modules/layout/components/cart-button"
import PrimaryNav from "@modules/layout/components/primary-nav"
import SideMenu from "@modules/layout/components/side-menu"
import Wordmark from "@modules/layout/components/wordmark"

// Approved Gate 2 primary taxonomy, in blueprint order. Categories are still
// resolved from live Medusa data (name + handle) rather than hard-coded, so
// this list only decides which categories are promoted to primary nav.
const PRIMARY_CATEGORY_NAMES = ["Dogs", "Cats", "Care & Travel"]

export default async function Nav() {
  const [regions, categories] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listCategories(),
  ])

  const primaryCategories = PRIMARY_CATEGORY_NAMES.map((name) =>
    categories?.find((category) => category.name === name)
  ).filter((category): category is HttpTypes.StoreProductCategory => !!category)

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative h-16 small:h-[72px] bg-page border-b border-border">
        <nav className="content-container flex items-center justify-between w-full h-full gap-4">
          <div className="flex items-center gap-1 flex-1 small:flex-none">
            <div className="small:hidden">
              <SideMenu categories={primaryCategories} regions={regions} />
            </div>
            <Wordmark />
          </div>

          <div className="hidden small:flex flex-1 justify-center">
            <PrimaryNav categories={primaryCategories} />
          </div>

          <div className="flex items-center gap-1 small:gap-2 justify-end flex-1 small:flex-none">
            <LocalizedClientLink
              href="/account"
              className="focus-ring hidden small:inline-flex items-center min-h-11 px-2 rounded-md text-nav text-ink-muted hover:text-ink"
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/account"
              aria-label="Account"
              className="focus-ring small:hidden inline-flex items-center justify-center min-h-11 min-w-11 rounded-md text-ink-muted hover:text-ink"
              data-testid="nav-account-link-mobile"
            >
              <User size={22} />
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  aria-label="Cart, 0 items"
                  className="focus-ring inline-flex items-center min-h-11 px-2 rounded-md text-nav text-ink-muted hover:text-ink"
                  data-testid="nav-cart-link"
                >
                  <span className="hidden small:inline" aria-hidden="true">
                    Cart (0)
                  </span>
                  <span
                    className="small:hidden inline-flex items-center gap-1"
                    aria-hidden="true"
                  >
                    <ShoppingBag />0
                  </span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
