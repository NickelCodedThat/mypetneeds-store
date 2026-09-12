"use client"

import { clx } from "@modules/common/components/ui"
import ChevronDown from "@modules/common/icons/chevron-down"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function Pagination({
  page,
  totalPages,
  headingId,
  "data-testid": dataTestid,
}: {
  page: number
  totalPages: number
  /** id of the catalog h1, so a page change can move focus/scroll there instead of leaving the shopper at the bottom. */
  headingId?: string
  "data-testid"?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index)

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) {
      return
    }

    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)

    const heading = headingId ? document.getElementById(headingId) : null
    heading?.scrollIntoView({ behavior: "smooth", block: "start" })
    heading?.focus()
  }

  const pageButtonClassName = (isCurrent: boolean) =>
    clx(
      "focus-ring inline-flex items-center justify-center min-h-11 min-w-11 rounded-md text-nav transition-colors duration-150 ease-out",
      isCurrent
        ? "bg-brand text-white"
        : "text-ink hover:bg-surface"
    )

  const renderPageButton = (p: number, isCurrent: boolean) => (
    <button
      key={p}
      type="button"
      aria-label={isCurrent ? `Page ${p}, current page` : `Go to page ${p}`}
      aria-current={isCurrent ? "page" : undefined}
      className={pageButtonClassName(isCurrent)}
      onClick={() => goToPage(p)}
    >
      {p}
    </button>
  )

  const renderEllipsis = (key: string) => (
    <span
      key={key}
      aria-hidden="true"
      className="inline-flex items-center justify-center min-h-11 min-w-11 text-ink-muted"
    >
      &hellip;
    </span>
  )

  const renderPageButtons = () => {
    const buttons = []

    if (totalPages <= 7) {
      buttons.push(...arrayRange(1, totalPages).map((p) => renderPageButton(p, p === page)))
    } else if (page <= 4) {
      buttons.push(...arrayRange(1, 5).map((p) => renderPageButton(p, p === page)))
      buttons.push(renderEllipsis("ellipsis-end"))
      buttons.push(renderPageButton(totalPages, totalPages === page))
    } else if (page >= totalPages - 3) {
      buttons.push(renderPageButton(1, 1 === page))
      buttons.push(renderEllipsis("ellipsis-start"))
      buttons.push(...arrayRange(totalPages - 4, totalPages).map((p) => renderPageButton(p, p === page)))
    } else {
      buttons.push(renderPageButton(1, false))
      buttons.push(renderEllipsis("ellipsis-start"))
      buttons.push(...arrayRange(page - 1, page + 1).map((p) => renderPageButton(p, p === page)))
      buttons.push(renderEllipsis("ellipsis-end"))
      buttons.push(renderPageButton(totalPages, false))
    }

    return buttons
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center w-full mt-12"
      data-testid={dataTestid}
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
          className="focus-ring inline-flex items-center justify-center min-h-11 min-w-11 rounded-md text-ink hover:bg-surface disabled:pointer-events-none disabled:opacity-40 transition-colors duration-150 ease-out"
        >
          <ChevronDown className="rotate-90" size={16} aria-hidden="true" />
        </button>
        {renderPageButtons()}
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
          className="focus-ring inline-flex items-center justify-center min-h-11 min-w-11 rounded-md text-ink hover:bg-surface disabled:pointer-events-none disabled:opacity-40 transition-colors duration-150 ease-out"
        >
          <ChevronDown className="-rotate-90" size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
