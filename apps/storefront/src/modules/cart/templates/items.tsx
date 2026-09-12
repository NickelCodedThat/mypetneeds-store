import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"

import Item from "@modules/cart/components/item"
import SkeletonCartLineItem from "@modules/skeletons/components/skeleton-cart-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items

  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading level="h1" className="text-[2rem] leading-[2.75rem]">
          Cart
        </Heading>
      </div>

      {/* Desktop-only column labels; each mobile card self-labels visually. */}
      <div
        className="hidden small:flex items-center gap-4 pb-3 border-b border-border txt-medium-plus text-ui-fg-subtle"
        aria-hidden="true"
      >
        <div className="w-24 shrink-0" />
        <Text className="flex-1">Product</Text>
        <Text className="w-32 medium:w-40 shrink-0">Quantity</Text>
        <Text className="w-20 medium:w-28 shrink-0 text-right">Unit price</Text>
        <Text className="w-20 medium:w-28 shrink-0 text-right">Total</Text>
      </div>

      <ul>
        {items
          ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={cart?.currency_code}
                  />
                )
              })
          : repeat(5).map((i) => {
              return <SkeletonCartLineItem key={i} />
            })}
      </ul>
    </div>
  )
}

export default ItemsTemplate
