# EcoTrack

Waste operations console for municipal teams: an operations dashboard, a
collector tracker, collection reports with CSV export, and collector
management. The Reward System is shown as under construction.

> **Frontend only.** The original product's backend is not part of this
> workspace. Records live in this browser's localStorage, seeded with a
> labelled demo dataset (sample collectors, positions and collection logs).
> Collector positions are demo coordinates, not live GPS. Sign-in does not
> verify the access key and is not a security boundary.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
npm run typecheck
npm run lint
```

Requires Node 20.19+.

## Sign in

Use the administrator account `alex.rivera@ecotrack.io` with any non-empty
access key. "Remember this device" keeps the session in localStorage;
otherwise it lasts for the browser session.

## Routes

| Route | Page |
|---|---|
| `/` | Redirects to `/overview` |
| `/overview` | Public overview |
| `/features` | Module walkthrough with live component previews |
| `/how-it-works` | Workflow from sign-in to export |
| `/preview` | The real console views on demo data (`?view=…`) |
| `/login` | Overview with the sign-in dialog open (`?signin=1` works on any public page) |
| `/dashboard` | Operations Dashboard: today's counts, logs, field units, shift timing |
| `/tracking` | Collector Tracking map and unit list (`?unit=ECO-C-…` selects a unit) |
| `/reports` | Collection Reports: filters, summary chart, log table, CSV export |
| `/collectors` | Manage Collectors: roster, details, add collector (`?add=1`) |
| `/rewards` | Reward System (under construction) |

Console routes require a session and redirect to `/login`, returning to the
requested page after sign-in.

## Stack

React 19 · TypeScript (strict) · Vite 8 · Tailwind CSS 4 · React Router 8 ·
Motion · Leaflet / React-Leaflet (OpenStreetMap tiles) · Recharts · Lucide ·
Instrument Sans, Geist and Geist Mono (self-hosted via Fontsource).

Brand assets (logo lockups, mark, app icon) live in `public/brand/`. Backend
integration and security notes: [`docs/BACKEND_HANDOFF.md`](docs/BACKEND_HANDOFF.md).

## Architecture

```
src/
  app/            App, router, providers (theme, auth)
  components/     ui primitives, layout shell, navigation, map markers, feedback
  content/        original product copy (original.ts) and public-site copy (product.ts)
  features/
    public/       public layout and the four public pages
    auth/         sign-in dialog
    views/        data views shared by the console and Preview (OpsViews, UnitMap)
    dashboard/ tracking/ reports/ collectors/ rewards/
  store/          external store, pure commands, selectors
  data/           repository (persistence boundary) and demo seed
  services/       local sign-in
  hooks/ lib/ types/
```

- **One source of figures.** Every count, chart and table is derived from the
  stored collection logs and collector records through `store/selectors.ts`;
  the public Preview renders the same components as the console.
- **Mutations are pure commands** (`store/commands.ts`): add collector, set
  shift timing, clear alerts.
- **Persistence** goes through `data/repositories/demoRepository.ts`
  (localStorage key `ecotrack:data`, versioned and validated on load). Swap it
  for an API client without touching UI code.
- **Layout.** Public pages open with a dark hero that fits the first
  viewport, then scroll through alternating sections. Console screens fill the
  viewport from 1024 px, with long tables scrolling inside their panels; below
  that, pages take their natural height and tables become card lists on phones.

## Design system

See [`design-system/ecotrack-manager/MASTER.md`](design-system/ecotrack-manager/MASTER.md).

## Known limitations

- No backend: data is per-browser, and sign-in is not verified.
- Collector positions and online status come from the demo seed, not devices.
- Map tiles need network access; without it, markers and lists still work.
- The Reward System module is not built.
