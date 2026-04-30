# SnapCSV Popup — UI Kit

Pixel-perfect React recreation of the SnapCSV Chrome extension popup at its native 360px width. Use these components when prototyping new product surfaces — copy them out and modify rather than rebuilding from scratch.

## What's here

- `index.html` — interactive click-thru of the full popup flow (scanning → list → preview → success / upgrade / license).
- `Popup.jsx` — root state machine + popup chrome (header, footer).
- `TableList.jsx` — list view + empty + scanning states + table list items.
- `PreviewPanel.jsx` — back nav, no-headers notice, preview table, export button.
- `UpgradePanel.jsx` — daily-limit panel with stacked CTAs.
- `LicensePanel.jsx` — license-key input with default / focus+slow / error states.
- `SuccessState.jsx` — auto-dismissing export success card.

All styles inherit from the project root's `colors_and_type.css` and the popup's own `popup.css` (extracted from the source repo). No external dependencies. No icon font. System fonts only.

## Coverage

| Screen | Covered |
|---|---|
| Scanning | ✅ |
| Empty (no tables) | ✅ |
| Table list | ✅ |
| Preview + export | ✅ |
| Success | ✅ |
| Upgrade prompt | ✅ |
| License input | ✅ |
| Footer nudge | ✅ |

State transitions are real — clicking a table opens the preview, exporting shows success, hitting "limit reached" opens the upgrade panel, etc.

## Caveats

- This is a UI recreation, not a working extension. There's no real table-scanning, no real CSV download, no real LemonSqueezy validation — buttons advance the demo state machine.
- The preview table data is mocked from the components in the source repo's `popup.js`.
