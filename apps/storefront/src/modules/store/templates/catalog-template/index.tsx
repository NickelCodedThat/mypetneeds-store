import { Suspense } from "react"

import { OptionValueIds } from "@lib/util/product-option-filters"
import Breadcrumbs, { BreadcrumbItem } from "@modules/common/components/breadcrumbs"
import SkeletonCatalogResults from "@modules/skeletons/templates/skeleton-catalog-results"
import { SortOptions } from "@modules/store/components/sort-control"

import CatalogResults, { CATALOG_PAGE_SIZE } from "../catalog-results"

const CATALOG_HEADING_ID = "catalog-heading"

type CatalogTemplateProps = {
  heading: string
  description?: string | null
  breadcrumb?: BreadcrumbItem[]
  sortBy?: SortOptions
  page?: string
  countryCode: string
  collectionId?: string
  categoryId?: string
  optionValueIds?: OptionValueIds
  /** Used only to size the loading skeleton; never the displayed count. */
  estimatedCount?: number
}

/**
 * One shared catalog shell for /store, category, and collection pages
 * (Gate 2B.5 section A): breadcrumb -> h1 -> description -> product count
 * + controls -> grid -> pagination.
 */
const CatalogTemplate = ({
  heading,
  description,
  breadcrumb,
  sortBy,
  page,
  countryCode,
  collectionId,
  categoryId,
  optionValueIds,
  estimatedCount,
}: CatalogTemplateProps) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="content-container py-8 small:py-12">
      {breadcrumb && <Breadcrumbs items={breadcrumb} />}
      <h1
        id={CATALOG_HEADING_ID}
        tabIndex={-1}
        className="text-h1 text-ink"
        data-testid="catalog-page-title"
      >
        {heading}
      </h1>
      {description && (
        <p className="text-body text-ink-muted mt-3 max-w-2xl">{description}</p>
      )}
      <div className="mt-8">
        <Suspense
          fallback={
            <SkeletonCatalogResults numberOfProducts={estimatedCount || CATALOG_PAGE_SIZE} />
          }
        >
          <CatalogResults
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            collectionId={collectionId}
            categoryId={categoryId}
            optionValueIds={optionValueIds}
            headingId={CATALOG_HEADING_ID}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default CatalogTemplate
