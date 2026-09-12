"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"

import PlaceholderImage from "@modules/common/icons/placeholder-image"
import { clx } from "@modules/common/components/ui"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

/**
 * PDP media area. With no real product photography yet (blueprint section
 * "Image and photography strategy" - placeholder phase), the zero-image
 * state must still read as deliberate: same 4:5 frame, surface/border
 * tokens, and the shared placeholder icon, never blank space or broken-
 * image chrome. When real images exist, only the first gets `priority`.
 */
const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex]

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative w-full aspect-[4/5] overflow-hidden rounded-rounded bg-surface border border-border"
        data-testid="product-image"
      >
        {activeImage?.url ? (
          <Image
            src={activeImage.url}
            alt={`${images.length > 1 ? `Image ${activeIndex + 1} of ${images.length}` : "Product photo"}`}
            className="absolute inset-0 object-contain object-center p-[8%]"
            priority={activeIndex === 0}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div
            className="w-full h-full absolute inset-0 flex items-center justify-center text-ink-muted"
            aria-hidden="true"
          >
            <PlaceholderImage size={40} />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3" role="group" aria-label="Product images">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-pressed={index === activeIndex}
              className={clx(
                "focus-ring relative w-16 h-16 shrink-0 overflow-hidden rounded-rounded bg-surface border transition-colors duration-150 ease-out",
                index === activeIndex
                  ? "border-2 border-brand"
                  : "border-border hover:border-ink-muted"
              )}
            >
              {image.url && (
                <Image
                  src={image.url}
                  alt=""
                  className="absolute inset-0 object-contain object-center p-1"
                  fill
                  sizes="64px"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
