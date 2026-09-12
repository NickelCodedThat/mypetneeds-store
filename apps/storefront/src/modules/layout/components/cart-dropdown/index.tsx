"use client"

import { Transition } from "@headlessui/react"
import { ShoppingBag } from "@medusajs/icons"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

// Shared with the ui-kit Button's primary/medium and primary/large classes
// (kept inline here so these remain single links, not a button nested in a
// link, per the approved shell nested-interactive-element rule).
const ctaClassName =
  "focus-ring text-button inline-flex gap-2 items-center justify-center rounded-md transition-colors duration-150 ease-out bg-brand text-white hover:bg-brand-hover"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div
      className="relative h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <LocalizedClientLink
        href="/cart"
        className="focus-ring h-full inline-flex items-center justify-center min-h-11 min-w-11 px-2 rounded-md text-nav text-ink-muted hover:text-ink"
        aria-label={`Cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`}
        data-testid="nav-cart-link"
      >
        <span className="hidden small:inline" aria-hidden="true">
          Cart ({totalItems})
        </span>
        <span className="small:hidden inline-flex items-center gap-1" aria-hidden="true">
          <ShoppingBag />
          {totalItems}
        </span>
      </LocalizedClientLink>
      <Transition
        show={cartDropdownOpen}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <div
          className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-page border border-border shadow-xl rounded-md w-[420px] text-ink"
          data-testid="nav-cart-dropdown"
        >
          <div className="p-4 flex items-center justify-center">
            <h3 className="text-h3">Cart</h3>
          </div>
          {cartState && cartState.items?.length ? (
            <>
              <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                {cartState.items
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "")
                      ? -1
                      : 1
                  })
                  .map((item) => (
                    <div
                      className="grid grid-cols-[122px_1fr] gap-x-4"
                      key={item.id}
                      data-testid="cart-item"
                    >
                      <LocalizedClientLink
                        href={`/products/${item.product_handle}`}
                        className="w-24"
                      >
                        <Thumbnail
                          thumbnail={item.thumbnail}
                          images={item.variant?.product?.images}
                          size="square"
                        />
                      </LocalizedClientLink>
                      <div className="flex flex-col justify-between flex-1">
                        <div className="flex flex-col flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                              <h3 className="text-body overflow-hidden text-ellipsis">
                                <LocalizedClientLink
                                  href={`/products/${item.product_handle}`}
                                  data-testid="product-link"
                                >
                                  {item.title}
                                </LocalizedClientLink>
                              </h3>
                              <LineItemOptions
                                variant={item.variant}
                                data-testid="cart-item-variant"
                                data-value={item.variant}
                              />
                              <span
                                data-testid="cart-item-quantity"
                                data-value={item.quantity}
                              >
                                Quantity: {item.quantity}
                              </span>
                            </div>
                            <div className="flex justify-end">
                              <LineItemPrice
                                item={item}
                                style="tight"
                                currencyCode={cartState.currency_code}
                              />
                            </div>
                          </div>
                        </div>
                        <DeleteButton
                          id={item.id}
                          className="mt-1"
                          data-testid="cart-item-remove-button"
                        >
                          Remove
                        </DeleteButton>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="p-4 flex flex-col gap-y-4 text-body">
                <div className="flex items-center justify-between">
                  <span className="text-ink font-semibold">
                    Subtotal{" "}
                    <span className="font-normal">(excl. taxes)</span>
                  </span>
                  <span
                    className="text-price"
                    data-testid="cart-subtotal"
                    data-value={subtotal}
                  >
                    {convertToLocale({
                      amount: subtotal,
                      currency_code: cartState.currency_code,
                    })}
                  </span>
                </div>
                <LocalizedClientLink
                  href="/cart"
                  className={clx(ctaClassName, "w-full h-12 px-6")}
                  data-testid="go-to-cart-button"
                >
                  Go to cart
                </LocalizedClientLink>
              </div>
            </>
          ) : (
            <div>
              <div className="flex py-16 flex-col gap-y-4 items-center justify-center">
                <div className="bg-surface-strong text-body flex items-center justify-center w-6 h-6 rounded-full text-ink-muted">
                  <span>0</span>
                </div>
                <span>Your shopping bag is empty.</span>
                <LocalizedClientLink
                  href="/store"
                  onClick={close}
                  className={clx(ctaClassName, "h-11 px-4")}
                >
                  Explore products
                </LocalizedClientLink>
              </div>
            </div>
          )}
        </div>
      </Transition>
    </div>
  )
}

export default CartDropdown
