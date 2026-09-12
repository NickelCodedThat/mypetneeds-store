import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@modules/common/components/ui"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className,
  disabled,
  "aria-label": ariaLabel,
  "data-testid": dataTestId,
}: {
  id: string
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  "aria-label"?: string
  "data-testid"?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    await deleteLineItem(id).catch((_err) => {
      setIsDeleting(false)
    })
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        type="button"
        aria-label={ariaLabel ?? "Remove item from cart"}
        data-testid={dataTestId}
        disabled={disabled || isDeleting}
        className="focus-ring inline-flex items-center justify-center min-h-11 min-w-11 rounded-md gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer disabled:pointer-events-none disabled:opacity-60"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton
