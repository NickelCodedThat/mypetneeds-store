"use client"

import { Dialog, Transition, TransitionChild } from "@headlessui/react"
import { BarsThree, ShoppingBag } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Fragment, useEffect, useRef } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { IconButton } from "@modules/common/components/ui"
import User from "@modules/common/icons/user"
import X from "@modules/common/icons/x"
import CountrySelect from "../country-select"

type SideMenuProps = {
  categories: HttpTypes.StoreProductCategory[]
  regions: HttpTypes.StoreRegion[] | null
}

const SideMenu = ({ categories, regions }: SideMenuProps) => {
  const { state, open, close } = useToggleState()
  const countryToggleState = useToggleState()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Headless UI's Dialog does not lock body scroll on its own; the approved
  // drawer behavior requires it while the panel is open.
  useEffect(() => {
    if (!state) {
      return
    }

    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = overflow
    }
  }, [state])

  return (
    <>
      <IconButton
        onClick={open}
        aria-label="Menu"
        aria-haspopup="dialog"
        data-testid="nav-menu-button"
      >
        <BarsThree />
      </IconButton>

      <Transition show={state} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[75]"
          onClose={close}
          initialFocus={closeButtonRef}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-ink/40"
              aria-hidden="true"
              data-testid="side-menu-backdrop"
            />
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-y-0 right-0 flex max-w-full">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="ease-in duration-150"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel
                  className="w-screen xsmall:max-w-[360px] h-full bg-page flex flex-col shadow-xl"
                  data-testid="nav-menu-popup"
                >
                  <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
                    <Dialog.Title className="text-h3 text-ink">
                      Menu
                    </Dialog.Title>
                    <IconButton
                      ref={closeButtonRef}
                      onClick={close}
                      aria-label="Close menu"
                      data-testid="close-menu-button"
                    >
                      <X size={20} />
                    </IconButton>
                  </div>

                  <nav
                    aria-label="Mobile"
                    className="flex flex-col gap-1 px-3 py-6 overflow-y-auto"
                  >
                    <span className="text-label text-ink-muted px-2 pb-2">
                      Shop
                    </span>
                    {categories.map((category) => (
                      <LocalizedClientLink
                        key={category.id}
                        href={`/categories/${category.handle}`}
                        onClick={close}
                        className="focus-ring text-nav text-ink rounded-md px-2 min-h-11 flex items-center hover:bg-surface"
                        data-testid={`${category.handle}-link`}
                      >
                        {category.name}
                      </LocalizedClientLink>
                    ))}
                    <LocalizedClientLink
                      href="/store"
                      onClick={close}
                      className="focus-ring text-nav text-ink rounded-md px-2 min-h-11 flex items-center hover:bg-surface"
                      data-testid="shop-all-link"
                    >
                      Shop all
                    </LocalizedClientLink>

                    <div className="my-3 border-t border-border" />

                    <span className="text-label text-ink-muted px-2 pb-2">
                      Account
                    </span>
                    <LocalizedClientLink
                      href="/account"
                      onClick={close}
                      className="focus-ring text-nav text-ink rounded-md px-2 min-h-11 flex items-center gap-2 hover:bg-surface"
                      data-testid="account-link"
                    >
                      <User size={20} />
                      Account
                    </LocalizedClientLink>
                    <LocalizedClientLink
                      href="/cart"
                      onClick={close}
                      className="focus-ring text-nav text-ink rounded-md px-2 min-h-11 flex items-center gap-2 hover:bg-surface"
                      data-testid="cart-link"
                    >
                      <ShoppingBag />
                      Cart
                    </LocalizedClientLink>

                    {!!regions?.length && (
                      <>
                        <div className="my-3 border-t border-border" />
                        {/* CountrySelect's panel visibility is driven by this
                            external toggle rather than Headless UI's own
                            Listbox state (see country-select/index.tsx), so
                            the trigger needs an explicit tap handler here to
                            work on touch, not just desktop hover. */}
                        <div
                          className="px-2"
                          onClick={countryToggleState.toggle}
                          onMouseEnter={countryToggleState.open}
                          onMouseLeave={countryToggleState.close}
                        >
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        </div>
                      </>
                    )}
                  </nav>
                </Dialog.Panel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default SideMenu
