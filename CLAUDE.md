# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

DallasRoofGuard: a static, hand-written HTML/CSS/JS roofing-company website (a roofing template build, not the usual Next.js stack). No package.json, no bundler, no tests, no lint. Everything ships as-is from this folder.

## Commands

Preview locally (any static server works):

```text
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/index.html`. Open the site through a server rather than `file://` so the Google Fonts and unpkg CDN scripts on the homepage load normally.

There is no build, test, or lint step. "Verification" for this repo means loading each page in a browser and checking the console.

## Git

This folder is **not its own git repository**. The nearest repo root is `C:\` (branch `master`, no commits). Before any branch or commit work, run `git init` inside this folder first so history stays scoped to the project.

## Architecture

### Pages are duplicated, not templated

Five pages, all standalone HTML with the header, nav, mobile drawer, CTA band, and footer copied verbatim into each:

- `index.html`, `services.html`, `contact.html` (root)
- `services/roof-repair.html`, `services/roof-replacement.html` (subfolder; every asset and link uses `../` paths)

A sitewide change (nav item, phone number, footer link) must be applied to all five files, and the `../` prefix must be preserved in the two subpages. Grep across `*.html` before assuming a string lives in one place.

### Theming is attribute-driven

`assets/site.css` is the design system. All look-and-feel variants are selected by attributes on `<html>`, and the CSS tokens cascade from them:

| Attribute   | Values                          |
|-------------|---------------------------------|
| `data-theme`| `ember` (default), `indigo`, `ironclad`, `pine` |
| `data-font` | `grotesk`, `geometric`, `mono-mix` |
| `data-hero` | `split`, `overlay`, `centered` (homepage hero layout) |
| `data-cta`  | `sharp`, `rounded`, `pill` (button radius) |

Each page hardcodes defaults on its `<html>` tag and has an inline `theme-init` script in `<head>` that reads `localStorage` keys `drg-theme`, `drg-font`, `drg-hero`, `drg-cta` before first paint, so a choice made on the homepage carries to every other page.

To add a theme or font: add the `[data-*]` block in `site.css`, add the option in `assets/home-tweaks.jsx`, and consider whether the `<html>` defaults on all five pages should change.

### Tweaks panel (homepage only)

`index.html` is the only page that loads React 18 and Babel standalone from unpkg (with SRI hashes) plus two JSX files compiled in-browser:

- `assets/tweaks-panel.jsx` is a generic, reusable floating-panel shell and control kit (`useTweaks`, `TweaksPanel`, `TweakRadio`, `TweakSelect`, etc.). It speaks a `postMessage` protocol to a host page (`__activate_edit_mode`, `__edit_mode_set_keys`, ...) and stays hidden unless a host activates it. Treat it as vendored; do not customize it for this site.
- `assets/home-tweaks.jsx` is the site-specific app. `TWEAK_DEFAULTS` sits inside an `/*EDITMODE-BEGIN*/ ... /*EDITMODE-END*/` block that the host tooling rewrites on disk. It also owns the three alternate hero headline/subhead copy sets (`COPY_SETS`) and writes the `<html>` attributes plus `localStorage`.

The other four pages do not load React at all. Keep it that way unless a page genuinely needs the panel.

### Shared behavior

`assets/site.js` is dependency-free and handles the sticky header shadow, mobile drawer, FAQ accordion, scroll-reveal (`.reveal` gets `.in`), and the contact form. The form is a **demo with no backend**: submit is intercepted, fields are disabled, and a note is shown. Wiring real submissions (Resend, CRM) is not done and would need server-side validation and rate limiting per the global security rules.

### Assets

Photography is WebP in `assets/images/`; logo, favicon, and maps are SVG in `assets/`. `ASSET-MANIFEST.md` maps every asset to the pages that use it and records the generation prompt and visual direction. Update it when adding or replacing an image. Hero images use `fetchpriority="high"`; everything below the fold uses `loading="lazy"`, and every `<img>` carries intrinsic `width`/`height` plus descriptive alt text.

### Placeholder business data

The phone number `(214) 555-0188`, license `TX-RC-0142887`, review count, and address are placeholders repeated across all pages. When reskinning for a real client, replace them everywhere, not just on the homepage.
