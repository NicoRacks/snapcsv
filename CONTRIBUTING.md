# Consuming the SnapCSV Design System

This folder is the source of truth for SnapCSV's visual language. Drop it into the extension repo at `design-system/` and consume it from anywhere in the codebase.

## Quick start

### From a CSS file
```css
@import url('../design-system/colors_and_type.css');

.my-component {
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-sans);
}
```

That single import gives you:
- All color tokens (`--color-bg`, `--color-accent`, `--color-upgrade`, …)
- Type stack (`--font-sans` = IBM Plex Sans, `--font-mono` = JetBrains Mono — bundled at `assets/fonts/`, no CDN)
- Spacing scale (`--space-1` through `--space-6`)
- Radii (`--radius-0` through `--radius-3`)
- Semantic role classes (`.t-body`, `.t-mono`, `.t-pro`, …)

### From an HTML prototype
```html
<link rel="stylesheet" href="../design-system/colors_and_type.css">
```

### Reusing components
Don't rebuild the popup chrome — copy the React components from `ui_kits/popup/` into your prototype. They're already wired to the tokens.

## Updating the system

1. Edit tokens in `colors_and_type.css` — every consumer picks up changes automatically.
2. Edit `Design System.html` to keep the rendered reference in sync.
3. Edit `README.md` voice/visual rules if the change is more than a token bump.
4. The preview cards in `preview/` are pinned specimens — only touch when adding a new token category.

## Don'ts

- Don't hardcode hex outside `:root` in `colors_and_type.css`.
- Don't add a new font family. The two we ship are deliberate.
- Don't reference fonts from a CDN. Self-hosted .ttf files are bundled in `assets/fonts/`.
- Don't introduce purple, amber, or orange. The palette is fixed.
