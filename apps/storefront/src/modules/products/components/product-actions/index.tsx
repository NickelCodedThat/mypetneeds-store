"use client"

import { addToCart } from "@lib/data/cart"
import { useHasPassedViewport } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt) => {
    if (varopt.option_id) acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [addToCartError, setAddToCartError] = useState<string | null>(null)
  const countryCode = useParams().countryCode as string

  const hasMultipleVariants = (product.variants?.length ?? 0) > 1

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setAddToCartError(null)
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // For each option group, which values have no matching variant given the
  // *other* currently selected options - lets the UI show them as
  // unavailable instead of only failing silently after the fact.
  const unavailableValuesByOption = useMemo(() => {
    const result: Record<string, string[]> = {}

    for (const option of product.options ?? []) {
      const values = option.values?.map((v) => v.value) ?? []
      const otherOptions = { ...options }
      delete otherOptions[option.id]

      result[option.id] = values.filter((value) => {
        const candidate = { ...otherOptions, [option.id]: value }
        return !product.variants?.some((v) =>
          isEqual(optionsAsKeymap(v.options), candidate)
        )
      })
    }

    return result
  }, [product.options, product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant, pathname, router, searchParams])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const hasPassedActions = useHasPassedViewport(actionsRef)

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)
    setAddToCartError(null)

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
      })
    } catch {
      setAddToCartError(
        "We couldn't add this to your cart. Please try again."
      )
    } finally {
      setIsAdding(false)
    }
  }

  const firstOptionTitle = product.options?.[0]?.title?.toLowerCase()

  const buttonLabel = !selectedVariant
    ? firstOptionTitle
      ? `Choose a ${firstOptionTitle}`
      : "Select an option"
    : !inStock || !isValidVariant
    ? "Out of stock"
    : "Add to cart"

  return (
    <div className="flex flex-col gap-y-4" ref={actionsRef}>
      <ProductPrice product={product} variant={selectedVariant} />

      {hasMultipleVariants && (
        <div className="flex flex-col gap-y-4">
          {(product.options || []).map((option) => (
            <OptionSelect
              key={option.id}
              option={option}
              current={options[option.id]}
              updateOption={setOptionValue}
              title={option.title ?? ""}
              data-testid="product-options"
              disabled={!!disabled || isAdding}
              unavailableValues={unavailableValuesByOption[option.id]}
            />
          ))}
        </div>
      )}

      {selectedVariant && (
        <p
          className="text-supporting text-ink-muted"
          data-testid="inventory-message"
        >
          {inStock ? "In stock" : "Out of stock"}
        </p>
      )}

      <Button
        onClick={handleAddToCart}
        disabled={
          !inStock || !selectedVariant || !!disabled || isAdding || !isValidVariant
        }
        variant="primary"
        className="w-full"
        isLoading={isAdding}
        data-testid="add-product-button"
      >
        {buttonLabel}
      </Button>

      {addToCartError && (
        <p role="alert" className="text-supporting text-error">
          {addToCartError}
        </p>
      )}

      <p className="text-supporting text-ink-muted">
        Shipping options are shown at checkout.
      </p>

      <MobileActions
        actionsRef={actionsRef}
        show={hasPassedActions}
        product={product}
        variant={selectedVariant}
        isAdding={isAdding}
        buttonLabel={buttonLabel}
        disabled={
          !inStock || !selectedVariant || !!disabled || isAdding || !isValidVariant
        }
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
