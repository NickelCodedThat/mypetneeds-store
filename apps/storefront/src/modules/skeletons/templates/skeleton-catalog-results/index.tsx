import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

/**
 * Matches the shared catalog shell's count-and-controls row plus product
 * grid (Gate 2B.5), so there's no layout jump when the real results replace
 * this skeleton.
 */
const SkeletonCatalogResults = ({
  numberOfProducts = 8,
}: {
  numberOfProducts?: number
}) => {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-24 bg-surface-strong rounded" />
        <div className="h-11 w-40 bg-surface-strong rounded-md" />
      </div>
      <SkeletonProductGrid numberOfProducts={numberOfProducts} />
    </div>
  )
}

export default SkeletonCatalogResults
