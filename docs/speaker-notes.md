# Final presentation speaker notes

Concise delivery text aligned to the supplied script. Only presenter 4 is assigned.

## 1. Personalized Agent-based Image Enhancement

Presenter 1 — unassigned
Hello, everyone. We are Group SOFT3888_TH18_04. Our project is Personalized Agent-based Image Enhancement via User Preference Modeling. We will present our objectives, architecture, evaluation and final outcomes.
Source: report Cover.

## 2. Project background

Presenter 1 — unassigned
Personalized image retouching should reflect individual preferences. Different users may prefer different edits of the same image. We learn from historical original-and-edited pairs and adapt to unseen users without additional training. The supplied image illustrates the problem; it is not a model prediction.
Source: report 1.1.

## 3. Existing methods and our core idea

Presenter 1 — unassigned
AdaInt and RSFNet can require user- or expert-specific training. DiffRetouch and PerTouch may need explicit controls. PieNet summarizes preferences in one vector. Our hypothesis is that more than one edit may be acceptable. We therefore model P(retouching parameters | current image, user history).
Source: report 1.1–2.2.

## 4. Project goals and achievements

Presenter 2 — unassigned
Our three goals are automatic retouching without instructions, adaptation to unseen users without fine-tuning, and multiple editing candidates. We combine a compact retouching space, Transformer conditioning and Conditional Normalizing Flow.
Source: report 1.2–1.3.

## 5. User stories and functional requirements

Presenter 2 — unassigned
FR-01 uses the current image and history for automatic enhancement. FR-02 adapts to unseen users with fixed model weights. FR-03 generates several candidates from a continuous conditional distribution.
Source: report 2.1.

## 6. Acceptance criteria and constraints

Presenter 2 — unassigned
Acceptance checks map to all three requirements: predict without instructions or the query target; adapt using eight historical pairs and no weight update; and generate multiple candidates. Constraints include compute, available history, leakage prevention and global LUT editing.
Source: report 3.3.

## 7. Modelling user preferences

Presenter 3 — unassigned
Early image-similarity retrieval achieved approximately 30% accuracy. Similar images do not reliably identify one unique edit. We instead model a continuous, potentially multimodal density. Its peaks are candidate editing regions; the experiment does not establish that every peak is a true preference.
Source: report 2.2.

## 8. Overall system architecture

Presenter 3 — unassigned
Stage 1 learns a low-dimensional retouching representation from original and expert-edited images. Stage 2 uses the query and user history to predict a distribution over that space. Sampling and the LUT decoder produce alternative edits.
Source: report 2.3–2.6.

## 9. Stage 1 · Retouching encoder and decoder

Presenter 3 — unassigned
The encoder receives the original, target and pixel-wise difference: nine channels in total. It produces a three-dimensional edit vector. The decoder maps this vector to eight coefficients, combines eight learned LUT bases and reconstructs the edit. Target images are used here for Stage 1 training, not as query inputs at inference.
Source: report 2.3.

## 10. Understanding the retouching space

Presenter 4 — Yuchen Deng
The learned retouching space has two properties: continuity and directionality. Similar vectors generally produce similar editing results. The unit direction of z represents adjustment type; its magnitude represents adjustment strength. Increasing magnitude produces progressively stronger edits in this continuous three-dimensional space.
Source: report 3.4.

## 11. Stage 2 · Transformer-based conditioning

Presenter 4 — Yuchen Deng
Stage 2 predicts the editing distribution from the current image and eight historical examples. A shared image encoder extracts image features; Stage 1 provides historical retouching vectors. These tokens enter a two-layer Transformer. The updated current-image representation becomes the condition vector for density estimation.
Source: report 2.4.

## 12. Conditional Flow and candidate generation

Presenter 4 — Yuchen Deng
Conditional Normalizing Flow models the distribution of retouching vectors. Training learns an invertible mapping between retouching space and a Gaussian latent space. At inference, Monte Carlo sampling generates candidate vectors. K-means groups similar samples, and mean probability density ranks the clusters. We obtain multiple representative candidates rather than one deterministic output.
Source: report 2.5.

## 13. Testing strategy and quality assurance

Presenter 5 — unassigned
We test reconstruction, prediction quality, unseen-user generalization, conditioning ablations, candidate coverage and computational cost. These controlled model experiments evaluate the project requirements.
Source: report 3.1–3.3.

## 14. Datasets and evaluation protocol

Presenter 5 — unassigned
We evaluated MIT-Adobe FiveK and PPSD. FiveK contains 5,000 originals and edits from five experts. Experts A–D train the model; Expert E is excluded. PPSD uses 250 training users and 50 unseen validation users. Each prediction uses eight historical examples, without user-specific fine-tuning or access to the current image’s ground-truth edit.
Source: report 3.2.

## 15. Test cases and requirement coverage

Presenter 5 — unassigned
Nine experimental test cases evaluate the functional requirements. For automatic retouching, we measure PSNR and SSIM. For training-free adaptation, we test unseen experts and users. For multimodality, we examine probability distributions and Top-K candidate performance. Wrong conditioning inputs test whether image content and user history meaningfully influence prediction.
Source: report 3.3.3.

## 16. Retouching space reconstruction evaluation

Presenter 6 — unassigned
We first tested whether a three-dimensional retouching space can reconstruct expert edits. Reconstruction PSNR reached 28.5 dB on FiveK and 28.2 dB on PPSD. Changing vector direction and magnitude evaluated continuity. A low-dimensional representation preserves substantial information about global colour and tone adjustments.
Source: report 3.4.

## 17. Quantitative results on FiveK

Presenter 6 — unassigned
FiveK mean Top-1 PSNR reached 23.562 dB. Top-3 and Top-5 results reached 25.191 and 26.214 dB. Expert E, completely excluded from training, reached 23.263 dB Top-1. These results support adaptation to unseen editing preferences without further training. Improved Best-of-K scores indicate better candidate coverage.
Source: report 3.5.1.

## 18. Comparison with existing methods

Presenter 6 — unassigned
We compared with personalized retouching methods including PieNet and RefRetouch. Our model achieved competitive FiveK PSNR with eight historical examples, and approximately 24.5 dB on PPSD. Training configurations, reference counts and evaluation procedures differ, so the comparisons provide context rather than proving superiority under identical conditions.
Source: report 3.5.

## 19. Ablation studies

Presenter 7 — unassigned
The complete model achieved 23.5 dB. Wrong current-image conditioning reduced this to 20.2 dB, and wrong history reduced it to 22.3 dB. Expert-average vectors reached 22.1 dB; the original image scored 18.3 dB. Both conditions contribute, with stronger image dependence in this experiment.
Source: report 3.6.

## 20. Multimodal evaluation and test limitations

Presenter 7 — unassigned
We evaluated multimodality through probability-density visualization and Top-K analysis. The learned conditional distribution generates different candidates, and Best-of-K improves as more candidates are considered. However, ground truth selects the best candidate offline. With usually only one recorded edit per image and user, these experiments cannot establish that every candidate represents a genuine preference.
Source: report 2.5, 3.3, 3.5.

## 21. Discipline knowledge, implementation and tools

Presenter 8 — unassigned
Our project combines convolutional image encoding, learnable LUT reconstruction, Transformer history processing and Conditional Normalizing Flow density modelling. We implemented the system primarily with Python, PyTorch and CUDA. Under the specified GPU benchmark conditions, single-image Monte Carlo inference took approximately 39.7 milliseconds.
Source: report 3.7, 4.1.

## 22. Client feedback and architecture evolution

Presenter 8 — unassigned
We explored semantic controls, dynamic grouping, memory, and similarity retrieval before adopting conditional density modelling. Experiments exposed deterministic retrieval and preference representation limits. Regular client discussions informed priorities; no individual architectural change is attributed to a particular meeting without evidence.
Source: report 2.7, 4.6.

## 23. Project management and collaboration

Presenter 9 — unassigned
Our team used GitHub for version control and collaboration, and Zoom and WeChat for communication. Regular client reviews linked literature, prototypes, experiments and revised priorities. Responsibilities evolved with feasibility and experimental findings.
Source: report 4.1–4.6.

## 24. Individual contributions

Presenter 9 — unassigned
Our team contributed across literature review, neural network development, data preparation, experimental evaluation, software testing, documentation and client communication. Responsibilities followed the needs of each development stage. Members integrated the retouching encoder–decoder, Transformer, Flow and evaluation pipeline. All nine members are summarized here.
Source: report 6, Table 6.

## 25. Reflections, limitations and conclusion

Presenter 9 — unassigned
Our primary contribution is reformulating personalized retouching as conditional probability density modelling rather than single-output prediction. A low-dimensional retouching representation makes continuous density estimation practical. Transformer conditioning and Conditional Normalizing Flow generate multiple candidates for unseen users without additional training. Historical preference modelling remains limited, and the LUT decoder mainly supports global colour and tone adjustments. Thank you for listening.
Source: report 5.1–5.5.
