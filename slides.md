---
theme: default
title: Reference-Guided Retouching
info: SOFT3888 technical walkthrough, September 2026
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
exportFilename: Reference-Guided-Retouching-v16
---

<section class="show-slide cover-slide">
  <div class="cover-copy"><h1>Reference<br>Guided<br>Retouching</h1><p>Dynamic grouping → regional attention<br>→ residual enhancement.</p><div class="identity"><b>Technical walkthrough</b><span>SOFT3888 · September 2026</span><span>Client: Marvin Tao · Tutor: Chuanzhi Xu</span></div></div>
  <div class="cover-object"><Scene :act="0"/><p class="object-caption"><b>Paired edits · reference selection · residual prediction</b></p></div>
  <div class="cover-names">Yuchen Deng · Gary Xu · Sihan Fang · Yiming Chen · Yiheng Guo<br>Lunyan Wang · Weishao Su · XingTang Chen · Zihao Zhang</div>
  <DeckFooter :page="1" :active="0" scope="Technical walkthrough"/>
</section>

<!--
Open with the reference-guided research system: original–edited pairs provide editing evidence, retrieval forms a reference group, cross-attention finds useful regional changes, and the CNN produces the output. The cover is a conceptual physical cutaway, not an exact tensor or layer-count diagram. This presentation uses the full-edit research baseline at 767cae8. The old task setting uses one shared network to group examples; one group simulates one user.

Page 2 establishes grouping, page 3 introduces paired FiveK data, and pages 4–6 explain regional transfer and supervision. Page 5 inspects recorded reference choices and attention links with an unarchived run version; page 7 shows the earlier reported ablations. Page 8 reserves text-guided partial edits and history-based completion for the next phase. The technical walkthrough contains eight slides, with full recorded outputs in the separate research evidence companion. The control-demo architecture, interface, checkpoint replay and zero-control observation are outside this presentation.
-->

---

<section class="show-slide">
  <h2>Dynamic grouping from paired edits.</h2><p class="subtitle">Shared edit encoder → mean pooling → Euclidean top-3.</p>
  <LearningMechanism/>
  <DeckFooter :page="2" :active="0" scope="Grouping · one group simulates one user"/>
</section>

<!--
Presentation baseline: cross-attention revision 767cae8, 19 September. The team leader confirms the old task setting: the same network forms editing groups, each group simulates one user, and cross-attention learns regional changes from references in that group. In this implementation the groups are refreshed per-query nearest-reference neighbourhoods; do not invent fixed global user IDs or separate networks per user. The query descriptor uses the full expert target. The separate partial-query evaluation script in this same commit is exploratory and is not the training flow illustrated here. Grouping uses model.b([I,E,E−I]) and global average pooling; distances are Euclidean, and candidates sharing the original scene are excluded. It recomputes candidate embeddings with current weights each chunk. This is supervised training with refreshed discrete retrieval, not reinforcement learning. Baseline config: train originals 1–400, validation 401–500; the downloader prepares up to 800, with remaining originals available for test. For testing, candidate references come from the training set; validation currently retrieves within validation. The supplied figure's actual run configuration and weights are not archived, so do not assign these defaults retrospectively to its metrics.

The animation illustrates the source retrieval rule using the flower example’s recorded reference set. The query target is from that recorded panel. The right-hand group shows clean original images decoded from the official FiveK DNGs for 0406, 0426 and 0490, with camera white balance and max side 500. Tensor labels use the baseline default 256-square model input, omit the batch axis and do not describe the preview PNG resolution. The grouping vector has 64 components; 128 channels belong to attention projections, not this descriptor. Those scene IDs were visually matched to the recorded references; no attention overlays or expert renditions appear in the displayed original-image group. The excluded same-scene rendition is an actual FiveK Expert D asset. Exact candidate-pool contents, descriptor distances and the original retrieval execution were not archived; the animation does not recreate that execution or claim those three references were freshly retrieved.
-->

---

<section class="show-slide">
  <h2>FiveK: one original, five expert targets.</h2><p class="subtitle">Paired samples (I, T) provide supervised edits.</p>
  <ExpertStudy/>
  <p class="slide-note">MIT–Adobe FiveK · Bychkovsky et al., CVPR 2011</p>
  <DeckFooter :page="3" :active="1" scope="FiveK · original + experts"/>
</section>

<!--
All six photos are fetched from the official MIT–Adobe FiveK dataset. This is the very same flower scene in the supplied experiment panel, identified against the official gallery as a0412-_DGW6297. Click experts A–E to compare edit differences. These are real expert renditions, not generated colour variants or outputs of a newly trained model. Project preprocessing is preserved: DNG camera WB, 8-bit RGB, max side 500, calculation at 256 square, PIL TIFF conversion without additional ICC transformation. The official TIFFs use ProPhoto RGB; standardising colour management remains a reproduction consideration. Five experts provide paired targets, not evidence of five internally homogeneous or persistent real-world user profiles.
-->

---

<section class="show-slide">
  <h2>Regional reference selection and transfer.</h2><p class="subtitle">Hard reference selection; soft spatial correspondence.</p>
  <DecisionMechanism/>
  <DeckFooter :page="4" :active="2" scope="Regional cross-attention"/>
</section>

<!--
The supplied dyNAmic Transfer Touch architecture diagram is the conceptual reference for retrieval, scoring, transfer, fusion and learning. It depicts an earlier version with two independent attention branches and temperature-based global reference weights. The presentation baseline at 767cae8 uses one cross-attention result per reference for two operations: absolute scaled QK logits give each query position a score (maximum over reference positions after averaging heads), and per-head spatial softmax supplies editing context. An argmax across references selects one context per query position. This is a hard reference decision and soft correspondence within the selected reference; the displayed matrix and score symbols are an explanatory diagram, not measured attention or reconstructed tensors. No numeric embeddings, attention weights or selection masks are fabricated. The displayed flower and Colosseum images are unchanged crops from the recorded example. Click either decision node to hold that stage. The implementation computes all reference contexts before the hard gate; the presentation explains the dependencies in sequence. Hard selection has no gradient, while the encoder and spatial transfer still receive the output-loss gradient.
-->

---

<section class="show-slide">
  <h2>Different regions select different references.</h2><p class="subtitle">Recorded reference choices and attention links.</p>
  <AttentionWorkbench sample="dog" :initial="2"/>
  <DeckFooter :page="5" :active="2" scope="Recorded diagnostic · run unarchived"/>
</section>

<!--
The experiment version for this supplied diagnostic is unarchived. It cannot be labelled a verified run of the 767cae8 baseline or the newer partial-edit model. It is used here to inspect recorded correspondences. The dog scene is FiveK 0407. Two references show the same leaves (0476) with different expert edits; shares are 0% and 34.38%. The lily (0417) receives 65.62%. These observations motivate soft retouching-role correspondence: useful edits need not come from identical object categories. They do not prove that the model understands roles or outperforms semantic matching. That needs a controlled comparison. The 767cae8 baseline computes absolute scaled QK logits, chooses each region's reference using max over reference positions of head-mean logits, and uses per-head softmax over positions within that chosen reference. Hard reference selection and soft correspondence coexist.

The flower record is now available through the Flowers tab on this evidence slide. Query 0412 matches the flower scene; references 0406, 0426 and 0490 were visually matched to official FiveK thumbnails. The reported shares are 51.17%, 48.83%, and 0%. These are the mean one-hot reference selections across query positions, not global mixture weights, attention probabilities, semantic coverage, or confidence scores. The red overlays are connected groups of strong attention links. They are not the hard selection masks. The original diagnostic uses matching colours and IDs; cropping retains the unmodified overlay. The raw tensor and original checkpoint are unavailable, so the browser does not invent spatial attention values.

The reference expert panel wipes between the actual recorded reference original and expert edit. Both retain the original diagnostic overlays; no covered pixels were reconstructed. The image wipe explains that reference pairs provide editing evidence. It does not depict new inference.
-->

---

<section class="show-slide">
  <h2>Residual enhancement and training.</h2><p class="subtitle">RGB + edit features → bounded residual → full-image loss.</p>
  <RenderMechanism/>
  <DeckFooter :page="6" :active="2" scope="Residual prediction · full-image supervision"/>
</section>

<!--
The 767cae8 baseline uses 32×32 Q/K scoring with a 256×256 input, while encoders produce 64×64 feature grids. Each head's attention is bilinearly lifted and renormalised over the reference value grid, then context is restored to the query grid. Baseline edit_dim is 64, attention_dim 128. The renderer concatenates RGB plus 64 editing features; it is not the Gen 1 seven-channel CNN. Baseline default lambda_ssim is zero, so the displayed loss is RGB L1 plus the 0.001 residual regulariser. Heatmaps are directly cropped from the supplied experiment panel, retaining the reported colour limits. They show output-minus-original diagnostics, not the four-channel DiffMap. The recorded panel has no archived checkpoint or run configuration; it cannot be assigned to the newer partial-edit experiment. No reconstructed attention, metrics or raw prediction values are implied. The residual structure does not guarantee unchanged structure or perfectly local edits.
-->

---

<section class="show-slide">
  <h2>Component ablations.</h2><p class="subtitle">Reported PSNR · chart archived 17 September.</p>
  <MetricChart/>
  <div class="ablation-reading"><p><b>Group</b><span>Nearest-reference retrieval.</span></p><p><b>Select</b><span>One reference per query position.</span></p><p><b>Transfer</b><span>Spatial attention over edit features.</span></p></div>
  <DeckFooter :page="7" :active="3" scope="Earlier experiment · reported ablations"/>
</section>

<!--
Transcribed from the research branch comparison figure: full 26.70; random grouping 21.90; equal weights 25.40; 12-channel CNN fusion 24.50. The full chart also lists PerTouch 26.20, InstantRetouch 23.34 and DiffRetouch 25.20. Those external comparisons remain in the attachment because matched training splits and evaluation protocols are not documented. These within-project ablations motivate causal tests, but the figure alone lacks random-seed uncertainty and run configuration; avoid claiming statistical significance. The 767cae8 baseline toggles implement the named interventions. The displayed comparison image is byte-identical to the figure committed at 26a883d on 17 September, before the partial-edit experiment. Do not imply that all displayed values belong to the current revision.
-->

---

<section class="show-slide closing-slide">
  <h2>Next: text-guided partial edits.</h2><p class="subtitle">Partial edit → retrieve similar edits → complete unspecified regions.</p>
  <NextStepMechanism/>
  <DeckFooter :page="8" :active="4" scope="Next phase · text + partial edits"/>
</section>

<!--
This next-phase slide follows the team leader’s latest description: text-based editing and partial editing belong together in the next phase. A text request specifies changes for part of an image; the system searches that user’s historical original–edited pairs for similar modifications; cross-attention determines which historical regions can guide each current region and completes the parts the user did not specify.

The flow is supported by the 3c1dadc changes: grouping queries use original RGB, partial-edit RGB and their difference; historical candidates retain full paired edits. The current-image encoder and renderer also receive the partial edit and mask, and specified pixels are copied into the final composition. Code availability is not a recorded successful run of this new flow. Text-to-edit handling is presented as the next-phase extension, not an integrated or verified capability of the shown research baseline.

The example is a schematic composed from real FiveK 0412 input pixels and Expert D pixels selected by an illustrative rectangle. It is not a semantic segmentation result or new model output. The reference thumbnails illustrate selection from history without attributing an actual user identity or inventing attention scores. Hatching marks the regions to be completed; the supplied expert target is never presented as a generated completion. Keep this boundary in the presentation, without adding new experiment plans, other-user or no-history trials, client preference tests, or product integration commitments.
-->
