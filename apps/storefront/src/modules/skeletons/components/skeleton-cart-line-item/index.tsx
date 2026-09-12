const SkeletonCartLineItem = () => {
  return (
    <li className="flex flex-col gap-3 py-6 border-b border-border last:border-0">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-20 small:w-24 aspect-square rounded-rounded bg-gray-200 animate-pulse" />
        <div className="flex-1 min-w-0 flex flex-col gap-2 pt-1">
          <div className="w-32 h-4 bg-gray-200 animate-pulse" />
          <div className="w-24 h-4 bg-gray-200 animate-pulse" />
        </div>
        <div className="hidden small:block w-20 medium:w-28 shrink-0">
          <div className="w-16 h-4 bg-gray-200 animate-pulse ml-auto" />
        </div>
        <div className="hidden small:block w-20 medium:w-28 shrink-0">
          <div className="w-16 h-4 bg-gray-200 animate-pulse ml-auto" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 pl-24 small:pl-28">
        <div className="w-24 h-11 bg-gray-200 animate-pulse" />
        <div className="w-16 h-4 bg-gray-200 animate-pulse small:hidden" />
      </div>
    </li>
  )
}

export default SkeletonCartLineItem
