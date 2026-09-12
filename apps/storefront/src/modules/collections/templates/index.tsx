import { OptionValueIds } from "@lib/util/product-option-filters"
import { HttpTypes } from "@medusajs/types"
import { BreadcrumbItem } from "@modules/common/components/breadcrumbs"
import { SortOptions } from "@modules/store/components/sort-control"
import CatalogTemplate from "@modules/store/templates/catalog-template"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const breadcrumb: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: collection.title, href: `/collections/${collection.handle}` },
  ]

  return (
    <CatalogTemplate
      heading={collection.title}
      breadcrumb={breadcrumb}
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      collectionId={collection.id}
      optionValueIds={optionValueIds}
      estimatedCount={collection.products?.length}
    />
  )
}
