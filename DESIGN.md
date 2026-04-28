# SnapCSV — DESIGN.md

> Drop this file into the project root. Any AI coding agent (Claude Code, Cursor, Copilot) will read it automatically and generate UI that matches SnapCSV's visual language without re-specification in every prompt.

**Product:** SnapCSV — Chrome Extension  
**Version:** 1.1 — Deep Ocean  
**Last updated:** April 14, 2026  

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
| Text secondary | `--color-text-muted` | `#4a7a90` | Counts, hints, secondary labels, footer text |
| Text disabled | `--color-text-disabled` | `#2a4a5a` | Inactive states, placeholders |

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
| Upgrade muted | `--color-upgrade-muted` | `#2a5a38` | Secondary text inside upgrade prompt |

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

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

No external font imports. System fonts only — zero latency, always available.

**Monospace (for license keys and filenames):**
```css
font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
```

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
Subtext: 12px, #2a5a38
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
- No spring, no bounce, no keyframe animations

**Keyboard requirements:**
- Escape: dismiss license panel → upgrade prompt
- Back button: always return to table list
- No other keyboard shortcuts in v1.0

---

## 9. Icon Brief

The extension icon sits in the Chrome toolbar at 16px next to 20+ other icons. It is the primary brand touchpoint.

**Accent color:** `#0ea5b8` aqua-teal — dominant icon color  
**Background:** `#090d12` deep navy or transparent  
**Symbol:** Table grid or CSV-related — readable at 16px  
**Style:** Flat. No gradients, no drop shadow, no fine detail that disappears small.  
**Sizes:** 16px, 48px, 128px — PNG

**Do not use:** Purple/violet (competitor default), gradients, letter-based marks.

---

## 10. Do's and Don'ts

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
- Don't import external fonts, icons, or CSS frameworks
- Don't use transitions longer than 150ms
- Don't use `border-radius` > 8px
- Don't show soft footer nudge AND hard upgrade panel simultaneously
- Don't use title case on button labels
- Don't add decorative gradients, patterns, or illustrations
- Don't change popup width (360px fixed)
- Don't use purple, amber, or orange — those belong to other themes, not this one

---

## 11. Full `:root` CSS Variables

Copy this block directly into the top of `popup.css`:

```css
:root {
  /* Base — Deep Ocean */
  --color-bg:                #090d12;
  --color-surface:           #0c1824;
  --color-surface-raised:    #132535;
  --color-border:            #142030;

  /* Text */
  --color-text:              #d8eaf0;
  --color-text-muted:        #4a7a90;
  --color-text-disabled:     #2a4a5a;

  /* Accent — Aqua Teal */
  --color-accent:            #0ea5b8;
  --color-accent-hover:      #12bcd0;
  --color-accent-muted:      #082030;
  --color-accent-text:       #ffffff;

  /* Upgrade — Green (go register) */
  --color-upgrade:           #1adb72;
  --color-upgrade-bg:        #0a1a08;
  --color-upgrade-border:    #1a3a15;
  --color-upgrade-muted:     #2a5a38;

  /* Success — Green */
  --color-success:           #22c55e;
  --color-success-bg:        #071a0a;
  --color-success-border:    #0f3015;

  /* Error */
  --color-error:             #ef4444;
  --color-error-bg:          #1f0808;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
}
```

---

## 12. File Conventions

```
popup/popup.css     ← All styles. :root variables at top. No external imports.
popup/popup.html    ← All UI panels as hidden divs, toggled via JS
popup/popup.js      ← State machine. Vanilla JS only. No frameworks.
background.js       ← Service worker. No UI logic.
```

---

## 13. Claude Code Session Prompt

Start every Claude Code session with:

> *"Read DESIGN.md in the project root before writing any CSS or HTML. Use only the CSS variables defined in Section 11. The theme is Deep Ocean — teal accent (#0ea5b8), green upgrade prompt (#1adb72), navy-black darks (#090d12). Never use purple, amber, or orange in this codebase."*

---

*This file is the source of truth for SnapCSV's UI. Theme: Deep Ocean. Adopted April 14, 2026. When UI decisions diverge from this file, update this file — don't patch individual components.*
