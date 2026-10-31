# EcoTrack: backend handoff

For the backend developer taking over integration. It describes what the
frontend does today, where the backend plugs in, and the security work the
backend must own. It was written from the code as of the security audit
(October 2026) and updated at the final pre-handoff pass; where this document
and the code disagree, the code wins.

## 1. Current state: there is no backend

| Area | Today | Where |
|---|---|---|
| Sign-in and sign-up | **Demo only.** Any email and access key open the console as one demo administrator; sign-up creates no account. Nothing is verified or sent anywhere; the dialog says so. | `src/services/auth.ts` |
| Session | A small JSON marker (`{ email, at }`) in `localStorage` ("remember device") or `sessionStorage`, key `ecotrack:session`. No token, no expiry, no server check. | `src/services/auth.ts` |
| Data | Everything lives in the browser's `localStorage` (key `ecotrack:data`), seeded with a labelled demo dataset. | `src/data/repositories/demoRepository.ts` |
| Network calls | None to an EcoTrack API. The only requests are OpenStreetMap map tiles and, if configured, the public-site enquiry form endpoint. | `src/features/views/UnitMap.tsx`, `src/features/public/site/contact.tsx` |
| Environment variables | None are read. | — |
| Secrets in the bundle | None. The audit scanned `src/`, `public/`, `index.html`, `vite.config.ts` and the production `dist/` output for keys, tokens, passwords and connection strings, and found none. | — |

Route guards (`RequireAuth` in `src/app/router.tsx`) only decide what the UI
shows. They are **not** access control: anyone can edit browser storage. Real
protection has to come from the backend refusing unauthenticated or
unauthorised requests.

## 2. Integration points

### 2.1 Data repository (the main swap point)

The UI never touches storage directly. It goes through one interface:

```ts
// src/data/repositories/demoRepository.ts
interface DataRepository {
  load(): LoadResult            // { status: 'ok', data } | { status: 'empty' } | { status: 'invalid', reason }
  save(data: AppData): void
  clear(): void
}
```

`createAppStore(repo)` in `src/store/store.ts` takes the repository. Swapping
`localStorageRepository` for an API-backed implementation is the intended path.
The interface is synchronous today; an API version will need it made async (or
a load step before the store is created). That is the one structural change
the integration requires.

### 2.2 Adapters: untrusted records in, domain types out

`src/data/normalize.ts` turns raw records into the domain types below. The
browser repository already runs every load through it; an API repository
should do the same with each response before handing data to the store.

| Function | Accepts | Drops (and counts in `report.rejected`) | Notes |
|---|---|---|---|
| `normalizeLogs(raw)` | array of `{ id, address, sector, status, createdAt }` | missing/empty `id`; `status` not one of `completed`, `pending`, `missed`; `createdAt` not a finite epoch-ms number or parseable ISO 8601 string | Duplicate ids: the later record wins (`report.duplicates`). Missing `address` becomes `''`, missing `sector` becomes `'Unassigned'`. |
| `normalizeCollectors(raw)` | array of `{ id, name, phone, registeredAt, online?, position? }` | missing `id` or `name`; invalid `registeredAt` | `online` is true only when the field is exactly `true`. `position` outside ±90 / ±180 or non-numeric becomes `null` ("no position reported"). |
| `toTimestamp(v)` | number or ISO string | | Returns `null` for anything that isn't a real time. |

Records are never patched with invented values (no fake times, no guessed
statuses). Covered by `tests/data.test.ts`.

### 2.3 Domain types (the contract the UI renders)

```ts
// src/types/domain.ts (all timestamps are epoch milliseconds)
interface Collector      { id: string /* ECO-C-#### */; name: string; phone: string; registeredAt: number; online: boolean; position: { lat: number; lng: number } | null }
type     LogStatus       = 'completed' | 'pending' | 'missed'
interface CollectionLog  { id: string; address: string; sector: string; status: LogStatus; createdAt: number }
interface ShiftTiming    { start: string /* "HH:MM" 24h */; end: string }
interface User           { name: string; email: string; role: string }

// src/store/types.ts
interface AppData { version: number; collectors: Collector[]; logs: CollectionLog[]; shift: ShiftTiming; clearedAlerts: string[] }
```

### 2.4 Writes the UI performs (rules to re-implement server-side)

All three are pure functions in `src/store/commands.ts`. The backend must
enforce the same rules; the client-side checks only give fast feedback.

| Action | Rules today | Suggested endpoint |
|---|---|---|
| Add collector | name ≥ 2 chars; phone `^\+?\d{10,15}$` after removing spaces/dashes; phone unique; server issues a unique `ECO-C-####` id; new collectors start `online: false`, `position: null` | `POST /collectors` |
| Set shift timing | both times `HH:MM` (00:00–23:59); start ≠ end. An end earlier than the start is an **overnight shift** (e.g. 22:00–06:00) and is valid. Rules live in `src/lib/shift.ts` (`shiftProblem`) and `setShiftTiming`. | `PUT /shift` |
| Clear alerts | adds alert ids to the cleared list | `POST /alerts/clear` |

Reads the UI needs: `GET /collectors`, `GET /logs` (the reports page filters
by date range, status, sector and free text; for large datasets move this to
query parameters), `GET /shift`, `GET /alerts`.

**Suggested** marks endpoints that do not exist yet; nothing in the frontend
assumes these exact paths. Agree on the API, then implement the repository
against it.

### 2.5 Authentication

`signIn(email, accessKey, remember)`, `signUp({ name, email, password },
remember)`, `restoreSession()` and `signOut()` in `src/services/auth.ts` are
the only auth functions; `AuthProvider` wraps them. Replace their bodies with
calls to the real auth service. Keep:

- `safeReturnPath()`: after sign-in or sign-up the app only returns to
  same-app paths, so a crafted `from` value cannot redirect off-site.
- The dialog's field validation, which is UX only: sign-in needs an email and
  an access key; sign-up needs a name (2+ characters), an email and a password
  of 8+ characters. Enforce the real password policy server-side.

**Sign-up today creates nothing.** With no account server, `signUp` signs the
visitor in to the demo console exactly as `signIn` does, and the dialog says
so. Routes: `/login` and `/signup` (also `?signin=1` / `?signup=1` on any
public page) open the same dialog in either mode. A real registration flow
will likely need email verification and possibly approval before console
access; the dialog has an error slot (`errors.form`) for any message the
server returns.

## 3. Metrics, charts and who calculates what

All percentages, chart datasets and summaries are **derived in the frontend
from the raw records** (logs and collectors). The backend does not need to
return percentages, chart series or pre-formatted labels.

### 3.1 Frontend calculation utilities

| Module | What it does | Tests |
|---|---|---|
| `src/lib/metrics.ts` | `share`, `percent`, `percentParts` (largest-remainder rounding so breakdowns sum to exactly 100), `formatPercent`, `statusBreakdown` | `tests/metrics.test.ts` |
| `src/lib/series.ts` | `statusSeries`: per-hour (today) or per-calendar-day buckets stacked by status; `startOfDay`, `daysBefore` (daylight-saving safe) | `tests/data.test.ts` |
| `src/lib/shift.ts` | shift validation, length (overnight-aware), whether the current time is within shift hours | `tests/shift.test.ts` |
| `src/store/selectors.ts` | `dashboardMetrics`, `inRange`, `logsToday`, built on the modules above | |

Rules applied everywhere:

- **Denominator.** Every status percentage uses *all logs in the set* (today's
  logs on the dashboard; the filtered logs on Reports). All three statuses are
  eligible; there is no separate eligibility flag in the data.
- **Unknown versus zero.** With no logs, percentages are `null` and render as
  "–" with "No logs recorded today"; never `0%`. A real zero (logs exist, none
  missed) renders `0%`.
- **Rounding.** Whole percentages. A breakdown (completed / pending / missed)
  uses largest-remainder rounding so it sums to 100; the collection rate is
  the completed part of that same breakdown, so the two never disagree.
  Meter widths use the unrounded share.
- **Invalid input.** NaN, Infinity, negatives and zero totals give `null`,
  so NaN or Infinity can't reach the screen. Unknown statuses are not counted.
- **Time periods.** Local calendar days. "Last 7 days" is today plus the six
  previous calendar days from local midnight. Logs timestamped later than now
  are not placed in a chart bucket.

### 3.2 Data each view needs

| View | Fields used | Derived in the frontend |
|---|---|---|
| Dashboard KPIs, analytics meters, collection rate | logs: `status`, `createdAt` | today's counts by status; % of today's logs; collection rate |
| Dashboard / Reports log tables | logs: `id`, `address`, `sector`, `status`, `createdAt` | sorting, date/time formatting |
| Reports summary + stacked bar chart | logs: `status`, `createdAt`, `sector` (filter), `id` + `address` (search) | range filter, counts, per-day/per-hour series |
| Reports CSV export | logs: all fields | CSV text (`src/lib/csv.ts`) |
| Live Tracker, dashboard map | collectors: `id`, `name`, `phone`, `online`, `position` | online/offline counts, "on map" count |
| Collectors roster + overview | collectors: all fields | counts, latest registration |
| Shift control (top bar + dashboard) | shift: `start`, `end` | length, overnight, within/outside shift hours |

### 3.3 What should stay on the backend

- **Large ranges.** The frontend aggregates whatever logs it is given. For
  "Last 30 days" and "All dates" on a real city's volume, don't send every
  log: add server-side filtering by date range, status and sector (query
  parameters), and paginate the table. If "All dates" must chart years of
  data, return per-day counts by status for the range (`{ date, completed,
  pending, missed }[]`); `statusSeries` output has that same shape, so the
  chart component won't need to change.
- Authentication, authorisation, validation of every write, ID generation and
  data integrity (see section 4).

### 3.4 States the UI already handles

Empty (no logs, no collectors, no filter matches), zero results, invalid
stored data (records dropped with a dev-only console warning), map tiles
failing, and the under-construction modules. **Not yet present:** a loading
state for asynchronous data and an error state for a failed API request,
because today's repository is synchronous. When the repository becomes async,
`PageSkeleton` (`src/components/layout/PageHeader.tsx`) is the loading
frame to reuse, and `EmptyState` plus the toast system cover errors.

## 4. Security responsibilities that must live in the backend

The frontend can't make anything secret: every request the browser makes, and
its destination, is visible to the user. These must be enforced server-side:

1. **Authentication.** Verify credentials. Issue sessions as `HttpOnly`,
   `Secure`, `SameSite=Lax` (or `Strict`) cookies, not tokens readable by
   JavaScript. Add expiry and server-side revocation on sign-out.
2. **Authorisation on every request.** Check the session and role server-side
   for each read and write. Never rely on the console's route guards or hidden
   buttons.
3. **Input validation.** Re-validate everything in section 2.3 and reject
   anything else; never trust client-generated IDs.
4. **CSRF protection** for cookie-authenticated writes (SameSite cookies plus a
   CSRF token or an `Origin` check).
5. **Rate limiting**, especially on sign-in and on the public enquiry endpoint.
6. **Secrets** (database URLs, service keys, SMTP credentials) only in server
   environment variables or a secret manager. Note for Vite: any variable
   prefixed `VITE_` is compiled into the public bundle, so never put a secret
   in one. `.gitignore` now excludes `.env` and `.env.*` (except `.env.example`).
7. **Error handling.** Return generic error messages to clients and log the
   details server-side. The frontend shows only friendly messages; in
   production the error boundary prints a one-line note to the console without
   stack traces.
8. **CORS.** Allow only the production frontend origin(s).
9. **Security headers** from the host or CDN: `Content-Security-Policy`
   (allow `tile.openstreetmap.org` for images, plus the API and enquiry
   origins), `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
   `Referrer-Policy: strict-origin-when-cross-origin`, and
   `frame-ancestors 'none'` in the CSP. `index.html` contains one small inline
   script (theme before first paint); allow it by hash, or move it to a file.
10. **Personal data.** Collector names and phone numbers are personal data.
    Decide retention, access logging and the privacy policy before going live.

## 5. Configuration the frontend already supports

| Setting | File | Purpose |
|---|---|---|
| `COMPANY.contactEmail` | `src/features/public/site/config.ts` | Turns on the public enquiry form (opens the visitor's email app). Public value, not a secret. |
| `COMPANY.enquiryEndpoint` | same | Optional URL that receives the enquiry form as a JSON POST (`{ name, organisation, email, message }`) and must return 2xx. The backend must validate, rate-limit and spam-check it. |

## 6. Hosting notes

- Tests: `npm test` runs the calculation and adapter unit tests with Node's
  built-in runner (Node 22.18+ or 23.6+ runs TypeScript natively; no test
  dependency is installed). `npm run typecheck` also type-checks the tests.
- Single-page app: the host must serve `index.html` for unknown paths (for
  example `/features` or `/dashboard`) so direct links and refreshes work.
- No production source maps are emitted (Vite default), so the original
  source isn't published.
- Map tiles come from OpenStreetMap's public servers. Check their tile usage
  policy, or use a commercial tile provider, before production traffic.
