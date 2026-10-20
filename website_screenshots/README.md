# EcoTrack Manager - Website Screenshots Index

**Project:** SGMS / EcoTrack Manager
**Captured:** 2026-10-13
**Purpose:** Baseline visual reference for future website redesign
**Total Screenshots:** 43 (25 desktop + 18 mobile)

---

## Project Overview

EcoTrack Manager is a React 19 + Vite web application for smart waste management.
Served at http://localhost:3000 via npm run dev inside ecotrack-manager/.

A separate standalone Login/Register template exists at ../Login/index.html (plain HTML/CSS/JS).

### Technology Stack
- Framework: React 19 + Vite 6
- Styling: Tailwind CSS v3
- Animations: Framer Motion
- Maps: Leaflet / React-Leaflet
- Charts: Recharts
- Icons: Lucide React
- Backend: REST API at https://ecotrack-rm92.onrender.com

### Routes / Pages
| Route | Component | Auth Required |
|-------|-----------|---------------|
| / | LandingPage | No |
| /login | LandingPage (modal open) | No |
| /dashboard | Dashboard | Yes |
| /tracking | CollectorTracking | Yes |
| /reports | Reports | Yes |
| /rewards | Rewards | Yes |
| /collectors | Collectors | Yes |

---

## Folder Structure

`
website_screenshots/
├── README.md
├── desktop/    <- 1440 x 900 px (25 files)
└── mobile/     <- 390 x 844 px (18 files)
`

---

## Desktop Screenshots (1440 x 900 px)

### Landing Page - http://localhost:3000/

| File | Section | Description |
|------|---------|-------------|
| 01_landing_hero.png | Hero Section (top) | Dark hero with EcoTrack navbar, The Intelligent Waste Operations Command Center headline, hero image, 3 stat badges (98%, 4.2K+, <8min) |
| 02_landing_problem_features.png | Problem & Features | Pain points section + 3-column feature cards grid |
| 03_landing_live_metrics.png | Live Operational Metrics | Real-time stat counters and live map preview |
| 04_landing_how_it_works.png | How It Works / Workflow | 3-step workflow diagram |
| 05_landing_testimonials_faq.png | Testimonials & FAQ | Testimonial cards + FAQ accordion area |
| 06_landing_footer_cta.png | Footer & CTA | Final CTA banner and footer |
| 07_landing_fullpage.png | Full Page (stitched) | Complete landing page top to bottom (~8MB) |

### Authentication - http://localhost:3000/login

| File | Section | Description |
|------|---------|-------------|
| 08_auth_login_modal.png | Login Modal | Split-panel: dark left side with email+password, ACCESS SYSTEM button; mint-green right panel with feature checklist |
| 09_auth_register_modal.png | Register Modal | Register form panel with Name, Email, Password fields |

Note: Screenshots 08 and 09 appear visually similar because the React panel-flip animation did not complete within the capture window.

### Dashboard - http://localhost:3000/dashboard

| File | Section | Viewport | Description |
|------|---------|----------|-------------|
| 10_dashboard_overview.png | Dashboard Top | 1440x900 | 4 KPI stat cards (Pickup Requests, Collected Today, Not Collected, Active Today), Analytics Overview with progress bars, Shift Timing panel |
| 11_dashboard_charts_and_map.png | Dashboard Middle | 1440x900 | Analytics bars and shift timing in detail |
| 12_dashboard_queue_activity.png | Dashboard Lower | 1440x900 | Efficiency scale, Commit Changes / Reset buttons |
| 13_dashboard_fullpage.png | Dashboard Full | 1440xAuto | Complete dashboard at natural content height |
| 14_dashboard_light_theme.png | Dashboard - Light Mode | 1440x900 | Dashboard with light/white theme toggled on |

### Live Tracker - http://localhost:3000/tracking

| File | Section | Description |
|------|---------|-------------|
| 15_tracking_live_map.png | Collector Tracking | Leaflet map with Live Field Tracker header, truck markers, SATELLITE LINK ACTIVE badge, Tracking Core legend |

### Collection Reports - http://localhost:3000/reports

| File | Section | Description |
|------|---------|-------------|
| 16_reports_overview.png | Reports Header & Filters | Collection Reports header, filter bar (search, date, status, sector), 4 summary stat cards, Under Construction placeholder |
| 17_reports_table_logs.png | Reports Table | Scrolled view showing collection log rows with address, status badges, timestamps |

### Reward System - http://localhost:3000/rewards

| File | Section | Description |
|------|---------|-------------|
| 18_rewards_system.png | Rewards Page | Reward System header + Under Construction card with pulsing Award icon |

### Collectors Management - http://localhost:3000/collectors

| File | Section | Description |
|------|---------|-------------|
| 19_collectors_directory.png | Collectors List | Manage Collectors header, ADD COLLECTOR button, empty state table (Collector Info, Collector ID, Contact Number columns) |
| 20_collectors_add_modal.png | Add Collector Modal | Form modal with Name and Contact Number fields |

### Interactive UI Components (captured from Dashboard)

| File | Component | Description |
|------|-----------|-------------|
| 21_component_profile_menu.png | Profile Dropdown | Top-right avatar dropdown: Active Account panel with user name, email, LOGOUT button |
| 22_component_notifications_panel.png | Notifications Dropdown | Bell dropdown: Recent Alerts with 3 items (Low Efficiency/amber, Target Achieved/green, Maintenance/blue) |
| 23_component_ecobot_ai_chat.png | Eco-Bot + Notifications | Both notifications panel and profile dropdown open simultaneously showing layered dropdown state |

### Standalone Login Template - file:///Login/index.html

| File | Section | Description |
|------|---------|-------------|
| 24_standalone_login_template.png | Login Form | Plain HTML/CSS animated login form - curved bg shapes, username/password, Login button |
| 25_standalone_register_template.png | Register Form | HTML register panel - username, email, password, Register button |

---

## Mobile Screenshots (390 x 844 px)

### Landing Page (Mobile)

| File | Section | Description |
|------|---------|-------------|
| 01_landing_hero.png | Hero Top | Mobile hero, EcoTrack logo, headline vertically stacked |
| 02_landing_features.png | Features | Scrolled down - feature cards single column |
| 03_landing_workflow_footer.png | Workflow & Footer | Workflow steps and footer at mobile width |
| 04_landing_fullpage.png | Full Page | Complete mobile landing page (~3.8MB) |

### Authentication (Mobile)

| File | Section | Description |
|------|---------|-------------|
| 05_auth_login_modal.png | Login Modal | Mobile auth - single column, form fields, ACCESS SYSTEM button |
| 06_auth_register_modal.png | Register Modal | Mobile register - name, email, password stacked |

### Dashboard (Mobile)

| File | Section | Description |
|------|---------|-------------|
| 07_dashboard_overview.png | Dashboard + Sidebar Open | Dashboard with sidebar open overlapping content |
| 08_dashboard_navigation_drawer.png | Navigation Drawer | Mobile sidebar open - all nav links + Eco-Bot mascot panel |
| 09_dashboard_charts_queue.png | Dashboard Charts | Stat cards and analytics bars at 390px width |
| 10_dashboard_fullpage.png | Dashboard Full Page | Complete mobile dashboard at natural height |

### Other Pages (Mobile)

| File | Page | Description |
|------|------|-------------|
| 11_tracking_live_map.png | Live Tracker | Leaflet map at mobile width, Collector Tracking header |
| 12_reports_overview.png | Collection Reports | Filter controls single column, summary cards stacked |
| 13_rewards_system.png | Reward System | Under Construction card at mobile width |
| 14_collectors_directory.png | Collectors Directory | Manage Collectors + empty table state |
| 15_collectors_add_modal.png | Add Collector Modal | Add Collector form at mobile viewport |
| 16_component_ecobot_ai_chat.png | Eco-Bot AI Chat | Mobile Eco-Bot assistant drawer |

### Standalone Login Template (Mobile)

| File | Section | Description |
|------|---------|-------------|
| 17_standalone_login.png | Login Form | HTML login form at 390px |
| 18_standalone_register.png | Register Form | HTML register form at 390px |

---

## Design System Reference

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| primary | #10b981 (emerald-500) | Accent, buttons, icons, glows |
| base | ~#0a0f1e (dark navy) | Page background |
| surface | ~#0d1a14 | Card backgrounds |
| border | rgba(255,255,255,0.08) | Card/panel borders |
| Collected | emerald-400 / #34d399 | Success states |
| Missed | rose-400 / #fb7185 | Error/missed states |
| Active | amber-400 / #fbbf24 | Live/in-progress states |
| Brand accent | #42d19d | Login modal brand panel |

### Typography
- Primary font: Poppins (Google Fonts)
- Weights: 500, 700, 800, 900 (black)
- Headings: tight tracking, heavy weight
- Labels: uppercase tracking-widest text-[10px]

### Key UI Patterns
- Glassmorphism cards: backdrop-blur-3xl bg-surface/40 border border-border
- Gradient text: text-gradient class for accent headings
- Eco glow: shadow-[0_0_30px_rgba(16,185,129,0.3)] on primary elements
- Sidebar: Collapsible (280px open / 88px collapsed), dark with mascot panel
- Header: Sticky top bar, 80px tall, with theme toggle, notifications, profile

---

## Limitations & Notes

1. Register Modal (Desktop 09): Panel-flip animation between Login/Register tabs did not complete in capture window. Both share same split-panel structure.
2. Eco-Bot Chat Drawer (Desktop 23): Eco-Bot chat did not open separately; notifications + profile dropdowns captured instead showing layered dropdown UI state.
3. Dashboard scrolling: const m re-declaration caused non-fatal JS warnings but screenshots captured at correct scroll positions.
4. Mobile Dashboard 07: Sidebar was open at capture time - accurately shows mobile sidebar open state.
5. Live Data: Dashboard shows zero values because backend API (Render free tier) may be sleeping. UI layout fully documented.
6. Collectors List: Empty state captured because backend returned no data.
7. No source files were modified. Vite dev server started for capture only.

---

## How to Restart the Dev Server

  cd C:\Users\Asus\OneDrive\Desktop\SGMS\ecotrack-manager
  npm run dev
  # App available at http://localhost:3000
