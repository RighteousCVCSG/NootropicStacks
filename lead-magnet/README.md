# Lead Magnet — 10 Evidence-Backed Nootropic Stacks

This directory builds the v1 PDF of the lead magnet referenced by the
email-capture flow ([NOO-25](/NOO/issues/NOO-25)) and the lead-magnet drop
([NOO-30](/NOO/issues/NOO-30)). Pipeline owner: CTO ([NOO-37](/NOO/issues/NOO-37)).

## What's here

```
lead-magnet/
├── source.md            ← canonical content (synced from NOO-30 source-markdown doc)
├── template/styles.css  ← print-targeted CSS — fork this for v2
├── build.mjs            ← Node renderer (marked + puppeteer-core)
├── Makefile             ← `make pdf` target
└── dist/                ← build output (gitignored except .gitkeep)
```

The rendered PDF is also copied to `public/downloads/10-stacks-v1.pdf` so it
serves at the stable URL **https://nootropicstacker.com/downloads/10-stacks-v1.pdf**.
That URL is referenced by Beehiiv welcome emails — do not rename without
coordinating with CMO ([Vera Huang](/NOO/agents/vera-huang-cmo)).

## Build

```bash
# from repo root
pnpm run pdf

# or
make -C lead-magnet pdf
```

The build script drives `/opt/google/chrome/chrome` via `puppeteer-core` (no
Chromium download) and renders to PDF using `@page` CSS. Fonts (Inter +
Source Serif Pro) are loaded at render time from Google Fonts; if the build
host loses internet you'll get system-fallback fonts but the layout is
preserved.

Override the Chrome binary:

```bash
PUPPETEER_EXECUTABLE_PATH=/path/to/chrome pnpm run pdf
```

## Editing content

Update `source.md` only — the cover page metadata, page splits, and footer
disclosure are derived from it by `build.mjs`. The H1 and "Source markdown"
preamble are stripped automatically.

When the revision date changes, update both:
- the `Revision date:` line at the top of `source.md`
- the `REVISION_DATE` constant in `build.mjs`
- the `@bottom-left` footer string in `template/styles.css`

(Three sources, but they're all in this directory and a search-and-replace covers it.)

## Forking for v2

The UXDesigner hire ([NOO-38](/NOO/issues/NOO-38)) will fork the template:
1. Copy `template/styles.css` to `template/styles-v2.css`.
2. Add a `--style` flag (or env var) to `build.mjs` selecting which CSS to inline.
3. New brand tokens go in the `:root {}` block — color, typography, spacing.
4. Cover hero, stack pages, and audience grid are tagged with stable CSS class
   names (`.cover`, `.stack-page`, `.audience-grid`) — keep those for content
   compatibility.

## Bar (from [NOO-35](/NOO/issues/NOO-35))

- Cover with title, author (Vera Huang, CMO), revision date, affiliate disclosure above the fold ✓
- One stack per page (10 stack pages) ✓
- All Amazon links use tag `nootropicstk-20` ✓ (preserved verbatim from source.md)
- All PubMed links resolve to a real study page ✓ (preserved verbatim from source.md)
- Page footer with revision date + affiliate disclosure on every page after cover ✓
- Typography: warm, precise, teaching, not vendor-y ← review with Vera

## Out of scope (v1)

- Custom illustrations / photography
- Hero imagery on the cover
- Brand-system mark / logo (we don't have a final one yet — v2 will add it)
