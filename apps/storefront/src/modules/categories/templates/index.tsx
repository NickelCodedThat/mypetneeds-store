import { notFound } from "next/navigation"

import { OptionValueIds } from "@lib/util/product-option-filters"
import { HttpTypes } from "@medusajs/types"
import { BreadcrumbItem } from "@modules/common/components/breadcrumbs"
import { SortOptions } from "@modules/store/components/sort-control"
import CatalogTemplate from "@modules/store/templates/catalog-template"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  if (!category || !countryCode) notFound()

  // Walk up to the root, then reverse so the trail reads outermost-first
  // (Home / Grandparent / Parent), matching real breadcrumb order.
  const ancestors: HttpTypes.StoreProductCategory[] = []
  let current = category.parent_category
  while (current) {
    ancestors.unshift(current)
    current = current.parent_category
  }

  const breadcrumb: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    ...ancestors.map((ancestor) => ({
      label: ancestor.name,
      href: `/categories/${ancestor.handle}`,
    })),
    { label: category.name, href: `/categories/${category.handle}` },
  ]

  return (
    <CatalogTemplate
      heading={category.name}
      description={category.description}
      breadcrumb={breadcrumb}
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      categoryId={category.id}
      optionValueIds={optionValueIds}
      estimatedCount={category.products?.length}
    />
  )
}
