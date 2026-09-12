"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@modules/common/components/ui"
import { useEffect, useRef } from "react"

export default function MainError({ reset }: { reset: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="content-container min-h-[60vh] py-16 flex flex-col items-start justify-center gap-4">
      <h1 ref={headingRef} tabIndex={-1} className="text-h1 text-ink">
        We couldn&apos;t load this page
      </h1>
      <p className="text-body text-ink-muted max-w-xl">
        Try again, or continue browsing all products.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={reset}>
          Try again
        </Button>
        <LocalizedClientLink
          href="/store"
          className="focus-ring inline-flex items-center min-h-11 px-4 rounded-md bg-brand text-white text-button hover:bg-brand-hover"
        >
          Shop all products
        </LocalizedClientLink>
      </div>
    </div>
  )
}
