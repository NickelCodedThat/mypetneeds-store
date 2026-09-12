"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@modules/common/components/ui"
import { useEffect, useRef } from "react"

export default function CheckoutError({ reset }: { reset: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="content-container min-h-[60vh] py-16 flex flex-col items-start justify-center gap-4">
      <h1 ref={headingRef} tabIndex={-1} className="text-h1 text-ink">
        We couldn&apos;t load checkout
      </h1>
      <p className="text-body text-ink-muted max-w-xl">
        Try again. Your cart will remain available if you return to it.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={reset}>
          Try again
        </Button>
        <LocalizedClientLink
          href="/cart"
          className="focus-ring inline-flex items-center min-h-11 px-4 rounded-md bg-brand text-white text-button hover:bg-brand-hover"
        >
          Return to cart
        </LocalizedClientLink>
      </div>
    </div>
  )
}
