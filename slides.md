---
theme: default
title: Final Presentation Workbench
info: SOFT3888 final presentation component workbench · visualization support for the preference-modelling architecture, October 2026
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
exportFilename: Final-Presentation-Workbench-v0
---

<section class="fp-slide fp-cover">
  <div class="fp-cover-copy">
    <h1>Preference<br>Modelling</h1>
    <p class="fp-cover-sub">Final presentation · component workbench</p>
    <p class="fp-cover-note">P(Retouching&nbsp;|&nbsp;Current&nbsp;Image,&nbsp;User&nbsp;History) — conditional density over a 3-D retouching space</p>
  </div>
  <div class="fp-cover-status">
    <p>No rubric or script yet — this deck only hosts and tests presentation components. Content pages come after the rubric arrives.</p>
  </div>
</section>

<!--
Workbench cover. The final narrative follows the W13 final group report:
preference = conditional probability density, not a single output.
-->

---

<section class="fp-slide">
  <h2>Phase 2 viewer: conditional retouching distribution</h2>
  <PreferenceSphere/>
  <p class="fp-provenance"><code>z ∈ R³</code> · 256 MC samples · 14° local density cells · 24×48 flow-probability grid · Top-K cells ranked by log P</p>
</section>

<!--
The visual is a browser version of phase2/visual3.py: switch image/expert,
inspect MC samples, local direction density, discrete flow probability, and
the selected candidate cells against the recorded GT vector.
-->

---

<section class="fp-slide">
  <h2>Visualization Coverage Plan</h2>
  <table class="fp-table">
    <thead><tr><th>Evidence (W13 report)</th><th>Planned visual</th><th>Status</th></tr></thead>
    <tbody>
      <tr><td>Preference = conditional, multimodal density (§1.1, §2.2)</td><td>3-D rotating preference sphere, MC samples + density + Top-K + GT</td><td>Component ready (synthetic data)</td></tr>
      <tr><td>Same image, different experts → different spheres (§2.5 figure)</td><td>Sphere Compare mode: two experts side by side + mean-direction separation angle; expert switching</td><td>Component ready; report figure script pending</td></tr>
      <tr><td>z: direction = style, |z| = strength (§2.3)</td><td>DirectionMagnitudeGrid: rows = Top-K/GT directions, cols = |z| multipliers</td><td>Component ready · awaits GPU renders</td></tr>
      <tr><td>Image similarity retrieval only ~30% (§2.2)</td><td>MotivationStat: big number + 100-dot grid (3 in 10 highlighted)</td><td>Component ready (report number)</td></tr>
      <tr><td>FiveK 23.8 · PPSD 24.5 · strict 23.5 vs PieNet 20.8 / RefRetouch 21.3 (§1.3)</td><td>MetricBars animated bars (slides) + static figure via make_figures.py (report)</td><td>Both ready</td></tr>
      <tr><td>Ablations: wrong history / wrong image (§1.3)</td><td>AblationBars — delta rows render as TBD until run CSVs archived</td><td>Component ready · awaits numbers</td></tr>
      <tr><td>Phase-1 reconstruction 29.3 dB (§2.3)</td><td>ReconstructionStrip: original | reconstruction | counter (images slot in after export)</td><td>Component ready · awaits images</td></tr>
      <tr><td>Five-stage architecture evolution (§2.7)</td><td>EvolutionTimeline (interactive) · ArchFlow pipeline for the current stage</td><td>Both ready</td></tr>
      <tr><td>Reusable visual language from the client deck</td><td>42 component pages: mechanisms, workbenches, comparisons, evidence, terminals, memory, counters…</td><td>Carried over · QA clear</td></tr>
    </tbody>
  </table>
</section>

---

<section class="show-slide gallery-slide">
  <h2>Scene</h2>
  <p class="gallery-usage"><code>&lt;Scene :act="0" /&gt;</code><span>Saved/WebGL product anatomy for the cover.</span></p>
  <div class="gallery-body"><div class="gallery-scene"><Scene :act="0"/></div></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>PreferenceDefinition</h2>
  <p class="gallery-usage"><code>&lt;PreferenceDefinition /&gt;</code><span>Routes explicit edits and unspecified regions.</span></p>
  <div class="gallery-body"><PreferenceDefinition/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>ExpertStudy</h2>
  <p class="gallery-usage"><code>&lt;ExpertStudy /&gt;</code><span>FiveK original, expert targets, and edit diagnostics.</span></p>
  <div class="gallery-body"><ExpertStudy/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>EditEncoding</h2>
  <p class="gallery-usage"><code>&lt;EditEncoding /&gt;</code><span>I, G, G−I → 9 channels → pooled edit descriptor.</span></p>
  <div class="gallery-body"><EditEncoding/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>HistoryRetrieval · history</h2>
  <p class="gallery-usage"><code>&lt;HistoryRetrieval mode="history" /&gt;</code><span>Complete edit descriptor → simulated history pool.</span></p>
  <div class="gallery-body"><HistoryRetrieval mode="history"/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>PartialEdit</h2>
  <p class="gallery-usage"><code>&lt;PartialEdit /&gt;</code><span>Partial edit clue and explicit-region mask.</span></p>
  <div class="gallery-body"><PartialEdit/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>HistoryRetrieval · query</h2>
  <p class="gallery-usage"><code>&lt;HistoryRetrieval mode="query" /&gt;</code><span>Partial edit clue → three reference pairs.</span></p>
  <div class="gallery-body"><HistoryRetrieval mode="query"/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>DecisionMechanism</h2>
  <p class="gallery-usage"><code>&lt;DecisionMechanism /&gt;</code><span>Q/K logits, reference gate, and spatial value mix.</span></p>
  <div class="gallery-body"><DecisionMechanism/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>RenderMechanism</h2>
  <p class="gallery-usage"><code>&lt;RenderMechanism /&gt;</code><span>71-channel concat → residual CNN → masked output → loss.</span></p>
  <div class="gallery-body"><RenderMechanism/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>AttentionWorkbench</h2>
  <p class="gallery-usage"><code>&lt;AttentionWorkbench sample="flowers" /&gt;</code><span>Recorded attention overlays and reference shares.</span></p>
  <div class="gallery-body"><AttentionWorkbench/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>BoundaryWorkbench</h2>
  <p class="gallery-usage"><code>&lt;BoundaryWorkbench /&gt;</code><span>Old grouping path and zero-control replay.</span></p>
  <div class="gallery-body"><BoundaryWorkbench/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>Workbench</h2>
  <p class="gallery-usage"><code>&lt;Workbench /&gt;</code><span>Saved checkpoint controls and measured output.</span></p>
  <div class="gallery-body"><Workbench/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>ChangeMaps</h2>
  <p class="gallery-usage"><code>&lt;ChangeMaps /&gt;</code><span>Recorded brightness, saturation, and warmth maps.</span></p>
  <div class="gallery-body"><ChangeMaps/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>ImageComparison</h2>
  <p class="gallery-usage"><code>&lt;ImageComparison :before="before" :after="after" /&gt;</code><span>Keyboard/pointer reveal between two images.</span></p>
  <div class="gallery-body"><ImageComparison before="/assets/evidence/flowers-original.png" after="/assets/evidence/flowers-ref1-expert.png" label="expert retouch vs original"/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>EvidencePlate</h2>
  <p class="gallery-usage"><code>&lt;EvidencePlate sample="flowers" /&gt;</code><span>Original, model output, target, PSNR, and SSIM.</span></p>
  <div class="gallery-body"><EvidencePlate/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>MetricChart</h2>
  <p class="gallery-usage"><code>&lt;MetricChart /&gt;</code><span>Archived comparison table with protocol boundary.</span></p>
  <div class="gallery-body"><MetricChart/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>MetricBars</h2>
  <p class="gallery-usage"><code>&lt;MetricBars /&gt;</code><span>Report-level PSNR comparisons.</span></p>
  <div class="gallery-body"><MetricBars/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>MetricEvidenceCard</h2>
  <p class="gallery-usage"><code>&lt;MetricEvidenceCard /&gt;</code><span>Report values kept separate by dataset and phase.</span></p>
  <div class="gallery-body"><MetricEvidenceCard/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>ResultsGallery</h2>
  <p class="gallery-usage"><code>&lt;ResultsGallery /&gt;</code><span>Recorded Flowers, Dog, and Books examples.</span></p>
  <div class="gallery-body"><ResultsGallery/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>HistoryDependence</h2>
  <p class="gallery-usage"><code>&lt;HistoryDependence /&gt;</code><span>Current limitation: preference remains in history.</span></p>
  <div class="gallery-body"><HistoryDependence/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>AchievementSummary</h2>
  <p class="gallery-usage"><code>&lt;AchievementSummary /&gt;</code><span>Three current achievements as one visual.</span></p>
  <div class="gallery-body"><AchievementSummary/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>AblationExperiment</h2>
  <p class="gallery-usage"><code>&lt;AblationExperiment /&gt;</code><span>Current writeup ablations: 27.2 / 22.1 / 24.5 / 23.1 dB.</span></p>
  <div class="gallery-body"><AblationExperiment/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>AblationBars</h2>
  <p class="gallery-usage"><code>&lt;AblationBars /&gt;</code><span>Run-level ablation slot; unknown values remain blank.</span></p>
  <div class="gallery-body"><AblationBars/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>PreferenceMemory · compress</h2>
  <p class="gallery-usage"><code>&lt;PreferenceMemory mode="compress" /&gt;</code><span>Future K×D latent memory construction.</span></p>
  <div class="gallery-body"><PreferenceMemory mode="compress"/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>PreferenceMemory · query</h2>
  <p class="gallery-usage"><code>&lt;PreferenceMemory mode="query" /&gt;</code><span>Future query × preference-memory path.</span></p>
  <div class="gallery-body"><PreferenceMemory mode="query"/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>ArchFlow</h2>
  <p class="gallery-usage"><code>&lt;ArchFlow /&gt;</code><span>Current phase-2 conditional multimodal pipeline.</span></p>
  <div class="gallery-body"><ArchFlow/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>DirectionMagnitudeGrid</h2>
  <p class="gallery-usage"><code>&lt;DirectionMagnitudeGrid /&gt;</code><span>Direction as style; magnitude as edit strength.</span></p>
  <div class="gallery-body"><DirectionMagnitudeGrid/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>EvolutionTimeline</h2>
  <p class="gallery-usage"><code>&lt;EvolutionTimeline /&gt;</code><span>Architecture evolution with current flow5 stage.</span></p>
  <div class="gallery-body"><EvolutionTimeline/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>LearningMechanism</h2>
  <p class="gallery-usage"><code>&lt;LearningMechanism /&gt;</code><span>Tensor shapes and dynamic grouping refresh.</span></p>
  <div class="gallery-body"><LearningMechanism/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>MotivationStat</h2>
  <p class="gallery-usage"><code>&lt;MotivationStat /&gt;</code><span>Report motivation: image similarity ≈30% top-1.</span></p>
  <div class="gallery-body"><MotivationStat/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>ReconstructionStrip</h2>
  <p class="gallery-usage"><code>&lt;ReconstructionStrip /&gt;</code><span>Phase-1 reconstruction slot and PSNR counter.</span></p>
  <div class="gallery-body"><ReconstructionStrip/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>NextStepMechanism</h2>
  <p class="gallery-usage"><code>&lt;NextStepMechanism /&gt;</code><span>Future text-guided partial-edit schematic.</span></p>
  <div class="gallery-body"><NextStepMechanism/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>FlowSamplingWorkbench</h2>
  <p class="gallery-usage"><code>&lt;FlowSamplingWorkbench :samples="256" /&gt;</code><span>Conditional flow: training z↔u and inference samples.</span></p>
  <div class="gallery-body"><FlowSamplingWorkbench :samples="256"/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>TransformerConditionWorkbench</h2>
  <p class="gallery-usage"><code>&lt;TransformerConditionWorkbench :layers="4" /&gt;</code><span>Current image + history → condition vector c.</span></p>
  <div class="gallery-body"><TransformerConditionWorkbench :layers="4"/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>CandidateClusterWorkbench</h2>
  <p class="gallery-usage"><code>&lt;CandidateClusterWorkbench :clusters="5" /&gt;</code><span>MC samples → clusters → Top-K representatives.</span></p>
  <div class="gallery-body"><CandidateClusterWorkbench :clusters="5"/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>LUTBasisAssembly</h2>
  <p class="gallery-usage"><code>&lt;LUTBasisAssembly :basis-count="8" /&gt;</code><span>z → coefficients → learnable LUT basis mixture.</span></p>
  <div class="gallery-body"><LUTBasisAssembly :basis-count="8"/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>PlaybackControls</h2>
  <p class="gallery-usage"><code>&lt;PlaybackControls :stage="2" :total="5" /&gt;</code><span>Manual previous/next plus timed playback controls.</span></p>
  <div class="gallery-body"><PlaybackControls :stage="2" :total="5" :playing="true" :reduced="false"/></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>Counter</h2>
  <p class="gallery-usage"><code>&lt;Counter :value="27.2" suffix=" dB" /&gt;</code><span>Animated numeric evidence primitive.</span></p>
  <div class="gallery-body"><div class="gallery-primitive"><Counter :value="27.2" :decimals="1" suffix=" dB"/></div></div>
</section>

---

<section class="show-slide gallery-slide">
  <h2>Terminal</h2>
  <p class="gallery-usage"><code>&lt;Terminal :lines="lines" /&gt;</code><span>Compact request/output trace for a live demo.</span></p>
  <div class="gallery-body"><Terminal title="REQUEST TRACE" :lines="['query=0001A', 'history=16', 'candidates=3', 'render=ready']"/></div>
</section>
