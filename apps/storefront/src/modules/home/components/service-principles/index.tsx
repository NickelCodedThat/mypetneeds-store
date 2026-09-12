// Approved factual copy only (GATE-2-UIUX-BLUEPRINT.md section 6, "Section
// 5: Brand service principles"). No guarantees, speeds, or proof points.
const PRINCIPLES = [
  "Clear options and prices",
  "Availability shown before checkout",
  "Built around everyday pet needs",
]

const ServicePrinciples = () => {
  return (
    <section className="content-container py-12 small:py-16">
      <div className="border-t border-border grid grid-cols-1 divide-y divide-border small:grid-cols-3 small:divide-y-0 small:divide-x">
        {PRINCIPLES.map((principle) => (
          <p
            key={principle}
            className="text-body text-ink py-6 small:py-8 small:px-8 small:text-center first:small:pl-0 last:small:pr-0"
          >
            {principle}
          </p>
        ))}
      </div>
    </section>
  )
}

export default ServicePrinciples
