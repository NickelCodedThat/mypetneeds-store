"use client"

import { Table, Text } from "@modules/common/components/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

// TODO: Update this to grab the actual max inventory once v2 inventory data
// is available on the line item. Both branches of the historical ternary
// here resolved to the same hard-coded ceiling of 10, so it's collapsed to
// a single constant; retaining the ceiling as documented known debt rather
// than inventing real inventory intelligence.
const MAX_QUANTITY_CEILING = 10

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // Guard against the selected quantity ever exceeding the rendered
  // <option> list (e.g. a cart created before the ceiling existed).
  const maxQuantity = Math.max(MAX_QUANTITY_CEILING, item.quantity)

  const quantityOptions = Array.from({ length: maxQuantity }, (_, i) => (
    <option value={i + 1} key={i}>
      {i + 1}
    </option>
  ))

  if (type === "preview") {
    return (
      <Table.Row className="w-full" data-testid="product-row">
        <Table.Cell className="!pl-0 p-4 w-24">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            aria-label={item.product_title}
            className="flex w-16"
          >
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="square"
            />
          </LocalizedClientLink>
        </Table.Cell>

        <Table.Cell className="text-left">
          <Text
            className="txt-medium-plus text-ui-fg-base"
            data-testid="product-title"
          >
            {item.product_title}
          </Text>
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
        </Table.Cell>

        <Table.Cell className="!pr-0">
          <span className="!pr-0 flex flex-col items-end h-full justify-center">
            <span className="flex gap-x-1">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
            <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
          </span>
        </Table.Cell>
      </Table.Row>
    )
  }

  const quantityLabel = `Quantity, ${item.product_title}`
  const removeLabel = `Remove ${item.product_title} from cart`

  const renderQuantityControl = (suffix: string) => (
    <div className="flex items-center gap-2">
      <CartItemSelect
        value={item.quantity}
        onChange={(e) => changeQuantity(parseInt(e.target.value))}
        aria-label={quantityLabel}
        disabled={updating}
        className="w-16 h-11"
        data-testid={`product-select-button${suffix}`}
      >
        {quantityOptions}
      </CartItemSelect>
      <DeleteButton
        id={item.id}
        aria-label={removeLabel}
        disabled={updating}
        data-testid={`product-delete-button${suffix}`}
      />
      {updating && <Spinner />}
    </div>
  )

  return (
    <li
      className="flex flex-col gap-3 py-6 border-b border-border last:border-0"
      data-testid="product-row"
    >
      {/* Mobile / narrow tablet: stacked card. Product info first row,
          quantity + remove + total second row. */}
      <div className="flex flex-col gap-3 small:hidden">
        <div className="flex items-start gap-4">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            aria-label={item.product_title}
            className="shrink-0 w-20"
          >
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="square"
            />
          </LocalizedClientLink>
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <Text
              className="txt-medium-plus text-ui-fg-base line-clamp-2"
              data-testid="product-title"
            >
              {item.product_title}
            </Text>
            <LineItemOptions
              variant={item.variant}
              data-testid="product-variant"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pl-24">
          {renderQuantityControl("")}
          <div className="flex flex-col items-end">
            {/* Shown only when it adds information beyond the line total. */}
            {item.quantity > 1 && (
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            )}
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </div>
      </div>

      {/* Desktop: single scannable row - Product / Quantity / Unit price / Total */}
      <div className="hidden small:flex items-center gap-4">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          aria-label={item.product_title}
          className="shrink-0 w-24"
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <Text
            className="txt-medium-plus text-ui-fg-base line-clamp-2"
            data-testid="product-title-desktop"
          >
            {item.product_title}
          </Text>
          <LineItemOptions
            variant={item.variant}
            data-testid="product-variant-desktop"
          />
        </div>
        <div className="w-32 medium:w-40 shrink-0">
          {renderQuantityControl("-desktop")}
        </div>
        <div className="w-20 medium:w-28 shrink-0 text-right">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </div>
        <div className="w-20 medium:w-28 shrink-0 flex justify-end">
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </div>
      </div>

      <ErrorMessage error={error} data-testid="product-error-message" />
    </li>
  )
}

export default Item
