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
transition: none
wakeLock: false
drawings:
  enabled: false
exportFilename: Personalized-Image-Retouching-Final-25
---

<WorkbenchPage :number="1">
  <ProjectCover />
</WorkbenchPage>

<!--
Presenter 1 — unassigned
Hello, everyone. We are Group SOFT3888_TH18_04. Our project is Personalized Agent-based Image Enhancement via User Preference Modeling. We will present our objectives, architecture, evaluation and final outcomes.
Source: report Cover.
-->

---

<WorkbenchPage :number="2">
  <ResearchProblem />
</WorkbenchPage>

<!--
Presenter 1 — unassigned
Personalized image retouching should reflect individual preferences. Different users may prefer different edits of the same image. We learn from historical original-and-edited pairs and adapt to unseen users without additional training. The supplied image illustrates the problem; it is not a model prediction.
Source: report 1.1.
-->

---

<WorkbenchPage :number="3">
  <ExistingMethods />
</WorkbenchPage>

<!--
Presenter 1 — unassigned
AdaInt and RSFNet can require user- or expert-specific training. DiffRetouch and PerTouch may need explicit controls. PieNet summarizes preferences in one vector. Our hypothesis is that more than one edit may be acceptable. We therefore model P(retouching parameters | current image, user history).
Source: report 1.1–2.2.
-->

---

<WorkbenchPage :number="4">
  <ResearchOutcomes />
</WorkbenchPage>

<!--
Presenter 2 — unassigned
Our three goals are automatic retouching without instructions, adaptation to unseen users without fine-tuning, and multiple editing candidates. We combine a compact retouching space, Transformer conditioning and Conditional Normalizing Flow.
Source: report 1.2–1.3.
-->

---

<WorkbenchPage :number="5">
  <RequirementMap />
</WorkbenchPage>

<!--
Presenter 2 — unassigned
FR-01 uses the current image and history for automatic enhancement. FR-02 adapts to unseen users with fixed model weights. FR-03 generates several candidates from a continuous conditional distribution.
Source: report 2.1.
-->

---

<WorkbenchPage :number="6">
  <UserAcceptance />
</WorkbenchPage>

<!--
Presenter 2 — unassigned
Acceptance checks map to all three requirements: predict without instructions or the query target; adapt using eight historical pairs and no weight update; and generate multiple candidates. Constraints include compute, available history, leakage prevention and global LUT editing.
Source: report 3.3.
-->

---

<WorkbenchPage :number="7">
  <PreferenceDensity />
</WorkbenchPage>

<!--
Presenter 3 — unassigned
Early image-similarity retrieval achieved approximately 30% accuracy. Similar images do not reliably identify one unique edit. We instead model a continuous, potentially multimodal density. Its peaks are candidate editing regions; the experiment does not establish that every peak is a true preference.
Source: report 2.2.
-->

---

<WorkbenchPage :number="8">
  <SystemArchitecture />
</WorkbenchPage>

<!--
Presenter 3 — unassigned
Stage 1 learns a low-dimensional retouching representation from original and expert-edited images. Stage 2 uses the query and user history to predict a distribution over that space. Sampling and the LUT decoder produce alternative edits.
Source: report 2.3–2.6.
-->

---

<WorkbenchPage :number="9">
  <RetouchingEncoder />
</WorkbenchPage>

<!--
Presenter 3 — unassigned
The encoder receives the original, target and pixel-wise difference: nine channels in total. It produces a three-dimensional edit vector. The decoder maps this vector to eight coefficients, combines eight learned LUT bases and reconstructs the edit. Target images are used here for Stage 1 training, not as query inputs at inference.
Source: report 2.3.
-->

---
transition: none
---

<WorkbenchPage :number="10">
  <LatentGeometry />
</WorkbenchPage>

<!--
Presenter 4 — Yuchen Deng
The learned retouching space has two properties: continuity and directionality. Similar vectors generally produce similar editing results. The unit direction of z represents adjustment type; its magnitude represents adjustment strength. Increasing magnitude produces progressively stronger edits in this continuous three-dimensional space.
Source: report 3.4.
-->

---

<WorkbenchPage :number="11">
  <TransformerConditioning />
</WorkbenchPage>

<!--
Presenter 4 — Yuchen Deng
Stage 2 predicts the editing distribution from the current image and eight historical examples. A shared image encoder extracts image features; Stage 1 provides historical retouching vectors. These tokens enter a two-layer Transformer. The updated current-image representation becomes the condition vector for density estimation.
Source: report 2.4.
-->

---

<WorkbenchPage :number="12">
  <ConditionalFlow />
</WorkbenchPage>

<!--
Presenter 4 — Yuchen Deng
Conditional Normalizing Flow models the distribution of retouching vectors. Training learns an invertible mapping between retouching space and a Gaussian latent space. At inference, Monte Carlo sampling generates candidate vectors. K-means groups similar samples, and mean probability density ranks the clusters. We obtain multiple representative candidates rather than one deterministic output.
Source: report 2.5.
-->

---

<WorkbenchPage :number="13">
  <TestingStrategy />
</WorkbenchPage>

<!--
Presenter 5 — unassigned
We test reconstruction, prediction quality, unseen-user generalization, conditioning ablations, candidate coverage and computational cost. These controlled model experiments evaluate the project requirements.
Source: report 3.1–3.3.
-->

---

<WorkbenchPage :number="14">
  <DatasetProtocol />
</WorkbenchPage>

<!--
Presenter 5 — unassigned
We evaluated MIT-Adobe FiveK and PPSD. FiveK contains 5,000 originals and edits from five experts. Experts A–D train the model; Expert E is excluded. PPSD uses 250 training users and 50 unseen validation users. Each prediction uses eight historical examples, without user-specific fine-tuning or access to the current image’s ground-truth edit.
Source: report 3.2.
-->

---

<WorkbenchPage :number="15">
  <RequirementCoverage />
</WorkbenchPage>

<!--
Presenter 5 — unassigned
Nine experimental test cases evaluate the functional requirements. For automatic retouching, we measure PSNR and SSIM. For training-free adaptation, we test unseen experts and users. For multimodality, we examine probability distributions and Top-K candidate performance. Wrong conditioning inputs test whether image content and user history meaningfully influence prediction.
Source: report 3.3.3.
-->

---

<WorkbenchPage :number="16">
  <ReconstructionEvidence />
</WorkbenchPage>

<!--
Presenter 6 — unassigned
We first tested whether a three-dimensional retouching space can reconstruct expert edits. Reconstruction PSNR reached 28.5 dB on FiveK and 28.2 dB on PPSD. Changing vector direction and magnitude evaluated continuity. A low-dimensional representation preserves substantial information about global colour and tone adjustments.
Source: report 3.4.
-->

---

<WorkbenchPage :number="17">
  <QuantitativeResults />
</WorkbenchPage>

<!--
Presenter 6 — unassigned
FiveK mean Top-1 PSNR reached 23.562 dB. Top-3 and Top-5 results reached 25.191 and 26.214 dB. Expert E, completely excluded from training, reached 23.263 dB Top-1. These results support adaptation to unseen editing preferences without further training. Improved Best-of-K scores indicate better candidate coverage.
Source: report 3.5.1.
-->

---
transition: none
---

<WorkbenchPage :number="18">
  <BaselineComparison />
</WorkbenchPage>

<!--
Presenter 6 — unassigned
We compared with personalized retouching methods including PieNet and RefRetouch. Our model achieved competitive FiveK PSNR with eight historical examples, and approximately 24.5 dB on PPSD. Training configurations, reference counts and evaluation procedures differ, so the comparisons provide context rather than proving superiority under identical conditions.
Source: report 3.5.
-->

---
transition: none
---

<WorkbenchPage :number="19">
  <AblationResults />
</WorkbenchPage>

<!--
Presenter 7 — unassigned
The complete model achieved 23.5 dB. Wrong current-image conditioning reduced this to 20.2 dB, and wrong history reduced it to 22.3 dB. Expert-average vectors reached 22.1 dB; the original image scored 18.3 dB. Both conditions contribute, with stronger image dependence in this experiment.
Source: report 3.6.
-->

---

<WorkbenchPage :number="20">
  <CandidateCoverage />
</WorkbenchPage>

<!--
Presenter 7 — unassigned
We evaluated multimodality through probability-density visualization and Top-K analysis. The learned conditional distribution generates different candidates, and Best-of-K improves as more candidates are considered. However, ground truth selects the best candidate offline. With usually only one recorded edit per image and user, these experiments cannot establish that every candidate represents a genuine preference.
Source: report 2.5, 3.3, 3.5.
-->

---

<WorkbenchPage :number="21">
  <TechnologyChoices />
</WorkbenchPage>

<!--
Presenter 8 — unassigned
Our project combines convolutional image encoding, learnable LUT reconstruction, Transformer history processing and Conditional Normalizing Flow density modelling. We implemented the system primarily with Python, PyTorch and CUDA. Under the specified GPU benchmark conditions, single-image Monte Carlo inference took approximately 39.7 milliseconds.
Source: report 3.7, 4.1.
-->

---

<WorkbenchPage :number="22">
  <ArchitectureEvolution />
</WorkbenchPage>

<!--
Presenter 8 — unassigned
We explored semantic controls, dynamic grouping, memory, and similarity retrieval before adopting conditional density modelling. Experiments exposed deterministic retrieval and preference representation limits. Regular client discussions informed priorities; no individual architectural change is attributed to a particular meeting without evidence.
Source: report 2.7, 4.6.
-->

---

<WorkbenchPage :number="23">
  <ProjectCollaboration />
</WorkbenchPage>

<!--
Presenter 9 — unassigned
Our team used GitHub for version control and collaboration, and Zoom and WeChat for communication. Regular client reviews linked literature, prototypes, experiments and revised priorities. Responsibilities evolved with feasibility and experimental findings.
Source: report 4.1–4.6.
-->

---

<WorkbenchPage :number="24">
  <ContributionEvidence />
</WorkbenchPage>

<!--
Presenter 9 — unassigned
Our team contributed across literature review, neural network development, data preparation, experimental evaluation, software testing, documentation and client communication. Responsibilities followed the needs of each development stage. Members integrated the retouching encoder–decoder, Transformer, Flow and evaluation pipeline. All nine members are summarized here.
Source: report 6, Table 6.
-->

---

<WorkbenchPage :number="25">
  <ResearchConclusion />
</WorkbenchPage>

<!--
Presenter 9 — unassigned
Our primary contribution is reformulating personalized retouching as conditional probability density modelling rather than single-output prediction. A low-dimensional retouching representation makes continuous density estimation practical. Transformer conditioning and Conditional Normalizing Flow generate multiple candidates for unseen users without additional training. Historical preference modelling remains limited, and the LUT decoder mainly supports global colour and tone adjustments. Thank you for listening.
Source: report 5.1–5.5.
-->
