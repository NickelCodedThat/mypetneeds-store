import { RefObject, useEffect, useState } from "react"

export const useIntersection = (
  element: RefObject<HTMLDivElement | null>,
  rootMargin: string
) => {
  const [isVisible, setState] = useState(false)

  useEffect(() => {
    if (!element.current) {
      return
    }

    const el = element.current

    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting)
      },
      { rootMargin }
    )

    observer.observe(el)

    return () => observer.unobserve(el)
  }, [element, rootMargin])

  return isVisible
}

/**
 * Reports whether an element has passed above the viewport. Unlike a plain
 * intersection check, this stays false while the element is still below the
 * fold, preventing a sticky duplicate action from appearing before shoppers
 * reach the primary control.
 */
export const useHasPassedViewport = (
  element: RefObject<HTMLDivElement | null>
) => {
  const [hasPassed, setHasPassed] = useState(false)

  useEffect(() => {
    if (!element.current) {
      return
    }

    const el = element.current
    const update = () => {
      setHasPassed(el.getBoundingClientRect().bottom < 0)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)

    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [element])

  return hasPassed
}
