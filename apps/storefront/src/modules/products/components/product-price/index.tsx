import { clx } from "@modules/common/components/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="h-9 w-32 bg-surface-strong rounded animate-pulse" />
  }

  const isSale = selectedPrice.price_type === "sale"
  // "From" only makes sense before a specific variant is selected, and only
  // when the product actually has more than one distinct price.
  const isFromPrice =
    !variant &&
    new Set(
      (product.variants ?? [])
        .map((v) => (v as { calculated_price?: { calculated_amount?: number } }).calculated_price?.calculated_amount)
        .filter((amount): amount is number => typeof amount === "number")
    ).size > 1

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span
        className={clx("text-h3", isSale ? "text-sale" : "text-ink")}
        data-testid="product-price"
        data-value={selectedPrice.calculated_price_number}
      >
        {isFromPrice && "From "}
        {selectedPrice.calculated_price}
      </span>
      {isSale && (
        <>
          <span
            className="text-body text-ink-muted line-through"
            data-testid="original-product-price"
            data-value={selectedPrice.original_price_number}
          >
            {selectedPrice.original_price}
          </span>
          <span className="text-label text-sale">Sale</span>
        </>
      )}
    </div>
  )
}
