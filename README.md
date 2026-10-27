# Personalized Image Retouching — Final Demo

The formal presentation has **25 slides**, including the cover and Q&A.
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

Mechanism explanations autoplay once on entry (2.2 seconds per step), then stop. Pause, replay and manual navigation remain available. Reduced-motion and print exports show complete content. Slide 24 contains limitations only.
