# Archive: Intermediate Flow5 Workbench

This branch preserves the intermediate report-oriented Flow5 component workbench that preceded the current 52-page presentation. It is a historical source snapshot and is not deployed by `main`.

## Provenance

The files were copied from the local `patch-construction` snapshot. That snapshot contains the 25 report topics, an early supporting-component set, the source data records, FiveK assets, figure exports and the first evidence-aware validation scripts. The source layout remains runnable in principle, but it should be treated as an intermediate checkpoint rather than the current release.

## Preserved decisions

- A report-first 25-topic narrative was mapped into a reusable Slidev/Vue workbench.
- Transformer, LUT, conditional-flow, sampling and evaluation concepts were converted into interactive mechanism components.
- `ContributionEvidence` used a personal/team tab model while contribution evidence was still being assembled.
- `ModelEvidenceGallery` reserved checkpoint-linked candidate and direction/magnitude slots and explicitly showed missing output records.
- The evidence index and validation scripts established provenance and leakage boundaries before the final visual expansion.

## Why this checkpoint was superseded

The intermediate gallery was honest about unavailable model exports, but it rendered missing-output states and empty visual slots. The final requirements called for populated image regions and a balanced nine-member contribution view. The active branch therefore replaced those slots with verified real-image diagnostics and replaced the tabbed contribution view with the nine-card evidence map.

## Evidence boundary

This branch documents the design path and the data contract. It does not contain verified final Flow5 candidate exports or new model measurements. Missing model outputs remain missing; expert targets are not relabelled as predictions.

For the deployed presentation and current browser checks, use `main`.
