# EcoTrack — Design System (Master)

Source of truth for visual and interaction decisions. Tokens live in
`src/styles/global.css` as `--et-*` CSS variables and are exposed to Tailwind
through `@theme inline` (`bg-panel`, `text-ink-2`, `bg-night`, `text-h2`, …).
Components use semantic roles only, never raw hex.

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
| Dark closing band with centered CTA, white multi-column footer | `CtaBand`, `PublicFooter` with a night legal strip |

Not adopted: the reference's white-on-`#48b340` buttons (2.69 : 1, fails WCAG
AA), its customer logos, certifications and claims, and any of its copy or
assets.

## Surfaces

| Surface | Light | Use |
|---|---|---|
| night / night-2 | `#1a1a1a` / `#242424` | brand frame (same in both themes, slightly deeper in dark) |
| canvas | `#ffffff` | public white sections, console page-header band, cards |
| muted | `#f9fafb` | alternating public sections, console workspace, table heads |
| panel | `#ffffff` | cards and panels |
| sunken / hover | `#f3f4f6` / `#f3f5f2` | meters, segmented controls / row hover |

Text on night uses `on-night` `#ffffff`, `on-night-2` `#c9ccc6`, `on-night-3`
`#9a9e97`. Wrap night regions in `.on-night` so focus rings switch to the brand
green.

## Colour

| Role | Light | Use |
|---|---|---|
| ink / ink-2 / ink-3 | `#171717` / `#52554f` / `#6b6f69` | text |
| line / line-strong | `#e7e9e5` / `#d4d7d1` | dividers / control borders |
| brand, accent | `#48b340` (hover `#3a9234`) | primary buttons with **near-black text** `#0d1f0b`, logo, active-nav underline, step numbers |
| accent-text | `#2e7429` | green text and links on light surfaces |
| accent-soft / accent-tint | `#edf7eb` / `#dcefd9` | icon circles, selected rows / timeline and connector lines |
| ok / warn / crit | `#3a9234` / `#c7850b` / `#d64545` | status fills |
| ok / warn / crit text | `#2e7429` / `#8a5300` / `#b42318` | status text on their `-soft` fills |

Green is spent on primary actions, selection, status and the brand mark —
never as a page background.

### Contrast (WCAG 2.1, calculated)

| Pair | Ratio |
|---|---|
| `#0d1f0b` on `#48b340` (primary button) | 6.7 : 1 |
| `#0d1f0b` on `#3a9234` (primary hover) | 4.6 : 1 |
| `#48b340` text on night `#1a1a1a` | 6.5 : 1 |
| accent-text on white / on accent-soft | 5.8 / 5.3 : 1 |
| ink-2 / ink-3 on white | 7.5 / 5.1 : 1 |
| on-night-2 on night | 10.9 : 1 |
| status text on soft fills | ≥ 5.2 : 1 |

## Typography

**Archivo Variable** (self-hosted, `@fontsource-variable/archivo`), normal
letter spacing; headings 700, buttons 500–600.

| Token | Size / line height | Use |
|---|---|---|
| `text-display` | `clamp(40px, min(3.9vw, 7.4vh), 72px)` / 1.02 | Overview hero |
| `text-h1` | `clamp(36px, 3.6vw, 48px)` / 1.1 | other page heroes |
| `text-h2` | `clamp(28px, 2.6vw, 36px)` / 1.15 | public section headings |
| `text-h3` | 24 / 32 | card headlines, notices |
| `text-title` | 20 / 28 | step and card titles |
| `text-lead` | `clamp(17px, 1.4vw, 20px)` / 1.55 | hero and section leads |
| `text-body` | 16 / 24 | public body copy |
| console page title | `clamp(26px, 2.2vw, 32px)` bold | `Page` header band |
| console data | 14 / 20 rows, 12 uppercase table heads | tables, panels |

Inputs are 16 px on phones (no iOS zoom) and 14 px from `sm`. Identifiers
and changing numbers use `tabular`.

## Spacing, radius, elevation

- 4 px base; steps 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96.
- Radii: `rounded-sm` 4 px badges and tags · `rounded-md` 6 px small buttons ·
  `rounded-lg` 8 px cards, controls, dialogs (the standard) · `rounded-full`
  icon circles and step numbers only.
- Shadows: `e1` console panels and inputs on muted · `e2` public cards, map
  overlays, popovers · `e3` product windows, dialogs, toasts.

## Layout

- **Public site** (`PublicLayout`, `Sections.tsx`): night header → page →
  white footer with a night legal strip. Every page opens with a night hero whose
  content fits the first viewport at 1280×720 and up, then alternates white and
  muted sections and closes with a `CtaBand` (Preview closes on its notes).
  Each page has its own composition:
  - Overview: split hero with the real dashboard on a laptop and roster on a phone;
    problem cards; modules beside the workflow; CTA.
  - Features: centered hero with a module index; alternating module rows with
    real component previews; the planned Reward System as a dashed notice; CTA.
  - How it works: split hero with a step index; centre-line timeline;
    records → screens connector diagram; CTA.
  - Preview: centered hero; the product window overlaps into a muted section;
    per-view notes on where the data comes from.
- **Console** (`AppShell`): night top bar (module nav from `lg`, night drawer
  below) → `Page` (white header band, then the muted workspace) → `Panel` /
  `PanelHeader`. On desktop the workspace fills the viewport; where minimum
  readable heights don't fit (Dashboard below ~800 px tall) the workspace scrolls
  rather than squeezing panels.
- **Tables** render as card lists below `sm`.
- Breakpoints: Tailwind defaults `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280.

## Components

| Component | Notes |
|---|---|
| `Button` / `ButtonLink` | variants `primary`, `outline`, `secondary`, `ghost`, `light` (on night), `danger`; sizes 32 / 40 / 48 / 56 (`xl`, uppercase, public CTAs). `trailingIcon` puts the icon after the label. Use `ButtonLink` for navigation. `cn` doesn't merge conflicting classes, so don't override display or size classes. |
| `IconButton` | requires `label`; variants `ghost`, `secondary`, `night` |
| `Brand` | `tone="night"` for white ECO on dark surfaces |
| `Kicker`, `Eyebrow`, `SectionHeading`, `Section`, `NightBand`, `CtaBand`, `Container`, `ContourLines` | `features/public/Sections.tsx` |
| `TextField`, `SelectField`, `SearchInput` | labels, errors via `aria-describedby`, `role="alert"` |
| `StatusBadge`, `LogStatusBadge`, `UnitStatusBadge` | 4 px radius, dot + label |
| `DemoTag` | dashed tag; `tone="night"` in the top bar and drawer |
| `Dialog`, `Popover`, `LoginDialog` | focus trap, Esc, focus restore; sign-in is a split night/white dialog |
| `EmptyState`, `ModuleNotice` | icon circle, title, guidance |
| `MetricStrip`, `StatusMix`, `LogTable`, `CollectorTable`, `UnitMap` | `features/views/` — the same components power the console and the public previews |

## Map

- OpenStreetMap tiles, no key, desaturated so markers carry the colour; the
  dark theme inverts and greys the tile pane only.
- Unit markers: solid green when online, neutral when offline, ink ring when
  selected. Units without a position are listed, not placed.

## Motion

`motion/react` with `MotionConfig reducedMotion="user"`; CSS animations off
under `prefers-reduced-motion`. Used for nav underlines, drawers, dialogs and
toasts only.

## Accessibility

- Skip links on public and console layouts; focus moves to `<main>` on route change.
- 2 px focus ring in `--et-focus` (dark green on light, brand green on night).
- Icon-only controls have accessible names; decorative icons are `aria-hidden`.
- Preview tabs use `role="tablist"` with arrow keys; unit filters use `radiogroup`.
- Touch targets ≥ 40 px in the console, 44–56 px for public CTAs and mobile inputs.
