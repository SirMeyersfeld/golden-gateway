# Start Here: New Owner Onboarding

This guide is written for a developer who is new to this codebase and may be new to coding.

## 1) Big-picture mental model

Think of this app as 4 layers:

1. **Pages (screens):** files in `src/pages/` and `src/pages/admin/`
2. **Layout + navigation:** `src/components/Layout.tsx`
3. **Data/auth layer:** Supabase + React Query + Auth Context
4. **Styling system:** Tailwind classes + global CSS tokens in `src/index.css`

If you want to change UI safely, you mostly work in layers 1, 2, and 4.

## 2) First files to understand

Read these in order:

1. `src/main.tsx` (entry point)
2. `src/App.tsx` (routes and app providers)
3. `src/contexts/AuthContext.tsx` (login/session/role handling)
4. `src/components/ProtectedRoute.tsx` (auth gate)
5. `src/components/Layout.tsx` (top navigation and shell)
6. `src/index.css` (global design tokens and utility classes)

Then read page files you plan to redesign:

- `src/pages/Index.tsx` (homepage)
- `src/pages/Deals.tsx`
- `src/pages/Portfolio.tsx`
- `src/pages/Documents.tsx`
- `src/pages/InvestWizard.tsx`

## 3) What can break if changed incorrectly

- **Routing can break** if paths in `src/App.tsx` are changed incorrectly.
- **Permissions can break** if role logic or RLS assumptions are changed.
- **Data loading can break** if React Query keys are changed carelessly.
- **Styles can become inconsistent** if you skip shared classes/tokens and use one-off styles everywhere.

## 4) Safe way to start editing UI

1. Change only spacing/typography/colors in one page first.
2. Reuse existing classes (`glass`, `glass-card`, `gradient-gold`, etc.) before creating new ones.
3. Run:
   - `npm run lint`
   - `npm run build`
4. Check desktop and mobile.
5. Commit small changes often.

## 5) Role-aware behavior (important)

The app has two roles:

- `investor`
- `fund_manager`

Fund managers see extra admin navigation and admin pages. Investors should not.

Role values are stored in Supabase `user_roles` and read in `AuthContext`.

## 6) Database note

UI is tightly connected to Supabase tables:

- `deals`
- `investments`
- `capital_calls`
- `profiles`
- `user_roles`

Read `docs/CODEBASE_LOGIC.md` and `docs/DEV_WORKFLOW.md` before touching any data-dependent UI.

