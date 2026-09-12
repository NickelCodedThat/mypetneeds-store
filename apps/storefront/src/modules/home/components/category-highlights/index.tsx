import { ArrowRightMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

// Approved copy (GATE-2-UIUX-BLUEPRINT.md section D). Factual and short -
// no product counts, no promotional claims.
const DESCRIPTIONS: Record<string, string> = {
  Dogs: "Everyday essentials for dogs.",
  Cats: "Everyday essentials for cats.",
  "Care & Travel": "Practical essentials for care and travel.",
}

type CategoryHighlightsProps = {
  categories: HttpTypes.StoreProductCategory[]
}

const CategoryHighlights = ({ categories }: CategoryHighlightsProps) => {
  if (!categories.length) {
    return null
  }

  const [first, second, ...rest] = categories

  return (
    <section className="content-container py-16 small:py-24">
      <h2 className="text-h2 text-ink mb-8 small:mb-10">Shop by category</h2>

      <div className="grid grid-cols-1 small:grid-cols-2 gap-4 small:gap-6">
        {[first, second].filter(Boolean).map((category) => (
          <CategoryPanel key={category.id} category={category} size="large" />
        ))}
      </div>

      {rest.length > 0 && (
        <div className="grid grid-cols-1 gap-4 small:gap-6 mt-4 small:mt-6">
          {rest.map((category) => (
            <CategoryPanel key={category.id} category={category} size="band" />
          ))}
        </div>
      )}
    </section>
  )
}

const CategoryPanel = ({
  category,
  size,
}: {
  category: HttpTypes.StoreProductCategory
  size: "large" | "band"
}) => {
  const description = DESCRIPTIONS[category.name]

  return (
    <LocalizedClientLink
      href={`/categories/${category.handle}`}
      className={clx(
        "focus-ring group relative flex items-end rounded-rounded border border-border bg-surface hover:bg-surface-strong hover:border-ink-muted transition-colors duration-150 ease-out overflow-hidden p-5 small:p-6",
        {
          "h-28 small:h-56": size === "large",
          "h-28 small:h-32": size === "band",
        }
      )}
    >
      <div className="flex flex-col gap-1 pr-8">
        <span className="text-h3 text-ink">{category.name}</span>
        {description && (
          <span className="text-supporting text-ink-muted">{description}</span>
        )}
      </div>
      <ArrowRightMini
        className="absolute right-5 bottom-5 small:right-6 small:bottom-6 text-ink-muted group-hover:text-ink transition-colors duration-150 ease-out"
        aria-hidden="true"
      />
    </LocalizedClientLink>
  )
}

export default CategoryHighlights
