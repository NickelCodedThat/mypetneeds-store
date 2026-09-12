import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

/**
 * Desktop: media (left column) and identity/purchase (right column,
 * title above the purchase panel). Mobile: a single `order-*` sequence
 * collapses the same markup into title -> media -> price/variants/CTA
 * (blueprint section 9, "Mobile composition") without duplicating any
 * content between breakpoints.
 */
const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div
        className="content-container py-8 small:py-12 flex flex-col small:grid small:grid-cols-2 small:gap-x-12 small:items-start"
        data-testid="product-container"
      >
        <div className="order-1 small:order-1 small:col-start-2 small:row-start-1 mb-4 small:mb-0">
          <ProductInfo product={product} />
        </div>

        <div className="order-2 small:order-2 small:col-start-1 small:row-start-1 small:row-span-2 small:sticky small:top-24 mb-6 small:mb-0">
          <ImageGallery images={images} />
        </div>

        <div className="order-3 small:order-3 small:col-start-2 small:row-start-2 flex flex-col gap-y-8">
          <Suspense
            fallback={
              <ProductActions disabled product={product} region={region} />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
          <ProductTabs product={product} />
        </div>
      </div>
      <div
        className="content-container my-16 small:my-24"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
