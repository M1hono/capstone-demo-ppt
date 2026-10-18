# Final presentation components

English Slidev/Vue workbench for the final report. Pages 1–25 preserve the supplied outline order; pages 26–52 provide reusable mechanism and evidence components. Each page presents a title, one visual and its source scope. Component names and usage descriptions stay in the source metadata; implementation tags and eyebrow subtitles are not displayed on slides.

```sh
npm ci
npm run dev
npm run build
npm run preview -- --port 4173
SHOW_BASE=http://127.0.0.1:4173 npm run test:slides
npm run test:data
npm run figures
```

The development preview uses port 18341. The report figures require Python 3, matplotlib and numpy; their tested versions are recorded in the verification output. Build and browser checks do not require Python. Generated SVG/PNG/PDF figures are supplied in `public/figures`.

Use the top-left Slidev navigation or arrow keys to change slides. Component controls support previous/next/play/show-all, metric switches and evidence selection. Playback stops when a slide is left. Reduced-motion users retain manual steps and rotation controls without automatic playback.

`data/report-evidence.json` is the source of all numerical charts. `data/component-index.json` maps the 25 topics and 27 supporting pages. `public/evidence/index.html` lists source links, hashes, available diagnostics, gaps and discrepancies. `docs/ACHIEVEMENTS.md` analyses XingTang Chen's supported personal contribution.

The original workbench is retained in the external baseline archive. Obsolete DiffMap, partial-edit, memory-slot, residual-CNN and grouping components are removed from this active copy. Earlier model predictions and synthetic sphere files are not presented as final flow5 evidence.

## Evidence import

`data/model-artifacts.json` records model-output availability. Leave absent outputs null/empty; never substitute expert targets or edited mockups. To add model outputs, set `status` to `exported` and add `run` with `checkpointSha256`, `configSha256`, `sourceCommit`, and `queryId` matching `query.id`. Use real SHA-256 hashes (64 hexadecimal characters).

- `reconstruction`: `{ "image": "assets/model/reconstruction.png" }`.
- `candidates`: ordered records `{ "rank": 1, "image": "assets/model/candidate-1.png", "z": [0.1,0.2,0.3], "logp": -1.2 }`. Values must come from an actual export.
- `directionGrid`: records `{ "direction": "candidate-1", "scale": 0.5, "image": "assets/model/direction-1-scale-05.png" }`.
- `distribution`: `{ "samples": [[x,y,z], ...] }` using full vectors, not pre-normalised directions. The viewer normalises direction separately and labels archived data as exported only when records exist.

Paths are relative to `public/` and must resolve locally. Run `npm run test:data` before building; it validates evidence paths, finite numbers and run identity. `npm run build` synchronises downloadable JSON with the live data source. Model outputs remain data records until verified exports can be added to a dedicated populated view. The 3D viewer uses explicitly labelled deterministic illustrative samples until a real distribution is supplied.

The shared source is an evidence source only. No model training or inference was run for this presentation. Report/source differences are retained, including two versus four Transformer layers, candidate ranking, final splits and PPSD SSIM.

## Quality revision

The architecture, encoder, LUT, Transformer, flow and selection components now show data transformations with manual steps. The real-image comparison supports a keyboard-operable reveal slider. The result plot uses within-expert ranges rather than connecting categorical expert identities. Contribution evidence includes four pinned source excerpts, complete local files and hashes. All numerical report data and the 25-topic outline remain in their original structured records.

Typography is served locally using IBM Plex Sans under its included OFL licence. No network font request is needed. The first rebuild is archived outside this source tree in `../revisions/first-rebuild/`.

## Visual evidence expansion

52 pages now include sixteen additional interactive visual components: a five-expert gallery, twenty-pair explorer, channel histograms, tone correspondence, colour shifts, spatial differences, crop loupe, pairwise difference matrix, history sampling, pairing ablation, protocol routing, probability landscape, invertible transport, Monte Carlo convergence, LUT interpolation and the performance map.

`VisualEvidenceGallery` replaces the empty model-output gallery with six real figure assets. `ReconstructionEvidence` combines available reference photographs with the recorded noise diagnostic. Every image region is populated. Absent model outputs remain documented in the evidence index, not shown as blank frames.

Regenerate the pixel diagnostics with `python3 scripts/derive-image-evidence.py` (Pillow and NumPy). These measurements use the original 500 × 332 display grid, with reference images resized by Lanczos. The JSON records source hashes, 64-bin histograms, 32 × 32 tone grids, channel shifts, pixel differences and generated-image hashes. These are reference comparisons, not new model-evaluation results.

The 3D distribution includes a populated SVG projection when WebGL is unavailable. All interactive controls work without network assets.
