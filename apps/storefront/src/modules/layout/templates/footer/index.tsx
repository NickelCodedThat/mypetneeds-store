import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Wordmark from "@modules/layout/components/wordmark"

// Approved Gate 2 primary taxonomy, in blueprint order (see nav/index.tsx).
const PRIMARY_CATEGORY_NAMES = ["Dogs", "Cats", "Care & Travel"]

export default async function Footer() {
  const categories = await listCategories()

  const primaryCategories = PRIMARY_CATEGORY_NAMES.map((name) =>
    categories?.find((category) => category.name === name)
  ).filter((category): category is HttpTypes.StoreProductCategory => !!category)

  return (
    <footer className="border-t border-border w-full">
      <div className="content-container flex flex-col w-full py-16 small:py-20 gap-10">
        <div className="flex flex-col xsmall:flex-row items-start justify-between gap-10">
          <div className="flex flex-col gap-3">
            <Wordmark className="-ml-1" />
            <Text className="text-body text-ink-muted max-w-xs">
              Practical essentials for dogs, cats, care, and travel.
            </Text>
          </div>

          <div className="grid grid-cols-2 gap-10 md:gap-16">
            <div className="flex flex-col gap-y-3">
              <span className="text-label text-ink-muted">Shop</span>
              <ul className="grid grid-cols-1 gap-3 text-body text-ink">
                {primaryCategories.map((category) => (
                  <li key={category.id}>
                    <LocalizedClientLink
                      className="focus-ring inline-flex items-center min-h-11 min-w-11 rounded-md hover:text-brand"
                      href={`/categories/${category.handle}`}
                      data-testid="footer-category-link"
                    >
                      {category.name}
                    </LocalizedClientLink>
                  </li>
                ))}
                <li>
                  <LocalizedClientLink
                    className="focus-ring inline-flex items-center min-h-11 rounded-md hover:text-brand"
                    href="/collections/new-arrivals"
                  >
                    New Arrivals
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="focus-ring inline-flex items-center min-h-11 rounded-md hover:text-brand"
                    href="/store"
                  >
                    All Products
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-y-3">
              <span className="text-label text-ink-muted">Account</span>
              <ul className="grid grid-cols-1 gap-3 text-body text-ink">
                <li>
                  <LocalizedClientLink
                    className="focus-ring inline-flex items-center min-h-11 rounded-md hover:text-brand"
                    href="/account"
                  >
                    Account
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <Text className="text-supporting text-ink-muted">
            © {new Date().getFullYear()} MyPetNeeds. All rights reserved.
          </Text>
        </div>
      </div>
    </footer>
  )
}
