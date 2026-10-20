# DECISIONS.md — Architecture & Design Decisions

## ADR-01: Demo Data Date Freshness Fallback
- **Context**: `demoRepository.ts` stores static timestamps. When testing across calendar midnight boundaries, `logsToday` computed 0 logs today, leaving preview dashboards empty.
- **Decision**: Rather than modifying the locked `demoRepository.ts` or authenticated store, public components calculate `effectiveNow = logs.length > 0 && logsToday(logs, now).length === 0 ? Math.max(...logs.map(l => l.createdAt)) : now`.
- **Status**: Implemented & Approved.

## ADR-02: PowerPoint Financial Impact Integration
- **Context**: Slide 8 of Team Vamos's deck contained concrete economic models (₹75k vs ₹21k daily, ₹16.2L monthly savings, 20-30% fuel savings).
- **Decision**: Implemented an interactive `FinancialImpactWidget` on `/overview` allowing users to toggle between daily costs and monthly impact, clearly labeled as the proposal deck's baseline calculations.
- **Status**: Implemented & Approved.

## ADR-03: Strict Scope Boundary
- **Context**: The post-login console is already functional and strictly protected from changes.
- **Decision**: All public modifications are restricted to `src/features/public/`, `public/assets/`, and root meta files (`index.html`, `vite.config.ts`).
- **Status**: Active Policy.
