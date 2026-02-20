# Figma MCP Design System Rules — Reconciliation (Fiskl)

## Project Structure

- **Single-file app:** All components and design tokens live in `App.jsx`
- **Framework:** React 19 + Vite
- **Styling:** Inline styles only — no Tailwind, no CSS Modules, no external styling libraries
- **Bundler:** Vite 7

---

## Figma Implementation Flow

1. Run `get_design_context` for the target node
2. Run `get_screenshot` for visual reference
3. Translate output into **inline styles** referencing CSS custom properties (see token map below)
4. Reuse existing primitive components from `App.jsx` before creating new ones
5. Validate against the Figma screenshot for 1:1 parity before marking complete

---

## Design Tokens

All tokens are CSS custom properties defined in the `<style>` block inside `App.jsx`. Always use `var(--token)` — never hardcode colors or values.

### Color Tokens → Figma Variable Mapping

| CSS Variable               | Value (oklch)                        | Figma Style Name         |
|---------------------------|--------------------------------------|--------------------------|
| `--background`            | `oklch(1 0 0)` (white)              | color/background         |
| `--foreground`            | `oklch(0.1993 0.0541 272.68)`       | color/foreground         |
| `--card`                  | `oklch(1 0 0)`                      | color/card               |
| `--card-foreground`       | `oklch(0.1993 0.0541 272.68)`       | color/card-foreground    |
| `--primary`               | `oklch(60.06% 0.2248 257.64)` (#0078FF approx) | color/primary  |
| `--primary-foreground`    | `oklch(0.9659 0.0209 227.52)`       | color/primary-foreground |
| `--muted`                 | `oklch(0.9774 0.0042 236.5)`        | color/muted              |
| `--muted-foreground`      | `oklch(0.5299 0.0425 263.39)`       | color/muted-foreground   |
| `--accent`                | `oklch(0.9493 0.0103 247.94)`       | color/accent             |
| `--accent-foreground`     | `oklch(0.1993 0.0541 272.68)`       | color/accent-foreground  |
| `--destructive`           | `oklch(0.6537 0.2329 21.74)` (#FF275F approx) | color/destructive |
| `--border`                | `oklch(0.9283 0.0055 274.96)`       | color/border             |
| `--input`                 | `oklch(0.8368 0.0305 262.52)`       | color/input              |
| `--warning`               | `oklch(0.6804 0.214 39.54)` (#FF5905 approx) | color/warning |
| `--positive`              | `oklch(0.6895 0.1494 162.47)` (#00E89D approx) | color/positive |
| `--tooltip`               | `oklch(0.1993 0.0541 272.68)`       | color/tooltip            |
| `--tooltip-foreground`    | `oklch(1 0 0)`                      | color/tooltip-foreground |
| `--sidebar`               | `oklch(0.9846 0.0017 247.84)`       | color/sidebar            |
| `--sidebar-foreground`    | `oklch(0.3063 0.0588 271.91)`       | color/sidebar-foreground |
| `--sidebar-primary`       | `oklch(0.598 0.22 257.871)`         | color/sidebar-primary    |
| `--sidebar-accent`        | `oklch(0.967 0.0029 264.54)`        | color/sidebar-accent     |
| `--sidebar-border`        | `oklch(0.9283 0.0055 274.96)`       | color/sidebar-border     |

### Gradient Token

```js
const C = {
  grad: "linear-gradient(92deg,#0058FF 0%,#00B4FF 45%,#00E0A0 100%)",
};
```
Use `C.grad` (imported from the `C` constant in `App.jsx`) for all gradient backgrounds.

### Border Radius

| CSS Variable | Value      |
|-------------|------------|
| `--radius`  | `0.5rem`   |

Use `var(--radius)` for standard corners. Cards use `calc(var(--radius) + 4px)`.

---

## Existing Primitive Components (reuse before creating new ones)

All in `App.jsx`:

| Component        | Purpose                                              |
|-----------------|------------------------------------------------------|
| `<Btn>`         | Buttons — props: `grad`, `outline`, `blue`, `sm`, `xs` |
| `<Crd>`         | Card container with border and background            |
| `<Badge>`       | Status pill — variants: `positive`, `neutral`, `warning`, `critical`, `ai` |
| `<Amt>`         | Formatted GBP amount — props: `a` (number), `sm`    |
| `<SumRow>`      | Summary stat row                                    |
| `<Separator>`   | Horizontal or vertical divider — prop: `vertical`   |
| `<Tooltip>`     | Hover tooltip — props: `content`, `side`            |
| `<DropdownMenu>`| Context menu                                        |
| `<Icon>`        | SVG icon — props: `d` (path), `size`, `className`   |
| `<SecHdr>`      | Section header with toggle                         |
| `<LedgerItem>`  | Ledger transaction row                              |
| `<StatementItem>`| Statement transaction row                          |
| `<EditModal>`   | Transaction edit modal                              |
| `<BalanceBanner>`| Sticky balance comparison bar                      |
| `<ConfBox>`     | AI confidence match widget                          |

---

## Icon System

Icons are defined as inline SVG path strings in the `Icons` object in `App.jsx`. Use the `<Icon>` component:

```jsx
<Icon d={Icons.home} size={16} />
<Icon d={Icons.chevronRight} size={14} />
```

- IMPORTANT: Do NOT install lucide-react, heroicons, or any icon library
- IMPORTANT: Do NOT use emoji icons except where they already exist in the codebase
- Add new icons to the `Icons` object as SVG `d` path strings

---

## Styling Rules

- IMPORTANT: Use **inline styles only** — no className-based styling, no external CSS
- IMPORTANT: Never hardcode hex colors — use `var(--token)` from the design token list above
- Use `C.grad` for the brand gradient (never hardcode the gradient string)
- Typography: `fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"` — already set globally via body styles
- Font weights in use: 400, 500, 600, 700, 800

---

## Asset Handling

- IMPORTANT: If the Figma MCP server returns a localhost source for an image or SVG, use that source directly
- IMPORTANT: Do NOT use placeholder images — use Figma-provided sources
- No external image assets currently in use; icons are inline SVG

---

## Figma MCP Variable → CSS Variable Quick Reference

When implementing Figma designs, map Figma variable names to CSS variables as follows:

```
color/primary        → var(--primary)
color/foreground     → var(--foreground)
color/background     → var(--background)
color/muted          → var(--muted)
color/muted-foreground → var(--muted-foreground)
color/border         → var(--border)
color/positive       → var(--positive)
color/warning        → var(--warning)
color/destructive    → var(--destructive)
color/card           → var(--card)
color/sidebar        → var(--sidebar)
radius/default       → var(--radius)
gradient/brand       → C.grad (linear-gradient(92deg,#0058FF 0%,#00B4FF 45%,#00E0A0 100%))
```
