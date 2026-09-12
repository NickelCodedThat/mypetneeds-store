import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

type HeroProps = {
  /** Live Dogs/Cats/Care & Travel categories, resolved by the page from Medusa data. */
  categories: HttpTypes.StoreProductCategory[]
}

const Hero = ({ categories }: HeroProps) => {
  const dogs = categories.find((category) => category.name === "Dogs")
  const cats = categories.find((category) => category.name === "Cats")

  return (
    <section className="w-full border-b border-border">
      <div className="flex flex-col small:flex-row small:min-h-[460px]">
        <div className="flex-1 small:w-7/12 bg-brand text-white flex flex-col justify-center gap-6 px-6 py-14 small:px-16 small:py-0">
          <h1 className="text-display max-w-lg">For their everyday.</h1>
          <p className="text-body-lg text-white/90 max-w-md">
            Shop practical essentials for dogs, cats, care, and travel.
          </p>
          <div className="flex flex-col gap-4 xsmall:flex-row xsmall:items-center">
            <LocalizedClientLink
              href="/store"
              className="focus-ring inline-flex items-center justify-center min-h-11 px-6 rounded-md bg-page text-brand text-button hover:bg-surface transition-colors duration-150 ease-out"
            >
              Shop all products
            </LocalizedClientLink>
            <div className="flex items-center gap-5">
              {dogs && (
                <LocalizedClientLink
                  href={`/categories/${dogs.handle}`}
                  className="focus-ring inline-flex items-center min-h-11 text-nav underline decoration-white/50 hover:decoration-white underline-offset-4"
                >
                  Shop dogs
                </LocalizedClientLink>
              )}
              {cats && (
                <LocalizedClientLink
                  href={`/categories/${cats.handle}`}
                  className="focus-ring inline-flex items-center min-h-11 text-nav underline decoration-white/50 hover:decoration-white underline-offset-4"
                >
                  Shop cats
                </LocalizedClientLink>
              )}
            </div>
          </div>
        </div>

        {/* Deliberate placeholder for future lifestyle/product photography:
            quiet surface tones and simple geometry, not a finished photo and
            not a "coming soon" message. Purely decorative. */}
        <div
          className="hidden small:block small:w-5/12 relative bg-surface overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-surface-strong" />
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full border-2 border-accent" />
          <div className="absolute left-12 bottom-12 w-44 h-44 rounded-rounded border border-border bg-page" />
        </div>
      </div>
    </section>
  )
}

export default Hero
