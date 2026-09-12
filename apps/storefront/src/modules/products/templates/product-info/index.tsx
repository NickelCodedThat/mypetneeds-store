import { HttpTypes } from "@medusajs/types"
import Breadcrumbs, { BreadcrumbItem } from "@modules/common/components/breadcrumbs"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  // Product categories aren't requested by the shared product-list query
  // (adding them would mean a new field for this slice alone), so the
  // breadcrumb gracefully falls back to Home / Product Name when absent.
  const category = product.categories?.[0]

  const breadcrumb: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    ...(category
      ? [{ label: category.name, href: `/categories/${category.handle}` }]
      : []),
    { label: product.title, href: `/products/${product.handle}` },
  ]

  return (
    <div className="flex flex-col gap-2">
      <Breadcrumbs items={breadcrumb} />
      <h1 className="text-h1 text-ink" data-testid="product-title">
        {product.title}
      </h1>
    </div>
  )
}

export default ProductInfo
