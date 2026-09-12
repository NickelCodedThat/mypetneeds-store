const SkeletonProductPreview = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] w-full rounded-rounded bg-surface-strong" />
      <div className="mt-3 flex flex-col gap-2">
        <div className="w-full h-[44px] bg-surface-strong rounded" />
        <div className="w-2/5 h-[22px] bg-surface-strong rounded" />
      </div>
    </div>
  )
}

export default SkeletonProductPreview
