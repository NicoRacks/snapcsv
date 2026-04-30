# SnapCSV — DESIGN.md

> Drop this file into the project root. Any AI coding agent (Claude Code, Cursor, Copilot) will read it automatically and generate UI that matches SnapCSV's visual language without re-specification in every prompt.

**Product:** SnapCSV — Chrome Extension  
**Version:** 1.4 — Deep Ocean (Truth Pass)  
**Last updated:** April 30, 2026  

---

## 1. Brand Identity

**Personality:** Fast, precise, trustworthy. No fluff. One job, done instantly.  
**Visual language:** Deep data-native dark — the kind of interface that feels at home on top of Yahoo Finance, Wikipedia, and government data portals.  
**Tone:** Direct. Zero onboarding copy. Every pixel serves the workflow.

**Core aesthetic:** Deep navy-black surfaces with an aqua-teal accent. Bright green for success and the upgrade "go" signal. Nothing decorative — this is the palette of data environments users already trust.

---

## 2. Color Palette

### Base Theme (Deep Ocean)

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Background | `--color-bg` | `#090d12` | Popup background, all panels |
| Surface | `--color-surface` | `#0c1824` | Table list items, preview rows, input fields |
| Surface raised | `--color-surface-raised` | `#132535` | Hovered list items, selected state |
| Border | `--color-border` | `#142030` | Dividers, input outlines, table row separators |
| Text primary | `--color-text` | `#d8eaf0` | All primary body text, table data |
| Text secondary | `--color-text-muted` | `#6da8c0` | Counts, hints, secondary labels, footer text · ~8:1 contrast ✓ |
| Text disabled | `--color-text-disabled` | `#507a95` | Inactive states, placeholders · ~4.7:1 contrast ✓ |

### Accent — Aqua Teal (Primary)

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Accent | `--color-accent` | `#0ea5b8` | Primary buttons, active states, PRO badge bg |
| Accent hover | `--color-accent-hover` | `#12bcd0` | Button hover |
| Accent muted | `--color-accent-muted` | `#082030` | Accent bg tints, subtle highlights |
| Accent text | `--color-accent-text` | `#ffffff` | Text on accent buttons/badges |

### Semantic — Green (Upgrade / Go)

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Upgrade | `--color-upgrade` | `#1adb72` | Upgrade CTA button, limit-reached header |
| Upgrade bg | `--color-upgrade-bg` | `#0a1a08` | Upgrade prompt panel background |
| Upgrade border | `--color-upgrade-border` | `#1a3a15` | Upgrade panel border |
| Upgrade muted | `--color-upgrade-muted` | `#6aaa7a` | Secondary text inside upgrade prompt · ~7.6:1 contrast ✓ |

> **Design intent:** The upgrade prompt uses green — the "go" register — not amber/warning. It should feel like an invitation to keep going, not a penalty for hitting a wall.

### Semantic — Green (Export Success)

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Success | `--color-success` | `#22c55e` | Export success text, checkmarks |
| Success bg | `--color-success-bg` | `#071a0a` | Success state panel background |
| Success border | `--color-success-border` | `#0f3015` | Success panel border |

### Semantic — Red (Error)

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Error | `--color-error` | `#ef4444` | Invalid license key, export failure |
| Error bg | `--color-error-bg` | `#1f0808` | Error message background tint |

---

## 3. Typography

### Font Stack

**Sans:** IBM Plex Sans (variable, **`wdth + wght`** axes) with system fallback.

```css
font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

**Monospace (for license keys and filenames):** JetBrains Mono (variable, **`wght`** axis only) with system fallback.

```css
font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
```

Both families are downloaded directly from **Google Fonts** (https://fonts.google.com), preserving the original filenames and OFL license files. They live inside the extension package — no CDN, no external requests, no CSP relaxation:

```
design-system/assets/fonts/
  IBMPlexSans-VariableFont_wdth,wght.ttf
  IBMPlexSans-Italic-VariableFont_wdth,wght.ttf
  JetBrainsMono-VariableFont_wght.ttf
  JetBrainsMono-Italic-VariableFont_wght.ttf
  OFL-IBMPlex.txt
  OFL-JetBrainsMono.txt
```

The `@font-face` declarations live in `design-system/colors_and_type.css`, which `popup/popup.css` consumes via `@import`. System fallbacks render instantly if any bundled file fails to load.

Reference these via the canonical CSS variables — `var(--font-sans)` and `var(--font-mono)` — never hardcode the family names.

### Type Scale

| Role | Size | Weight | Line height | Usage |
|------|------|--------|-------------|-------|
| Header label | 13px | 600 | 1.2 | Popup title "SnapCSV", section headers |
| Body | 13px | 400 | 1.5 | Table list items, descriptions, hints |
| Body small | 12px | 400 | 1.4 | Preview row data, secondary info |
| Caption | 11px | 400 | 1.3 | Footer counter, counts, timestamps |
| Button | 13px | 500 | 1 | All button labels |
| Monospace | 12px | 400 | 1.4 | License key input, exported filename |
| PRO badge | 10px | 700 | 1 | All-caps "PRO" badge label |

### Text Rules

- All labels sentence case. Never title case on buttons.
- Counts and metadata use `--color-text-muted`.
- Never exceed 2 font weights on any single view.
- Monospace always for: license key input, filename display, code snippets.
- The type scale above governs **text only**. Decorative Unicode glyphs sit at their own sizes outside the scale: `⬡` logo at 16px, `⊘` empty-state icon at 28px, `✓` success checkmark at 22px. Do not size text content at these values.

---

## 4. Layout & Spacing

### Popup Dimensions

```
Width:      360px (fixed — Chrome extension constraint)
Max height: 500px (content scrolls inside, popup frame stays fixed)
```

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Icon gaps, inline tight spacing |
| `--space-2` | 8px | Between label and value, compact row padding |
| `--space-3` | 12px | Standard row vertical padding |
| `--space-4` | 16px | Section padding, button padding |
| `--space-5` | 20px | Major section gaps |
| `--space-6` | 24px | Header/footer height baseline |

### Layout Sections (top to bottom)

```
┌─────────────────────────────────────────┐  ← 360px wide
│  HEADER BAR           [PRO]  [×]        │  40px — fixed
├─────────────────────────────────────────┤
│  STATUS / CONTENT AREA                  │  flex-grow, scrollable
│  (table list · preview · upgrade ·      │
│   error · success panels)               │
├─────────────────────────────────────────┤
│  FOOTER — usage counter / nudge         │  32px — fixed
└─────────────────────────────────────────┘
```

---

## 5. Border Radius

| Context | Value |
|---------|-------|
| Popup container | 0px (Chrome handles outer radius) |
| Buttons | 6px |
| Input fields | 6px |
| Table list items | 4px |
| Preview table rows | 0px (tight, spreadsheet-like) |
| Badges (PRO) | 4px |
| Upgrade / success / error panels | 8px |

---

## 6. Shadows & Elevation

No drop shadows. Elevation via background color only.

- Layer 0 (base): `#090d12`
- Layer 1 (surface): `#0c1824`
- Layer 2 (raised/hover): `#132535`

Use `--color-border` for separation. Never `box-shadow`.

---

## 7. Component Patterns

### Header Bar

```
Height: 40px · Padding: 0 16px · flex, space-between, align-center
Left: "SnapCSV" — 13px, weight 600, --color-text
Right: PRO badge (after activation) — always visible once activated
Border-bottom: 1px solid --color-border
```

**PRO Badge:** "PRO" all-caps · 10px, weight 700 · padding 2px 6px · background `#0ea5b8` · white text · 4px radius

### Table List Item

```
Padding: 12px 16px · Border-bottom: 1px solid --color-border
Active: border-left 2px solid --color-accent, padding-left 14px
Hover: background --color-surface-raised

Line 1: "Table 1" — 13px, weight 500, --color-text
Line 2: "8 rows · 4 columns" — 12px, --color-text-muted
No icons, no checkboxes — text-only rows
```

### Preview Panel

```
Header: "← Back" — 12px, --color-text-muted · border-bottom 1px solid --color-border
Preview table: full-width, 3 data rows max
  - Header row: --color-surface-raised bg, weight 600
  - Data rows: --color-surface bg
  - Cell padding: 6px 10px · Cell border: 1px solid --color-border · 12px font
Export button: full-width, below preview table
```

### Primary Button (Export CSV)

```
Width: 100% · Height: 40px · Border-radius: 6px · Border: none
Background: #0ea5b8 · Hover: #12bcd0 · Text: white, 13px, weight 500
Transition: background 150ms ease
```

### Upgrade Prompt Panel

```
Background: #0a1a08 · Border: 1px solid #1a3a15 · Border-radius: 8px · Padding: 16px
Headline: "You've exported 10 tables today." — 13px, weight 500, #1adb72
Subtext: 12px, #6aaa7a
Upgrade button: full-width, background #1adb72, text #000000, weight 600
Activate link: 12px, --color-text-muted, underline, centered
```

### Footer Bar

```
Height: 32px · Padding: 0 16px · flex, align-center
Border-top: 1px solid --color-border

Default: "{N} free exports left today" — 12px, --color-text-muted
Soft nudge (≤3): same + "Go Pro →" — 12px, --color-upgrade (#1adb72)
No exports left: "No free exports left today. Go Pro →" — 12px, --color-upgrade
Licensed: "Unlimited exports · Pro" — 12px, --color-text-muted
```

### License Key Input

```
Font: 12px monospace · Padding: 8px 12px
Background: --color-surface · Border: 1px solid --color-border
Focus: border --color-accent · Border-radius: 6px
Placeholder: "XXXXXXXX-XXXX-..." — --color-text-disabled
Error: --color-error inline message below input, 12px
```

### Success State

```
Background: #071a0a · Border: 1px solid #0f3015 · Border-radius: 8px · Padding: 16px
"✓ Exported!" — 13px, weight 600, #22c55e
Filename: 12px monospace, --color-text-muted
Auto-dismisses after 3 seconds → returns to table list
```

---

## 8. Motion

- Duration: **150ms**, easing: `ease`
- Applies to: button hover, list item hover
- Does NOT apply to: panel switches, state changes, errors — instant
- No spring, no bounce, no keyframe animations (except spinner)

**Reduced motion:** Respect `prefers-reduced-motion: reduce` — spinner animation is disabled, opacity reduced. No other motion is affected since transitions are already minimal.

**Keyboard requirements:**
- Tab: all interactive elements reachable in DOM order
- Enter / Space: activate table list items (they carry `role="button"`)
- Escape: dismiss license panel → returns to upgrade prompt or preview
- Back button: always returns to table list from preview
- Enter inside license input: triggers activation
- No other keyboard shortcuts in v1.0

---

## 9. Accessibility

SnapCSV targets WCAG 2.1 AA compliance. The following rules apply to all UI work.

### Contrast

All text tokens are calibrated to pass WCAG AA (4.5:1 for body text) on the darkest surface they appear on:

| Token | Hex | Contrast on `--color-bg` |
|-------|-----|--------------------------|
| `--color-text` | `#d8eaf0` | ~13:1 ✓ |
| `--color-text-muted` | `#6da8c0` | ~8:1 ✓ |
| `--color-text-disabled` | `#507a95` | ~4.7:1 ✓ |
| `--color-upgrade-muted` | `#6aaa7a` | ~7.6:1 on `--color-upgrade-bg` ✓ |

### Focus Styles

Every interactive element exposes a visible focus ring via `:focus-visible`. Never suppress focus outlines.

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}
```

**Exception — license input:** uses `border-color: var(--color-accent)` + `box-shadow: 0 0 0 2px var(--color-accent-muted)` instead of outline, since the border is already the primary affordance.

### Screen Reader Utility

```css
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

Use `.sr-only` for: table captions in the preview panel, any label that is visually redundant but needed for AT context.

### ARIA Patterns

| Pattern | Implementation |
|---------|---------------|
| Decorative icons (⬡ ⊘ ✓ spinner) | `aria-hidden="true"` — never `aria-label` when surrounding text already conveys meaning |
| Error messages | `role="alert"` — announced immediately by screen readers |
| Status messages (slow warning, no-headers notice) | `role="status"` + `aria-live="polite"` |
| Live regions (footer nudge, success state) | `aria-live="polite"` + `aria-atomic="true"` |
| External links (upgrade, Go Pro) | `aria-label="[action], opens in new tab"` + `rel="noopener noreferrer"` |
| Interactive list items | `role="button"` + `tabindex="0"` + `keydown` handler for Enter/Space |
| Form inputs | `aria-describedby` linking input to its error message `id` |
| Scanning panel | `role="status"` + `aria-live="polite"` |

### Button Rules

- All `<button>` elements must have explicit `type="button"`.
- Never use a `<div>` or `<span>` as a button. Use `<button>` or add `role="button"` + `tabindex="0"` + keyboard handler to other elements.

### Motion

See Section 8 for `prefers-reduced-motion` requirement.

---

## 10. Icon Brief

The extension icon sits in the Chrome toolbar at 16px next to 20+ other icons. It is the primary brand touchpoint. The shipping mark is **v2 brandmark** (labeled `Brand mark · shipping · v2` in `design-system/preview/brand-logo.html`) — canonical files at `design-system/assets/logo-{16,48,128}.png`, mirrored to `icons/icon-{16,48,128}.png` for the manifest.

**Composition:**
- **Chassis:** near-black rounded square (`#090d12`-ish), corner radius ~26px relative to a 500px master
- **Body:** stylized 3-row data table — narrow index column on the left in lighter teal, three wider data rows on the right in `#0ea5b8` aqua teal, separated by thin chassis-color gutters
- **Badge:** `#1adb72` green circle with a white downward-arrow glyph, overlapping the bottom-right cell of the table
- **Style:** Flat. No gradients, no drop shadow, no fine detail that disappears at 16px

**File sizes (canonical bytes):** `icon-16.png` = 533 B · `icon-48.png` = 1429 B · `icon-128.png` = 3530 B. Production icons must be byte-identical to the v2 source files; copy from `design-system/assets/logo-*.png` on every brandmark update.

**Versions in the design system:**
- `logo-{16,48,128}.png` and `logo-v2-*.png` — the canonical shipping v2 mark
- `logo-v3-*.png` — alternate-direction exploration only, not shipping
- `assets/legacy/logo-*-mvp.png` — pre-Deep-Ocean MVP versions, archived

**Do not use:** Purple/violet (competitor default and the pre-Deep-Ocean palette), gradients, letter-based marks, drop shadow, or any chassis radius > ~26px.

---

## 11. Do's and Don'ts  

### ✅ Do
- Use `--color-surface` for all cards and interactive surfaces
- Use green `#1adb72` **exclusively** for upgrade/limit state — "go" register
- Use green `#22c55e` **exclusively** for export success
- Keep all text at 12–13px
- Use monospace for license keys and filenames — always
- Keep the footer visible and sticky at all times
- Show the PRO badge immediately after activation — persists across sessions
- Fail open on network errors
- Reference CSS variables — never hardcode hex values outside `popup.css`

### ❌ Don't
- Don't use `box-shadow` — ever
- Don't load fonts from a CDN or external host. The two canonical fonts (IBM Plex Sans, JetBrains Mono) are bundled inside the extension package — reference them via `var(--font-sans)` / `var(--font-mono)`. Don't import icons or CSS frameworks.
- Don't use transitions longer than 150ms
- Don't use `border-radius` > 8px
- Don't show soft footer nudge AND hard upgrade panel simultaneously
- Don't use title case on button labels
- Don't add decorative gradients, patterns, or illustrations
- Don't change popup width (360px fixed)
- Don't use purple, amber, or orange — those belong to other themes, not this one

---

## 12. Full `:root` CSS Variables

Copy this block directly into the top of `popup.css`:

> The canonical implementation lives in `design-system/colors_and_type.css`. `popup/popup.css` consumes it via `@import url('../design-system/colors_and_type.css');` — do not duplicate this block in production CSS.

```css
:root {
  /* Base — Deep Ocean */
  --color-bg:                #090d12;
  --color-surface:           #0c1824;
  --color-surface-raised:    #132535;
  --color-border:            #142030;

  /* Text */
  --color-text:              #d8eaf0;
  --color-text-muted:        #6da8c0;  /* WCAG AA: ~8:1 */
  --color-text-disabled:     #507a95;  /* WCAG AA: ~4.7:1 */

  /* Accent — Aqua Teal */
  --color-accent:            #0ea5b8;
  --color-accent-hover:      #12bcd0;
  --color-accent-active:     #0a96aa;
  --color-accent-muted:      #082030;
  --color-accent-text:       #ffffff;

  /* Upgrade — Green (go register) */
  --color-upgrade:           #1adb72;
  --color-upgrade-hover:     #16c466;  /* button hover — slightly darker green */
  --color-upgrade-bg:        #0a1a08;
  --color-upgrade-border:    #1a3a15;
  --color-upgrade-muted:     #6aaa7a;  /* WCAG AA: ~7.6:1 on upgrade-bg */
  --color-upgrade-text:      #000000;  /* black text on green CTA — ~13:1 */

  /* Success — Green */
  --color-success:           #22c55e;
  --color-success-bg:        #071a0a;
  --color-success-border:    #0f3015;

  /* Error */
  --color-error:             #ef4444;
  --color-error-bg:          #1f0808;

  /* Type stack — bundled variable fonts with system fallback */
  --font-sans: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;

  /* Type roles (size · weight · line-height) */
  --t-pro-size: 10px;       --t-pro-weight: 700;     --t-pro-tracking: 0.8px;
  --t-caption-size: 11px;   --t-caption-weight: 400; --t-caption-lh: 1.3;
  --t-body-sm-size: 12px;   --t-body-sm-weight: 400; --t-body-sm-lh: 1.4;
  --t-button-size: 13px;    --t-button-weight: 500;  --t-button-lh: 1.0;
  --t-body-size: 13px;      --t-body-weight: 400;    --t-body-lh: 1.5;
  --t-header-size: 13px;    --t-header-weight: 600;  --t-header-lh: 1.2;
  --t-logo-size: 14px;      --t-logo-weight: 700;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;

  /* Radii */
  --radius-0: 0px;     /* popup container, table rows */
  --radius-1: 4px;     /* badges, list items */
  --radius-2: 6px;     /* buttons, inputs */
  --radius-3: 8px;     /* panels (max — never exceed) */

  /* Motion */
  --motion-fast: 150ms ease;
}
```

---

## 13. File Conventions

```
design-system/colors_and_type.css  ← Canonical tokens (colors + type) + @font-face for bundled fonts. Single source of truth — imported by popup/popup.css.
design-system/assets/fonts/        ← Bundled variable .ttf files: IBM Plex Sans (regular + italic), JetBrains Mono (regular + italic), with OFL license files.
design-system/assets/logo-{16,48,128}.png  ← Canonical brand mark (v2). Mirrored to icons/icon-*.png for the manifest.

popup/popup.css     ← All styles. @imports design-system/colors_and_type.css for tokens. No duplicate :root block.
popup/popup.html    ← All UI panels as hidden divs, toggled via JS
popup/popup.js      ← State machine. Vanilla JS only. No frameworks.
background.js       ← Service worker. No UI logic.
icons/icon-*.png    ← Toolbar icons referenced by manifest.json. Copy from design-system/assets/logo-*.png on every brandmark update.
```

---

## 14. Claude Code Session Prompt

Start every Claude Code session with:

> *"Read DESIGN.md in the project root before writing any CSS or HTML. Use only the CSS variables defined in Section 12. The theme is Deep Ocean — teal accent (#0ea5b8), green upgrade prompt (#1adb72), navy-black darks (#090d12). Never use purple, amber, or orange in this codebase."*

---

*This file is the source of truth for SnapCSV's UI. Theme: Deep Ocean. Adopted April 14, 2026. Accessibility pass: April 30, 2026 (v1.2). Typography pass: April 30, 2026 (v1.3 — bundled IBM Plex Sans + JetBrains Mono, design-system import). Truth pass: April 30, 2026 (v1.4 — replaced renamed font binaries with the canonical Google Fonts versions, fixed duplicate Section 9 numbering, rewrote Icon Brief for the actual v2 brandmark, added `--color-upgrade-text` / `--color-upgrade-hover` tokens). When UI decisions diverge from this file, update this file — don't patch individual components.*
