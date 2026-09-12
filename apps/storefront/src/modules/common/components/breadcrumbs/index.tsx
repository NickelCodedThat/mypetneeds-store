import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type BreadcrumbItem = {
  label: string
  href: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

/**
 * Shared catalog breadcrumb trail (blueprint section "Category/Collection
 * UX" + Gate 2B.5 section E). The last item is the current page and is
 * rendered as plain text with aria-current, not a redundant link.
 */
const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  if (!items.length) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-supporting text-ink-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 && <span aria-hidden="true">/</span>}
              {isLast ? (
                <span aria-current="page" className="text-ink">
                  {item.label}
                </span>
              ) : (
                <LocalizedClientLink
                  href={item.href}
                  className="focus-ring inline-flex items-center min-h-11 rounded px-1 hover:text-ink"
                >
                  {item.label}
                </LocalizedClientLink>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
