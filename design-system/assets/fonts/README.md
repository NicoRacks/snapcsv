# SnapCSV — Bundled fonts

Variable font files self-hosted with the extension. No external CDN, no Google Fonts runtime imports, no CSP changes.

| File | Family | Axes |
|---|---|---|
| `IBMPlexSans-Variable.ttf` | IBM Plex Sans (sans) | wdth + wght 100–900 |
| `IBMPlexSans-Italic-Variable.ttf` | IBM Plex Sans italic | wdth + wght 100–900 |
| `JetBrainsMono-Variable.ttf` | JetBrains Mono (mono) | wght 100–900 |
| `JetBrainsMono-Italic-Variable.ttf` | JetBrains Mono italic | wght 100–900 |

Declared in `colors_and_type.css` via `@font-face` with `format('truetype-variations')`. The full weight axis (100–900) is exposed, so any `font-weight: <n>` between 100 and 900 works without loading a different file.

**Why variable .ttf and not .woff2:** the user supplied .ttf from Google Fonts. Browsers treat them identically for rendering. The size delta (~250 KB sans, ~140 KB mono) is acceptable for an extension that ships once.

**System fallback** kicks in if the file fails to load — popup still renders cleanly via `-apple-system, BlinkMacSystemFont, 'Segoe UI'`.
