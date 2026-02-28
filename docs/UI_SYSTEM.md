# UI System Documentation

This guide explains how UI is built so you can redesign safely and consistently.

## UI architecture at a glance

- **Design tokens:** CSS variables in `src/index.css` (`:root`)
- **Utility classes:** custom classes in `src/index.css` (`.glass`, `.gradient-gold`, etc.)
- **Tailwind theme mapping:** `tailwind.config.ts` maps tokens to Tailwind color names
- **Base components:** `src/components/ui/*` (shadcn/Radix wrappers)
- **Page-specific composition:** files in `src/pages/*`

## Design tokens (source of truth)

In `src/index.css`, token groups include:

- Background/foreground colors
- Surface colors (`card`, `popover`, `secondary`, `muted`)
- Semantic colors (`primary`, `destructive`, `success`)
- Border/input/ring
- Radius (`--radius`)
- Brand gradient stops (`--brand-start`, `--brand-mid`, `--brand-end`)

Rule: prefer changing tokens first, not hundreds of individual class strings.

## Custom utility classes currently used

These are reused throughout pages:

- `gradient-gold` / `gradient-gold-text`
- `glass` / `glass-card` / `glass-hover`
- `glow-gold`
- `divider-gold`
- `texture-noise`, `aurora`, `grid-overlay`
- `text-balance`

If you redesign style direction, update these classes to propagate visual changes quickly.

## Tailwind configuration

File: `tailwind.config.ts`

- `fontFamily.sans` = Inter
- `fontFamily.display` = Space Grotesk
- Colors are wired to CSS variables (`hsl(var(--token))`)
- Global radius values are derived from `--radius`

Meaning: token changes in `index.css` flow naturally into Tailwind classes like `bg-primary`, `text-muted-foreground`, etc.

## Base UI components

Located in `src/components/ui/`:

- `button.tsx` uses class-variance-authority (variants + sizes)
- `card.tsx`, `input.tsx`, `table.tsx`, `dialog.tsx`, etc. are reusable primitives
- Most page UIs are built by composing these plus custom utility classes

Recommendation: use these primitives first instead of creating raw custom controls.

## Layout structure

File: `src/components/Layout.tsx`

- Fixed top nav
- Desktop nav + mobile menu
- Main content transition animations
- Role badge and user controls

When changing global UX patterns (nav density, header height, spacing), start here.

## Page-level UI composition patterns

Common patterns used across pages:

- `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` for content container
- Section blocks with `py-*` for rhythm
- Cards with `glass`/`glass-hover` and rounded corners
- Framer Motion for reveal/hover micro-interactions
- Lucide icons for semantic visual cues

## Animation conventions

Animations are mostly:

- Entry fades/slides (`initial` + `animate`)
- Hover lift (`whileHover={{ y: -4 ... }}`)
- Small scale tap states (`whileTap={{ scale: ... }}`)

Use subtle motion. Keep transitions fast and calm for fintech feel.

## Responsive behavior

Patterns currently used:

- Breakpoints: `sm`, `md`, `lg`, `xl`
- Grids shift from 1-column to multi-column progressively
- Mobile menu appears below `md`

When redesigning:

- Start mobile-first, then scale up.
- Keep target tap areas at least 40px high.

## Practical style-safe editing rules

1. Prefer token edits in `index.css` for broad visual shifts.
2. Use shared classes/components before one-off class stacks.
3. Keep semantic classes (`text-muted-foreground`) rather than hardcoded colors.
4. Reuse spacing scale consistently (`4/6/8/10/12` etc.).
5. Avoid mixing too many visual metaphors per page.

## Fast UI change checklist

If you want to restyle quickly:

1. Update color/radius tokens in `src/index.css`.
2. Refine shared utilities (`glass*`, `gradient*`, `divider*`).
3. Adjust top nav styling in `Layout.tsx`.
4. Tune page-level spacing and typography in `Index.tsx` first.
5. Propagate same patterns to `Deals`, `Portfolio`, `Documents`, `InvestWizard`.

