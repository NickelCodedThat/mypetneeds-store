import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

type WordmarkProps = {
  className?: string
}

const Wordmark = ({ className }: WordmarkProps) => {
  return (
    <LocalizedClientLink
      href="/"
      className={clx(
        "focus-ring inline-flex items-center min-h-11 rounded-md text-[22px] small:text-2xl font-bold tracking-[-0.015em] text-ink",
        className
      )}
      data-testid="nav-store-link"
    >
      MyPetNeeds
    </LocalizedClientLink>
  )
}

export default Wordmark
