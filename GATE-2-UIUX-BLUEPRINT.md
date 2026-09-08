# Gate 2A UI/UX Audit and Storefront Design Blueprint

Project: MyPetNeeds

Scope: customer-facing Medusa storefront

Audit baseline: `04ace530025dc44c9dbd3881c41f38e821e53519`

Canonical remote: `https://github.com/NickelCodedThat/mypetneeds-store.git`

Prepared for: Nick, Tech Bull, and Jason

## 1. Executive design direction

MyPetNeeds should look like a calm, capable pet-care retailer, not a pet-themed template. The visual reference is a well-organized neighborhood pet shop translated into a modern digital storefront: bright natural light, clearly labeled shelves, useful guidance, and a small amount of warm color. Products remain the center of attention.

The recommended identity uses a clean white canvas, a confident blue with a slight cobalt cast, a limited clay-orange accent, dark blue-black text, and one warm but disciplined sans-serif family. Warmth should come from copy, photography, and small accent moments. It should not come from a cream page background, cartoons, paw motifs, or excessive rounding.

The store should feel useful before it feels decorative. Every page must answer the shopper's next question quickly:

- Where am I?
- Is this for my pet or task?
- What does it cost?
- Which option do I need?
- Is it available?
- What happens next?

The direction is intentionally scalable. Navigation is based on stable customer taxonomy, product cards can carry more commerce states later, list pages use URL-backed sorting and pagination, and the visual system does not rely on the launch catalog having only 12 products.

### Design stance

- Physical scene: a pet owner shops on a phone in a bright kitchen or living room, checking size and price while their pet is nearby. The interface must remain crisp in ordinary daylight and easy to operate one-handed.
- Color strategy: restrained. White and cool-tinted neutrals carry most surfaces. Blue supplies recognition and action. Clay orange appears on less than 10 percent of the interface.
- Aesthetic lane: modern retail utility with soft household cues. This is not editorial-magazine design, cartoon branding, luxury fashion, or a SaaS dashboard.
- Motion: quiet confirmation, never entertainment.
- Brand dependency: implementation can begin with a typographic `MyPetNeeds` wordmark. No layout may depend on a future symbol logo.

### Gate 2 outcome

Gate 2 should establish the brand shell, homepage, product cards, catalog pages, product detail page, responsive behavior, and accessibility baseline. Cart and checkout should remain behaviorally untouched until their later gates, apart from preventing global token work from degrading them.

## 2. CURRENT STARTER AUDIT

### Audit method and evidence

The audit covered the complete `apps/storefront` route and component structure, Tailwind and Medusa UI styling, data access boundaries, loading and error components, and the real local application backed by the seeded Medusa catalog. The live store was inspected at 1440 by 1000 and 390 by 844 viewports. The homepage, Dogs category, a three-variant product, mobile menu, empty cart, filled cart, and checkout address step were rendered and exercised. A Large Adjustable Everyday Harness was added to a local cart to verify price and state behavior; no order was placed.

Live evidence:

- The real catalog renders all 12 products and correct category membership.
- The multi-variant harness shows `From $19.00`; selecting Large adds the $25.00 variant to cart correctly.
- The 1440px homepage is 4,567px tall because the sole featured collection renders all 12 products after a 75vh starter hero.
- The 390px homepage uses a stable two-column grid without page-level horizontal overflow.
- The 390px filled cart has a 395px document width, producing horizontal overflow and clipping the Total column.
- The 390px checkout does not overflow, but it keeps paired fields in two narrow columns.
- No browser console warnings or errors appeared during the audited routes.

### Audit health snapshot

Overall: **11/20, acceptable foundation with significant design and accessibility work required**.

- Accessibility: **2/4**. Semantic libraries are present, but shared form labels are not associated, visible focus is inconsistent, several controls lack accessible names, product images use generic alternatives, and many targets are below 44px.
- Performance: **3/4**. Next.js server components, Suspense, `next/image`, and route-level data loading are good foundations. Homepage over-rendering and aggressive PDP image priority need refinement when real images arrive.
- Theming: **2/4**. Medusa semantic UI tokens exist, but there is no MyPetNeeds token layer and hard-coded grays, white, rose, orange, and black remain throughout the storefront.
- Responsive design: **2/4**. Core layouts adapt, yet the cart overflows at 390px, the menu panel exceeds the viewport when margins are included, catalog controls are desktop-shaped on mobile, and checkout fields are too compressed.
- Anti-pattern resistance: **2/4**. The site avoids loud gradients and ornamental clutter, but uses generic Inter, a glassy overlay menu, a wall of identical cards, and framework-demo copy. It reads as a starter rather than a purposeful retailer.

Issue count used for prioritization: 0 P0, 9 P1, 9 P2, and 4 P3.

### Anti-pattern verdict

The current experience fails the distinctiveness test, but it does not look like the usual colorful AI-generated landing page. It looks unmistakably like an uncustomized framework demo. The most visible tells are the `Medusa Store` identity, GitHub hero, generic Inter styling, very tall identical product cards, glass-blurred side menu, and Medusa/Next.js footer promotion.

### What is already good and should remain

- Next.js App Router structure cleanly separates the main storefront and checkout route groups.
- Country-aware URLs and region data remain part of every commerce route.
- Product, category, collection, price, variant, inventory, cart, fulfillment, and payment data stay in Medusa and `src/lib/data`. This boundary must remain.
- Server components fetch catalog data, while client components handle only interactive state.
- Sorting and pagination are URL-backed, which supports back/forward navigation and shareable results.
- `ProductActions` correctly derives valid variants and inventory availability.
- The mobile PDP already has a sticky purchase pattern and an accessible Headless UI dialog foundation.
- Headless UI and Radix provide sound primitives for popovers, dialogs, radio groups, and accordions.
- Skeletons exist for product grids, cart, related products, orders, and other asynchronous surfaces.
- Empty cart and 404 states exist instead of rendering blank pages.
- `next/image` and image sizing hooks are already present for future product photography.
- The two-column mobile product grid is viable for this category and catalog density.

### P1 findings to resolve before Gate 2 approval

1. **No MyPetNeeds identity.** `modules/layout/templates/nav/index.tsx:28-35`, the checkout layout, footer, metadata, and copyright still say `Medusa Store`.
2. **The homepage is a framework advertisement, not a shop.** `modules/home/components/hero/index.tsx:5-25` promotes the starter repository and provides no pet taxonomy, merchandising intent, or brand value.
3. **Primary shopping navigation is absent.** Dogs, Cats, and Care & Travel are hidden in the footer or generic side menu; there is no search decision or catalog-first desktop navigation.
4. **Products without images collapse the PDP's central purpose.** `ImageGallery` maps an empty array and renders no fallback. The live PDP appears as a left information column, a blank center, and a detached action column.
5. **Starter shipping and returns copy makes unsupported promises.** `product-tabs/index.tsx:81-113` claims 3-5 day delivery, simple exchanges, easy returns, and no-questions-asked refunds. None is approved business policy.
6. **Checkout form labels are not programmatically associated.** `common/components/input/index.tsx:42-58` writes `htmlFor={name}` but does not give the input `id={name}`. The email input is exposed with validation-title text rather than `Email` as its accessible name.
7. **Keyboard and naming gaps are systemic.** The menu explicitly removes its focus outline; PDP accordion trigger buttons have no accessible name in the rendered accessibility tree; icon-only footer links and delete controls require verified names.
8. **Touch targets are too small.** Live measurements found 17 visible homepage targets below 44px in at least one dimension. The Menu text is only 31px wide, Cart is 14px high as a nested link, View all is 29px high, and footer links are 15-21px high.
9. **The filled mobile cart horizontally overflows.** At a 390px viewport, the document is 395px wide and the Total column clips. The table model in `cart/templates/items.tsx` and fixed cell sizing in `cart/components/item/index.tsx` are not appropriate for narrow screens.

### P2 findings

- Product media uses a 9:16 aspect ratio in catalog grids and 11:14 for featured cards. The result is unusually tall for mixed pet supplies and wastes space when placeholders are shown.
- The homepage renders every product in New Arrivals. This makes collection size determine homepage length and will become unusable as the catalog grows.
- Mobile catalog pages place the desktop sort rail above the page title, consuming roughly 300px before the first product.
- Category and collection pages do not show product count, current filter summary, clear-all behavior, or a designed no-results state.
- PDP title is an `h2`, leaving the page without an `h1`.
- Related products can render nearly the entire remaining catalog; the audited PDP showed 11 related items.
- The full-screen menu uses decorative `backdrop-blur-2xl`, does not lock body scrolling, and its `w-full` plus `m-2` panel extends beyond a 390px viewport.
- No route-level `error.tsx` exists. Several data failures return `null`, which can produce unexplained blank areas instead of recoverable error states.
- The running storefront requests `/store/locales` during navigation and receives a 404 each time. When localization is not configured, the shell should not issue this unsupported request.

### P3 findings

- Home, category, collection, and PDP metadata still names Medusa; category title construction currently duplicates the suffix.
- Sort labels use developer-style arrows (`Low -> High`) instead of retail language.
- Placeholder image alternatives are generic (`Thumbnail`, `Product image 1`) rather than product-aware.
- The footer exposes Medusa GitHub, documentation, source code, and platform badges to customers.

### What should be restyled

- Global color, typography, spacing, focus, button, input, divider, and surface treatment.
- Wordmark, primary navigation, utility controls, mobile menu, and cart preview.
- Product media frames, product card text hierarchy, prices, and commerce badges.
- Category headers, sorting controls, pagination, and empty states.
- PDP gallery, purchase panel, variants, inventory messaging, accordions, sticky mobile CTA, and related products.
- Footer architecture and all customer-facing metadata.

### What should be structurally changed

- Replace the menu-first desktop header with taxonomy-first navigation.
- Replace the homepage's hero-plus-entire-collection stack with an intentional merchandising sequence.
- Replace the three-column PDP with a media-and-purchase composition.
- Replace desktop-shaped mobile catalog controls with a compact sort/filter action row and bottom sheet.
- Ensure the empty-image PDP still owns visible media space.
- In the later cart gate, replace the mobile table with a responsive list layout.

### What should not be rewritten

- `src/lib/data` commerce calls and Medusa SDK configuration.
- Region, locale, country-code routing, cookies, and cart persistence.
- Variant validity and inventory logic in `ProductActions` unless a specific defect is found.
- Cart totals, fulfillment calculation, payment sessions, and order placement.
- Headless UI and Radix primitives that already provide correct interaction foundations.
- Existing route grouping and server/client boundaries.
- Backend seed data, prices, inventory, categories, and collection assignment.

### Technical frontend risks for Jason

- Medusa UI preset classes and new MyPetNeeds tokens can conflict if raw colors and semantic tokens are mixed. Add a named brand layer and migrate touched components consistently.
- The `small` breakpoint is 1024px, not Tailwind's default. Existing `small:` behavior therefore means laptop, not tablet. Do not assume conventional Tailwind breakpoint names.
- Global body or typography changes can unintentionally restyle cart, checkout, and account pages that are outside Gate 2 implementation scope.
- Cards and PDP share `Thumbnail`, price helpers, and region-aware product types. Keep one media primitive and one price presentation contract.
- Product images are currently absent. All layout acceptance testing must cover both zero images and future multi-image products.
- Related product logic is only a starter query and may return most of the catalog. Gate 2 should cap presentation without inventing recommendation intelligence.
- Locale fetching currently produces repeated `/store/locales` 404 responses. Preserve country routing, but gate or remove locale UI and requests until the backend supports them.
- The Medusa developer skills and documentation MCP described in `AGENTS.md` were not available during this audit. They should be installed or connected before changing Medusa-specific API shapes.

## 3. Brand personality

### Three concrete voice words

- **Soft-woven:** comfortable and domestic, expressed through imagery and humane copy rather than rounded decoration.
- **Clearly labeled:** organized, legible, and honest about price, options, and state.
- **Dependable:** calm, direct, and free of exaggerated promises.

### Voice rules

- Use plain retail language: `Shop dog essentials`, `Choose size`, `Add to cart`, `Shipping options shown at checkout`.
- Keep headings short and useful.
- Address the owner directly only when it clarifies a task.
- Use `pet` when the statement truly covers dogs and cats; otherwise name the animal.
- Do not use baby talk, puns, exclamation-heavy copy, fake urgency, or sentimental claims on every section.
- Do not claim vet approval, sustainability, delivery speed, returns terms, guarantees, popularity, or product quality without approved evidence.

### Wordmark

Use `MyPetNeeds` in title case exactly. Set it in the primary typeface at 700-750 weight with normal casing, approximately 22px on mobile and 24px on desktop. Letter spacing should be between -0.02em and -0.01em. Do not uppercase it. The wordmark must be a text link with an accessible name and enough surrounding area to meet the 44px target.

A future logo may replace or sit beside the text, but the header geometry must not require one. Do not use a paw inside a letter, a pet silhouette, or a cartoon animal as a temporary mark.

## 4. Design system

### Color roles

Use OKLCH custom properties as the source of truth, then map Tailwind utilities and Medusa component variants to semantic names. The following palette was contrast-checked in sRGB.

```css
:root {
  --color-page: oklch(1 0 0);
  --color-surface: oklch(0.97 0.008 242);
  --color-surface-strong: oklch(0.94 0.012 242);
  --color-ink: oklch(0.22 0.025 242);
  --color-ink-muted: oklch(0.45 0.025 242);
  --color-border: oklch(0.86 0.012 242);
  --color-brand: oklch(0.48 0.13 242);
  --color-brand-hover: oklch(0.42 0.12 242);
  --color-accent: oklch(0.72 0.14 48);
  --color-success: oklch(0.46 0.11 150);
  --color-warning: oklch(0.78 0.14 83);
  --color-error: oklch(0.48 0.18 28);
  --color-sale: oklch(0.50 0.18 28);
  --color-focus: oklch(0.52 0.16 242);
}
```

Usage rules:

- Page background: pure white. Do not use cream or beige as the site-wide warmth mechanism.
- Primary text: ink. It has approximately 17.3:1 contrast on white.
- Secondary text: ink-muted. It has approximately 7.4:1 contrast on white and can safely carry real content.
- Dividers: border at 1px. Use surface-strong when a boundary needs more visual weight.
- Brand and primary CTA: brand blue with white text, approximately 6.4:1 contrast.
- Hover CTA: brand-hover with white text, approximately 8.2:1 contrast.
- Accent: clay orange for small merchandising cues, selected category emphasis, and illustration details. Use ink text on an accent fill, not white.
- Success and error: white text when filled. Warning uses ink text on its lighter fill.
- Sale is distinct from error in meaning even if both are red-family colors. Never show a sale treatment without Medusa price data proving a comparison price.
- Focus: a 2px outer ring plus 2px white offset. Do not replace focus with color change alone.
- Disabled controls: surface-strong background, muted text, no shadow, `cursor-not-allowed`, and unchanged readable labels.

### Typography

Recommended family: [Spline Sans](https://fonts.google.com/specimen/Spline%2BSans), served through `next/font/google` or self-hosted as a variable WOFF2. It has open, slightly softened shapes without becoming juvenile. Use one family throughout Gate 2; a second display face is not warranted.

Fallback: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

Type scale:

- Display hero: 48/52 desktop, 38/42 tablet, 34/38 mobile, 700 weight, maximum 16 words.
- Page `h1`: 40/44 desktop, 32/36 mobile, 700.
- Section `h2`: 30/36 desktop, 26/32 mobile, 700.
- Subsection `h3`: 22/28 desktop, 20/26 mobile, 650.
- Body large: 18/28, 450.
- Body: 16/24, 450.
- Small/supporting: 14/20, 450.
- Label/eyebrow: 13/18, 650. Sentence case by default. Uppercase only for badges no longer than four words.
- Product title: 15/22, 600, two-line maximum in grids.
- Price: 15/22, 650, `font-variant-numeric: tabular-nums`.
- Button: 15/20, 650.
- Navigation: 15/20, 600.

Use balanced wrapping on headings and pretty wrapping on descriptions. Limit prose to 65-70 characters per line.

### Spacing and layout

- Base spacing unit: 4px.
- Allowed working steps: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, and 120px.
- Content maximum: 1280px for retail pages; 720px for long-form copy.
- Wide desktop gutters: 48px.
- Laptop gutters: 32px.
- Tablet gutters: 24px.
- Mobile gutters: 20px, with 16px permitted only for dense checkout/cart controls.
- Major section gap: 96-120px desktop, 64-80px tablet, 48-64px mobile.
- Product grid gap: 24px horizontal and 40px vertical desktop; 12px horizontal and 32px vertical mobile.
- Header height: 72px desktop, 64px mobile.

Catalog grid:

- 320-767px: 2 columns.
- 768-1023px: 3 columns.
- 1024-1439px: 4 columns.
- 1440px and above: 5 columns within the 1280px content maximum.

Do not rename breakpoint tokens casually. The current custom `small: 1024px` behavior must either be preserved with clear new aliases or migrated deliberately across touched components.

### Shape language

- Inputs and buttons: 6px radius.
- Product media and substantial surfaces: 8px radius.
- Drawers and bottom sheets: 12px on exposed corners only.
- Chips: full pill only when content is a compact status or selectable value.
- Cards: no outer card container by default. Product media may have a bordered surface, while title and price remain on the page canvas.
- Borders: 1px neutral. Selected options use a 2px brand border without changing layout size.
- Shadows: none on static content. Use a restrained overlay shadow on menus/dialogs and a subtle elevation change on actionable containers only.

### Icons

- Continue using the Medusa icon package where a suitable icon exists.
- Standard sizes: 20px utility, 24px primary control, 16px inline.
- Use 1.75-2px visual stroke weight consistently.
- Every icon-only control requires a visible tooltip on pointer hover and an accessible name.
- Do not use decorative paws, bones, hearts, or animal silhouettes as general-purpose UI icons.

### Interaction and motion

- Hover: 140-180ms color, border, or background transition with an ease-out curve.
- Pressed: small tone shift, not a bouncing scale.
- Drawer/sheet: 200-240ms opacity and translate transition.
- Sticky header: no shrinking or morphing. Add a border or subtle solid shadow only after scroll if needed.
- Product cards: never zoom or move the image on hover. Change title color, media border, or background.
- Loading: preserve geometry and announce meaningful asynchronous updates.
- Reduced motion: remove translations and pulsing; use an instant change or short crossfade.

## 5. Header and navigation

### Desktop structure, 1024px and above

Use a single 72px sticky header on white:

1. Left: `MyPetNeeds` wordmark.
2. Center-left: Dogs, Cats, Care & Travel.
3. Right: Account and Cart with item count.

The taxonomy links must be visible without opening a menu. Active category uses a brand-colored underline or bottom border, not a pill. Keep at least 24px between primary links and 16px between utilities.

Search is omitted from Gate 2. Do not render an icon, empty utility slot, or inert control. Advanced search remains out of scope.

The cart control should be a single link or button, never a button nested around a link. Display `Cart` plus a numeric count on desktop. A compact bag icon plus count is acceptable on narrow widths if its accessible name is `Cart, 1 item`.

### Tablet, 768-1023px

Keep wordmark left and Cart right. Move taxonomy into a menu trigger, or show Dogs and Cats while placing Care & Travel in the menu if measured space supports it. Account may become an icon with an accessible label. Do not compress text below comfortable tap sizes.

### Mobile, below 768px

- Wordmark left, then Account and Cart icon controls right.
- A labeled Menu control may lead or trail utilities, but must be at least 44 by 44px.
- Menu opens a full-height solid-white drawer, maximum 360px wide on larger phones and full viewport width on small phones.
- First group: Dogs, Cats, Care & Travel, Shop all.
- Second group: Account, Cart.
- Third group: country/locale controls only when meaningful.
- Lock page scroll, trap focus, focus the close button on open, restore focus to Menu on close, close on Escape, and avoid blur-heavy glass treatment.

### Sticky and promo behavior

Keep the header sticky on catalog and PDP routes. On checkout, retain the simplified back-and-wordmark header.

Do not render an announcement bar during Gate 2. Define an optional 32-36px slot that may be enabled later only with approved, true content. No fake discount, shipping threshold, or urgency copy.

## 6. Homepage architecture

The homepage must introduce the brand, expose the primary taxonomy immediately, and offer a controlled sample of the catalog. It must not mirror collection size.

### Section 1: Commerce hero, required now

- Purpose: tell shoppers what the store sells and offer a clear entry.
- Content: heading `For their everyday.` Supporting copy: `Shop practical essentials for dogs, cats, care, and travel.` Primary action: `Shop all products`. Secondary text links: `Shop dogs` and `Shop cats`.
- Desktop: 7/5 split, 440-500px tall. Copy sits on a solid brand-blue field; the right side uses the approved neutral media placeholder and preserves its final size rather than collapsing.
- Mobile: copy first in a 360-420px section, followed by media or a compact category band. Keep the primary action fully visible in the initial viewport below the header.
- Interaction: links only. No carousel, autoplay, parallax, or video.
- Data: category URLs and approved static brand copy. Real photography is later work.

### Section 2: Shop by pet and task, required now

- Purpose: expose Dogs, Cats, and Care & Travel as the primary mental model.
- Content: three large category links with one short truthful descriptor each.
- Desktop: Dogs and Cats receive equal visual weight; Care & Travel may span a shorter third panel or horizontal band.
- Mobile: three stacked 104-128px rows with clear labels and arrow affordances.
- Interaction: whole region is one link, with border/background hover and visible focus.
- Data: Medusa categories by handle and description. Do not hard-code product counts.

### Section 3: New arrivals, required now

- Purpose: show current merchandise without dumping the full collection.
- Content: title, `View new arrivals` link, maximum 4 products on desktop and 4 on mobile.
- Desktop: four-column row.
- Mobile: two-by-two grid. Do not use a horizontal carousel at Gate 2.
- Data: Medusa `New Arrivals` collection, region-aware prices.

### Section 4: Everyday routines, omitted from Gate 2

- Rationale: the current catalog does not provide enough truthful data destinations for a useful task-based section.
- Implementation: do not render this section during Gate 2 and do not hard-code product destinations.

### Section 5: Brand service principles, required now

- Purpose: explain how the storefront helps without inventing guarantees.
- Content: `Clear options and prices`, `Availability shown before checkout`, and `Built around everyday pet needs`.
- Layout: open three-column text row separated by dividers, not three rounded cards. Stack on mobile.
- Data: verified storefront behavior and region configuration.

### Section 6: Secondary merchandising, later

- Possible future modules after separate approval: best sellers, seasonal edits, editorial guides, and promotional campaigns.
- Do not build until there is supporting data, approved content, and a merchandising owner.

### Footer transition

End with a quiet brand-blue or surface-strong band containing a concise `Shop by category` set. Do not add a newsletter form until consent language, provider, data handling, and success/error behavior are approved.

## 7. Product-card system

### Required anatomy

1. Product media frame.
2. Optional data-backed status label.
3. Category eyebrow when it improves scanning.
4. Product title.
5. Price or `From` price.
6. Optional variant cue such as `3 sizes` when it can be derived reliably.
7. Stock state only when unavailable or genuinely low.

### Presentation

- Image ratio: 4:5 across homepage and catalog. Use square only for compact cart/order thumbnails.
- Image treatment: surface background, 8px radius, 1px border, `object-contain`, and roughly 8 percent interior breathing room for cutout product photography.
- Placeholder: same 4:5 frame with a quiet product-image icon and a visually hidden description. Do not show broken-image chrome. For linked cards, decorative placeholder SVG should be `aria-hidden` because the link already names the product.
- Title: two-line maximum using a fixed two-line text area so prices align. Never truncate to one line on mobile.
- Price: align beneath the title, left on all viewports. Do not split title left and price right in narrow cards.
- Sale readiness: calculated sale price first, original price struck through second, optional `Sale` text badge. Never convey sale by color alone.
- Out of stock: keep card navigable; show `Out of stock` text and reduce only the media saturation, not all content opacity.

### Interaction

- Entire card is a semantic product link.
- Hover changes media border/surface and title color. No image scale, rotation, or translate.
- Focus ring encloses the whole card and remains visible over the page and media surface.
- Do not nest buttons inside the card link.

### Quick add and wishlist

Do not implement wishlist in Gate 2.

Do not implement quick add in Gate 2. The catalog includes products with required size selection, and a mixed quick-add behavior would add complexity and error risk. Revisit after analytics show that repeat purchase or simple-product speed justifies it.

### Responsive grid

Use the grid defined in the design system. At 390px, cards should be about 169px wide with a 12px gap and 20px outer gutters. Test the longest current titles and a synthetic 70-character title. Price must never collide with or sit immediately beside a wrapped title.

## 8. Category and collection UX

Category, collection, and All Products should share one catalog shell.

### NOW

- Page header contains breadcrumb when nested, `h1`, optional approved category description, and product count from the Medusa response.
- Keep URL-backed sorting with labels `Newest`, `Price: low to high`, and `Price: high to low`.
- Use numbered pagination with previous/next controls. Keep the query parameter and scroll to the catalog heading after navigation. A 24-product page size is the recommended scalable default.
- Desktop controls sit in one horizontal row above the grid. Sorting aligns right. A filter control appears only when useful options exist.
- Mobile uses two 44px controls, `Filter` and `Sort`, in a compact row below the header. Each opens an accessible bottom sheet. If filters are not available for a category, show Sort only.
- Selected filters display as removable chips with `Clear all` when at least one filter is active.
- Empty category: explain that no products are currently listed and link to `Shop all products`.
- No-results after filtering: say `No products match these filters`, offer `Clear filters`, and preserve the category context.

### LATER

- Search results, predictive search, facet counts, price range, brand/vendor facets, ratings, infinite scroll, saved filters, personalization, and merchandising rules.
- Prefer pagination over load more until analytics and SEO requirements justify a change.

### Data and architecture

- Continue using `PaginatedProducts`, `listProductsWithSort`, region pricing, and URL search parameters.
- Extend the shared catalog response to expose `count` to the header rather than issuing a second request.
- Reuse one Sort sheet and one Filter sheet across store, category, and collection routes.
- Do not hard-code category names or counts into page components.

## 9. Product detail page blueprint

### Desktop composition

Use a two-column layout within 1280px:

- Left, 58-62 percent: media gallery.
- Right, 38-42 percent: sticky purchase panel, top offset equal to header plus 32px.

Place breadcrumb above both columns. Move title, price, short description, variants, availability, quantity decision, and Add to cart into the purchase column. Product details and approved shipping/returns information follow below the primary action. Related products span the page after the main section.

### Media gallery

- Zero images: render one 4:5 placeholder, never an empty column.
- One image: one large 4:5 or square-leaning frame depending on asset dimensions.
- Two or more images: large primary frame with selectable thumbnails. Do not preload more than the first visible image.
- Support variant-specific image changes without resetting the shopper's scroll unexpectedly.
- Future zoom must be an explicit control and keyboard operable; do not use hover-only magnification.

### Purchase hierarchy

1. Breadcrumb: `Dogs / Harnesses` when data exists.
2. Product `h1`.
3. Current variant price or `From` price before selection.
4. Short description.
5. Variant selectors grouped by option with a semantic legend.
6. Availability message.
7. Quantity.
8. Primary Add to cart button.
9. Factual fulfillment note.
10. Product detail accordions.

Variant buttons must have at least 44px height and expose selected state with `aria-pressed` or a radio pattern. Invalid combinations must be disabled and explain why when relevant. When price changes with a variant, announce the new price politely to assistive technology.

Availability states:

- No selection: `Choose a size` and keep the main CTA focused on completing that action.
- In stock: `In stock` may be shown after selection.
- Out of stock: show `Out of stock`, keep the option understandable, and disable Add to cart.
- Low stock: do not invent scarcity. Show only when a documented threshold and accurate inventory value are approved.

Quantity recommendation: default to one. Add a stepper only when it can respect real variant inventory and accessible increment/decrement semantics. Do not copy the cart's hard-coded maximum of 10.

Fulfillment copy for Gate 2: `Shipping options are shown at checkout.` Hide returns content until policy language is approved. Remove all starter timing, exchange, refund, and hassle-free claims.

### Mobile composition

Order content as breadcrumb, media, title, price, description, options, availability, CTA, product details, related products.

The sticky purchase bar appears only after the primary action scrolls out of view. Keep it to roughly 72px plus safe-area inset:

- Before a required option is selected: price plus `Choose options`, which opens the options sheet.
- After a valid selection: current price plus `Add to cart`.
- Do not show a disabled `Select variant` beside a separate options button.
- Do not repeat the full product title in a two-line sticky bar.

The options sheet must focus its heading or close control, trap focus, close on Escape, restore focus, and expose selected state. Include bottom padding for `env(safe-area-inset-bottom)`.

### Product details

- Accordion triggers must include their visible label in the accessible button name.
- Product information rows with missing values should be omitted, not displayed as dashes.
- Use approved supplier specifications only.
- Keep description visible; do not hide all meaningful content in accordions.

### Related products

- Gate 2 maximum: 4 products desktop, 4 products mobile in a two-by-two grid.
- Heading: `More for everyday care` or similarly specific approved copy.
- Use existing collection/tag/category data only. Do not imply personalization.
- If no meaningful set exists, omit the module.

### PDP error states

- Add-to-cart failure: persistent inline error adjacent to CTA, `role="alert"`, plain-language retry.
- Variant unavailable after selection: preserve the selection, explain the state, and prevent submission.
- Image failure: fall back to the designed placeholder without shifting layout.
- Product missing: branded 404 with routes to Dogs, Cats, and Shop all.

## 10. Cart and checkout future principles

**FUTURE IMPLEMENTATION. Do not implement during Gate 2.**

### Cart

- Desktop: line items left, 360-400px sticky summary right.
- Mobile: replace the data table with stacked line-item rows. Media and product information occupy the first row; quantity, remove, and total form a second row. This will fix the current 390px overflow.
- Quantity controls must have visible labels, loading state, error recovery, and real inventory limits.
- Remove is an icon button with `Remove Adjustable Everyday Harness` as its accessible name.
- Pricing order: unit price when helpful, line total, subtotal, shipping/tax pending labels, final total.
- Keep promotion entry collapsed until requested, but make the control 44px tall.
- Empty cart should provide Dogs, Cats, and Shop all routes, not only generic copy.

### Checkout

- Preserve the existing address, delivery, payment, review sequence and commerce actions.
- Add a visible four-step progress indicator with current, completed, and future states. It must not be the only way to navigate or convey progress.
- Use one-column fields at 390px. Allow two columns from 640px for natural pairs such as first/last name and city/state.
- Labels remain visible above or within controls but must always be programmatically associated.
- Required markers need a text explanation once per form.
- Errors appear next to fields, summarize at the top after submit, receive focus when appropriate, and use `aria-describedby` plus `aria-invalid`.
- Delivery and payment choices use full-row radio controls with clear price and state.
- Order summary is sticky only when it fits without hiding form content. On mobile it appears after the active step, with a compact expandable summary near the top only if testing proves useful.
- The final Place order action must show total and loading state, resist duplicate submission, and never be hidden below an ambiguous disabled section.

## 11. Footer

### Gate 2 structure

- Brand column: MyPetNeeds wordmark.
- Destinations: Dogs, Cats, Care & Travel, New Arrivals, All Products, and Account.
- Utility row: copyright plus country/currency only if still needed.
- Do not render Help, Company, Policy, newsletter, or social headings, slots, controls, or links during Gate 2.

Desktop uses an open layout with a top divider and 64-80px padding. Mobile keeps the six real destinations immediately visible; no empty accordions are rendered.

Newsletter and social remain out of scope. Do not render placeholder slots, an email form, or empty social icons.

Remove all customer-facing Medusa GitHub, documentation, source-code, and Next.js promotional attribution. Retain repository licensing and legal files.

## 12. Responsive behavior

### Around 390px iPhone

- 20px gutters and 12px product-grid gap.
- Two-column product grid, one-column checkout fields, full-width primary actions.
- Full-width navigation drawer with no horizontal overflow.
- Product titles reserve two lines and prices sit below.
- PDP sticky action respects the safe area and does not cover content.
- Cart uses responsive rows, not a wide table.
- Minimum 44px touch target for every control.

### Larger mobile, 430-767px

- Keep two product columns; slightly increase gap only if each card remains at least 180px.
- Category sheets and PDP options sheet may use a centered maximum width while still touching the bottom edge.
- Avoid adding a third product column merely because it fits mathematically.

### Tablet, 768-1023px

- Three product columns.
- Compact header or menu-assisted taxonomy.
- PDP may remain two columns only when each side is usable at 768px; otherwise keep a stacked layout through 899px.
- Cart stays one column with summary below items until approximately 960px.

### Laptop, 1024-1439px

- Full taxonomy header.
- Four product columns.
- Two-column PDP and cart summary layout.
- Use 32px gutters and avoid the current 40px cart column gap when it compresses line items.

### Wide desktop, 1440px and above

- Cap content at 1280px.
- Five product columns for catalog pages; keep featured homepage rows to four when stronger merchandising is desired.
- Do not stretch media or text to fill the viewport.
- Increase outer whitespace, not component scale.

### Reflow and zoom

At 200 percent browser zoom, pages must reflow without loss of content or horizontal scrolling except where a genuinely two-dimensional data surface requires it. The storefront currently has no such customer-facing data surface.

## 13. Accessibility requirements

Gate 2 targets WCAG 2.1 AA.

- Add a first-focus `Skip to main content` link and a stable `main` target.
- Use one `h1` per page. Do not skip heading levels.
- All interactive elements must be semantic links, buttons, inputs, or recognized composite widgets. Never nest a button inside a link.
- Every interactive element must be keyboard reachable in a logical order.
- Every focused control must show the 2px brand focus ring with white offset.
- Repair `Input` by assigning a stable input ID and matching label `htmlFor`. Use `useId` when name alone is not unique.
- Associate field help and errors through `aria-describedby`; set `aria-invalid` when invalid.
- Give asynchronous errors `role="alert"`; use polite live regions for price, cart-count, and loading completion where appropriate.
- Name icon-only menu, account, cart, close, remove, gallery, accordion, quantity, and pagination controls.
- Maintain at least 4.5:1 contrast for normal text, 3:1 for large text and control boundaries, and 3:1 for focus indicators.
- Never use color alone for sale, selection, success, error, or availability.
- Minimum touch target: 44 by 44px. Closely spaced links need at least 8px separation.
- Product card image alt: use concise product identification only when the image adds information. If the linked product title immediately names the same destination, empty alt is preferred to repetition.
- PDP gallery alt: `Adjustable Everyday Harness, front view`, `... buckle detail`, or similarly content-specific text supplied with image metadata. Do not use `Product image 1`.
- Modal/drawer behavior: focus entry, focus trap, Escape close, labeled title, body scroll lock, focus restoration.
- Honor `prefers-reduced-motion`. Skeleton pulse, drawers, accordions, and sticky transitions all need reduced alternatives.
- Verify at 200 percent zoom, keyboard only, VoiceOver/Safari, and one Chromium screen reader combination.

## 14. Loading, empty, and error-state direction

### Loading

- Skeleton dimensions must exactly match final card and page geometry to prevent layout shift.
- Use 4:5 product skeletons after the card change.
- Limit pulse animation and disable it for reduced motion.
- Buttons retain their label or provide equally descriptive loading text; prevent repeat actions.
- Do not skeleton the entire persistent header.

### Empty

- Empty cart: short message plus Shop dogs, Shop cats, and Shop all products.
- Empty category/collection: explain availability without blaming the shopper.
- Filter no-results: preserve filters, show clear/reset action.
- Related products: omit the section.
- Missing product information: omit empty rows rather than showing `-`.

### Error

- Add route-level `error.tsx` for the main storefront and checkout route groups.
- Main error: `We couldn't load this page`, Retry, and Shop all products.
- Catalog error: keep category title and offer Retry.
- Cart mutation error: keep the prior quantity and explain that the update failed.
- Checkout error: never clear entered fields; place focus on the error summary after submit.
- 404 copy: use `Go to homepage`, not `Go to frontpage`, and provide category routes.
- Never expose raw Medusa exception text when it is not actionable or safe.

## 15. Image and photography strategy

### Product photography

- Primary catalog asset: isolated product on a true white or very light cool-neutral background, consistent camera height and scale.
- Standard crop: 4:5 with safe space around the object.
- PDP sequence: hero angle, alternate angle, material/detail, scale/context, and usage when available.
- Preserve honest color; avoid heavy filters and fake depth effects.
- Provide at least 1600px on the long edge for PDP originals and optimized responsive derivatives through Next.js.

### Lifestyle photography

- Natural daylight in real homes, cars, entryways, or outdoor routines relevant to the product.
- Pets appear comfortable and unstaged. Avoid costumes, exaggerated expressions, cartoon props, and saturated studio backdrops.
- Show a credible mix of pet sizes, breeds, homes, and owners over time.
- Leave intentional negative space for homepage copy only when art direction planned for that placement.

### Placeholder phase

- Use solid neutral surfaces and one consistent line icon.
- Preserve final aspect ratio and layout height.
- Never substitute unrelated stock pet photography for a specific product.
- Treat placeholder SVGs as decorative when adjacent text supplies the accessible name.

## 16. What NOT to build yet

- Vendor, supplier, or marketplace interfaces.
- Subscriptions, loyalty, rewards, referrals, or memberships.
- AI shopping or recommendation features.
- Reviews, ratings, fake testimonials, press, or customer statistics.
- Wishlist.
- Quick add.
- Predictive or advanced search.
- Infinite scroll.
- Personalization and recently viewed products.
- Newsletter capture without an approved provider and consent flow.
- Social feed integrations.
- Fake promotions, discounts, timers, guarantees, shipping promises, returns promises, or low-stock urgency.
- New backend modules or duplicated/hard-coded commerce data.
- Cart or checkout redesign during Gate 2.
- A temporary novelty logo.
- A second type family without a clear brand need.

## 17. JASON IMPLEMENTATION MAP

### 2B.0: Approved direction handoff

Purpose: confirm that the approved decisions in section 19 are attached to the implementation slices.

Likely artifacts: this blueprint and task acceptance notes. No storefront code.

Keep untouched: all application code and Medusa data.

Acceptance criteria:

- Section 19 is treated as final product direction for Gate 2.
- Unsupported shipping/returns copy is scheduled for removal.
- Required homepage category handles are confirmed from Medusa.

Dependencies: none.

### 2B.1: Tokens, typography, and accessible primitives

Purpose: create the reusable visual foundation before page styling.

Likely files:

- `apps/storefront/src/styles/globals.css`
- `apps/storefront/tailwind.config.js`
- `apps/storefront/src/app/layout.tsx`
- `apps/storefront/src/modules/common/components/ui/index.tsx`
- `apps/storefront/src/modules/common/components/input/index.tsx`
- shared link, button, select, divider, modal, and radio components as needed

Keep untouched: `src/lib/data`, backend, cart/checkout actions, lockfile, and dependencies.

Acceptance criteria:

- Semantic tokens match the approved palette and do not mix raw colors in touched primitives.
- Spline Sans loads without layout flash beyond the accepted font strategy.
- Focus ring, button sizes, disabled states, labels/IDs, errors, and reduced motion are correct.
- Checkout and account pages remain legible even though their redesign is later.
- No new dependency is added.

Dependencies: 2B.0.

### 2B.2: Global shell, header, navigation, and footer

Purpose: replace the starter identity and make taxonomy visible.

Likely files:

- `modules/layout/templates/nav/index.tsx`
- `modules/layout/components/side-menu/index.tsx`
- `modules/layout/components/cart-button/index.tsx`
- `modules/layout/components/cart-dropdown/index.tsx`
- `modules/layout/templates/footer/index.tsx`
- `modules/layout/components/medusa-cta/index.tsx`
- main and checkout layouts
- route metadata under `src/app`

Keep untouched: cart logic, locale/region functions, payment, and fulfillment.

Acceptance criteria:

- MyPetNeeds appears everywhere customers currently see Medusa Store.
- Dogs, Cats, and Care & Travel are visible on desktop.
- Mobile drawer has no overflow, locks scroll, traps/restores focus, and closes by Escape.
- No nested interactive elements.
- No inert search control is shipped.
- Footer exposes only real destinations.

Dependencies: 2B.1.

### 2B.3: Product media, card, price, and shared commerce states

Purpose: establish the repeated shopping unit before page composition.

Likely files:

- `modules/products/components/thumbnail/index.tsx`
- `modules/products/components/product-preview/index.tsx`
- `modules/products/components/product-preview/price.tsx`
- `modules/common/icons/placeholder-image.tsx`
- product grid and skeleton components

Keep untouched: price calculation helpers, Medusa product types, cart actions.

Acceptance criteria:

- 4:5 media works with missing and real images.
- Long titles, From price, sale readiness, and out-of-stock state do not shift the grid.
- Cards meet focus and accessible-name requirements.
- No image hover transform.
- All target grid counts work at 390, 768, 1024, and 1440px.

Dependencies: 2B.1.

### 2B.4: Homepage

Purpose: turn the starter landing page into a brand and merchandising entry.

Likely files:

- `src/app/[countryCode]/(main)/page.tsx`
- `modules/home/components/hero/index.tsx`
- `modules/home/components/featured-products/index.tsx`
- `modules/home/components/featured-products/product-rail/index.tsx`
- new focused home components for category navigation, routines, and service principles

Keep untouched: collection/category data services and backend catalog.

Acceptance criteria:

- Section order matches this blueprint.
- Homepage renders a bounded four-product New Arrivals sample.
- Every commerce module uses Medusa data.
- Zero-image catalog remains deliberate and stable.
- No unsupported facts or fake promotional content appear.
- Initial mobile viewport exposes brand purpose and a shopping action.

Dependencies: 2B.2 and 2B.3.

### 2B.5: Store, category, and collection shell

Purpose: make browsing scalable and mobile-appropriate.

Likely files:

- `modules/store/templates/index.tsx`
- `modules/store/templates/paginated-products.tsx`
- `modules/store/components/refinement-list/**`
- `modules/store/components/pagination/index.tsx`
- `modules/categories/templates/index.tsx`
- `modules/collections/templates/index.tsx`
- product-grid skeletons

Keep untouched: product query semantics beyond exposing count/page size, category data, and backend.

Acceptance criteria:

- Shared shell presents heading, description, count, controls, grid, and pagination in consistent order.
- Mobile sort/filter sheets are keyboard and screen-reader operable.
- URL state survives refresh and back/forward.
- Empty and no-results states are distinct.
- Current categories with only four products do not look broken.

Dependencies: 2B.2 and 2B.3.

### 2B.6: Product detail page

Purpose: create the highest-confidence purchase experience without changing commerce rules.

Likely files:

- `modules/products/templates/index.tsx`
- `modules/products/templates/product-info/index.tsx`
- `modules/products/components/image-gallery/index.tsx`
- `modules/products/components/product-actions/**`
- `modules/products/components/product-price/**`
- `modules/products/components/product-tabs/**`
- `modules/products/components/related-products/index.tsx`
- PDP route metadata

Keep untouched: variant calculation, inventory rules, `addToCart`, product data, and checkout.

Acceptance criteria:

- PDP has one `h1`, visible media fallback, correct current price, understandable variant state, and truthful fulfillment copy.
- All three harness sizes select correctly and add the correct $19/$22/$25 variant.
- Simple products remain easy to add.
- Sticky mobile CTA does not duplicate or obscure controls.
- Related products cap at four.
- Add-to-cart errors are announced and recoverable.

Dependencies: 2B.2 and 2B.3.

### 2B.7: State, responsive, accessibility, and regression pass

Purpose: close cross-page gaps and prepare JD review.

Likely files: route-level error/loading/not-found files, skeletons, touched Gate 2 components, test files if added within existing tooling.

Keep untouched: cart/checkout visual redesign, backend, database, and lockfile.

Acceptance criteria:

- No horizontal overflow from 320px through 1920px on Gate 2 surfaces.
- Keyboard, focus, headings, labels, names, announcements, contrast, touch targets, text zoom, and reduced motion meet section 13.
- Loading, empty, failure, no-image, long-title, out-of-stock, and multi-variant states pass.
- Cart and checkout commerce behavior remains functional and no less accessible after global changes.
- Lint and build pass except only explicitly documented pre-existing issues, with no Medusa rule disabled.

Dependencies: 2B.4, 2B.5, and 2B.6.

## 18. QA checklist JD will use after Jason implements

### Brand and content

- [ ] MyPetNeeds wordmark is spelled and cased consistently.
- [ ] No visible Medusa Store, starter-template, GitHub, documentation, source-code, or Next.js promotional copy remains on customer pages unless legally required.
- [ ] No fake shipping, returns, guarantee, review, statistic, certification, promotion, or scarcity claim appears.
- [ ] Dogs, Cats, and Care & Travel are the primary navigation taxonomy.
- [ ] Typography, color, radius, border, and motion follow the approved tokens.

### Commerce data

- [ ] All 12 products render from Medusa with correct USD prices.
- [ ] All 16 variants remain selectable where applicable.
- [ ] Harness and orthopedic bed show correct From pricing before selection and exact price after selection.
- [ ] Add to cart adds the selected variant and updates the count.
- [ ] Out-of-stock and invalid combinations cannot be added.
- [ ] No storefront component contains hard-coded product, price, inventory, category count, or cart data.

### Viewports

- [ ] 320x568 minimum mobile smoke test.
- [ ] 390x844 iPhone baseline.
- [ ] 430x932 larger phone.
- [ ] 768x1024 tablet portrait.
- [ ] 1024x768 small laptop/tablet landscape.
- [ ] 1440x900 laptop/desktop.
- [ ] 1920x1080 wide desktop.
- [ ] No unintended horizontal overflow at any viewport.
- [ ] Content remains usable at 200 percent zoom and with larger system text.

### Header and footer

- [ ] Header remains stable during scroll and does not cover anchored content.
- [ ] Desktop taxonomy is visible and active state is clear.
- [ ] Mobile menu locks scroll, traps focus, closes by Escape/backdrop/close, and restores focus.
- [ ] Account and Cart have accurate accessible names and 44px targets.
- [ ] Search is absent and no inert search control or empty slot is rendered.
- [ ] Footer links all resolve to real destinations.

### Homepage

- [ ] Hero uses the approved placeholder strategy and does not depend on real photography.
- [ ] Primary action is visible and understandable on mobile.
- [ ] Category links route correctly.
- [ ] New Arrivals is capped and uses live collection data.
- [ ] Homepage length does not grow with full collection size.
- [ ] Section rhythm is varied and not a wall of cards.

### Cards and catalog

- [ ] Card media is 4:5 and does not move on hover.
- [ ] Long titles reserve two lines without colliding with prices.
- [ ] Sale and stock states include text, not color only.
- [ ] Sort labels and active selection are clear.
- [ ] Pagination preserves URL state and focus context.
- [ ] Mobile sort/filter sheets are operable by keyboard and screen reader.
- [ ] Empty category and filtered no-results states use the correct action.

### PDP

- [ ] Exactly one `h1` names the product.
- [ ] Zero-image PDP renders a deliberate media placeholder.
- [ ] Gallery has product-specific alternatives when real images exist.
- [ ] Variant selection exposes name, selected state, invalid state, price change, and availability.
- [ ] All primary controls meet 44px target size.
- [ ] Mobile sticky CTA appears at the right scroll point, respects safe area, and does not cover content.
- [ ] Shipping/returns accordions contain only approved facts and have named triggers.
- [ ] Related products show no more than four relevant items.

### Accessibility

- [ ] Skip link works.
- [ ] Keyboard focus is always visible.
- [ ] Heading order is logical.
- [ ] No nested interactive controls.
- [ ] Every form label is programmatically associated.
- [ ] Errors are associated, announced, and understandable.
- [ ] Icon-only controls have names.
- [ ] Text, controls, focus, and status colors meet WCAG AA contrast.
- [ ] VoiceOver/Safari smoke test covers header, category, PDP options, cart count, and menu dialog.
- [ ] Chromium screen-reader smoke test covers the same flow.
- [ ] Reduced-motion mode removes pulse and movement while retaining state clarity.

### Regression and quality

- [ ] Cart and checkout still complete through payment review without placing an unintended order.
- [ ] No cart table or global-style overflow was introduced.
- [ ] Loading, error, empty, long-title, missing-image, and slow-network states have been exercised.
- [ ] Browser console contains no new warnings or errors.
- [ ] Next.js build and repository lint complete with no new errors and no disabled Medusa rules.
- [ ] Product images use appropriate sizes, lazy loading, and priority only for above-the-fold media.
- [ ] Layout shift is visually negligible during catalog and PDP loading.

## 19. Approved Gate 2 decisions

- Palette: use the proposed cobalt-blue, clay-orange, and white-neutral system.
- Typography: use Spline Sans as the single Gate 2 family through `next/font/google`.
- Hero heading: `For their everyday.`
- Hero supporting copy: `Shop practical essentials for dogs, cats, care, and travel.`
- Hero primary CTA: `Shop all products`.
- Hero secondary routes: `Shop dogs` and `Shop cats`.
- Search: omit from Gate 2. Do not render an inert search control.
- Everyday routines: omit until enough truthful data destinations exist.
- Shipping and returns: remove every unsupported starter claim.
- PDP fulfillment copy: `Shipping options are shown at checkout.`
- Returns: hide returns content until a real policy is approved.
- Photography: use the approved placeholder strategy during Gate 2. Real photography is later work.
- Service principles: `Clear options and prices`, `Availability shown before checkout`, and `Built around everyday pet needs`.
- Footer: render only Dogs, Cats, Care & Travel, New Arrivals, All Products, and Account. Do not render unimplemented Help, Company, Policy, newsletter, or social destinations.
- Out of scope: newsletter, social, wishlist, quick add, reviews, advanced search, promotional bar, marketplace UI, loyalty, subscriptions, recommendations, and AI shopping.
- Catalog page size: use 24 products.
- Attribution: remove Medusa and Next.js promotional attribution from customer-facing UI while retaining repository licensing and legal files.

These decisions are final for Gate 2. Jason should implement slices 2B.1 through 2B.7 without reinterpreting the approved product direction.
