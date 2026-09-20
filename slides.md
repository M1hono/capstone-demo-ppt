---
theme: default
routerMode: hash
title: Reference-Guided Retouching
info: SOFT3888 research walkthrough · preference-completion formulation, September 2026
author: SOFT3888 project team
aspectRatio: 16/9
canvasWidth: 1280
colorSchema: light
fonts:
  sans: Arial
  mono: Menlo
  provider: none
transition: fade
wakeLock: false
drawings:
  enabled: false
exportFilename: Reference-Guided-Retouching-v22
---

<section class="show-slide cover-slide">
  <div class="cover-copy">
    <h1>Reference<br>Guided<br>Retouching</h1>
    <div class="identity"><span>SOFT3888 · September 2026</span><span>Client: Marvin Tao · Tutor: Chuanzhi Xu</span></div>
  </div>
  <div class="cover-object"><Scene :act="0"/></div>
  <div class="cover-names">Yuchen Deng · Gary Xu · Sihan Fang · Yiming Chen · Yiheng Guo<br>Lunyan Wang · Weishao Su · XingTang Chen · Zihao Zhang</div>
  <DeckFooter :page="1"/>
</section>

<!--
Presentation cover. Keep the project title, approved conceptual 3D anatomy and team identity. The research objective and preference definition begin on the next page. No eyebrow label or equation banner.
-->

---

<section class="show-slide source-slide objective-slide">
  <h2>Current Research Objective and Definition of User Preference</h2>
  <PreferenceDefinition/>
  <DeckFooter :page="2"/>
</section>

<!--
Primary source: the team's current research writeup, chapter 1. User preference is defined by two routes: explicit instructions are followed directly; unspecified or incomplete regions are completed from the user's historical editing behaviour. This definition drives both the dataset reconstruction (pages 5–6) and the forward pass (pages 7–9). The cover object is a conceptual cutaway, not a tensor diagram. Manuscript definition: Final Desired Edit = Explicit User Edit + Preference-Based Completion of Unspecified Regions. The user explicitly rejected a cover equation banner; the definition is explained by the original prose instead.

The history photographs are real original/Expert C pairs from FiveK scenes 0001, 0006 and 0016. They illustrate the input type, not a measured user history or reference retrieval. The centre region grid is a schematic, not a generated image.
-->

---

<section class="show-slide source-slide">
  <h2>Reconstruction of the FiveK Dataset</h2>
  <ExpertStudy/>
  <p class="slide-note">MIT–Adobe FiveK · Bychkovsky et al., CVPR 2011</p>
  <DeckFooter :page="3"/>
</section>

<!--
Primary source: writeup chapter 2. FiveK supplies original photographs plus expert-retouched versions, so the basic pair is I + G. It provides no real user editing histories and no instructions such as "make the sky darker", so the two variables we need — current explicit intent and historical preference — must be reconstructed. Click experts A–E to compare edit differences on the same scene. Auxiliary evidence: all six photos come from the official dataset (flower scene a0412-_DGW6297); preprocessing is DNG camera WB, 8-bit RGB, max side 500, calculation at 256 square. Five experts are retouchers providing paired targets, not five persistent user profiles — which is exactly why the reconstruction on the next pages is needed.
-->

---

<section class="show-slide source-slide">
  <h2>Stage One: Encoding Complete Editing Information</h2>
  <EditEncoding/>
  <DeckFooter :page="4"/>
</section>

<!--
Primary source: writeup chapter 3. Every original–expert pair is encoded into a latent editing representation describing what transformation turned I into G — a dense learned vector, not a hand-defined list of brightness or saturation statistics. Auxiliary evidence from the archived code (3c1dadc): the inputs I, G, G − I are stacked as a 9-channel tensor, encoded, then globally average-pooled into a 64-dimensional descriptor; distances between descriptors are Euclidean. Every pair in FiveK obtains its own descriptor this way. Only encoding and spatial pooling are shown here. Dimensions are an architecture example from the archived implementation, not the unarchived metric run configuration.
-->

---

<section class="show-slide source-slide">
  <h2>Stage Two: Dynamic Construction of Simulated User History</h2>
  <HistoryRetrieval mode="history"/>
  <DeckFooter :page="5"/>
</section>

<!--
Primary source: writeup chapter 4. For each training sample the 20 most similar complete editing representations are retrieved and treated as one simulated user's editing history; the assumption is that similar editing decisions across different visual content reflect one underlying preference. The grouping is refreshed during training as the encoder improves, so the dataset structure adapts with the model instead of relying on manual groups. Auxiliary evidence: the archived code (3c1dadc) refreshes embeddings with the current network every training chunk and tracks grouping stability between refreshes. Presentation boundary: in the archived implementation the top-3 references are selected directly from the candidate pool by descriptor distance; the 20-sample history pool is the team's described design for the simulated user. Present the writeup formulation; do not add fixed user identities.

The twenty displayed pairs are official FiveK scenes 0001–0020 with Expert C edits. Their membership is illustrative: no run has identified these photographs as the twenty nearest neighbours. Originals are camera-white-balanced DNG renders; the edits are official gallery thumbnails. Asset sources and hashes are archived separately.
-->

---

<section class="show-slide source-slide">
  <h2>Stage Three: Constructing Partial Edits to Simulate Explicit User Requirements</h2>
  <PartialEdit/>
  <DeckFooter :page="6"/>
</section>

<!--
Primary source: writeup chapter 5. The current image is semantically segmented; regions covering roughly 40% of pixels are selected; their pixels are replaced by the expert target while the rest stay original. The partial edit represents the user's current explicit intent, and the complete expert image is the final result the user wants — so the task changes from I → G to I + partial edit + history → G. Auxiliary evidence, verified in the archived code (3c1dadc): segmentation is Mask2Former panoptic (facebook/mask2former-swin-small-coco-panoptic, threshold 0.5) cached per original; the kept-unspecified target ratio is 0.6, so the edited area is ≈40%; the composite is exactly where(mask, expert, original). The three displayed images are an illustrative rectangle composite from FiveK 0412 and Expert D — not a Mask2Former output and not a model prediction; say so if asked.
-->

---

<section class="show-slide source-slide">
  <h2>Stage Four: Retrieving Historical Preference Using the Partial Edit</h2>
  <HistoryRetrieval mode="query"/>
  <DeckFooter :page="7"/>
</section>

<!--
Primary source: writeup chapter 6. The second retrieval uses only the partial modification — the model knows the original, which regions were explicitly modified, and how they changed — and searches within the 20-sample simulated history for the three most relevant references. This is what makes the mechanism applicable at inference: complete ground-truth edits are unavailable outside training, but the partial edit comes from the user's actual explicit requirements. Auxiliary evidence (3c1dadc): grouping queries are embedded from the partial edit while candidates keep full expert pairs; same-scene pairs are excluded; num_reference = 3 with selection temperature 0.01. Archived code ranks candidates from the full pool directly; the writeup describes the search within the constructed 20-sample history — present the writeup's two-stage formulation as the design.

The three photographed references are FiveK scenes 0001, 0006 and 0016, matching H1, H6 and H16 in the illustrated pool. These are real original/Expert C pairs selected to explain the diagram, not a recorded retrieval or ranked result.
-->

---

<section class="show-slide source-slide">
  <h2>Stage Five: Cross-Attention-Based Transfer of Historical Editing Information</h2>
  <DecisionMechanism/>
  <DeckFooter :page="8"/>
</section>

<!--
Primary source: writeup chapter 7. Retrieved references are not copied — cross-attention runs between the current image and the three references. Because a person may sit left in the current image and centre in a reference, the same coordinates cannot assume the same edit; correspondences are learned from visual content. The current image provides queries; references provide features plus editing information; attention weights aggregate relevant historical editing features into one modification representation conditioned on the current image — a dynamic combination of multiple references, not the edit of a single photograph. Auxiliary evidence (3c1dadc): one attention head, attention_dim 128, edit_dim 64; Q/K scoring on a 32×32 grid with a 64×64 value grid. Click the decision nodes to hold a stage. The query encoder takes [I,P,M] (7 channels), while the reference edit encoder takes [Iᵣ,Gᵣ,Gᵣ−Iᵣ] (9 channels). Reference keys and values both derive from edit encoding. The per-position hard reference gate is distinct from spatial softmax. The reference photograph is an archived pair illustrating the input type, not a measured retrieval in the current experiment. The diagram is explanatory, not measured tensors.
-->

---

<section class="show-slide source-slide">
  <h2>Stage Six: Spatial Reconstruction and Final Image Generation</h2>
  <RenderMechanism/>
  <DeckFooter :page="9"/>
</section>

<!--
Primary source: writeup chapter 8. Cross-attention runs in a lower-resolution feature space to control cost; the modification features are interpolated back to full resolution. The enhancement network then receives four inputs: the original image (RGB content and structure), the partial user edit (explicit operations), the explicit-region mask (which regions still need completion), and the historical modification features (from retrieval and cross-attention). Training still compares the output against the complete expert-retouched image, so the model must reproduce detailed edits and their magnitudes, not just a general stylistic direction. Auxiliary evidence (3c1dadc): scoring grid 32×32 lifted to the 64×64 value grid, renderer concatenates RGB with 64 edit-feature channels plus the partial edit and mask (architecture version 2), supervised by L1 with the 0.001 residual regulariser; the specified pixels are then copied from P via where(mask, P, prediction). The 71-channel tensor is 3 original + 3 partial + 1 mask + 64 history features. The output shown is symbolic, not an old prediction relabelled as the new model. These are archived architectural details; the present metric run configuration is not archived.
-->

---

<section class="show-slide source-slide">
  <h2>Current Quantitative Results</h2>
  <div class="evaluation-layout">
    <table class="metric-table"><thead><tr><th>Metric</th><th>Current model</th></tr></thead><tbody><tr><td>PSNR</td><td>27.2 <small>dB</small></td></tr><tr><td>SSIM</td><td>0.90</td></tr></tbody></table>
    <div class="source-results-flow"><div><span>Partial Edit Clue</span><i>+</i><span>History Retrieval</span><i>+</i><span>Cross-Attention Transfer</span></div><i>↓</i><b>Complete Edit Reconstruction</b></div>
  </div>
  <div class="result-conclusion"><p>Even when only partial editing information is explicitly provided, historical retrieval and Cross-Attention can provide additional information for completing the missing edits.</p><p>It is capable of reconstructing a result that is quantitatively close to the complete expert-retouched target.</p></div>
  <DeckFooter :page="10"/>
</section>

<!--
Primary source: writeup chapter 9. The current model reports PSNR 27.2 dB and SSIM 0.90. The significance is not only the absolute values: the results support the hypothesis that partial editing information plus historical retrieval and cross-attention can complete the unspecified edits. Provenance boundary: these values come from the team's current writeup; the research repositories do not yet archive the run configuration or checkpoint behind them, and an earlier figure (17 September, previous formulation) reported different values — do not mix those numbers into this deck. The current run configuration, split and checkpoint are not archived with these results. Do not assign older evaluation defaults to this run. The evaluation diagram is symbolic; no old output image is presented as evidence for the current metrics.
-->

---

<section class="show-slide source-slide">
  <h2>Main Achievements at the Current Stage</h2>
  <div class="achievements-layout">
    <AchievementSummary/>
    <AblationExperiment/>
  </div>
  <DeckFooter :page="11"/>
</section>

<!--
Primary source: writeup chapter 10. Three achievements: a clearer definition of personalization; a method to dynamically reconstruct FiveK into simulated intent plus history without user labels; and strong quantitative performance under the new formulation. The three ablations isolate the contributions: replacing the constructed user history with random samples drops PSNR from 27.2 to 22.1; keeping the history but selecting references randomly within it drops to 24.5; removing cross-attention and feeding reference and current images directly into the CNN drops to 23.1. Provenance boundary: these values are from the team's current writeup; no archived run configurations accompany them yet, and no seed-level uncertainty is reported — avoid claiming statistical significance. The earlier 17 September figure reported different values under the previous formulation; that figure stays out of this deck.

The small I/G pair in the reconstruction diagram uses real FiveK flower scene 0412 and Expert D. It illustrates the paired training data; it is not an output associated with the reported metrics.
-->

---

<section class="show-slide source-slide">
  <h2>Current Limitation</h2>
  <HistoryDependence/>
  <DeckFooter :page="12"/>
</section>

<!--
Primary source: writeup chapter 11. The honest limitation: the system uses user history but does not yet build an independent, persistent representation of the user. Inference still performs partial edit → search historical images → select references → cross-attention, so the accurate description is history-conditioned personalized image enhancement rather than a complete latent user modelling framework — the preference remains distributed across the historical database. This framing sets up the future work on the next two pages.

The partial edit is the existing illustrative rectangle composite from scene 0412 and Expert D. Historical and selected-reference photographs are real original/Expert C pairs; database membership and reference selection remain illustrative.
-->

---

<section class="show-slide source-slide">
  <h2>Future Work: Latent Memory Slots for Implicit User Modeling</h2>
  <PreferenceMemory mode="compress"/>
  <DeckFooter :page="13"/>
</section>

<!--
Primary source: writeup chapter 12. Next step: transform the large collection of historical image–edit pairs into a compact latent user preference memory — K latent memory slots, each a D-dimensional dense representation. The slots need no manually assigned semantic labels; the model should learn representations of the form "when the image is in a particular visual situation, this user tends to edit it a particular way". This is future design, not an implemented or recorded capability of the current system — present it as the plan, without promising timelines.

The four historical examples are real FiveK original/Expert C pairs (0001, 0006, 0016 and 0020). Only the image inputs are photographic evidence; the learned compression and latent slots remain a proposed mechanism.
-->

---

<section class="show-slide source-slide">
  <h2>Future Preference-Memory Query Process</h2>
  <PreferenceMemory mode="query"/>
  <DeckFooter :page="14"/>
</section>

<!--
Primary source: writeup chapter 13. In the future architecture the complete historical collection is required only to construct the User Preference Memory; once built, inference no longer searches the database. For unspecified regions the model extracts query features of the current visual situation; the memory provides latent keys and values; cross-attention performs query × preference memory → relevant historical preference, which is combined with the user's explicit current edit to produce the personalized result. This moves the system from retrieving historical images toward querying a compact latent model. Future design — no recorded run exists.

The unspecified-region image uses original pixels from FiveK scene 0412 with a translucent overlay on the specified region of the existing illustrative rectangle mask. It is not semantic segmentation or a predicted result; the mask covers roughly 24.9%, separate from the manuscript training target of approximately 40%.
-->

---

<section class="show-slide source-slide closing-slide">
  <h2>Final Research Hypotheses</h2>
  <div class="source-hypotheses">
    <div><span>1</span><p>Can historical editing behavior help reconstruct the complete desired result when the user provides only partial editing information?</p><small>Our current results already provide initial evidence supporting this hypothesis.</small></div>
    <div><span>2</span><p>Can the complete editing history be compressed into a small latent preference memory without significantly reducing PSNR and SSIM?</p></div>
    <div><span>3</span><p>If the input image and explicit user instruction remain unchanged, but the User Preference Memory is replaced with the memory of another user, does the output change toward the corresponding user’s target editing behavior?</p></div>
  </div>
  <p class="source-next-step">The next major step is to compress the historical editing behavior into a queryable Latent User Preference Model, while preserving the strong reconstruction performance of the current system.</p>
  <DeckFooter :page="15"/>
</section>

<!--
Primary source: writeup chapter 14. Three hypotheses close the talk. H1 — can historical behaviour help reconstruct the complete desired result from partial information — has initial supporting evidence (page 10). H2 — can the complete history be compressed into a small latent preference memory without significant PSNR/SSIM loss — is untested. H3 — with input and explicit instruction unchanged, swapping the preference memory should move the output toward the corresponding user's editing behaviour, evidence that the memory holds personalized decisions rather than generic image features — is untested. Overall arc: reference-based enhancement evolving into explicit intent + historical behaviour + cross-attention preference transfer. Next major step: the queryable latent user preference model, preserving strong reconstruction performance. Do not add new experiment plans beyond these hypotheses.
-->
