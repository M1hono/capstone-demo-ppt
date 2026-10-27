# Reference-diagram coverage

Source: the supplied reference PowerPoint (SHA-256 `6f07c8c4ab7ca30290298873dc18c643315caeb67e4daa088c9fdf38f249f7f5`).
Checked against the embedded figures, not only PowerPoint text extraction.
Report sections 2.3–2.5 confirm the training objectives and mean-log-density cluster ranking.

| Page | Reference information | Current representation |
| --- | --- | --- |
| 9 | Original, target, pixel difference; 9 channels | Three labelled input images and channel count |
| 9 | Convolution/downsampling, flatten/FC, 3D z | Encoder diagram with explicit projection |
| 9 | Decoder FC, 8 coefficients, 8 learnable LUT bases, weighted sum, application to original | Decoder and reconstruction columns |
| 9 | Reconstruction loss against T; backpropagation updates encoder, decoder and LUTs | Persistent training-loop strip |
| 11 | Query and historical originals share an image encoder | Explicit shared-encoder path |
| 11 | Historical original/target pairs supply Stage 1 edit vectors | Separate edit-encoder path |
| 11 | FC projections, shared embedding dimension | Both paths project to D-dimensional tokens |
| 11 | Interleaved pairs followed by query; two Transformer layers; updated query becomes c | All 17 tokens, two layers and query readout |
| 12 | Condition c from image and history; ground-truth z; u=f(z;c); z and u are 3D | Training lane and shared-condition header |
| 12 | Gaussian log density; Jacobian term; negative log-likelihood; parameter update | Explicit formulas and backpropagation line |
| 12 | Monte Carlo Gaussian samples, inverse conditional Flow, generated z | Persistent inference nodes |
| 12 | K-means in z space, average log-density ranking, representative per cluster, Top-K rendering | Persistent clustering/ranking/decoder nodes |
| 16 | Retouching continuity, direction and magnitude | Direction figure on 16; both complete figures together on 10 |
| 17 | Same query under five expert histories; target, Top-1, Best-3, Best-5; samples and density | Five-row matrix with every expert and all six visual columns |
| 17 | Aggregate PSNR table and held-out Expert E; mean Top-1 SSIM | Numeric table and two callouts |
| 18 | Cross-method PSNR, SSIM, reference counts; PPSD context | Chart, table and protocol caveat |
| 18 | Six selected PPSD inputs, targets and three candidates with per-example PSNR | All six sets retained in a compact image matrix |
| 19 | Original image, average z, wrong image, wrong history, complete model | All five ablation conditions |
| 20 | Conditioning-to-candidate schematic; sample directions and direction-only density | Supplied schematic and PPSD distribution panels, with a readable legend |
| 21 | Inference latency, peak CUDA allocation and benchmark device/scope | Three metrics with scope caption |
| 22–23 | Architecture evolution and project workflow | All stages visible together; no animation |

The result montages are supplied examples, not new model runs. Selected training-image diagnostics are explicitly separated from aggregate test scores. Best-of-K is offline target-based evaluation, whereas model candidate ordering uses density. Per-image direction-density normalization is stated; density radius is not retouching magnitude.

The source montage's repetitive diagnostic metadata is retained in the original media under `public/evidence/reference-figures/`, rather than copied into tiny slide labels. Crops and hashes are recorded in `public/assets/reference-deck/results/provenance.json`. No photographs were synthesized or retouched.

All pages are static except page 12's automatic emphasis. That emphasis changes borders/backgrounds only; text, formulas and diagrams stay present. No playback controls or progress indicators appear. Print/export mode disables all emphasis and shows complete content.
