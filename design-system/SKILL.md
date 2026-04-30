---
name: snapcsv-design
description: Use this skill to generate well-branded interfaces and assets for SnapCSV, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

- **Theme:** Deep Ocean. Dark navy-black, aqua-teal accent, two distinct greens (upgrade vs. success), red for errors only.
- **Forbidden:** purple, amber, orange, gradients, box-shadow (anywhere, ever), border-radius > 8px, transitions > 150ms, external fonts, icon fonts, emoji.
- **Type:** System sans only. Monospace reserved for license keys + filenames.
- **Sizes:** 10–14px range. Body 13px. Captions 11px.
- **Popup width:** always 360px. Never change.
- **Tokens:** import `colors_and_type.css` — never hardcode hex outside `:root`.

See README.md for full guidelines, `Design System.html` for the rendered reference, and `ui_kits/popup/` for component recreations.
