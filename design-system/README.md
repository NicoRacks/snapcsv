# SnapCSV Design System

> **Theme:** Deep Ocean · **Version:** 1.1 · **Updated:** April 30, 2026

A complete design system for **SnapCSV** — a Chrome extension that exports any webpage HTML table to CSV in one click. Built by [Blank Canvas Ventures LLC](https://github.com/NicoRacks).

The product is a 360px-wide browser popup with a 500px max height. Panels swap in place — no navigation, no pages. **One job, done instantly.** Personality: fast, precise, trustworthy. Data-native. Zero decoration.

---

## Sources

- **GitHub repo:** [`NicoRacks/snapcsv`](https://github.com/NicoRacks/snapcsv) — imported `popup/popup.{html,css,js}`, `icons/`, and read `DESIGN.md`, `README.md`, `manifest.json`, `index.html` (privacy policy)
- **Design spec:** the user's expanded "Deep Ocean" brief — slightly higher-contrast text colors than the repo (`#6da8c0` muted, `#507a95` disabled), and 20 explicit color tokens. **This spec is the source of truth.** The repo's `DESIGN.md` v1.1 has older muted/disabled values; treat those as superseded.

---

## CONTENT FUNDAMENTALS

SnapCSV's voice is **the product itself, talking back to you in five words or fewer.** No marketing. No onboarding. No emoji. Every string earns its pixel.

### Voice
- **Direct.** State the fact. "Daily limit reached." "Exported!" "No tables found on this page."
- **Sentence case, always.** Never title case on buttons, never ALL CAPS except the `PRO` badge.
- **Imperative for actions.** "Export CSV", "Activate", "Paste your license key…"
- **Past tense for results.** "Exported!" not "Export complete" or "Successfully exported".
- **Numbers concrete.** "10 tables today", "3 free exports left today", "24 rows · 6 columns".
- **No "you" in chrome copy** — labels are nouns or imperatives, not sentences. The exception is the upgrade panel, which uses second-person *briefly*: "You've exported 10 tables today."

### Casing & punctuation
- Sentence case on every label, button, and panel title.
- The middle dot `·` is the canonical separator for inline metadata: `8 rows · 4 columns`, `Unlimited exports · Pro`.
- Em-dash on the upgrade button: `Upgrade — $19 one-time`.
- Ellipsis `…` (single character) for placeholders and progress: `Paste your license key…`, `Scanning page…`, `Taking longer than expected…`.
- Right arrow `→` for outbound links: `Go Pro →`. Left arrow `←` for back navigation: `← Back`.
- Warning glyph `⚠` for inline notices: `⚠ No headers detected — first row is data`.

### Tone examples (verbatim from the product)
| Context | Copy |
|---|---|
| Scanning | `Scanning page…` |
| Empty | `No tables found on this page.` / `Try a page with HTML <table> elements.` |
| List header | `Tables found` |
| Limit hit | `Daily limit reached` / `You've exported 10 tables today. Upgrade to SnapCSV Pro for unlimited exports.` |
| Soft nudge | `3 free exports left today.` |
| Success | `Exported!` |
| Error | `Invalid license key.` |
| Slow | `Taking longer than expected…` |

### Forbidden
- ❌ Emoji. Unicode glyphs (`⬡ ⊘ ⚠ ✓ · → ←`) are allowed because they're typographic, not decorative.
- ❌ "Awesome", "Great!", "Oops", "Whoops", any cheerleader copy.
- ❌ Multi-sentence explanations on chrome. If a label needs two sentences, the design is wrong.
- ❌ Marketing adjectives: "powerful", "smart", "intuitive", "blazing-fast".

---

## VISUAL FOUNDATIONS

SnapCSV is a **dark, data-native interface**. Think Bloomberg terminal, not consumer app. The aesthetic is borrowed from the environments users already trust their data with — Yahoo Finance, Wikipedia tables, government data portals.

### Color
- **Deep navy-black surfaces.** Three layers: `#090d12` base → `#0c1824` surface → `#132535` raised. Depth is communicated *only* via background color.
- **Aqua teal accent** (`#0ea5b8`) for primary action, focus, and the PRO badge. Deliberately not blue — blue is generic; aqua reads "data-tool".
- **Two greens, never one.** `#1adb72` is the *upgrade / "go" register* — bright, optimistic. `#22c55e` is the *export-success register* — slightly darker, more grounded. Never swap them.
- **Red `#ef4444`** for errors only. No amber, no orange — the upgrade prompt uses green, not warning yellow.
- **Forbidden palette:** purple, violet, amber, orange, gradients of any kind.

### Type
- **Sans:** `IBM Plex Sans` (variable font, bundled at `assets/fonts/IBMPlexSans-Variable.ttf`) with system fallback `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`. Self-hosted — no external imports, no CDN, no CSP changes. Plex gives the product a half-step of engineering personality without sacrificing legibility.
- **Mono:** `JetBrains Mono` (variable font, bundled at `assets/fonts/JetBrainsMono-Variable.ttf`) with fallback `'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace`. Reserved for **license keys and exported filenames only** — never decorative. Distinct character shapes (zero-with-slash, unambiguous l/I/1) so license keys can't be misread.
- **Loading:** `colors_and_type.css` declares `@font-face` against the bundled .ttf files. One file per family (variable font axis covers 100–900). System fallback if for any reason the font file fails to load.
- **Two weights per view, max.** Usually 400 + 600. Buttons are 500. The PRO badge is the only 700.
- All sizes between **10–14px**. Body lives at 13px. Captions at 11px.

### Spacing & layout
- 6-step scale: `4 / 8 / 12 / 16 / 20 / 24`. Don't invent values between.
- Popup is **always 360px wide.** Never adjust.
- Header 40px tall, footer 32px (when shown). Content fills the middle and scrolls inside.

### Backgrounds & imagery
- **No backgrounds beyond the three layers.** No images, no patterns, no full-bleed photography, no gradients, no noise textures, no illustrations.
- **No hero imagery, no iconography beyond a single hex logo glyph.** Tables are the imagery.

### Animation
- **150ms `ease`** for hover transitions. That's the entire motion vocabulary.
- Panel switches are **instant** — no fade, slide, or crossfade.
- Spinner uses a CSS keyframe (`spin`) and is disabled under `prefers-reduced-motion`.
- No springs, no bounces, no parallax, no scroll-triggered animation.

### Hover & press states
- **Buttons (primary):** `bg #0ea5b8 → #12bcd0` on hover, `#0a96aa` on active. No transform, no scale.
- **Buttons (secondary):** transparent → border becomes accent, text brightens to `#d8eaf0`.
- **Buttons (ghost):** text only, `#507a95 → #6da8c0`. No bg change.
- **List items:** bg `#090d12 → #132535`, `border-left` flips from transparent (3px reserved) to `#142030`. Selected state uses `#0ea5b8` for that 3px stripe.
- **Inputs:** `border-color` swaps to `#0ea5b8` on focus. No shadow, no ring on inputs.

### Borders & corners
- **All borders are 1px `#142030`**, except focus rings (2px `#0ea5b8`, 2px offset).
- **Radius scale:** `0 / 4 / 6 / 8`. Cap is **8px — never exceed.** Buttons + inputs = 6. Badges + list items = 4. Panels = 8. Table rows + popup container = 0.

### Elevation
- **No `box-shadow`. Anywhere. Ever.** This is the single strictest rule in the system. Depth is communicated *only* via the three background layers and `--color-border` separation.

### Transparency & blur
- **None.** No `backdrop-filter`, no `rgba()` overlays, no scrims. The interface is opaque.

### Cards & panels
- Cards are flat colored rectangles. Border `1px #142030` for raised surfaces, or `1px #1a3a15` / `#0f3015` for the upgrade/success colored panels. Always 8px radius. Never any shadow.

### Layout rules
- The header is fixed, the footer is fixed (when shown), the middle scrolls inside.
- `border-left: 3px solid transparent` is reserved on every table list item — when the item becomes selected, the stripe fills with accent. Layout never shifts.
- **Never show the footer nudge AND the upgrade panel simultaneously.**

---

## ICONOGRAPHY

SnapCSV uses **almost no iconography.** This is intentional — every icon is a decision the user has to parse, and we want the user parsing tables, not chrome.

### What we use
- **Brandmark:** `assets/logo-{16,48,128}.png` — a stylized data table (3 rows of cells, narrow index column on the left, wider data rows on the right) with a teal circular download-arrow badge overlapping the bottom-right cell. The whole mark sits on a near-black rounded square (`#0c1824`, ~24px corner radius). Used in the popup header at 18px, in the Chrome toolbar at 16px, and on the store listing at 128px. Future direction explorations live at `assets/brandmark-v2.svg` and `assets/brandmark-v3.svg` — not shipped, kept for reference.
- **Status glyphs (Unicode, typographic — not decorative):**
  - `⊘` empty state ("No tables found")
  - `⚠` no-headers warning strip
  - `✓` export success
  - `›` chevron on table list items
  - `←` back nav, `→` outbound link
  - `·` middle-dot separator
- **PRO badge.** Text-only, `PRO` in a 4px-radius accent-filled pill. No icon.

### What we don't use
- ❌ **No icon font** (no Lucide, Heroicons, Material, FontAwesome, Phosphor — none).
- ❌ **No SVG icons.** The popup is 360px wide; every SVG is a maintenance liability for almost no information gain.
- ❌ **No emoji**, ever. Even decorative emoji read as untrustworthy in a data context.
- ❌ **No PNG icons in the popup UI.** PNGs are reserved for the Chrome toolbar (16/48/128) where they have to be raster.

If a future feature genuinely needs an icon (e.g. column type indicators in the preview table), the rule is: **try a Unicode glyph first; only reach for an SVG if there is no readable glyph**, and then ship the SVG inline (no asset reference) at 12px stroke-1.5, accent-color stroke, no fill, `aria-hidden="true"`.

The brand logo PNGs at 16/48/128 are at `assets/logo-*.png`. Imported from the source repo's `icons/` folder.

---

## INDEX

Manifest of this design system:

| Path | Purpose |
|---|---|
| `README.md` | This file — voice, visuals, iconography, manifest |
| `SKILL.md` | Agent-Skills front matter so this folder is invocable as a skill |
| `colors_and_type.css` | All CSS custom properties + semantic role classes (`.t-body`, `.t-mono`, etc.) |
| `Design System.html` | Single-page reference document — every token, every component, every state |
| `assets/logo-{16,48,128}.png` | Chrome toolbar icons / canonical brand mark |
| `preview/*.html` | Individual cards rendered in the Design System tab |
| `ui_kits/popup/` | Pixel-perfect React recreation of the extension popup |
| `popup/` | Original imported source (popup.html / popup.css / popup.js) for reference |

### UI kits
- **`ui_kits/popup/`** — the only product surface. Click-thru recreation of the 360px Chrome extension popup, covering: scanning → table list → preview → export → success, plus the upgrade and license-input flows.

### Where to start
1. Read this README for voice and visual rules.
2. `@import 'colors_and_type.css'` in any new CSS to inherit tokens.
3. Open `Design System.html` to see everything rendered.
4. For new product work, copy components out of `ui_kits/popup/` rather than rebuilding.
