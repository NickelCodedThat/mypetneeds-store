import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  /** Values with no matching variant given the other selected options. */
  unavailableValues?: string[]
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
  unavailableValues = [],
}) => {
  const values = (option.values ?? []).map((v) => v.value)

  return (
    <fieldset className="flex flex-col gap-y-3">
      <legend className="text-supporting text-ink-muted">{title}</legend>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label={title}
        data-testid={dataTestId}
      >
        {values.map((value) => {
          const isSelected = value === current
          const isUnavailable = unavailableValues.includes(value)

          return (
            <button
              type="button"
              onClick={() => updateOption(option.id, value)}
              key={value}
              aria-pressed={isSelected}
              aria-disabled={isUnavailable || undefined}
              disabled={disabled || isUnavailable}
              className={clx(
                "focus-ring min-h-11 min-w-11 px-4 rounded-md text-nav transition-colors duration-150 ease-out",
                isSelected
                  ? "border-2 border-brand text-ink font-semibold"
                  : "border border-border text-ink hover:bg-surface",
                isUnavailable &&
                  "text-ink-muted line-through pointer-events-none opacity-60"
              )}
              data-testid="option-button"
            >
              {value}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default OptionSelect
