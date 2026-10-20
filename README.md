# Final presentation components

English Slidev/Vue workbench for the final report. Pages 1–25 preserve the supplied outline order; pages 26–36 provide reusable mechanism and evidence components. Each page displays one main component, its usage and source scope.

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

`data/report-evidence.json` is the source of all numerical charts. `data/component-index.json` maps the 25 topics and 11 supporting components. `public/evidence/index.html` lists source links, hashes, available diagnostics, gaps and discrepancies. `docs/ACHIEVEMENTS.md` analyses XingTang Chen's supported personal contribution.

The original workbench is retained in the external baseline archive. Obsolete DiffMap, partial-edit, memory-slot, residual-CNN and grouping components are removed from this active copy. Earlier model predictions and synthetic sphere files are not presented as final flow5 evidence.

## Evidence import

`data/model-artifacts.json` reserves output slots. Leave absent outputs null/empty; never substitute expert targets or edited mockups. To add model outputs, set `status` to `exported` and add `run` with `checkpointSha256`, `configSha256`, `sourceCommit`, and `queryId` matching `query.id`. Use real SHA-256 hashes (64 hexadecimal characters).

- `reconstruction`: `{ "image": "assets/model/reconstruction.png" }`.
- `candidates`: ordered records `{ "rank": 1, "image": "assets/model/candidate-1.png", "z": [0.1,0.2,0.3], "logp": -1.2 }`. Values must come from an actual export.
- `directionGrid`: records `{ "direction": "candidate-1", "scale": 0.5, "image": "assets/model/direction-1-scale-05.png" }`.
- `distribution`: `{ "samples": [[x,y,z], ...] }` using full vectors, not pre-normalised directions. The viewer normalises direction separately and labels archived data as exported only when records exist.

Paths are relative to `public/` and must resolve locally. Run `npm run test:data` before building; it validates evidence paths, finite numbers and run identity. `npm run build` synchronises downloadable JSON with the live data source. Actual output slots automatically render when populated. The 3D viewer uses explicitly labelled deterministic illustrative samples until a real distribution is supplied.

The shared source is an evidence source only. No model training or inference was run for this presentation. Report/source differences are retained, including two versus four Transformer layers, candidate ranking, final splits and PPSD SSIM.
