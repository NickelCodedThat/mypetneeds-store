import { OptionValueIds } from "@lib/util/product-option-filters"
import { SortOptions } from "@modules/store/components/sort-control"

import CatalogTemplate from "./catalog-template"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) => {
  return (
    <CatalogTemplate
      heading="All products"
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      optionValueIds={optionValueIds}
    />
  )
}

export default StoreTemplate
