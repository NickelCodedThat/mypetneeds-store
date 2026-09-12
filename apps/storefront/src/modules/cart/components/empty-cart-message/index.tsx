import { Heading, Text } from "@modules/common/components/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div className="py-48 px-2 flex flex-col justify-center items-start" data-testid="empty-cart-message">
      <Heading
        level="h1"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        Cart
      </Heading>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        Your cart is empty. Browse practical essentials by pet or see the full
        catalog.
      </Text>
      <div className="flex flex-wrap gap-3">
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

export default EmptyCartMessage
