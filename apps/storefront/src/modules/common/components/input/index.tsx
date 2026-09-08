import { Label } from "@modules/common/components/ui"
import React, { useEffect, useId, useImperativeHandle, useState } from "react"

import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
  /** Field-level error message. Sets aria-invalid and links via aria-describedby. */
  error?: string
  /** Supporting/help text, not an error. Also linked via aria-describedby. */
  helpText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      name,
      label,
      touched: _touched,
      required,
      topLabel,
      id,
      error,
      helpText,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    // Every shared input needs a stable id the label can target. Callers may
    // supply their own id (preserved); otherwise fall back to `name`, which
    // is already unique per form in this app's field-naming convention
    // (e.g. "shipping_address.first_name"); useId covers the rare case where
    // neither is a safe DOM id.
    const generatedId = useId()
    const inputId = id ?? name ?? generatedId
    const errorId = error ? `${inputId}-error` : undefined
    const helpId = helpText ? `${inputId}-help` : undefined
    const describedBy =
      [helpId, errorId, ariaDescribedBy].filter(Boolean).join(" ") || undefined

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text")
      }

      if (type === "password" && !showPassword) {
        setInputType("password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current!)

    return (
      <div className="flex flex-col w-full">
        {topLabel && (
          <Label htmlFor={inputId} className="mb-2 txt-compact-medium-plus">
            {topLabel}
          </Label>
        )}
        <div className="flex relative z-0 w-full txt-compact-medium">
          <input
            type={inputType}
            name={name}
            id={inputId}
            placeholder=" "
            required={required}
            aria-invalid={ariaInvalid ?? (error ? true : undefined)}
            aria-describedby={describedBy}
            className="focus-ring pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none disabled:cursor-not-allowed disabled:bg-surface-strong disabled:text-ink-muted aria-[invalid=true]:border-error border-ui-border-base hover:bg-ui-bg-field-hover"
            {...props}
            ref={inputRef}
          />
          <label
            htmlFor={inputId}
            onClick={() => inputRef.current?.focus()}
            className="flex items-center justify-center mx-3 px-1 transition-all absolute duration-300 top-3 -z-1 origin-0 text-ui-fg-subtle"
          >
            {label}
            {required && <span className="text-error">*</span>}
          </label>
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus-ring text-ui-fg-subtle px-4 transition-all duration-150 rounded-md focus:text-ui-fg-base absolute right-0 top-3"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
        {helpText && (
          <p id={helpId} className="text-supporting text-ink-muted mt-1">
            {helpText}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-supporting text-error mt-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
