"use client"

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import { ChevronDownMini } from "@medusajs/icons"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

// Approved retail labels (Gate 2B.5 section H) - replaces the previous
// developer-style "Low -> High" / "High -> Low" copy.
const SORT_OPTIONS: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
]

type SortControlProps = {
  sortBy: SortOptions
  "data-testid"?: string
}

const SortControl = ({ sortBy, "data-testid": dataTestId }: SortControlProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const current = SORT_OPTIONS.find((option) => option.value === sortBy) ?? SORT_OPTIONS[0]

  const handleChange = (value: SortOptions) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", value)
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Listbox value={sortBy} onChange={handleChange}>
      <div className="relative">
        <ListboxButton
          aria-label="Sort products"
          data-testid={dataTestId}
          className="focus-ring inline-flex items-center gap-2 min-h-11 px-4 rounded-md border border-border text-nav text-ink hover:bg-surface transition-colors duration-150 ease-out"
        >
          Sort: {current.label}
          <ChevronDownMini aria-hidden="true" />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom end"
          transition
          className="z-20 mt-2 w-56 rounded-md border border-border bg-page shadow-xl py-1 transition duration-100 ease-out data-[closed]:opacity-0 [--anchor-gap:4px]"
        >
          {SORT_OPTIONS.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="cursor-pointer select-none min-h-11 flex items-center px-4 text-nav text-ink data-[focus]:bg-surface"
            >
              {({ selected }) => (
                <span>
                  {selected ? "✓ " : ""}
                  {option.label}
                </span>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}

export default SortControl
