import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { OptionValueIds } from "@lib/util/product-option-filters"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import SortControl, { SortOptions } from "@modules/store/components/sort-control"

// Approved Gate 2 catalog page size (blueprint section 8, "Category and
// collection UX"). Defined once here since this is the single place the
// shared catalog shell fetches and paginates products.
export const CATALOG_PAGE_SIZE = 24

type CatalogResultsProps = {
  sortBy: SortOptions
  page: number
  countryCode: string
  collectionId?: string
  categoryId?: string
  optionValueIds?: OptionValueIds
  headingId: string
}

export default async function CatalogResults({
  sortBy,
  page,
  countryCode,
  collectionId,
  categoryId,
  optionValueIds,
  headingId,
}: CatalogResultsProps) {
  const queryParams: {
    limit: number
    collection_id?: string[]
    category_id?: string[]
    order?: string
  } = {
    limit: CATALOG_PAGE_SIZE,
  }

  if (collectionId) {
    queryParams.collection_id = [collectionId]
  }

  if (categoryId) {
    queryParams.category_id = [categoryId]
  }

  if (sortBy === "created_at") {
    queryParams.order = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
    optionValueIds,
  })

  const totalPages = Math.ceil(count / CATALOG_PAGE_SIZE)

  if (!count) {
    return (
      <div className="flex flex-col items-start gap-4 py-16 border-t border-border">
        <p className="text-body text-ink-muted">
          No products are currently listed here.
        </p>
        <LocalizedClientLink
          href="/store"
          className="focus-ring inline-flex items-center justify-center min-h-11 px-6 rounded-md bg-brand text-white text-button hover:bg-brand-hover transition-colors duration-150 ease-out"
        >
          Shop all products
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-body text-ink-muted" data-testid="product-count">
          {count} {count === 1 ? "product" : "products"}
        </p>
        <SortControl sortBy={sortBy} data-testid="sort-by-container" />
      </div>
      <ul
        className="grid grid-cols-2 w-full md:grid-cols-3 small:grid-cols-4 large:grid-cols-5 gap-x-3 gap-y-8 small:gap-x-6 small:gap-y-10"
        data-testid="products-list"
      >
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} />
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
          headingId={headingId}
        />
      )}
    </>
  )
}
