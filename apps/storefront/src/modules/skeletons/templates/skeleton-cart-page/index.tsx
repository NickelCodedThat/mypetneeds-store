import repeat from "@lib/util/repeat"
import SkeletonCartLineItem from "@modules/skeletons/components/skeleton-cart-line-item"
import SkeletonCodeForm from "@modules/skeletons/components/skeleton-code-form"
import SkeletonOrderSummary from "@modules/skeletons/components/skeleton-order-summary"

const SkeletonCartPage = () => {
  return (
    <div className="py-12">
      <div className="content-container">
        <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-8">
          <div className="flex flex-col bg-white p-6 gap-y-6">
            <div className="bg-white flex items-start justify-between">
              <div className="flex flex-col gap-y-2">
                <div className="w-60 h-8 bg-gray-200 animate-pulse" />
                <div className="w-48 h-6 bg-gray-200 animate-pulse" />
              </div>
              <div>
                <div className="w-14 h-8 bg-gray-200 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="pb-3 flex items-center">
                <div className="w-20 h-12 bg-gray-200 animate-pulse" />
              </div>
              <ul>
                {repeat(4).map((index) => (
                  <SkeletonCartLineItem key={index} />
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-y-8">
            <SkeletonOrderSummary />
            <SkeletonCodeForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonCartPage
