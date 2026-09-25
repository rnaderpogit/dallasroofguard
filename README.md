# DallasRoofGuard visual asset build

This folder contains the completed static website with all image placeholders replaced.

## Preview locally

Serve this folder with any static web server and open `index.html`. For example:

```text
python -m http.server 4173
```

Then visit `http://127.0.0.1:4173/index.html`.

## Asset approach

- Generated photography is stored as optimized WebP in `assets/images/`.
- The logo, favicon, and maps are lightweight SVG assets in `assets/`.
- Hero imagery loads eagerly; below-the-fold images use native lazy loading.
- Every content image includes intrinsic dimensions and descriptive alternative text.
- Existing typography, copy, ember palette, page structure, and tweak options are preserved.

See `ASSET-MANIFEST.md` for the full placeholder map and generation prompts.
