---
theme: default
title: Personalized Image Retouching — Final Presentation
info: Final research presentation for SOFT3888, with interactive mechanisms and supporting evidence.
author: SOFT3888_TH18_04
aspectRatio: 16/9
canvasWidth: 1280
colorSchema: light
lang: en
fonts:
  sans: IBM Plex Sans
  mono: Menlo
  provider: none
transition: fade
wakeLock: false
drawings:
  enabled: false
exportFilename: Personalized-Image-Retouching-Final
---

<WorkbenchPage :number="1">
  <ProjectCover />
</WorkbenchPage>

<!--
Project identity, client, tutor and group members.
Evidence: supplied report Cover. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="2">
  <ResearchProblem />
</WorkbenchPage>

<!--
Compare real expert edits and explain the preference-modelling hypothesis.
Evidence: supplied report 1.1, 2.2. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="3">
  <ResearchOutcomes />
</WorkbenchPage>

<!--
Connect the distribution objective to the reported outcomes.
Evidence: supplied report 1.2–1.3, 3.5. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="4">
  <ArchitectureEvolution />
</WorkbenchPage>

<!--
Step through five research approaches and their limitations.
Evidence: supplied report 1.4, 2.7. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="5">
  <RequirementMap />
</WorkbenchPage>

<!--
Trace FR-01, FR-02 and FR-03 to model behaviour.
Evidence: supplied report 2.1. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="6">
  <QualityObjectives />
</WorkbenchPage>

<!--
Connect quality objectives to measured evidence and its limits.
Evidence: supplied report 3.7.1. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="7">
  <UserAcceptance />
</WorkbenchPage>

<!--
Map each user need to an observable acceptance criterion.
Evidence: supplied report 2.1. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="8">
  <DesignTradeoffs />
</WorkbenchPage>

<!--
Explain the capacity, conditioning and sampling trade-offs.
Evidence: supplied report 2.6. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="9">
  <SystemArchitecture />
</WorkbenchPage>

<!--
Follow the two-stage training and inference paths.
Evidence: supplied report 2.2–2.5. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="10">
  <TestingStrategy />
</WorkbenchPage>

<!--
Connect each research question to its evaluation method.
Evidence: supplied report 3.1. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="11">
  <DatasetProtocol />
</WorkbenchPage>

<!--
Inspect the reported image/user splits and history boundary.
Evidence: supplied report 3.2. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="12">
  <EvaluationMetrics />
</WorkbenchPage>

<!--
Separate image fidelity, oracle coverage and preference validity.
Evidence: supplied report 3.1–3.3. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="13">
  <QuantitativeResults />
</WorkbenchPage>

<!--
Inspect every per-expert PSNR/SSIM value and the PPSD result.
Evidence: supplied report 3.5. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="14">
  <BaselineComparison />
</WorkbenchPage>

<!--
Compare external results with visible protocol differences.
Evidence: supplied report 3.5. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="15">
  <CandidateCoverage />
</WorkbenchPage>

<!--
Distinguish deployable ranking from offline Best-of-K coverage.
Evidence: supplied report 3.5. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="16">
  <ConditioningAblation mode="history" />
</WorkbenchPage>

<!--
Hold the query fixed and replace the user history.
Evidence: supplied report 3.6. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="17">
  <ConditioningAblation mode="image" />
</WorkbenchPage>

<!--
Replace the conditioner image while rendering the real query.
Evidence: supplied report 3.6. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="18">
  <RuntimeBenchmark />
</WorkbenchPage>

<!--
Compare all six benchmark configurations and measurement limits.
Evidence: supplied report 3.7. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="19">
  <TechnologyChoices />
</WorkbenchPage>

<!--
Explain the role of each model and engineering technology.
Evidence: supplied report 2.6, 3.7. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="20">
  <FeedbackCycle />
</WorkbenchPage>

<!--
Trace the reported proposal–review–implementation loop.
Evidence: supplied report 4.6 (client feedback). Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="21">
  <ContributionEvidence />
</WorkbenchPage>

<!--
Inspect supported contributions and individual evidence links.
Evidence: supplied report 4.1–4.3, Table 6. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="22">
  <ChallengeResolution />
</WorkbenchPage>

<!--
Connect observed problems to changes and remaining gaps.
Evidence: supplied report 4.4–4.5, 5.2. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="23">
  <AchievementLessons />
</WorkbenchPage>

<!--
Separate research outcomes from presentation-engineering contributions.
Evidence: supplied report 5.1–5.2. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="24">
  <ImprovementPriorities />
</WorkbenchPage>

<!--
Order next work by research impact and verification method.
Evidence: supplied report 5.3–5.4. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="25">
  <ResearchConclusion />
</WorkbenchPage>

<!--
Summarise the architecture, evidence and outstanding validation.
Evidence: supplied report 5.5. Consult the evidence index for protocol limits and missing final-run assets.
-->

---

<WorkbenchPage :number="26" title="Retouching encoder" component="RetouchingEncoder" section="2.3" usage="Inspect O, T and T − O as the nine-channel input.">
  <RetouchingEncoder />
</WorkbenchPage>

---

<WorkbenchPage :number="27" title="Eight-basis LUT decoder" component="LUTAssembly" section="2.3; audited phase1/model.py" usage="Follow coefficients, basis combination and image-wide rendering.">
  <LUTAssembly />
</WorkbenchPage>

---

<WorkbenchPage :number="28" title="Transformer-based condition generation" component="TransformerConditioning" section="2.4; source depth discrepancy" usage="Inspect the 17 tokens, paired positions and query condition.">
  <TransformerConditioning />
</WorkbenchPage>

---

<WorkbenchPage :number="29" title="Conditional normalizing flow" component="ConditionalFlow" section="2.5" usage="Switch between likelihood training and inverse sampling.">
  <ConditionalFlow />
</WorkbenchPage>

---

<WorkbenchPage :number="30" title="Retouching vectors and directional density" component="PreferenceDistribution" section="2.2, 2.5; illustrative geometry" usage="Rotate full vectors and their unit-direction projection.">
  <PreferenceDistribution />
</WorkbenchPage>

---

<WorkbenchPage :number="31" title="Candidate selection: report and source" component="CandidateSelection" section="2.5; audited mc_centers" usage="Compare the reported ranking with the saved implementation.">
  <CandidateSelection />
</WorkbenchPage>

---

<WorkbenchPage :number="32" title="Direction and magnitude in retouching space" component="LatentGeometry" section="2.3, 3.4" usage="Explore the geometric interpretation without inventing rendered outputs.">
  <LatentGeometry />
</WorkbenchPage>

---

<WorkbenchPage :number="33" title="Reconstruction and decoder robustness" component="ReconstructionEvidence" section="3.4, 3.7.5" usage="Separate aggregate reconstruction, example images and a small noise diagnostic.">
  <ReconstructionEvidence />
</WorkbenchPage>

---

<WorkbenchPage :number="34" title="Historical pairing and input sensitivity" component="PairingDiagnostic" section="3.6; archived phase2_diag.txt" usage="Inspect literal diagnostic values and the limits of history dependence.">
  <PairingDiagnostic />
</WorkbenchPage>

---

<WorkbenchPage :number="35" title="Evidence discrepancies and provenance" component="EvidenceAudit" section="Report / source audit" usage="Review unresolved claims and the presentation decision for each.">
  <EvidenceAudit />
</WorkbenchPage>

---

<WorkbenchPage :number="36" title="Visual evidence atlas" component="VisualEvidenceGallery" section="Figure and candidate evidence" usage="Inspect six populated report and diagnostic figures; open or download each source asset.">
  <VisualEvidenceGallery />
</WorkbenchPage>

---

<WorkbenchPage :number="37" title="Five expert edits of one scene" component="ExpertStyleGallery" section="2.2; real FiveK references" usage="Compare the original with five recorded expert edits.">
  <ExpertStyleGallery />
</WorkbenchPage>

---

<WorkbenchPage :number="38" title="Twenty historical editing pairs" component="HistoryPairExplorer" section="2.4; real FiveK references" usage="Browse complete original/edit pairs and their scene identities.">
  <HistoryPairExplorer />
</WorkbenchPage>

---

<WorkbenchPage :number="39" title="Colour and luma distributions" component="ColorHistogramCompare" section="Derived display-image measurements" usage="Compare measured RGB and encoded-luma histograms.">
  <ColorHistogramCompare />
</WorkbenchPage>

---

<WorkbenchPage :number="40" title="Pixel tone correspondence" component="ToneMappingScatter" section="Derived display-image measurements" usage="Inspect the joint distribution of original and reference luma.">
  <ToneMappingScatter />
</WorkbenchPage>

---

<WorkbenchPage :number="41" title="Expert colour shifts" component="ColorChannelShift" section="Derived display-image measurements" usage="Compare signed channel changes for the same scene.">
  <ColorChannelShift />
</WorkbenchPage>

---

<WorkbenchPage :number="42" title="Where do edits change the image?" component="SpatialDifferenceMap" section="Derived display-image measurements" usage="Explore per-pixel differences and thresholded regions.">
  <SpatialDifferenceMap />
</WorkbenchPage>

---

<WorkbenchPage :number="43" title="Synchronous image detail inspection" component="LocalEditLoupe" section="Real FiveK references" usage="Move one crop across the original and aligned expert edit.">
  <LocalEditLoupe />
</WorkbenchPage>

---

<WorkbenchPage :number="44" title="Pairwise reference differences" component="ExpertDifferenceMatrix" section="Derived display-image measurements" usage="Select any image pair and inspect its measured RGB difference.">
  <ExpertDifferenceMatrix />
</WorkbenchPage>

---

<WorkbenchPage :number="45" title="Sampling a user history" component="HistorySamplingWorkbench" section="2.4; protocol illustration" usage="Resample eight complete pairs from twenty real references.">
  <HistorySamplingWorkbench />
</WorkbenchPage>

---

<WorkbenchPage :number="46" title="Does historical pairing matter?" component="TokenPairingWorkbench" section="3.6; archived pairing diagnostic" usage="Shift image/edit associations and inspect recorded sensitivity.">
  <TokenPairingWorkbench />
</WorkbenchPage>

---

<WorkbenchPage :number="47" title="Training, inference and scoring boundaries" component="ProtocolLeakageMap" section="3.2; reported evaluation protocol" usage="Trace which images enter each stage of the reported protocol.">
  <ProtocolLeakageMap />
</WorkbenchPage>

---

<WorkbenchPage :number="48" title="A continuous multimodal preference landscape" component="ProbabilityLandscape" section="2.2; illustrative probability model" usage="Change mixture mass and compare a density with its marginal.">
  <ProbabilityLandscape />
</WorkbenchPage>

---

<WorkbenchPage :number="49" title="Invertibility and local volume change" component="GaussianTransportGrid" section="2.5; analytic flow illustration" usage="Deform coordinates and inspect the exact local Jacobian.">
  <GaussianTransportGrid />
</WorkbenchPage>

---

<WorkbenchPage :number="50" title="What more samples reveal" component="MonteCarloConvergence" section="2.5; illustrative Monte Carlo sampling" usage="Compare nested samples with the exact synthetic density.">
  <MonteCarloConvergence />
</WorkbenchPage>

---

<WorkbenchPage :number="51" title="Inside a LUT interpolation cell" component="LUTInterpolationCube" section="2.3; exact interpolation illustration" usage="Change RGB coordinates and inspect all eight corner weights.">
  <LUTInterpolationCube />
</WorkbenchPage>

---

<WorkbenchPage :number="52" title="Inference performance across configurations" component="LatencyThroughputMap" section="3.7; recorded GPU benchmark" usage="Compare latency, throughput and allocated memory together.">
  <LatencyThroughputMap />
</WorkbenchPage>
