UI Style Guide — Showroom Car Management
=======================================

Purpose
- Provide the design tokens, components, and usage patterns introduced in the project.

Color tokens (Tailwind aliases)
- `primary`: #d633ff (accent)
- `navy`: #0b1220 (app background)
- `card`: #0f1724 (card background)

Typography
- Base font: Inter (system fallback included)
- Headings: use `text-2xl` / `text-lg` plus `font-semibold`
- Body: `text-sm` / `text-base` with `text-slate-200` on dark background

Components
- Button (`src/components/ui/Button.tsx`)
  - Variants: `primary`, `neutral`, `ghost`
  - Sizes: `sm`, `md`, `lg`
  - Animations: hover lift, press scale (Framer Motion)

- Modal (`src/components/Modal.tsx`)
  - Uses Framer Motion `AnimatePresence` + motion for overlay fade and modal scale/slide
  - Accessible: `role="dialog" aria-modal="true"`

- StatCard (`src/components/StatCard.tsx`)
  - Elevated card with hover lift and subtle shadow

Spacing, Shadows, Radius
- Card radius: `rounded-lg` / `rounded-xl` for large modals
- Card shadow: soft large shadow + backdrop blur (see `.card-bg` in globals.css)

Animation guidelines
- Use short, responsive spring animations for micro-interactions:
  - Hover lift: y: -4 to -8, duration ~0.15–0.25s
  - Press: scale 0.98
  - Modal entrance: small y offset + scale

Files to check
- `tailwind.config.js` — color tokens
- `src/styles/globals.css` — card styles & variables
- `src/components/ui` — UI primitives (Button)

How to extend
- Create variants in `Button.tsx` for new semantic colors (success/warn/error)
- Use `motion` wrappers to animate other components consistently

