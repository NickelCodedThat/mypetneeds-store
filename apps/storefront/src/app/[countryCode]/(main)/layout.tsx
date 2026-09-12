import { Metadata } from "next"

import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()

  return (
    <>
      <a
        href="#main-content"
        className="focus-ring fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-page px-4 py-3 text-button text-ink shadow-xl focus:translate-y-0"
      >
        Skip to main content
      </a>
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      <main id="main-content" tabIndex={-1}>
        {props.children}
      </main>
      <Footer />
    </>
  )
}
