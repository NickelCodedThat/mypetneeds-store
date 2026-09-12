import { clx } from "@modules/common/components/ui"
import { VariantPrice } from "types/global"

type PreviewPriceProps = {
  price: VariantPrice
  /** True when the product's variants carry more than one distinct price. */
  isFromPrice?: boolean
}

export default function PreviewPrice({ price, isFromPrice }: PreviewPriceProps) {
  if (!price) {
    return null
  }

  const isSale = price.price_type === "sale"

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={clx("text-price", isSale ? "text-sale" : "text-ink")}>
        {isFromPrice && "From "}
        {price.calculated_price}
      </span>
      {isSale && (
        <>
          <span
            className="text-supporting text-ink-muted line-through"
            data-testid="original-price"
          >
            {price.original_price}
          </span>
          <span className="text-label text-sale">Sale</span>
        </>
      )}
    </div>
  )
}
