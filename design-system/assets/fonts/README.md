# SnapCSV — Bundled fonts

Variable font files self-hosted with the extension. No external CDN, no Google Fonts runtime imports, no CSP changes. **Files are exact, byte-for-byte, the binaries downloaded from [fonts.google.com](https://fonts.google.com)** — preserving original Google Fonts filenames so the variable axis convention (`_wdth,wght` vs `_wght`) is visible from the file listing alone.

| File | Family | Axes |
|---|---|---|
| `IBMPlexSans-VariableFont_wdth,wght.ttf` | IBM Plex Sans | `wdth` 75–100 + `wght` 100–900 |
| `IBMPlexSans-Italic-VariableFont_wdth,wght.ttf` | IBM Plex Sans italic | `wdth` 75–100 + `wght` 100–900 |
| `JetBrainsMono-VariableFont_wght.ttf` | JetBrains Mono | `wght` 100–900 |
| `JetBrainsMono-Italic-VariableFont_wght.ttf` | JetBrains Mono italic | `wght` 100–900 |

Declared in `colors_and_type.css` via `@font-face` with `format('truetype-variations')`. IBM Plex's `wdth` axis is exposed via `font-stretch: 75% 100%` so `font-stretch: condensed` works without loading a separate file. Weight 100–900 is exposed for both families.

**License:** OFL 1.1 — required for redistribution. Original license files live alongside as `OFL-IBMPlex.txt` and `OFL-JetBrainsMono.txt`.

**System fallback** kicks in if any file fails to load — popup still renders cleanly via `-apple-system, BlinkMacSystemFont, 'Segoe UI'` (sans) and `'SF Mono', 'Fira Code', Consolas` (mono).
