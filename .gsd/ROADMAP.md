# ROADMAP.md — Project Roadmap

> **Current Phase**: Milestone v1.0 Completed  
> **Milestone**: v1.0 Pre-Login Public Website Finalization  
> **Status**: ✅ All Phases Complete & Verified

## Must-Haves
- [x] Distinct public routing (`/overview`, `/features`, `/how-it-works`, `/preview`).
- [x] PowerPoint presentation data integration (macro waste stats, 5 failure points, 5-stage geofencing chain, Slide 7/8 financial model).
- [x] Interactive components (`FinancialImpactWidget`, `ResidentPhone`, `GeofenceMap`).
- [x] Strict isolation of authenticated console (`.et-public` scoped).
- [x] Open Graph & Twitter meta tags, and `public/og-image.png`.
- [x] Route-based dynamic document title synchronizer.
- [x] Vendor chunk splitting in `vite.config.ts`.
- [x] Visual polish & subtle vector skyline backdrop.
- [x] Comprehensive verification across breakpoints.

---

## Phases

### Phase 1: SEO, Social Metadata & Dynamic Titles
**Status**: 🟢 Completed  
**Objective**: Production-grade search engine indexing, social preview card, and route-synchronized document titles.  
**Deliverables**:
- Updated `index.html` with canonical tags, meta description, Open Graph, and Twitter card headers.
- Created `public/og-image.png` (1200×630px) reflecting EcoTRACK's visual identity.
- Added dynamic title synchronization in `PublicLayout.tsx` (`EcoTrack — Overview`, etc.).

### Phase 2: Performance & Bundle Optimization
**Status**: 🟢 Completed  
**Objective**: Eliminate Vite's >500 kB chunk warning by cleanly code-splitting third-party vendor libraries (`leaflet`, `react-leaflet`, `motion`, `react`).  
**Deliverables**:
- Configured `manualChunks` in `vite.config.ts`.
- Verified with `npm run build` that all chunk sizes stay below 400 kB (0 warnings).

### Phase 3: Visual Polish & Vector Accentuation
**Status**: 🟢 Completed  
**Objective**: Add lightweight vector accents (e.g. city skyline inspired by Slide 1) to hero sections.  
**Deliverables**:
- Created `CitySkylineBackdrop` SVG component in `visuals.tsx` and embedded in `OverviewPage.tsx`.
- Polished desktop and mobile responsive layouts.

### Phase 4: Multi-Viewport Verification & Sign-off
**Status**: 🟢 Completed  
**Objective**: End-to-end verification across desktop, tablet, and mobile, confirming zero console impact.  
**Deliverables**:
- Automated browser tests at 1440×900 and 390×844 passed.
- Verified dynamic title changes across `/overview`, `/features`, `/how-it-works`, `/preview`.
- Zero changes to locked authenticated files confirmed via `git diff`.
