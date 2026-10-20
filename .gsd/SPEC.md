# SPEC.md — Project Specification

> **Status**: `FINALIZED`  
> **Milestone**: v1.0 Pre-Login Public Website Finalization  
> **Target**: Public pre-login website for EcoTRACK

## Vision
EcoTRACK is a smart municipal waste management and environmental operations platform connecting citizens, frontline collectors, and municipal authorities. The pre-login website serves as the authoritative, enterprise-grade public gateway communicating the platform's mission, operational chain, financial impact model, and platform readiness without modifying the locked authenticated console.

## Goals
1. Deliver a world-class, accessible, responsive public web experience across 4 distinct routes (`/overview`, `/features`, `/how-it-works`, `/preview`).
2. Faithfully represent all product requirements, macro statistics, 5-stage geofencing workflow, and financial models from Team Vamos's proposal deck (`public/EcoTrack_Vamos_v2 2.pptx`).
3. Maintain 100% strict isolation of the authenticated post-login application (`/dashboard`, `/tracking`, `/reports`, `/rewards`, `/collectors`, `AppShell.tsx`, `Sidebar.tsx`, auth, and repositories).
4. Achieve production readiness: full SEO meta tags, social sharing card, dynamic route titles, WCAG 2.1 AA accessibility, and optimized vendor chunking.

## Non-Goals (Out of Scope)
- Modifying any authenticated console feature pages, layout wrappers, topbar, or sidebar.
- Modifying authentication logic or data stores.
- Implementing the resident or collector native mobile applications (these remain clearly labeled as `Planned`).
- Altering the backend architecture or inventing unverified partner claims.

## Users
- **Municipal Authorities**: Reviewing operational capabilities, live fleet tracking, and collection reports.
- **Urban Residents**: Understanding pickup requests, arrival geofence alerts, and gamified Eco Points.
- **Frontline Collectors**: Viewing dynamic geofenced routes and minimal offline workflows.

## Constraints
- **Strict Boundary**: All public styles must be scoped inside `.et-public`.
- **Zero Console Regressions**: Authenticated console code is strictly read-only.
- **Accurate Claims**: Only cite verifiable data and projections from the deck; clearly differentiate between "In this build" and "Planned".

## Success Criteria
- [x] Baseline git commit and audit completed.
- [x] All 4 public routes render with high-fidelity presentation deck content.
- [x] Production build passes with 0 type errors.
- [ ] SEO, Open Graph tags, and social card asset configured.
- [ ] Dynamic document titles updating per route.
- [ ] Vite chunk size warning resolved with clean vendor code-splitting.
- [ ] Comprehensive multi-viewport responsive verification.
