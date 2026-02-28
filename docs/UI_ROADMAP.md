# UI Upgrade Roadmap (Beginner-Friendly)

This roadmap helps you modernize the UI without breaking existing functionality.

## Goal

Create a polished, trustworthy fintech experience while keeping logic stable.

## Ground rules

- Do not change DB schema and business logic in the same PR as visual changes.
- Keep each PR focused: one area/page at a time.
- Always run `npm run lint` and `npm run build` before merging.

---

## Phase 0: Baseline and safety (Day 1)

1. Capture screenshots of key pages (desktop + mobile):
   - `/`
   - `/deals`
   - `/invest`
   - `/portfolio`
   - `/documents`
   - `/admin`, `/admin/deals`, `/admin/capital-calls`
2. Define a visual checklist:
   - color consistency
   - spacing rhythm
   - typography hierarchy
   - CTA clarity
   - trust/compliance messaging visibility
3. Create a UI branch and commit baseline.

Output: visual baseline + no-risk starting point.

---

## Phase 1: Design system cleanup (High impact, low risk)

Target files:

- `src/index.css`
- `tailwind.config.ts`
- `src/components/Layout.tsx`

Tasks:

1. Finalize token palette (primary/accent/neutral) for trust-centric brand.
2. Standardize radius and card shadows.
3. Normalize button treatments (primary, outline, ghost).
4. Ensure nav/header styling matches new system.
5. Keep utility class names stable so pages inherit changes.

Success criteria:

- Whole app immediately looks more consistent before page rewrites.

---

## Phase 2: Landing page polish (`Index`) 

Target file:

- `src/pages/Index.tsx`

Tasks:

1. Keep content and CTA destinations unchanged.
2. Improve hierarchy: hero headline, supporting copy, primary/secondary actions.
3. Keep trust section and metrics highly visible.
4. Ensure campaign cards are readable/scannable.
5. Keep motion subtle and accessible.

Success criteria:

- Homepage communicates trust and value in under 5 seconds.

---

## Phase 3: Core investor flows

Target files:

- `src/pages/Deals.tsx`
- `src/pages/InvestWizard.tsx`
- `src/pages/Portfolio.tsx`
- `src/pages/Documents.tsx`

Order:

1. `Deals` (most critical conversion page)
2. `InvestWizard` (highest trust requirement)
3. `Portfolio` (information density and clarity)
4. `Documents` (compliance/professional tone)

Tasks:

- Improve card/table legibility.
- Make status badges consistent (color + shape + semantics).
- Standardize spacing, labels, and interaction feedback.
- Keep all data queries/mutations untouched unless bug fixing.

---

## Phase 4: Admin experience alignment

Target files:

- `src/pages/admin/*`

Tasks:

1. Bring admin visuals into same system as investor UI.
2. Improve table scanability and action affordances.
3. Make forms (deal form/capital calls) cleaner and more forgiving.
4. Keep admin workflow quick and clear.

---

## Phase 5: Quality, accessibility, and performance

Checklist:

- Contrast meets accessibility expectations.
- Keyboard focus states are visible on all controls.
- Reduced-motion mode still feels polished.
- No layout jumps on slow networks.
- Bundle warnings reviewed (code splitting roadmap if needed).

---

## Suggested improvements beyond visuals

These are optional but recommended after UI stabilization.

## 1) Introduce page-level design wrappers

Create reusable section wrappers and page headers to remove repeated class strings.

## 2) Add a component inventory

Document each reusable component usage with do/don't examples.

## 3) Move hardcoded data toward real data

- `Portfolio` and `Documents` are currently static mock-style data.
- Add data contracts before wiring to backend.

## 4) Add role-based route guard on frontend

Currently admin links are role-aware, but route-level guard is not explicit.

## 5) Add visual regression checks

Use snapshot/screenshot checks to prevent style regressions.

---

## Beginner execution template (copy for each PR)

1. Scope: one page/system area.
2. Plan: list exact files.
3. Edit: UI only first.
4. Verify:
   - `npm run lint`
   - `npm run build`
   - manual mobile + desktop check
5. Document:
   - what changed
   - what intentionally did not change
6. Commit small and focused.

---

## Priority order recommendation

If you only have limited time, do this sequence:

1. `index.css` tokens + shared classes
2. `Layout.tsx` header/nav
3. `Index.tsx`
4. `Deals.tsx`
5. `InvestWizard.tsx`
6. Admin pages

This gives maximum visual improvement per hour while minimizing risk.

