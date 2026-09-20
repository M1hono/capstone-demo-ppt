---
theme: default
title: Reference-Guided Retouching
info: SOFT3888 client deployment review, September 2026
author: SOFT3888 project team
aspectRatio: 16/9
canvasWidth: 1280
colorSchema: light
routerMode: hash
fonts:
  sans: Arial
  mono: Menlo
  provider: none
transition: fade
wakeLock: false
drawings:
  enabled: false
exportFilename: Reference-Guided-Retouching-v11
---

<section class="show-slide cover-slide">
  <div class="cover-copy"><h1>Reference<br>Guided<br>Retouching</h1><p>Learn from original–edited pairs.<br>Select references. Transfer edits.</p><div class="identity"><b>Client deployment review</b><span>SOFT3888 · September 2026</span><span>Client: Marvin Tao · Tutor: Chuanzhi Xu</span></div></div>
  <div class="cover-object"><Scene :act="0"/><p class="object-caption"><b>Current editor · reference research · recorded results</b></p></div>
  <div class="cover-names">Yuchen Deng · Gary Xu · Sihan Fang · Yiming Chen · Yiheng Guo<br>Lunyan Wang · Weishao Su · XingTang Chen · Zihao Zhang</div>
  <DeckFooter :page="1" :active="0" scope="Client review"/>
</section>

<!--
Open with the engineering object. The deployed editor takes explicit controls; the research cartridge learns which reference edit information is relevant. This presentation uses the full-edit research baseline at 767cae8; partial-edit conditioning is reserved for the next-step slide. These are related implementations, not a claim that cross-attention is already connected to the current web demo. The cover presents reference-guided retouching as the current research task. The 3D anatomy depicts the existing control editor; it does not imply that a personal history agent is integrated. Pages 3–5 demonstrate that editor, pages 6–9 explain the research baseline, pages 8 and 10 inspect records of unarchived run versions, and page 13 contains the new proposal. The 13-slide core is followed by a separate evidence companion.
-->

---

<section class="show-slide">
  <h2>The same photo has five editing targets.</h2><p class="subtitle">FiveK supplies paired examples of how the same image can be edited.</p>
  <ExpertStudy/>
  <p class="slide-note">MIT–Adobe FiveK · Bychkovsky et al., CVPR 2011</p>
  <DeckFooter :page="2" :active="0" scope="FiveK · original + experts"/>
</section>

<!--
All six photos are fetched from the official MIT–Adobe FiveK dataset. This is the very same flower scene in the supplied experiment panel, identified against the official gallery as a0412-_DGW6297. Click experts A–E to compare edit differences. These are real expert renditions, not generated colour variants or outputs of a newly trained model. Project preprocessing is preserved: DNG camera WB, 8-bit RGB, max side 500, calculation at 256 square, PIL TIFF conversion without additional ICC transformation. The official TIFFs use ProPhoto RGB; standardising colour management remains a reproduction consideration. Five experts provide paired targets, not evidence of five internally homogeneous or persistent real-world user profiles.
-->

---

<section class="show-slide">
  <h2>The current editor follows explicit controls.</h2><p class="subtitle">Text, a reference image or region sliders produce a four-channel DiffMap.</p>
  <div class="input-routes"><div><b>Text request</b><span>Regions + language labels<br>→ numeric edits</span></div><div><b>Reference image <em>Experimental</em></b><span>RGB + contrast statistics<br>→ bounded edits</span></div><div><b>Region fine tune</b><span>Region mask + RGBC sliders<br>→ feathered edits</span></div></div>
  <Scene :act="2" class="wide-engine"/>
  <div class="contract-line"><b>RGB input</b><span>+</span><b>P = [ΔR, ΔG, ΔB, ΔContrast]</b><span>→</span><b>7-channel residual CNN</b><span>→</span><b>Output</b></div>
  <DeckFooter :page="3" :active="1" scope="Current demo · explicit controls"/>
</section>

<!--
Text uses semantic segmentation plus constrained label generation and deterministic label-to-number mapping. The shipped reference adapter uses trimmed RGB medians and a luminance P90–P10 contrast span, clipped to ±0.3 before strength. It is not the learned reference encoder. Region controls feather masks with a two-pixel Gaussian blur, combine global and local settings, then clip to ±0.3. The four RGBC conditioning channels are distinct from the three post-hoc brightness/saturation/warmth diagnostic maps shown later. Text planning uses Mask2Former segmentation and Qwen label generation before deterministic numeric mapping.
-->

---

<section class="show-slide">
  <h2>Inspect the current editor’s output.</h2><p class="subtitle">Saved checkpoint runs show what four explicit control settings change.</p>
  <Workbench initial="warm"/>
  <DeckFooter :page="4" :active="1" scope="Current demo · checkpoint replay"/>
</section>

<!--
This workbench replays newly executed CPU inference using the exact repository PreferenceControlledCNN and checkpoint. All tensor shapes and output statistics are from the run. Warm, cool, and zero controls were executed separately, as was the exact reference adapter with strength 0.7. Switching controls is replay, not live inference. Expert D is the same-scene reference used as an oracle illustration of the adapter; this cannot establish transfer to unrelated photos. Do not call timings end-to-end deployment latency, since segmentation and Qwen were not involved.
-->

---

<section class="show-slide">
  <h2>The editor exposes each requested adjustment.</h2><p class="subtitle">This is the current demo; learned reference retrieval is a separate research model.</p>
  <div class="app-evidence"><img src="/assets/web-demo.jpg" alt="Supplied web demo screenshot, person region selected, red plus 0.08 and blue minus 0.08"/><aside><h3>Person region</h3><dl class="spec-list"><dt>Red / Blue</dt><dd>+0.08 / −0.08</dd><dt>Green / Contrast</dt><dd>0.00 / 0.00</dd></dl><p>Adjust → render → compare</p></aside></div>
  <div class="acceptance-row"><span><b>US01–04</b> Upload & controls</span><span><b>US05 · 08</b> Region edits</span><span><b>US06–07</b> Compare & download</span><span><b>US09–10</b> Quality: open</span></div>
  <DeckFooter :page="5" :active="1" scope="Current demo · interface capture"/>
</section>

<!--
This is an actual supplied demo screenshot, not the separate Retouch Lab UX mock. The live operator should demonstrate image upload, a text preference, a reference trial, selecting an actual mask and fine-tuning, comparison and download. The screenshot proves a captured interface state; it is not a passing record for every user story. US09 structure preservation must be judged on output evidence, and US10 broader quality evaluation remains open. Live demo takes place on the team's machine, outside this deck. Reruns reuse the source image and cached masks, so slider adjustments do not require repeated segmentation.
-->

---

<section class="show-slide">
  <h2>Group editing examples to simulate users.</h2><p class="subtitle">The same network forms groups and learns how to edit within them.</p>
  <LearningMechanism/>
  <DeckFooter :page="6" :active="2" scope="Old approach · dynamic user groups"/>
</section>

<!--
Presentation baseline: cross-attention revision 767cae8, 19 September. The team leader confirms the old task setting: the same network forms editing groups, each group simulates one user, and cross-attention learns regional changes from references in that group. In this implementation the groups are refreshed per-query nearest-reference neighbourhoods; do not invent fixed global user IDs or separate networks per user. The query descriptor uses the full expert target. The separate partial-query evaluation script in this same commit is exploratory and is not the training flow illustrated here. Grouping uses model.b([I,E,E−I]) and global average pooling; distances are Euclidean, and candidates sharing the original scene are excluded. It recomputes candidate embeddings with current weights each chunk. This is supervised training with refreshed discrete retrieval, not reinforcement learning. Baseline config: train originals 1–400, validation 401–500; the downloader prepares up to 800, with remaining originals available for test. For testing, candidate references come from the training set; validation currently retrieves within validation. The supplied figure's actual run configuration and weights are not archived, so do not assign these defaults retrospectively to its metrics.

The animation illustrates the source retrieval rule using the flower example’s recorded reference set. The query target and reference images are from that same recorded panel. The excluded same-scene rendition is an actual FiveK Expert D asset. Exact candidate-pool contents, descriptor distances and the original retrieval execution were not archived; the animation does not recreate that execution or claim those three references were freshly retrieved.
-->

---

<section class="show-slide">
  <h2>Learn regional edits within a group.</h2><p class="subtitle">Cross-attention finds how the group’s reference edits can guide each input region.</p>
  <DecisionMechanism/>
  <DeckFooter :page="7" :active="3" scope="Old approach · regional cross-attention"/>
</section>

<!--
The supplied dyNAmic Transfer Touch architecture diagram is the conceptual reference for retrieval, scoring, transfer, fusion and learning. It depicts an earlier version with two independent attention branches and temperature-based global reference weights. The presentation baseline at 767cae8 uses one cross-attention result per reference for two operations: absolute scaled QK logits give each query position a score (maximum over reference positions after averaging heads), and per-head spatial softmax supplies editing context. An argmax across references selects one context per query position. This is a hard reference decision and soft correspondence within the selected reference; the displayed matrix and score symbols are an explanatory diagram, not measured attention or reconstructed tensors. No numeric embeddings, attention weights or selection masks are fabricated. The displayed flower and Colosseum images are unchanged crops from the recorded example. Click either decision node to hold that stage. The implementation computes all reference contexts before the hard gate; the presentation explains the dependencies in sequence. Hard selection has no gradient, while the encoder and spatial transfer still receive the output-loss gradient.
-->

---

<section class="show-slide">
  <h2>Find useful edits across different scenes.</h2><p class="subtitle">Recorded correspondences; the experiment version is unarchived.</p>
  <AttentionWorkbench sample="dog" :initial="2"/>
  <DeckFooter :page="8" :active="3" scope="Recorded diagnostic · version unconfirmed"/>
</section>

<!--
The experiment version for this supplied diagnostic is unarchived. It cannot be labelled a verified run of the 767cae8 baseline or the newer partial-edit model. It is used here to inspect recorded correspondences. The dog scene is FiveK 0407. Two references show the same leaves (0476) with different expert edits; shares are 0% and 34.38%. The lily (0417) receives 65.62%. These observations motivate soft retouching-role correspondence: useful edits need not come from identical object categories. They do not prove that the model understands roles or outperforms semantic matching. That needs a controlled comparison. The 767cae8 baseline computes absolute scaled QK logits, chooses each region's reference using max over reference positions of head-mean logits, and uses per-head softmax over positions within that chosen reference. Hard reference selection and soft correspondence coexist.

The flower record is now available through the Flowers tab on the following evidence slide. Query 0412 matches the flower scene; references 0406, 0426 and 0490 were visually matched to official FiveK thumbnails. The reported shares are 51.17%, 48.83%, and 0%. These are the mean one-hot reference selections across query positions, not global mixture weights, attention probabilities, semantic coverage, or confidence scores. The red overlays are connected groups of strong attention links. They are not the hard selection masks. The original diagnostic uses matching colours and IDs; cropping retains the unmodified overlay. The raw tensor and original checkpoint are unavailable, so the browser does not invent spatial attention values.

The reference expert panel wipes between the actual recorded reference original and expert edit. Both retain the original diagnostic overlays; no covered pixels were reconstructed. The image wipe explains that reference pairs provide editing evidence. It does not depict new inference.
-->

---

<section class="show-slide">
  <h2>Train grouping and enhancement together.</h2><p class="subtitle">The editing loss updates the network that also forms the groups.</p>
  <RenderMechanism/>
  <DeckFooter :page="9" :active="3" scope="Research · whole-image training"/>
</section>

<!--
The 767cae8 baseline uses 32×32 Q/K scoring with a 256×256 input, while encoders produce 64×64 feature grids. Each head's attention is bilinearly lifted and renormalised over the reference value grid, then context is restored to the query grid. Baseline edit_dim is 64, attention_dim 128. The renderer concatenates RGB plus 64 editing features; it is not the Gen 1 seven-channel CNN. Baseline default lambda_ssim is zero, so the displayed loss is RGB L1 plus the 0.001 residual regulariser. Heatmaps are directly cropped from the supplied experiment panel, retaining the reported colour limits. They show output-minus-original diagnostics, not the four-channel DiffMap. The recorded panel has no archived checkpoint or run configuration; it cannot be assigned to the newer partial-edit experiment. No reconstructed attention, metrics or raw prediction values are implied. The residual structure does not guarantee unchanged structure or perfectly local edits; these acceptance tests are on slide 12.
-->

---

<section class="show-slide">
  <h2>What the recorded outputs show.</h2><p class="subtitle">Compare saved experimental outputs with their expert targets.</p>
  <ResultsGallery/>
  <div class="metric-context"><div><b>Recorded result scope</b><p>Per-image target similarity.<br>Run versions are not archived.</p></div><div><b>Earlier milestone</b><p><strong>26.6 dB · 0.88 SSIM</strong><br>Separate evaluation subset.</p></div><div><b>Reading the evidence</b><p>Compare the saved outputs.<br>Keep each score in context.</p></div></div>
  <DeckFooter :page="10" :active="4" scope="Recorded samples · version unconfirmed"/>
</section>

<!--
Flowers: 26.496 dB / 0.7949. Dog: 32.761 / 0.9531. Books: 27.242 / 0.8946. Values are transcribed from the team's unmodified example panels, not recalculated from JPEGs. The supplied panels do not establish sample count, model checkpoint or aggregate evaluation protocol. Their scores are not evidence for the new partial-edit training setup or for long-term user preference learning. The earlier report's 26.6 / 0.88 is separate from the Gen 3 comparison chart's 26.70; never average or conflate these records. No claims about dataset-wide performance or new controlled experiments are made.
-->

---

<section class="show-slide">
  <h2>Which parts improved the reported score?</h2><p class="subtitle">Chart archived 17 September · team-reported ablations.</p>
  <MetricChart/>
  <div class="ablation-reading"><p><b>Group</b><span>Group similar editing examples.</span></p><p><b>Select</b><span>Choose a reference per region.</span></p><p><b>Transfer</b><span>Align useful editing features.</span></p></div>
  <DeckFooter :page="11" :active="4" scope="Earlier experiment · reported ablations"/>
</section>

<!--
Transcribed from the research branch comparison figure: full 26.70; random grouping 21.90; equal weights 25.40; 12-channel CNN fusion 24.50. The full chart also lists PerTouch 26.20, InstantRetouch 23.34 and DiffRetouch 25.20. Those external comparisons remain in the attachment because matched training splits and evaluation protocols are not documented. These within-project ablations motivate causal tests, but the figure alone lacks random-seed uncertainty and run configuration; avoid claiming statistical significance. The 767cae8 baseline toggles implement the named interventions. The displayed comparison image is byte-identical to the figure committed at 26a883d on 17 September, before the partial-edit experiment. Do not imply that all displayed values belong to the current revision.
-->

---

<section class="show-slide">
  <h2>Inspect the old inputs and a saved output.</h2><p class="subtitle">Follow the grouping input, then inspect the earlier editor’s zero-control output.</p>
  <BoundaryWorkbench/>
  <DeckFooter :page="12" :active="4" scope="Old grouping · recorded editor output"/>
</section>

<!--
The Grouping input mode summarises the old approach confirmed by the team: a shared network groups complete original–expert edits, a group simulates one user, and regional cross-attention uses references from that group. The 767cae8 README and code use the same model.b encoder for grouping descriptors and reference editing features. Full query targets enter grouping; original RGB enters regional generation. The displayed pairs are recorded illustrations, not a newly executed group assignment.

The Zero control mode retains an actual saved run of the earlier explicit-control editor. Mean absolute edit was 0.027538985 under zero conditioning, demonstrating a nonzero edit for this checkpoint and input. The difference image is an absolute RGB difference of saved 8-bit PNGs amplified four times; the metric is from the original float-tensor run. This is separate from the grouped cross-attention model. No extra deployment experiment or future test programme is proposed on this page.
-->

---

<section class="show-slide closing-slide">
  <h2>Next: use partial edits to guide completion.</h2><p class="subtitle">Find similar past modifications, then fill in what the user left unspecified.</p>
  <NextStepMechanism/>
  <DeckFooter :page="13" :active="4" scope="Next phase · partial-edit prototype"/>
</section>

<!--
This next-phase slide follows the team leader’s description only: the user specifies changes for part of an image; the system searches that user’s historical original–edited pairs for similar modifications; cross-attention determines which historical regions can guide each current region and completes the parts the user did not specify.

The flow is supported by the 3c1dadc changes: grouping queries use original RGB, partial-edit RGB and their difference; historical candidates retain full paired edits. The current-image encoder and renderer also receive the partial edit and mask, and specified pixels are copied into the final composition. Code availability is not a recorded successful run of this new flow.

The example is a schematic composed from real FiveK 0412 input pixels and Expert D pixels selected by an illustrative rectangle. It is not a semantic segmentation result or new model output. The reference thumbnails illustrate selection from history without attributing an actual user identity or inventing attention scores. Hatching marks the regions to be completed; the supplied expert target is never presented as a generated completion. Keep this boundary in the presentation, without adding new experiment plans, other-user or no-history trials, client preference tests, or product integration commitments.
-->
