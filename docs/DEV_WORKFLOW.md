# Developer Workflow and Operational Guide

This doc covers how to run, debug, and safely change this project.

## Local setup

## Prerequisites

- Node.js (LTS recommended)
- npm
- Supabase project keys in environment variables

Required env vars:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Install and run

```bash
npm install
npm run dev
```

Build and lint checks:

```bash
npm run lint
npm run build
```

Tests:

```bash
npm run test
```

---

## Folder-level map

- `src/main.tsx` — render entrypoint
- `src/App.tsx` — providers + routes
- `src/contexts/` — app-wide auth context
- `src/components/` — layout and shared wrappers
- `src/components/ui/` — reusable primitive UI components
- `src/pages/` — investor-facing pages
- `src/pages/admin/` — fund manager/admin pages
- `src/integrations/supabase/` — Supabase client + generated DB types
- `supabase/migrations/` — SQL schema, RLS policies, triggers

---

## Daily development habits

1. Pull latest changes.
2. Make one focused change set.
3. Verify with lint + build.
4. Manually test impacted pages.
5. Commit with clear message.

Recommended commit style:

- `ui: refine deal cards spacing and typography`
- `docs: add onboarding architecture guide`
- `fix: enforce minimum amount validation in wizard`

---

## How to debug common issues

## Auth issue: user always redirected to `/auth`

Check:

1. Supabase keys are valid.
2. Session exists in browser storage.
3. `AuthContext` `loading` reaches `false`.
4. Supabase auth callback is firing.

## Role issue: admin menu not visible

Check:

1. `user_roles` row exists for that user.
2. Role is exactly `fund_manager`.
3. `fetchRole` query returns data.

## Data issue: page blank/no rows

Check:

1. RLS policy allows current user for that table/action.
2. Query filters are correct (`created_by`, `deal_id`, etc.).
3. Query `enabled` condition is not preventing fetch.

## Studio issue: CMS not working

Likely cause:

- `cms_blocks` table does not exist.

Current code already shows this warning in UI and expected columns.

---

## UI change safety checklist

Before merging any UI PR:

- No route path changes unless intentional.
- No mutation/query key breakage.
- No role regression (investor/fund manager flows still work).
- Mobile layout tested.
- `npm run lint` passes.
- `npm run build` passes.

---

## Known technical debt and improvement opportunities

1. `Portfolio` and `Documents` are static/mock-like.
2. Admin chart data is static.
3. `cms_blocks` migration is missing from repo (but used in code).
4. Frontend admin route-level guard could be explicit.
5. Some TS strictness settings are relaxed in `tsconfig.json`.

---

## Suggested next engineering tasks (non-UI)

1. Add migration for `cms_blocks`.
2. Add route guard wrapper for admin pages.
3. Introduce typed query/mutation helpers to reduce duplication.
4. Add integration tests for auth role flows.
5. Add central constants for query keys.

