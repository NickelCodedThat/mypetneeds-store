import { clx } from "@modules/common/components/ui"
import Image from "next/image"
import React from "react"

import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: { url?: string }[] | null
  /**
   * "full" (default) is the approved 4:5 catalog/homepage media frame.
   * "square" is reserved for compact cart/order-history thumbnails.
   */
  size?: "full" | "square"
  /**
   * No longer changes the media aspect ratio (blueprint section 7: 4:5
   * everywhere except compact square thumbnails). Kept as a no-op prop so
   * existing callers (e.g. the homepage product rail) don't need to change.
   */
  isFeatured?: boolean
  /** Restrained desaturation for a factually out-of-stock product. */
  isUnavailable?: boolean
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "full",
  isUnavailable,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <div
      className={clx(
        "relative w-full overflow-hidden rounded-rounded bg-surface border border-border transition-colors duration-150 ease-out group-hover:border-ink-muted",
        {
          "aspect-[4/5]": size === "full",
          "aspect-square": size === "square",
          "grayscale-[60%]": isUnavailable,
        },
        className
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} />
    </div>
  )
}

const ImageOrPlaceholder = ({ image }: { image?: string }) => {
  return image ? (
    <Image
      src={image}
      alt=""
      className="absolute inset-0 object-contain object-center p-[8%]"
      draggable={false}
      quality={50}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
    />
  ) : (
    <div
      className="w-full h-full absolute inset-0 flex items-center justify-center text-ink-muted"
      aria-hidden="true"
    >
      <PlaceholderImage size={24} />
    </div>
  )
}

export default Thumbnail
