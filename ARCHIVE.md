# Archive: Legacy Preference-Enhancement Workbench

This branch preserves the earlier browser and presentation workbench that preceded the final Flow5 evidence deck. It is a historical source snapshot and is not deployed by `main`.

## Provenance

The files were copied from the local `rollback-copy` snapshot used during the project rebuild. The snapshot contains the first-generation presentation shell, its interaction components, FiveK reference assets, evidence records, playback scripts and evidence-companion PDFs. The original source layout is retained so the experiments can be checked out and inspected without reconstructing them from the final branch.

## Preserved experiments

- Explicit preference and region-edit controls using DiffMap-style inputs, masks and constrained RGB/contrast adjustments.
- Reference-image adaptation and residual-CNN replay for a practical web demonstration.
- Dynamic history grouping, partial-edit composition and reference retrieval experiments.
- Latent preference-memory and preference-sphere visualisations used to reason about direction, magnitude and multimodality.
- Attention, rendering, reconstruction and candidate-clustering workbench components.

## Why these paths were superseded

The early approaches were useful for understanding the task but did not satisfy the final research objective together. Explicit controls required user guidance; grouping and retrieval behaved like edit transfer rather than user-specific preference inference; memory-slot aggregation risked averaged or fixed styles; and the sphere viewer used illustrative or synthetic data where verified Flow5 exports were unavailable. These limitations motivated the later shift to conditional density modelling with a Transformer and conditional normalizing flow.

## Evidence boundary

This branch preserves implementation history and supporting assets. It does not establish final Flow5 metrics, trained checkpoints or current deployment behaviour. Illustrative masks, synthetic sphere data and prototype replay outputs remain labelled as exploratory material in the preserved source.

For the deployed 52-page presentation and current QA, use `main`.
