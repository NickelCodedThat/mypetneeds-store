import { Metadata } from "next"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">Page not found</h1>
      <p className="text-small-regular text-ui-fg-base">
        The page you tried to access does not exist.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <LocalizedClientLink
          href="/"
          className="focus-ring inline-flex items-center min-h-11 px-4 rounded-md border border-border hover:bg-surface"
        >
          Go to homepage
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/categories/dogs"
          className="focus-ring inline-flex items-center min-h-11 px-4 rounded-md border border-border hover:bg-surface"
        >
          Shop dogs
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/categories/cats"
          className="focus-ring inline-flex items-center min-h-11 px-4 rounded-md border border-border hover:bg-surface"
        >
          Shop cats
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/store"
          className="focus-ring inline-flex items-center min-h-11 px-4 rounded-md bg-brand text-white hover:bg-brand-hover"
        >
          Shop all products
        </LocalizedClientLink>
      </div>
    </div>
  )
}
