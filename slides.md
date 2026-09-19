---
theme: default
title: Preference Enhancement Engine
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
exportFilename: Preference-Enhancement-Engine-v7
---

<section class="show-slide cover-slide">
  <div class="cover-copy"><h1>Preference<br>Enhancement<br>Engine</h1><p>From editing preferences<br>to an inspectable result.</p><div class="identity"><b>Client deployment review</b><span>SOFT3888 · September 2026</span><span>Client: Marvin Tao · Tutor: Chuanzhi Xu</span></div></div>
  <div class="cover-object"><Scene :act="0"/><p class="object-caption"><b>How it works · What the evidence shows</b></p></div>
  <div class="cover-names">Yuchen Deng · Gary Xu · Sihan Fang · Yiming Chen · Yiheng Guo<br>Lunyan Wang · Weishao Su · XingTang Chen · Zihao Zhang</div>
  <DeckFooter :page="1" :active="0" scope="Client review"/>
</section>

<!--
Open with the engineering object. The deployed editor takes explicit controls; the research cartridge learns which historical edit information is relevant. These are related implementations, not a claim that cross-attention is already connected to the current web demo. The 13-slide core is followed by a separate evidence companion.
-->

---

<section class="show-slide">
  <h2>One image. Five expert edits.</h2><p class="subtitle">FiveK holds the scene constant and varies the editing target.</p>
  <ExpertStudy/>
  <p class="slide-note">MIT–Adobe FiveK · Bychkovsky et al., CVPR 2011</p>
  <DeckFooter :page="2" :active="0" scope="FiveK · original + experts"/>
</section>

<!--
All six photos are fetched from the official MIT–Adobe FiveK dataset. This is the very same flower scene in the supplied experiment panel, identified against the official gallery as a0412-_DGW6297. Click experts A–E to compare edit differences. These are real expert renditions, not generated colour variants or outputs of a newly trained model. Project preprocessing is preserved: DNG camera WB, 8-bit RGB, max side 500, calculation at 256 square, PIL TIFF conversion without additional ICC transformation. The official TIFFs use ProPhoto RGB; standardising colour management remains a reproduction consideration. Five experts provide paired targets, not evidence of five internally homogeneous or persistent real-world user profiles.
-->

---

<section class="show-slide">
  <h2>Three controls. One DiffMap.</h2><p class="subtitle">Each request becomes spatial controls for red, green, blue and contrast.</p>
  <div class="input-routes"><div><b>Text preference</b><span>Regions + language labels<br>→ numeric edits</span></div><div><b>Reference image <em>Experimental</em></b><span>RGB + contrast statistics<br>→ bounded edits</span></div><div><b>Region fine tune</b><span>Region mask + RGBC sliders<br>→ feathered edits</span></div></div>
  <Scene :act="2" class="wide-engine"/>
  <div class="contract-line"><b>RGB input</b><span>+</span><b>P = [ΔR, ΔG, ΔB, ΔContrast]</b><span>→</span><b>7-channel residual CNN</b><span>→</span><b>Output</b></div>
  <DeckFooter :page="3" :active="1" scope="Gen 1 · current demo"/>
</section>

<!--
Text uses semantic segmentation plus constrained label generation and deterministic label-to-number mapping. The shipped reference adapter uses trimmed RGB medians and a luminance P90–P10 contrast span, clipped to ±0.3 before strength. It is not the learned reference encoder. Region controls feather masks with a two-pixel Gaussian blur, combine global and local settings, then clip to ±0.3. The four RGBC conditioning channels are distinct from the three post-hoc brightness/saturation/warmth diagnostic maps shown later. Text planning uses Mask2Former segmentation and Qwen label generation before deterministic numeric mapping.
-->

---

<section class="show-slide">
  <h2>See what the controls change.</h2><p class="subtitle">One FiveK image and one checkpoint, replayed with four control settings.</p>
  <Workbench initial="warm"/>
  <DeckFooter :page="4" :active="2" scope="Gen 1 · checkpoint replay"/>
</section>

<!--
This workbench replays newly executed CPU inference using the exact repository PreferenceControlledCNN and checkpoint. All tensor shapes and output statistics are from the run. Warm, cool, and zero controls were executed separately, as was the exact reference adapter with strength 0.7. Switching controls is replay, not live inference. Expert D is the same-scene reference used as an oracle illustration of the adapter; this cannot establish transfer to unrelated photos. Do not call timings end-to-end deployment latency, since segmentation and Qwen were not involved.
-->

---

<section class="show-slide">
  <h2>Select a region. Refine the edit.</h2><p class="subtitle">The current demo exposes the plan before the next render.</p>
  <div class="app-evidence"><img src="/assets/web-demo.jpg" alt="Supplied web demo screenshot, person region selected, red plus 0.08 and blue minus 0.08"/><aside><h3>Person region</h3><dl class="spec-list"><dt>Red / Blue</dt><dd>+0.08 / −0.08</dd><dt>Green / Contrast</dt><dd>0.00 / 0.00</dd></dl><p>Adjust → render → compare</p></aside></div>
  <div class="acceptance-row"><span><b>US01–04</b> Upload & controls</span><span><b>US05 · 08</b> Region edits</span><span><b>US06–07</b> Compare & download</span><span><b>US09–10</b> Quality: open</span></div>
  <DeckFooter :page="5" :active="2" scope="Gen 1 · demo capture"/>
</section>

<!--
This is an actual supplied demo screenshot, not the separate Retouch Lab UX mock. The live operator should demonstrate image upload, a text preference, a reference trial, selecting an actual mask and fine-tuning, comparison and download. The screenshot proves a captured interface state; it is not a passing record for every user story. US09 structure preservation must be judged on output evidence, and US10 broader quality evaluation remains open. Live demo takes place on the team's machine, outside this deck. Reruns reuse the source image and cached masks, so slider adjustments do not require repeated segmentation.
-->

---

<section class="show-slide">
  <h2>Learn which editing history to retrieve.</h2><p class="subtitle">Training updates the edit encoder; the next search uses its updated descriptors.</p>
  <LearningMechanism/>
  <DeckFooter :page="6" :active="1" scope="Gen 3 · training"/>
</section>

<!--
Source inspected at cross-attention revision 767cae8. Grouping uses model.b([I,E,E−I]) and global average pooling; distances are Euclidean, and candidates sharing the original scene are excluded. It recomputes candidate embeddings with current weights each chunk. This is supervised training with refreshed discrete retrieval, not reinforcement learning. Current config: train originals 1–400, validation 401–500; the downloader prepares up to 800, with remaining originals available for test. For testing, candidate references come from the training set; validation currently retrieves within validation. The supplied figure's actual run configuration and weights are not archived, so do not assign these defaults retrospectively to its metrics.

The animation illustrates the source retrieval rule using the flower example’s recorded reference set. The query target and reference images are from that same recorded panel. The excluded same-scene rendition is an actual FiveK Expert D asset. Exact candidate-pool contents, descriptor distances and the original retrieval execution were not archived; the animation does not recreate that execution or claim those three references were freshly retrieved.
-->

---

<section class="show-slide">
  <h2>Choose a reference. Then transfer its edit.</h2><p class="subtitle">Choose one reference per region; softly match positions within it.</p>
  <DecisionMechanism/>
  <DeckFooter :page="7" :active="1" scope="Gen 3 · decision mechanism"/>
</section>

<!--
The supplied dyNAmic Transfer Touch architecture diagram is the conceptual reference for retrieval, scoring, transfer, fusion and learning. It depicts an earlier version with two independent attention branches and temperature-based global reference weights. Current source at 767cae8 uses one cross-attention result per reference for two operations: absolute scaled QK logits give each query position a score (maximum over reference positions after averaging heads), and per-head spatial softmax supplies editing context. An argmax across references selects one context per query position. This is a hard reference decision and soft correspondence within the selected reference; the displayed matrix and score symbols are an explanatory diagram, not measured attention or reconstructed tensors. No numeric embeddings, attention weights or selection masks are fabricated. The displayed flower and Colosseum images are unchanged crops from the recorded example. Click either decision node to hold that stage. The implementation computes all reference contexts before the hard gate; the presentation explains the dependencies in sequence. Hard selection has no gradient, while the encoder and spatial transfer still receive the output-loss gradient.
-->

---

<section class="show-slide">
  <h2>Find useful edits across different scenes.</h2><p class="subtitle">Recorded groups connect query regions to historical editing evidence.</p>
  <AttentionWorkbench sample="dog" :initial="2"/>
  <DeckFooter :page="8" :active="1" scope="Gen 3 · recorded attention"/>
</section>

<!--
The dog scene is FiveK 0407. Two references show the same leaves (0476) with different expert edits; shares are 0% and 34.38%. The lily (0417) receives 65.62%. These observations motivate soft retouching-role correspondence: useful edits need not come from identical object categories. They do not prove that the model understands roles or outperforms semantic matching. That needs a controlled comparison. Current source computes absolute scaled QK logits, chooses each region's reference using max over reference positions of head-mean logits, and uses per-head softmax over positions within that chosen reference. Hard reference selection and soft correspondence coexist.

The flower record is now available through the Flowers tab on the following evidence slide. Query 0412 matches the flower scene; references 0406, 0426 and 0490 were visually matched to official FiveK thumbnails. The reported shares are 51.17%, 48.83%, and 0%. These are the mean one-hot reference selections across query positions, not global mixture weights, attention probabilities, semantic coverage, or confidence scores. The red overlays are connected groups of strong attention links. They are not the hard selection masks. The original diagnostic uses matching colours and IDs; cropping retains the unmodified overlay. The raw tensor and original checkpoint are unavailable, so the browser does not invent spatial attention values.

The historical expert panel wipes between the actual recorded reference original and expert edit. Both retain the original diagnostic overlays; no covered pixels were reconstructed. The image wipe explains that reference pairs provide editing evidence. It does not depict new inference.
-->

---

<section class="show-slide">
  <h2>Assemble local edits. Learn from the result.</h2><p class="subtitle">The loss updates the network before references are retrieved again.</p>
  <RenderMechanism/>
  <DeckFooter :page="9" :active="3" scope="Gen 3 · source + recorded maps"/>
</section>

<!--
Current code uses 32×32 Q/K scoring with a 256×256 input, while encoders produce 64×64 feature grids. Each head's attention is bilinearly lifted and renormalised over the reference value grid, then context is restored to the query grid. Current edit_dim is 64, attention_dim 128. The renderer concatenates RGB plus 64 editing features; it is not the Gen 1 seven-channel CNN. Current default lambda_ssim is zero, so the displayed loss is RGB L1 plus the 0.001 residual regulariser. Heatmaps are directly cropped from the supplied experiment panel, retaining the reported colour limits. They show output-minus-original diagnostics, not the four-channel DiffMap. The recorded panel predates the current source; its weights and configuration are not available. No reconstructed attention, metrics or raw prediction values are implied. The residual structure does not guarantee unchanged structure or perfectly local edits; these acceptance tests are on slide 12.
-->

---

<section class="show-slide">
  <h2>Compare the image and the score.</h2><p class="subtitle">Three recorded examples, each with its own editing target.</p>
  <ResultsGallery/>
  <div class="metric-context"><div><b>Metric scope</b><p>Expert-target similarity.<br>Each score describes one image.</p></div><div><b>Earlier milestone</b><p><strong>26.6 dB · 0.88 SSIM</strong><br>Separate evaluation subset.</p></div><div><b>Next evaluation</b><p>Unseen users and histories.<br>Client preference judgements.</p></div></div>
  <DeckFooter :page="10" :active="4" scope="Gen 3 · recorded samples"/>
</section>

<!--
Flowers: 26.496 dB / 0.7949. Dog: 32.761 / 0.9531. Books: 27.242 / 0.8946. Values are transcribed from the team's unmodified example panels, not recalculated from JPEGs. The supplied panels do not establish sample count, model checkpoint or aggregate evaluation protocol. The earlier report's 26.6 / 0.88 is separate from the Gen 3 comparison chart's 26.70; never average or conflate these records. No claims about dataset-wide performance or new controlled experiments are made.
-->

---

<section class="show-slide">
  <h2>Random references show the largest drop.</h2><p class="subtitle">Team-reported ablations, measured in PSNR.</p>
  <MetricChart/>
  <div class="ablation-reading"><p><b>Retrieve</b><span>Choose relevant editing history.</span></p><p><b>Select</b><span>Choose a reference per region.</span></p><p><b>Transfer</b><span>Align useful editing features.</span></p></div>
  <DeckFooter :page="11" :active="4" scope="Gen 3 · reported ablations"/>
</section>

<!--
Transcribed from the research branch comparison figure: full 26.70; random grouping 21.90; equal weights 25.40; 12-channel CNN fusion 24.50. The full chart also lists PerTouch 26.20, InstantRetouch 23.34 and DiffRetouch 25.20. Those external comparisons remain in the attachment because matched training splits and evaluation protocols are not documented. These within-project ablations motivate causal tests, but the figure alone lacks random-seed uncertainty and run configuration; avoid claiming statistical significance. Source current toggles implement the named interventions. Do not imply that all displayed values belong to the current revision.
-->

---

<section class="show-slide">
  <h2>Two limits define the next tests.</h2><p class="subtitle">A measured rendering behaviour and an unresolved retrieval dependency.</p>
  <div class="boundary-layout"><div class="zero-observation"><div class="boundary-heading"><b>Zero control still changes pixels</b><span>Measured</span></div><div class="zero-pair"><figure><img src="/assets/fivek/cnn-input.png" alt="Actual FiveK input"/><figcaption>Original</figcaption></figure><figure><img src="/assets/fivek/cnn-zero.png" alt="Actual zero conditioning output"/><figcaption>Zero RGBC output</figcaption></figure></div><p>Mean absolute edit: <b>0.0275</b> on [0, 1].<br>Next: identity and protected-region tests.</p></div><div class="retrieval-boundary"><h3>Retrieval still uses the target</h3><div class="leakage-flow"><span>Query original + <b>query expert</b></span><i>↓</i><span>Retrieval descriptor → top 3 pairs</span><i>↓</i><span>Original + reference pairs → renderer</span></div><p>Remove the query expert<br>from reference selection.</p><p class="small">Use only the request image and available user history.</p></div></div>
  <div class="verification-strip"><b>Verified here</b><span>Checkpoint load · finite output</span><b>Demo-day checks</b><span>API · text · reference · region</span></div>
  <DeckFooter :page="12" :active="4" scope="Gen 1 test · Gen 3 source"/>
</section>

<!--
New CPU run measured mean absolute edit 0.027538985 under a zero conditioning map. This is a factual counterexample to an identity guarantee, not a full failure-rate estimate. No full Text/Qwen/Mask2Former runtime has been run here; testing scripts existing in the repository do not imply passing results. Current research forward ignores current_expert, but grouping_embedding(original,expert) still uses it upstream. A deployment-safe evaluation must remove target-derived query retrieval and split by original and user history. Explicit source-ID ranges keep same-scene expert variants within a split, whereas the unused random split path divides pair IDs and needs care.
-->

---

<section class="show-slide closing-slide">
  <h2>Let user history guide the next edit.</h2><p class="subtitle">The next integration step makes reference choice personal and inspectable.</p>
  <div class="next-layout"><div><Scene :act="12"/><p class="object-caption">Current demo + research module<br><b>Integration is the next step.</b></p></div><div class="decision-sequence"><div><span>01</span><p><b>Use one user's history</b>Restrict candidates to that user's past edits.</p></div><div><span>02</span><p><b>Show the decision</b>Expose selected references, region matches and the result.</p></div><div><span>03</span><p><b>Evaluate without the target</b>Test query-only retrieval on held-out histories.</p></div></div></div>
  <div class="client-decision"><b>Client review</b><span>Which decisions to show?</span><span>Which regions to protect?</span><span>Which histories to test?</span></div>
  <DeckFooter :page="13" :active="4" scope="Next integration"/>
</section>

<!--
Link directly to the client's feedback: user history as candidate pool; soft retouching-role correspondence rather than rigid semantic alignment; separate observable decision stages; optional explicit instructions and protected masks. Persistent history and an integrated planner are not implemented in the current research source. Do not relabel learned attention as an LLM agent or reinforcement learner. Record feedback as a user story plus acceptance condition, assign an owner, and bring the resulting evidence back to the next review. Live demo and full evidence panels remain separate from the 13-page core. Team name TH18_04 versus repository TU18_04 still requires group confirmation before submission; avoid asserting either on the cover.
-->
