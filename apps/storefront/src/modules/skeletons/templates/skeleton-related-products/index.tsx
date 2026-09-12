import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonRelatedProducts = () => {
  return (
    <div className="animate-pulse">
      <div className="flex justify-center mb-10">
        <div className="h-8 w-56 bg-surface-strong rounded" />
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-3 gap-y-8 small:gap-x-6 small:gap-y-10">
        {repeat(4).map((index) => (
          <li key={index}>
            <SkeletonProductPreview />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SkeletonRelatedProducts
