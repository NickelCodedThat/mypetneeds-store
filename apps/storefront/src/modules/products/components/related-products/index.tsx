import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

// Approved Gate 2B.6 cap - never more than this many, regardless of how
// many products the existing selection heuristic would otherwise return.
const RELATED_PRODUCTS_LIMIT = 4

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Existing selection heuristic, unchanged: same collection, else shared
  // tags. Request one extra so filtering out the current product still
  // leaves a full set where possible.
  const queryParams: HttpTypes.StoreProductListParams = {
    limit: RELATED_PRODUCTS_LIMIT + 1,
  }
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products
      .filter((responseProduct) => responseProduct.id !== product.id)
      .slice(0, RELATED_PRODUCTS_LIMIT)
  })

  if (!products.length) {
    return null
  }

  return (
    <div className="content-container">
      <div className="flex flex-col items-center text-center mb-10">
        <h2 className="text-h2 text-ink">More for everyday care</h2>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-3 gap-y-8 small:gap-x-6 small:gap-y-10">
        {products.map((product) => (
          <li key={product.id}>
            <Product region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
