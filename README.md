# Social Media Analytics Dashboard

A production-quality analytics dashboard for social media creators, built with Next.js 15, Supabase, and Visx. Displays engagement metrics with full data isolation via Row Level Security.

**Live Demo**: https://analytics-challenge-eight.vercel.app/

## Setup Instructions

### Prerequisites

- Node.js 22+
- A [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
git clone https://github.com/francisroystanley/analytics-challenge
cd analytics-challenge
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your Supabase credentials (found in **Settings > API** in the Supabase dashboard):

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_PROJECT_ID=your-project-id
```

`SUPABASE_PROJECT_ID` is only used for CLI type generation and is never exposed to the client.

### 3. Set up the database

Run the migrations in order against your Supabase project. These are located in `supabase/migrations/`:

| Migration                   | Purpose                                                               |
| --------------------------- | --------------------------------------------------------------------- |
| `001_create_tables.sql`     | Creates `posts` and `daily_metrics` tables, indexes, and RLS policies |
| `002_get_user_summary.sql`  | Postgres function for analytics aggregation                           |
| `003_get_daily_metrics.sql` | Postgres function for time-series data                                |
| `004_enable_realtime.sql`   | Enables Supabase Realtime on both tables                              |

You can run them via the Supabase SQL Editor or with the CLI:

```bash
npx supabase link --project-ref <project-id>
npx supabase db push
```

### 4. Seed test data

Run `supabase/seed.sql` in the SQL Editor after creating two test users via Supabase Auth (email/password). Update the `user_id` values in the seed file to match your test users' UUIDs.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to the login page, then to the dashboard after authenticating.

---

## Architecture Decisions

### 1. Where engagement metrics are aggregated

**Decision**: Database-level aggregation via Postgres functions.

Two custom functions handle all aggregation:

- **`get_user_summary()`** — computes total engagement, average engagement rate, top post, trend percentage, and post count in a single RPC call.
- **`get_daily_metrics(days_count)`** — returns time-series data for the chart, filtered to the requested date range.

Both functions use `SECURITY INVOKER`, which means RLS policies are enforced automatically — the function only sees the calling user's data without any additional filtering logic in the application layer.

**Trade-offs**:

- _Performance vs. flexibility_: Aggregation in Postgres avoids transferring raw rows over the network, but the query shape is fixed — adding a new metric means updating the SQL function and redeploying a migration rather than just changing app code.
- _Caching_: TanStack Query caches the aggregated result with a 5-minute stale time, reducing database load. The downside is that data can be up to 5 minutes stale, though Supabase Realtime invalidation mitigates this for active sessions.
- _Complexity_: Business logic now lives in two places (SQL functions and app code). This is harder to test and reason about than pure client-side aggregation, but SQL is the natural tool for `SUM`/`AVG` operations and scales without loading all rows into memory.
- _Portability_: Postgres functions couple the app to Supabase/PostgreSQL. Migrating to a different backend would require rewriting the aggregation layer. For this use case, the coupling is acceptable since Supabase is a core dependency.

### 2. State management map

| State                       | Location          | Reasoning                                                                       |
| --------------------------- | ----------------- | ------------------------------------------------------------------------------- |
| Platform filter             | URL search params | Shareable, bookmarkable, survives page refresh                                  |
| Sort column & direction     | URL search params | Same — a shared link shows the same view                                        |
| Current page & page size    | URL search params | Navigating back restores scroll position                                        |
| Chart view type (line/area) | URL search params | Persisted as part of the view configuration                                     |
| Selected post / modal open  | Zustand           | Temporary — discarded when the user navigates away, no reason to persist in URL |
| Posts data                  | TanStack Query    | Server state with cache invalidation                                            |
| Daily metrics data          | TanStack Query    | Server state with 5-min stale time                                              |
| Analytics summary           | TanStack Query    | Server state with 5-min stale time                                              |

**Reasoning**: The challenge spec suggested Zustand for filters, but URL search params are strictly better for dashboard filters — they're shareable, bookmarkable, and survive refresh. Zustand is reserved for truly short-lived state (the modal). TanStack Query manages all server state with proper cache keys and stale times. This avoids the common mistake of duplicating server state in a client store.

The `useDashboardParams` hook encapsulates all URL state with validation and sensible defaults. It omits default values from the URL to keep links clean.

### 3. Empty state handling

Every component handles the zero-data case explicitly:

- **Summary Cards**: Renders a dedicated `SummaryCardsEmpty` component with a message when `postCount === 0`. Metrics show `0` for totals and `N/A` for rates.
- **Posts Table**: Shows a `PostsTableEmpty` component. If the table is empty due to a filter (e.g., no TikTok posts), the message reflects that.
- **Engagement Chart**: Renders an inline "No metrics data available" message instead of crashing on empty arrays. Visx scales handle empty domains gracefully.
- **API Routes**: Return valid JSON with zero/null values, never error on empty data. `get_user_summary()` has an explicit early return for `_post_count = 0`.
- **Trend Indicator**: Shows a neutral gray indicator with "No trend data" when the trend percentage is `null`.

### 4. Trend percentage calculation

**Decision**: Last 7 days vs. prior 7 days.

The `get_user_summary()` function computes:

```
recent = SUM(likes + comments + shares) for posts in [now - 7d, now]
prior  = SUM(likes + comments + shares) for posts in [now - 14d, now - 7d]
trend  = ((recent - prior) / prior) * 100
```

**Edge cases**:

- `prior > 0`: Standard percentage change
- `prior = 0`, `recent > 0`: Returns `100%` (new activity)
- Both zero: Returns `null` (no trend data)

**Why 7 days**: Social media posting cadence is typically weekly. A 7-day window captures a full posting cycle and provides actionable, recent feedback. A 30-day window smooths out too much signal for a creator dashboard where recency matters. Monthly comparison introduces calendar-boundary artifacts (28 vs 31 day months).

---

## Tech Stack

| Category      | Technology                                    |
| ------------- | --------------------------------------------- |
| Framework     | Next.js 15 (App Router) with React Compiler   |
| Language      | TypeScript (strict mode)                      |
| Backend       | Supabase (PostgreSQL + Auth + RLS + Realtime) |
| UI Components | shadcn/ui (Radix UI)                          |
| Styling       | Tailwind CSS v4                               |
| Global State  | Zustand                                       |
| Server State  | TanStack Query v5                             |
| Table         | TanStack Table v8                             |
| Charts        | Visx (D3-based)                               |
| Animations    | Framer Motion                                 |
| Icons         | Lucide React                                  |

## Project Structure

```
src/
├── app/
│   ├── (auth)/login, signup     # Auth pages
│   ├── api/
│   │   ├── analytics/summary/   # Aggregated metrics (Node.js runtime)
│   │   ├── metrics/daily/       # Time-series data (Edge runtime)
│   │   └── posts/               # Paginated posts
│   └── dashboard/               # Protected dashboard route
├── components/
│   ├── ui/                      # shadcn/ui primitives
│   ├── posts/                   # Table, modal, filters, skeletons
│   ├── charts/                  # Visx chart with tooltip
│   └── dashboard/               # Summary cards, trend indicator
├── lib/
│   ├── supabase/                # Client, server, middleware helpers
│   ├── hooks/                   # TanStack Query hooks, realtime, URL params
│   ├── stores/                  # Zustand (modal state only)
│   └── queries/                 # Query key factory
└── supabase/
    ├── migrations/              # 4 SQL migrations
    └── seed.sql                 # Sample data for 2 test users
```

## Security

- **RLS**: Full CRUD policies on both tables ensuring `auth.uid() = user_id`
- **API Routes**: All three routes validate the Supabase session before returning data
- **No service role key**: The app uses only the anon key with RLS — `SUPABASE_SERVICE_ROLE_KEY` is not used or exposed
- **Environment variables**: Secrets stored in `.env.local`, never committed. `.env.example` documents required vars without values
- **Middleware**: Auth middleware redirects unauthenticated users away from protected routes

## Bonus Features

- **Visx charts** — D3-based charting with responsive sizing, interactive tooltips, and area/line toggle
- **Framer Motion** — Animated modal with staggered content transitions
- **Supabase Realtime** — Live cache invalidation via `postgres_changes` subscriptions on both tables
- **Postgres functions** — Server-side aggregation with `SECURITY INVOKER` for automatic RLS enforcement
- **GitHub Actions CI** — Lint, build checks, and automated migration sync on push/PR to main
- **Preview deployments** — Separate Supabase project for Vercel preview builds so PRs never touch production data
- **URL-persisted state** — Dashboard filters, sorting, pagination, and chart type all survive refresh and are shareable via link
- **React Compiler** — Enabled for automatic memoization

## What I'd Improve With More Time

- **Unit and E2E tests**: Add Vitest for API route and utility function tests, Playwright for critical user flows (login, filter, modal)
- **Rate limiting**: Add rate limiting on API routes to prevent abuse
- **Optimistic updates**: TanStack Query mutations with optimistic UI for any future write operations
- **Virtualized table**: For datasets beyond a few hundred posts, virtualize the table rows
- **Error monitoring**: Integrate Sentry or similar for production error tracking

## Time Spent

~5-6 hours, in line with the suggested estimate. AI-assisted development (Claude) was used for scaffolding and iteration.
