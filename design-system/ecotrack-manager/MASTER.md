# EcoTrack — Design System (Master)

Source of truth for visual and interaction decisions. Tokens live in
`src/styles/global.css` as `--et-*` CSS variables and are exposed to Tailwind
through `@theme inline` (`bg-panel`, `text-ink-2`, `bg-night`, `text-h2`, …).
Components use semantic roles only, never raw hex.

**Light first.** Light is the default for every new visitor and the primary
design target; dark is fully supported. Both themes share the same geometry
(sizes, spacing, radii, layout); only the colour tokens change. The choice is
stored under `ecotrack:theme` and applied before first paint by `index.html`.

## Where the direction comes from

The visual language is adapted from the rendered ecobillz.com site (inspected
in a browser, October 2026), translated to EcoTrack's product and content:

| Reference principle | EcoTrack adaptation |
|---|---|
| Dark charcoal `#1a1a1a` header and hero with white type | `night` surface: public header, page heroes, CTA bands, console top bar, sign-in brand panel |
| Fine line-mesh texture behind dark sections | `ContourLines`: flowing contour lines (a topographic nod to field work), 7.5 % white |
| Sections alternating white / gray-50, ~80–96 px vertical padding, 1280 px container | `Section tone="white" \| "muted"`, `py-16 lg:py-24`, `Container` 1280 px |
| Archivo 700 headings: 72 / 48 / 36 / 24 | Named type tokens `text-display`, `text-h1`, `text-h2`, `text-h3` |
| Centered section headings with a short lead | `SectionHeading` (center or left) with uppercase green eyebrow |
| Alternating text / product-visual rows | Features page rows, reversed on every second row |
| 56 px green CTA, uppercase; outline secondary | `Button size="xl"`; `outline` on light, `light` (white outline) on night |
| White cards on gray-50, 8 px radius, soft shadow, icon in a pale green circle | Problem cards, step cards, KPI cards, console panels |
| Dark closing band with centered CTA, multi-column footer | one end-of-page call to action per page; night footer with a legal strip |

Not adopted: the reference's white-on-`#48b340` buttons (2.69 : 1, fails WCAG
AA), its customer logos, certifications and claims, and any of its copy or
assets.

## Surfaces

| Surface | Light | Use |
|---|---|---|
| night / night-2 / night-3 | `#0f1411` / `#172019` / `#1e2a21` | brand frame: near-black with a forest undertone (console top bar, public header and heroes, sign-in panel) |
| canvas | `#ffffff` | public white sections, console page-header band, cards |
| muted | `#f6f6f1` (warm off-white page) | alternating public sections, console workspace, table heads |
| panel | `#ffffff` | cards and panels |
| sunken / hover | `#efefe9` / `#f3f4ee` | meters, segmented controls / row hover |

Text on night uses `on-night` `#f4f7f4`, `on-night-2` `#b9c4bc`, `on-night-3`
`#8b988f`. Wrap night regions in `.on-night` so focus rings switch to the brand
green.

### Dark: one environment

In dark, page (`muted`) and `canvas` share one tone (`#0b100d`); panels sit
one quiet step up (`#0f1511`); hairlines are `#19221c` and only controls get
the stronger `#2a362d`. `shadow-e1` is none in dark, so panels don't float;
only popovers and dialogs (`e2`, `e3`) carry elevation. Public sections all
sit on the page tone and are marked only by a faint forest light.

### Light: layered depth

Warm off-white page, white content surfaces, a forest-tinted band
(`--pub-field`), soft two-layer green-black shadows, and a faint green light
under the console top bar (`.et-workspace`). The public header is a warm
frosted bar (`.pub-chrome`); the footer and the Overview product stage
(`.pub-night`, a rounded island) stay night as the dark anchors.

## Colour

| Role | Light | Use |
|---|---|---|
| ink / ink-2 / ink-3 | `#111613` / `#454e48` / `#5f6862` | charcoal text |
| line / line-strong | `#e7e7df` / `#d3d5cb` | warm hairlines / control borders |
| brand, accent | `#43c34b` (hover `#37ad3f`) | primary buttons with **near-black text** `#0b1f0d`, logo, active-nav underline, step numbers |
| accent-text | `#237a2b` | green text and links on light surfaces |
| accent-soft / accent-tint | `#ebf7ec` / `#d5efd7` | icon circles, selected rows / timeline and connector lines |
| ok / warn / crit | `#2f9e38` / `#c7850b` / `#d64545` | status fills |
| ok / warn / crit text | `#237a2b` / `#8a5300` / `#b42318` | status text on their `-soft` fills |

Green is spent on primary actions, selection, status and the brand mark —
never as a page background.

### Contrast (WCAG 2.1, calculated)

| Pair | Ratio |
|---|---|
| `#0b1f0d` on `#43c34b` (primary button) | 7.52 : 1 |
| `#0d1f0b` on `#3a9234` (primary hover) | 4.6 : 1 |
| `#43c34b` text on night `#0f1411` | 8.11 : 1 |
| accent-text on white / on accent-soft | 5.8 / 5.3 : 1 |
| ink-2 / ink-3 on white | 7.5 / 5.1 : 1 |
| on-night-2 on night | 10.9 : 1 |
| status text on soft fills | ≥ 5.2 : 1 |

## Typography

**Instrument Sans** (headings, via `h1`–`h3` and `.font-display`), **Geist**
(all interface text) and **Geist Mono** (`.data-mono`: log and collector IDs,
times, coordinates). All self-hosted through Fontsource; no external font
requests.

| Token | Size / line height | Use |
|---|---|---|
| Overview hero title | `clamp(44px, 4.2vw, 74px)` / 1 | Overview hero |
| `text-h1` | `clamp(36px, 3.6vw, 48px)` / 1.1 | other page heroes |
| `text-h2` | `clamp(28px, 2.6vw, 36px)` / 1.15 | public section headings |
| `text-h3` | 24 / 32 | card headlines, notices |
| `text-title` | 20 / 28 | step and card titles |
| `text-lead` | `clamp(17px, 1.4vw, 20px)` / 1.55 | hero and section leads |
| `text-body` | 16 / 24 | public body copy |
| console page title | `clamp(22px, 1.6vw, 26px)` semibold, 13.5 px subtitle | `Page` header band |
| console panel title | 15 / 24 semibold | `PanelHeader` |
| console data | 14 / 20 rows, 11.5 uppercase table heads | tables, panels |

Inputs are 16 px on phones (no iOS zoom) and 14 px from `sm`. Identifiers
and changing numbers use `tabular`.

## Spacing, radius, elevation

- 4 px base; steps 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96.
- Console rhythm: 16 px between workspace blocks (`gap-4`); panel headers
  12 × 20 px; panel bodies 16–20 px; workspace padding 12–20 px vertically
  (scales with viewport height) and 16 / 24 / 32 px horizontally at
  `base` / `sm` / `xl`. Content is capped at 1800 px.
- Control heights: 32 px (`sm` buttons, segmented options, small icon
  buttons) · 40 px (default buttons, inputs, selects, time fields, icon
  buttons) · 48 px (`lg`, dialog submits, public CTAs) · 52 px (`xl`).
  Inputs are 44 px below `sm` for touch.
- Table rows: about 42 px for log rows and 48 px for rows with an avatar;
  20 px outer cell padding.
- Radii: `rounded-md` 6 px small buttons and segmented options ·
  `rounded-lg` 8 px controls, buttons, dialogs · `rounded-xl` 12 px console
  panels and KPI cards · `rounded-2xl` 16 px public product frames ·
  `rounded-full` status badges, icon circles and step numbers.
- Shadows: `e1` console panels and inputs on muted · `e2` public cards, map
  overlays, popovers · `e3` product windows, dialogs, toasts.

## Layout

- **Public site** (`PublicLayout`, `features/public/site/`): theme-aware header
  → page → night footer. Every page opens with a hero whose content fits the
  first viewport at 1280×720 and up, then varies its sections and ends on one
  call to action (see Calls to action).
  Each page has its own composition:
  - Overview: split hero with the real dashboard on a laptop and roster on a phone;
    problem cards; modules beside the workflow; CTA.
  - Features: centered hero with a module index; alternating module rows with
    real component previews; the planned Reward System as a dashed notice; CTA.
  - How it works: split hero with a step index; centre-line timeline;
    records → screens connector diagram; CTA.
  - Preview: centered hero; the product window overlaps into a muted section;
    per-view notes on where the data comes from.
- **Public bands in the light theme**: the hero (`.pub-hero`) and content
  bands (`.pub-dark`) are warm white with a soft green light, and their
  `--pub-on-dark*` text variables are remapped to ink, so the same markup
  serves both themes. `.pub-night` stays dark in both themes (the product
  stage on Overview, the mobile menu). The header and footer are the night
  brand frame in both themes.
- **Console** (`AppShell`): night top bar (module nav from `lg`, night drawer
  below) → `Page` (title row directly on the workspace, with no band or rule,
  then the content) → `Panel` / `PanelHeader`. On desktop the workspace
  fills the viewport and long lists scroll inside their panel; every page fits
  1366 × 768 without page scrolling.
- **Tables** render as card lists below `sm`.
- Breakpoints: Tailwind defaults `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280.

## Calls to action (public site)

- Header: **Sign in** only (outlined). "Request a demo" is added as the
  green button only when an enquiry channel is configured.
- Each page has one main action: Overview hero **See the product** (with
  **How it works** as its single secondary), Features end **How it works**,
  How it works end **See the product**, Preview end **Sign in to the
  console**. The Overview closing section repeats only **See the product**.
- The footer is navigation only (Explore, Platform, Privacy); it has no
  button row. Other destinations are reached through the nav and text links.

## Components

| Component | Notes |
|---|---|
| `Button` / `ButtonLink` | variants `primary`, `outline`, `secondary`, `ghost`, `light` (on night), `danger`; sizes 32 / 40 / 48 / 56 (`xl`, uppercase, public CTAs). `trailingIcon` puts the icon after the label. Use `ButtonLink` for navigation. `cn` doesn't merge conflicting classes, so don't override display or size classes. |
| `IconButton` | requires `label`; variants `ghost`, `secondary`, `night` |
| `Brand` | `tone="night"` for white ECO on dark surfaces |
| `Container`, `Eyebrow`, `StatusPill`, `PageHead` | `features/public/site/ui.tsx` (public site only) |
| `ContourLines` | `features/auth/ContourLines.tsx`, behind the sign-in panel |
| `TextField`, `SelectField`, `SearchInput` | labels, errors via `aria-describedby`, `role="alert"` |
| `StatusBadge`, `LogStatusBadge`, `UnitStatusBadge` | 4 px radius, dot + label |
| `DemoTag` | dashed tag; `tone="night"` in the top bar and drawer |
| `Dialog`, `Popover`, `LoginDialog` | focus trap, Esc, focus restore; sign-in is a split night/white dialog |
| `EmptyState`, `ModuleNotice` | icon circle, title, guidance |
| `MetricStrip`, `StatusMix`, `LogTable`, `CollectorTable`, `UnitMap` | `features/views/` — the same components power the console and the public previews |

## Interaction

- Buttons (`BUTTON_BASE`): colour, border and shadow ease over 150 ms; a 1 px
  press on `:active`; disabled buttons fade to 45 % and ignore hover and press.
  Primary has a fine top highlight and a soft green lift on hover. A trailing
  arrow (`trailingIcon`) nudges 2 px forward on hover. Icon buttons share the
  press. No scaling, bouncing or glow.
- Focus: the 2 px `--et-focus` ring everywhere; inputs add a 3 px soft ring.
- Live indicator (`.et-ping`): one fading ring every 2.4 s, used for the
  shift-hours dot and the maintenance status. Hidden under reduced motion.

## Shift timing

The top bar carries a shift control on every console page: a status dot
(green with a soft ring inside shift hours, grey outside), the saved range,
and an editor in a popover. The dashboard panel uses the same `ShiftEditor`.
It shows the shift length, "ends the next day" for overnight shifts, unsaved
changes, inline validation (save disabled while invalid) and save failures.
"In shift hours" is derived from the clock and the saved timing only.

## Under construction

`ModuleNotice` takes an `art` illustration from `ConstructionArt.tsx`, a
different one per module: Reward System draws a collection route towards an
outlined reward marker; the reports engine raises dashed blueprint columns
under a sweeping calibration line. No numbers or progress values. CSS-only
animations; the resting state is the finished drawing, shown under reduced
motion. "Planned" pills turn their dashed ring slowly.

## Map

- OpenStreetMap tiles, no key, desaturated so markers carry the colour; the
  dark theme inverts and greys the tile pane only.
- Unit markers: solid green when online, neutral when offline, ink ring when
  selected. Units without a position are listed, not placed.

## Motion

`motion/react` with `MotionConfig reducedMotion="user"`; CSS animations off
under `prefers-reduced-motion`. Used for nav underlines, drawers, dialogs,
toasts, meter fills and the dashed route line only; 150 ms for colour
changes on controls.

## Accessibility

- Skip links on public and console layouts; focus moves to `<main>` on route change.
- 2 px focus ring in `--et-focus` (dark green on light, brand green on night).
- Icon-only controls have accessible names; decorative icons are `aria-hidden`.
- Preview tabs use `role="tablist"` with arrow keys; unit filters use `radiogroup`.
- Touch targets ≥ 40 px in the console, 44–56 px for public CTAs and mobile inputs.

## Brand identity

The mark is a geofence ring open at the upper right, a leaf growing out
through the gap, and a tracked point on the ring: geofencing, the
environment and precise tracking in one geometric symbol. Files in
`public/brand/`:

| File | Use |
|---|---|
| `ecotrack-logo-on-dark.svg` / `-on-light.svg` | Primary lockup (mark plus outlined ECOTRACK wordmark) |
| `ecotrack-mark-on-dark.svg` / `-on-light.svg` | Standalone symbol |
| `ecotrack-app-icon.svg` (also `public/favicon.svg`) | Mark on the night tile: favicon and app icon |
| `ecotrack-icon-180.png`, `-512.png` | Touch and app icons |

In the UI, `Brand`, `BrandMark` and `Wordmark` (`src/components/layout/Brand.tsx`)
render the same geometry from `brandPaths.ts`, so every touchpoint matches.
The wordmark is outlined from Instrument Sans 650 with +0.05em tracking.
