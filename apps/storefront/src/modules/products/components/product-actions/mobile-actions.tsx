import { Button, clx } from "@modules/common/components/ui"
import React, { RefObject } from "react"
import { Transition, TransitionChild } from "@headlessui/react"

import { HttpTypes } from "@medusajs/types"
import ProductPrice from "../product-price"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  isAdding?: boolean
  buttonLabel: string
  disabled: boolean
  onAddToCart: () => void
  show: boolean
  actionsRef: RefObject<HTMLDivElement | null>
}

/**
 * Mirrors the main purchase panel's own state rather than owning a second,
 * independent variant-selection form. Tapping the label scrolls back to the
 * real controls instead of opening a duplicate options sheet.
 */
const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  isAdding,
  buttonLabel,
  disabled,
  onAddToCart,
  show,
  actionsRef,
}) => {
  const scrollToActions = () => {
    actionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <Transition show={show} as={React.Fragment}>
      <TransitionChild
        as={React.Fragment}
        enter="ease-out duration-200"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <div
          className={clx(
            "small:hidden fixed inset-x-0 bottom-0 z-40 bg-page border-t border-border",
            "px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
          )}
          data-testid="mobile-actions"
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col min-w-0 flex-1">
              <span
                className="text-supporting text-ink-muted truncate"
                data-testid="mobile-title"
              >
                {product.title}
              </span>
              <ProductPrice product={product} variant={variant} />
            </div>
            <Button
              onClick={variant ? onAddToCart : scrollToActions}
              disabled={variant ? disabled : false}
              variant="primary"
              className="shrink-0"
              isLoading={isAdding}
              data-testid="mobile-cart-button"
            >
              {buttonLabel}
            </Button>
          </div>
        </div>
      </TransitionChild>
    </Transition>
  )
}

export default MobileActions
