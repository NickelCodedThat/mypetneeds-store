"use client"

import { HttpTypes } from "@medusajs/types"
import { useParams, usePathname } from "next/navigation"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

type PrimaryNavProps = {
  categories: HttpTypes.StoreProductCategory[]
}

const PrimaryNav = ({ categories }: PrimaryNavProps) => {
  const pathname = usePathname()
  const { countryCode } = useParams()

  return (
    <nav aria-label="Primary" className="flex items-center gap-8 h-full">
      {categories.map((category) => {
        const href = `/categories/${category.handle}`
        const localizedHref = `/${countryCode}${href}`
        const isActive =
          pathname === localizedHref || pathname.startsWith(`${localizedHref}/`)

        return (
          <LocalizedClientLink
            key={category.id}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={clx(
              "focus-ring text-nav h-full inline-flex items-center border-b-2 transition-colors duration-150 ease-out",
              isActive
                ? "border-brand text-ink"
                : "border-transparent text-ink-muted hover:text-ink hover:border-border"
            )}
            data-testid="nav-category-link"
          >
            {category.name}
          </LocalizedClientLink>
        )
      })}
    </nav>
  )
}

export default PrimaryNav
