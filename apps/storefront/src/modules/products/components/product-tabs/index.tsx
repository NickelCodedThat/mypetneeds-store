"use client"

import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDownMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

/**
 * Factual "Product details" (description + any spec fields that actually
 * have data - missing ones are omitted, never shown as "-") and a one-line
 * "Shipping" section. No shipping-speed, exchange, or returns claims -
 * blueprint section 9/"Approved Gate 2 decisions" removed those.
 */
const ProductTabs = ({ product }: ProductTabsProps) => {
  const specs: { label: string; value: string }[] = []

  if (product.material) {
    specs.push({ label: "Material", value: product.material })
  }
  if (product.origin_country) {
    specs.push({ label: "Country of origin", value: product.origin_country })
  }
  if (product.weight) {
    specs.push({ label: "Weight", value: `${product.weight} g` })
  }
  if (product.length && product.width && product.height) {
    specs.push({
      label: "Dimensions",
      value: `${product.length}L x ${product.width}W x ${product.height}H`,
    })
  }

  const hasDetails = !!product.description || specs.length > 0

  return (
    <Accordion.Root
      type="multiple"
      className="flex flex-col divide-y divide-border border-t border-border"
    >
      {hasDetails && (
        <AccordionItem value="details" title="Product details">
          <div className="flex flex-col gap-4">
            {product.description && (
              <p className="text-body text-ink-muted whitespace-pre-line">
                {product.description}
              </p>
            )}
            {specs.length > 0 && (
              <dl className="grid grid-cols-2 gap-x-8 gap-y-3">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-label text-ink-muted">{spec.label}</dt>
                    <dd className="text-body text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </AccordionItem>
      )}
      <AccordionItem value="shipping" title="Shipping">
        <p className="text-body text-ink-muted">
          Shipping options are shown at checkout.
        </p>
      </AccordionItem>
    </Accordion.Root>
  )
}

const AccordionItem = ({
  value,
  title,
  children,
}: {
  value: string
  title: string
  children: React.ReactNode
}) => (
  <Accordion.Item value={value}>
    <Accordion.Header>
      <Accordion.Trigger className="focus-ring group flex w-full items-center justify-between min-h-11 py-2 text-left text-nav text-ink">
        {title}
        <ChevronDownMini
          className="text-ink-muted transition-transform duration-150 ease-out group-radix-state-open:rotate-180"
          aria-hidden="true"
        />
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content className="pb-4">{children}</Accordion.Content>
  </Accordion.Item>
)

export default ProductTabs
