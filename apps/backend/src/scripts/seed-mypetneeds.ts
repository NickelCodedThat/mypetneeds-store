import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createServiceZonesWorkflow,
  createShippingOptionsWorkflow,
  createTaxRegionsWorkflow,
  deleteProductCategoriesWorkflow,
  deleteProductOptionsWorkflow,
  deleteProductsWorkflow,
  updateStockLocationsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Idempotent Gate 1 development seed for MyPetNeeds.
 *
 * Safe to re-run: every step checks existing state first and only creates
 * or changes what's missing. Run with:
 *   pnpm --filter @dtc/backend seed
 * or from the repo root:
 *   pnpm run backend:seed
 */

type MyPetNeedsVariant = {
  title: string
  sku: string
  size: string
  price: number
}

type MyPetNeedsProduct = {
  title: string
  handle: string
  description: string
  category: "Dogs" | "Cats" | "Care & Travel"
  variants: MyPetNeedsVariant[]
}

const STARTER_PRODUCT_HANDLES = ["t-shirt", "sweatshirt", "sweatpants", "shorts"]
const STARTER_CATEGORY_NAMES = ["Shirts", "Sweatshirts", "Pants", "Merch"]
const STARTER_OPTION_TITLES = ["Size", "Color"]

const MYPETNEEDS_CATEGORIES = ["Dogs", "Cats", "Care & Travel"] as const

const MYPETNEEDS_PRODUCTS: MyPetNeedsProduct[] = [
  {
    title: "Orthopedic Dog Bed",
    handle: "orthopedic-dog-bed",
    description:
      "Supportive foam dog bed designed to cushion joints for a comfortable rest, day or night.",
    category: "Dogs",
    variants: [
      { title: "Small", sku: "MPN-BED-ORTHO-SM", size: "Small", price: 59 },
      { title: "Medium", sku: "MPN-BED-ORTHO-MD", size: "Medium", price: 79 },
      { title: "Large", sku: "MPN-BED-ORTHO-LG", size: "Large", price: 99 },
    ],
  },
  {
    title: "Adjustable Everyday Harness",
    handle: "adjustable-everyday-harness",
    description:
      "A comfortable, adjustable harness for daily walks with a secure clip and padded straps.",
    category: "Dogs",
    variants: [
      { title: "Small", sku: "MPN-HARNESS-EVERY-SM", size: "Small", price: 19 },
      { title: "Medium", sku: "MPN-HARNESS-EVERY-MD", size: "Medium", price: 22 },
      { title: "Large", sku: "MPN-HARNESS-EVERY-LG", size: "Large", price: 25 },
    ],
  },
  {
    title: "Slow Feeder Bowl",
    handle: "slow-feeder-bowl",
    description:
      "A ridged feeding bowl that slows down fast eaters to help with digestion and portion pacing.",
    category: "Dogs",
    variants: [{ title: "Standard", sku: "MPN-BOWL-SLOWFEED", size: "Standard", price: 16 }],
  },
  {
    title: "Durable Rope Toy",
    handle: "durable-rope-toy",
    description: "A tough woven rope toy built for tugging, chewing, and fetch.",
    category: "Dogs",
    variants: [{ title: "Standard", sku: "MPN-TOY-ROPE", size: "Standard", price: 12 }],
  },
  {
    title: "Cozy Cat Cave Bed",
    handle: "cozy-cat-cave-bed",
    description: "An enclosed, soft-sided cave bed that gives cats a warm, private place to curl up.",
    category: "Cats",
    variants: [{ title: "Standard", sku: "MPN-BED-CAVECAT", size: "Standard", price: 34 }],
  },
  {
    title: "Interactive Teaser Wand",
    handle: "interactive-teaser-wand",
    description: "A wand toy with a feather attachment for interactive, movement-based play.",
    category: "Cats",
    variants: [{ title: "Standard", sku: "MPN-TOY-WAND", size: "Standard", price: 9 }],
  },
  {
    title: "Ceramic Cat Bowl",
    handle: "ceramic-cat-bowl",
    description: "A weighted ceramic bowl that stays put during mealtime and is easy to clean.",
    category: "Cats",
    variants: [{ title: "Standard", sku: "MPN-BOWL-CERAMIC-CAT", size: "Standard", price: 14 }],
  },
  {
    title: "Litter Catching Mat",
    handle: "litter-catching-mat",
    description: "A textured mat placed outside the litter box to trap stray litter before it spreads.",
    category: "Cats",
    variants: [{ title: "Standard", sku: "MPN-MAT-LITTER", size: "Standard", price: 18 }],
  },
  {
    title: "Pet Travel Water Bottle",
    handle: "pet-travel-water-bottle",
    description: "A leak-resistant bottle with an attached trough for watering pets on the go.",
    category: "Care & Travel",
    variants: [{ title: "Standard", sku: "MPN-TRAVEL-BOTTLE", size: "Standard", price: 15 }],
  },
  {
    title: "Everyday Grooming Brush",
    handle: "everyday-grooming-brush",
    description: "A gentle slicker brush for regular at-home grooming and de-shedding.",
    category: "Care & Travel",
    variants: [{ title: "Standard", sku: "MPN-GROOM-BRUSH", size: "Standard", price: 11 }],
  },
  {
    title: "Waste Bag Dispenser",
    handle: "waste-bag-dispenser",
    description: "A clip-on dispenser that holds a roll of waste bags for walks.",
    category: "Care & Travel",
    variants: [{ title: "Standard", sku: "MPN-WASTE-DISPENSER", size: "Standard", price: 8 }],
  },
  {
    title: "Waterproof Car Seat Cover",
    handle: "waterproof-car-seat-cover",
    description: "A waterproof cover that protects a car's back seat during pet travel.",
    category: "Care & Travel",
    variants: [{ title: "Standard", sku: "MPN-CARSEAT-COVER", size: "Standard", price: 45 }],
  },
]

export default async function seedMyPetNeeds({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // --- Store: MyPetNeeds, USD as default currency (EUR kept for the existing Europe region) ---
  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "name", "default_sales_channel_id", "supported_currencies.currency_code", "supported_currencies.is_default"],
  })
  const store = stores[0]

  const usdIsDefault = store.supported_currencies?.some(
    (c: any) => c.currency_code === "usd" && c.is_default
  )
  if (store.name !== "MyPetNeeds" || !usdIsDefault) {
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          name: "MyPetNeeds",
          supported_currencies: [
            { currency_code: "usd", is_default: true },
            { currency_code: "eur", is_default: false },
          ],
        },
      },
    })
    logger.info("Store updated: name=MyPetNeeds, default currency=USD")
  } else {
    logger.info("Store already configured as MyPetNeeds/USD. Skipping.")
  }

  const defaultSalesChannelId = store.default_sales_channel_id as string

  // --- Region: United States (USD) ---
  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  })
  let usRegion: any = existingRegions.find((r: any) => r.name === "United States")
  if (!usRegion) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "United States",
            currency_code: "usd",
            countries: ["us"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    })
    usRegion = result[0]
    logger.info("Created United States region (USD).")
  } else {
    logger.info("United States region already exists. Skipping.")
  }

  // --- Tax region: US ---
  const { data: existingTaxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code"],
  })
  if (!existingTaxRegions.some((t: any) => t.country_code === "us")) {
    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: "us", provider_id: "tp_system" }],
    })
    logger.info("Created US tax region.")
  } else {
    logger.info("US tax region already exists. Skipping.")
  }

  // --- Stock location: repurpose the starter's single warehouse for MyPetNeeds/US ---
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })
  let stockLocation: any = stockLocations[0]
  if (stockLocation.name !== "MyPetNeeds Fulfillment Center") {
    const { result } = await updateStockLocationsWorkflow(container).run({
      input: {
        selector: { id: stockLocation.id },
        update: {
          name: "MyPetNeeds Fulfillment Center",
          address: {
            city: "Austin",
            country_code: "US",
            address_1: "",
            province: "TX",
          },
        },
      },
    })
    stockLocation = result[0]
    logger.info("Renamed stock location to MyPetNeeds Fulfillment Center (US address).")
  } else {
    logger.info("Stock location already configured for MyPetNeeds. Skipping.")
  }
  // Note: this location was already linked to the fulfillment provider and the
  // default sales channel by the Gate 0 seed; renaming/re-addressing it keeps
  // those links intact rather than duplicating stock-location infrastructure.

  // --- Fulfillment: add a United States service zone to the existing fulfillment set ---
  const { data: fulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id", "name", "service_zones.id", "service_zones.name"],
  })
  const fulfillmentSet = fulfillmentSets[0]
  let usServiceZone: any = fulfillmentSet?.service_zones?.find((z: any) => z.name === "United States")
  if (fulfillmentSet && !usServiceZone) {
    const { result } = await createServiceZonesWorkflow(container).run({
      input: {
        data: [
          {
            name: "United States",
            fulfillment_set_id: fulfillmentSet.id,
            geo_zones: [{ type: "country", country_code: "us" }],
          },
        ],
      },
    })
    usServiceZone = result[0]
    logger.info("Created United States service zone.")
  } else {
    logger.info("United States service zone already exists. Skipping.")
  }

  // --- Shipping profile: reuse the existing default one ---
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "name"],
  })
  const shippingProfile = shippingProfiles[0]

  // --- Shipping option usable for local dev checkout in the US zone ---
  const { data: shippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name", "service_zone_id"],
  })
  const hasUsShippingOption = shippingOptions.some(
    (o: any) => usServiceZone && o.service_zone_id === usServiceZone.id
  )
  if (usServiceZone && !hasUsShippingOption) {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: usServiceZone.id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Ship in 2-3 business days.",
            code: "standard",
          },
          prices: [
            { currency_code: "usd", amount: 7 },
            { region_id: usRegion.id, amount: 7 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    })
    logger.info("Created Standard Shipping option for the United States zone.")
  } else {
    logger.info("US shipping option already exists. Skipping.")
  }

  // --- Remove the stock DTC starter catalog (clothing demo products/categories) ---
  const { data: starterProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: STARTER_PRODUCT_HANDLES },
  })
  if (starterProducts.length) {
    await deleteProductsWorkflow(container).run({
      input: { ids: starterProducts.map((p: any) => p.id) },
    })
    logger.info(`Deleted ${starterProducts.length} starter demo product(s).`)
  } else {
    logger.info("No starter demo products remain. Skipping.")
  }

  // Starter's shared (non-exclusive) "Size"/"Color" options aren't cascade-deleted
  // with their products (they're global option definitions, not product-owned), so
  // they'd otherwise linger and leak into the storefront's options filter.
  const { data: starterOptions } = await query.graph({
    entity: "product_option",
    fields: ["id", "title", "is_exclusive"],
    filters: { title: STARTER_OPTION_TITLES, is_exclusive: false },
  })
  if (starterOptions.length) {
    await deleteProductOptionsWorkflow(container).run({
      input: { ids: starterOptions.map((o: any) => o.id) },
    })
    logger.info(`Deleted ${starterOptions.length} orphaned starter product option(s).`)
  } else {
    logger.info("No orphaned starter product options remain. Skipping.")
  }

  const { data: starterCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
    filters: { name: STARTER_CATEGORY_NAMES },
  })
  if (starterCategories.length) {
    await deleteProductCategoriesWorkflow(container).run({
      input: starterCategories.map((c: any) => c.id),
    })
    logger.info(`Deleted ${starterCategories.length} starter demo categor(y/ies).`)
  } else {
    logger.info("No starter demo categories remain. Skipping.")
  }

  // --- MyPetNeeds categories ---
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  const categoryIdByName = new Map<string, string>(
    existingCategories.map((c: any) => [c.name, c.id])
  )
  const missingCategoryNames = MYPETNEEDS_CATEGORIES.filter((name) => !categoryIdByName.has(name))
  if (missingCategoryNames.length) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategoryNames.map((name) => ({
          name,
          is_active: true,
        })),
      },
    })
    result.forEach((c) => categoryIdByName.set(c.name, c.id))
    logger.info(`Created categories: ${missingCategoryNames.join(", ")}`)
  } else {
    logger.info("MyPetNeeds categories already exist. Skipping.")
  }

  // --- A single "New Arrivals" collection to demonstrate collection support ---
  const { data: existingCollections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "title"],
  })
  let newArrivalsCollection: any = existingCollections.find((c: any) => c.title === "New Arrivals")
  if (!newArrivalsCollection) {
    const { result } = await createCollectionsWorkflow(container).run({
      input: {
        collections: [{ title: "New Arrivals", handle: "new-arrivals" }],
      },
    })
    newArrivalsCollection = result[0]
    logger.info("Created New Arrivals collection.")
  } else {
    logger.info("New Arrivals collection already exists. Skipping.")
  }

  // --- MyPetNeeds development catalog: products, variants, SKUs, USD pricing ---
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })
  const existingHandles = new Set(existingProducts.map((p: any) => p.handle))
  const productsToCreate = MYPETNEEDS_PRODUCTS.filter((p) => !existingHandles.has(p.handle))

  if (productsToCreate.length) {
    await createProductsWorkflow(container).run({
      input: {
        products: productsToCreate.map((p) => ({
          title: p.title,
          handle: p.handle,
          description: p.description,
          status: ProductStatus.PUBLISHED,
          category_ids: [categoryIdByName.get(p.category)!],
          collection_id: newArrivalsCollection!.id,
          shipping_profile_id: shippingProfile.id,
          options: [{ title: "Size", values: p.variants.map((v) => v.size) }],
          variants: p.variants.map((v) => ({
            title: v.title,
            sku: v.sku,
            manage_inventory: true,
            options: { Size: v.size },
            prices: [{ currency_code: "usd", amount: v.price }],
          })),
          sales_channels: [{ id: defaultSalesChannelId }],
        })),
      },
    })
    logger.info(`Created ${productsToCreate.length} MyPetNeeds product(s).`)
  } else {
    logger.info("All MyPetNeeds products already exist. Skipping product creation.")
  }

  // --- Inventory: 25 units per variant at the MyPetNeeds Fulfillment Center ---
  const allSkus = MYPETNEEDS_PRODUCTS.flatMap((p) => p.variants.map((v) => v.sku))
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku", "location_levels.location_id"],
    filters: { sku: allSkus },
  })
  const levelsToCreate = inventoryItems
    .filter(
      (item: any) =>
        !item.location_levels?.some((l: any) => l.location_id === stockLocation.id)
    )
    .map((item: any) => ({
      location_id: stockLocation.id,
      inventory_item_id: item.id,
      stocked_quantity: 25,
    }))

  if (levelsToCreate.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: levelsToCreate },
    })
    logger.info(`Created ${levelsToCreate.length} inventory level(s) at 25 units each.`)
  } else {
    logger.info("Inventory levels already exist for all MyPetNeeds variants. Skipping.")
  }

  logger.info("MyPetNeeds Gate 1 seed complete.")
}
