import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

// Medusa gives every variant a title even when a product has no
// customer-facing options; a single-variant product's title is
// conventionally "Default variant" or "Standard", which doesn't help the
// shopper and shouldn't be displayed as if it were a real selection.
const isMeaninglessVariantTitle = (title?: string | null) =>
  !title || ["default variant", "standard"].includes(title.trim().toLowerCase())

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {
  if (isMeaninglessVariantTitle(variant?.title)) {
    return null
  }

  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className="inline-block txt-medium text-ui-fg-subtle w-full overflow-hidden text-ellipsis"
    >
      {variant?.title}
    </Text>
  )
}

export default LineItemOptions
