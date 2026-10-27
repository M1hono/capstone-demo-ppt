# Personalized Image Retouching — Final Demo

The formal presentation has **25 slides**, from the cover to the final limitations and conclusion.
Slide 2 reconstructs the supplied three-user preference illustration and historical examples. The illustration is not model-output evidence.

## Run

```sh
npm install
npm run dev -- --port 18355
npm run build
npm run qa
```

Use `SHOW_BASE=http://127.0.0.1:18355 npm run qa` when using that port.
The English slide source is `slides.md`; the report-aligned content index is `data/component-index.json`.

## Deliverables

- `exports/Personalized-Image-Retouching-Final-25.pdf`
- `exports/output.pptx`

The project lives under `notes/2026/S2C/SOFT3888/assignments/final-demo/presentation`. Historical workspaces and the complete 52-slide baseline remain in the parent directory. They are not part of the formal presentation.

## Visual direction

Modern Editorial: neutral paper, ink, restrained yellow and fine rules.
Hero: recorded photographs and the user-supplied preference illustration.
Page types: showcase cover, reading and explanation slides.

Saira is bundled with its SIL Open Font License. Theme tokens are in `styles/modern.css`.
Report values, protocol caveats, original source provenance and the formal group tag SOFT3888_TH18_04 are retained.

All slides are static except slide 12, whose browser diagram automatically emphasizes four stages at 2.4-second intervals while keeping all content visible. No playback buttons, progress indicators, tabs, selectors or sliders are shown; slide advancement is manual. Reduced-motion and PDF exports show complete static content. The PPTX has brief diagram entrances on slide 12 only; its animation structure is validated, but desktop PowerPoint playback has not been tested. Titles and order follow the supplied 25-slide reference. Slide 24 is contributions; slide 25 combines reflection, limitations and conclusion. No next steps. Presenter 4 is Yuchen Deng (slides 10–12); other presenter assignments remain blank.

Speaker notes: `docs/speaker-notes.md`. Reference image crops retain pixel provenance in `public/assets/reference-deck/provenance.json`.

Reference figures use transparent canvas copies; original crops and protected photograph pixels are retained.

The browser checks follow the current 25-page index and verify static layouts, reference figures, complete print content and slide 12's automatic emphasis. The reference-diagram coverage is recorded in `docs/reference-coverage.md`.
