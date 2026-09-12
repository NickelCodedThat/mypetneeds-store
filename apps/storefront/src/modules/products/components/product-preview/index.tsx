import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

type VariantWithPriceAndStock = HttpTypes.StoreProductVariant & {
  calculated_price?: {
    calculated_amount?: number
  }
}

/**
 * A product is only ever marked out of stock when every variant confirms it
 * (tracks inventory, doesn't allow backorder, and has none left). Listing
 * queries with a narrower `fields` selection (e.g. the homepage rail) won't
 * return `manage_inventory`/`inventory_quantity` at all - in that case we
 * can't confirm anything, so the product is treated as available rather
 * than guessing.
 */
function isProductOutOfStock(product: HttpTypes.StoreProduct): boolean {
  const variants = product.variants as VariantWithPriceAndStock[] | undefined

  if (!variants?.length) {
    return false
  }

  return variants.every((variant) => {
    if (variant.manage_inventory == null) {
      return false
    }
    if (!variant.manage_inventory || variant.allow_backorder) {
      return false
    }
    return (variant.inventory_quantity ?? 0) <= 0
  })
}

/** True when variants carry more than one distinct price, i.e. a genuine "From" range. */
function hasPriceRange(product: HttpTypes.StoreProduct): boolean {
  const variants = product.variants as VariantWithPriceAndStock[] | undefined
  const amounts = new Set(
    (variants ?? [])
      .map((variant) => variant.calculated_price?.calculated_amount)
      .filter((amount): amount is number => typeof amount === "number")
  )
  return amounts.size > 1
}

export default function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const outOfStock = isProductOutOfStock(product)

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="focus-ring group block rounded-md"
      data-testid="product-wrapper"
    >
      <Thumbnail
        thumbnail={product.thumbnail}
        images={product.images}
        isFeatured={isFeatured}
        isUnavailable={outOfStock}
      />
      <div className="mt-3 flex flex-col gap-1">
        {outOfStock && (
          <span className="text-supporting text-ink-muted">Out of stock</span>
        )}
        {/* Plain text, not a heading: catalog page heading hierarchy is a
            2B.5 concern, not a per-card decision. */}
        <p
          className="text-product-title text-ink min-h-[44px] group-hover:text-brand transition-colors duration-150 ease-out"
          data-testid="product-title"
        >
          {product.title}
        </p>
        {cheapestPrice && (
          <PreviewPrice
            price={cheapestPrice}
            isFromPrice={hasPriceRange(product)}
          />
        )}
      </div>
    </LocalizedClientLink>
  )
}
