// Purely visual selection indicator. Every caller already places this inside
// an element that owns the real interactive/radio semantics (a Headless UI
// Radio, or a Listbox.Option) - giving this its own role="radio" would nest
// a second radio inside that ancestor's, and the accessible name/state would
// be announced twice. Marked presentational and hidden from the a11y tree
// so the ancestor's own semantics are what assistive tech reports.
const Radio = ({ checked, 'data-testid': dataTestId }: { checked: boolean, 'data-testid'?: string }) => {
  return (
    <span
      aria-hidden="true"
      data-state={checked ? "checked" : "unchecked"}
      className="group relative flex h-5 w-5 items-center justify-center outline-none"
      data-testid={dataTestId || 'radio-button'}
    >
      <div className="shadow-borders-base group-hover:shadow-borders-strong-with-shadow bg-ui-bg-base group-data-[state=checked]:bg-ui-bg-interactive group-data-[state=checked]:shadow-borders-interactive group-focus:!shadow-borders-interactive-with-focus group-disabled:!bg-ui-bg-disabled group-disabled:!shadow-borders-base flex h-[14px] w-[14px] items-center justify-center rounded-full transition-all">
        {checked && (
          <span
            data-state={checked ? "checked" : "unchecked"}
            className="group flex items-center justify-center"
          >
            <div className="bg-ui-bg-base shadow-details-contrast-on-bg-interactive group-disabled:bg-ui-fg-disabled rounded-full group-disabled:shadow-none h-1.5 w-1.5"></div>
          </span>
        )}
      </div>
    </span>
  )
}

export default Radio
