import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

// Homepage must never grow with collection size (blueprint section 6,
// "Section 3: New arrivals"): always request and render at most this many.
const NEW_ARRIVALS_LIMIT = 4

type NewArrivalsProps = {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}

export default async function NewArrivals({
  collection,
  region,
}: NewArrivalsProps) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      limit: NEW_ARRIVALS_LIMIT,
      fields: "*variants.calculated_price",
    },
  })

  if (!products.length) {
    return null
  }

  return (
    <section className="content-container py-16 small:py-24">
      <div className="flex items-end justify-between mb-8 small:mb-10">
        <h2 className="text-h2 text-ink">New arrivals</h2>
        <LocalizedClientLink
          href={`/collections/${collection.handle}`}
          className="focus-ring inline-flex items-center min-h-11 text-nav text-brand hover:text-brand-hover"
        >
          View new arrivals
        </LocalizedClientLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-3 gap-y-8 small:gap-x-6 small:gap-y-10">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} />
          </li>
        ))}
      </ul>
    </section>
  )
}
