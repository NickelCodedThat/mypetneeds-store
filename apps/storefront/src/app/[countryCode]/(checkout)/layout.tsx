import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import Wordmark from "@modules/layout/components/wordmark"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-page relative small:min-h-screen">
      <div className="h-16 bg-page border-b border-border">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="focus-ring text-nav text-ink-muted flex items-center gap-x-2 flex-1 basis-0 rounded-md min-h-11"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block hover:text-ink">
              Back to shopping cart
            </span>
            <span className="mt-px block small:hidden hover:text-ink">
              Back
            </span>
          </LocalizedClientLink>
          <Wordmark />
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
    </div>
  )
}
