import { Metadata } from "next"

import { getCollectionByHandle } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import CategoryHighlights from "@modules/home/components/category-highlights"
import Hero from "@modules/home/components/hero"
import NewArrivals from "@modules/home/components/new-arrivals"
import ServicePrinciples from "@modules/home/components/service-principles"

export const metadata: Metadata = {
  title: "MyPetNeeds",
  description:
    "Shop practical essentials for dogs, cats, care, and travel.",
}

// Approved Gate 2 primary taxonomy, in blueprint order (matches the shell's
// nav/index.tsx and footer/index.tsx). Categories are still resolved from
// live Medusa data (name + handle) rather than hard-coded.
const PRIMARY_CATEGORY_NAMES = ["Dogs", "Cats", "Care & Travel"]

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const [categories, newArrivalsCollection] = await Promise.all([
    listCategories(),
    getCollectionByHandle("new-arrivals"),
  ])

  const primaryCategories = PRIMARY_CATEGORY_NAMES.map((name) =>
    categories?.find((category) => category.name === name)
  ).filter((category): category is HttpTypes.StoreProductCategory => !!category)

  return (
    <>
      <Hero categories={primaryCategories} />
      <CategoryHighlights categories={primaryCategories} />
      {newArrivalsCollection && (
        <NewArrivals collection={newArrivalsCollection} region={region} />
      )}
      <ServicePrinciples />
    </>
  )
}
