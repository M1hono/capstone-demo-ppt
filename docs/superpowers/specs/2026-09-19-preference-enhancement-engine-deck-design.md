# Reference-Guided Retouching · v20 design contract

Updated: 2026-09-20. The current deck has 15 pages: an independent cover followed by the 14 sections of the supplied manuscript. This section supersedes earlier scope and page-number records below.

## Content and appearance

All section titles use the manuscript wording verbatim. Do not shorten titles, rewrite the research arguments or replace the achievements with an ablation-only page. The achievements section must retain clearer personalization, dynamic FiveK reconstruction and quantitative performance, alongside the three reported ablations. Body arguments and playback captions are extracted from the manuscript. Code-derived dimensions are auxiliary technical evidence.

Use the approved neutral colours, thin rules and real FiveK specimens. No eyebrow labels, decorative corner labels or cover formula banner. The cover contains the project title, 3D anatomy and identity. The objective section is separate and uses a dedicated region diagram, not the cover image. Page numbers are centred at the bottom.

## Current sequence

1. Cover: Reference-Guided Retouching.
2. Current Research Objective and Definition of User Preference.
3. Reconstruction of the FiveK Dataset.
4. Stage One: Encoding Complete Editing Information.
5. Stage Two: Dynamic Construction of Simulated User History.
6. Stage Three: Constructing Partial Edits to Simulate Explicit User Requirements.
7. Stage Four: Retrieving Historical Preference Using the Partial Edit.
8. Stage Five: Cross-Attention-Based Transfer of Historical Editing Information.
9. Stage Six: Spatial Reconstruction and Final Image Generation.
10. Current Quantitative Results.
11. Main Achievements at the Current Stage.
12. Current Limitation.
13. Future Work: Latent Memory Slots for Implicit User Modeling.
14. Future Preference-Memory Query Process.
15. Final Research Hypotheses.

## Purpose-built components

`PreferenceDefinition` illustrates explicit instructions taking priority and historical behavior completing unspecified regions. `AchievementSummary` uses three compact diagrams for personalization, reconstructed data and quantitative performance. `AblationExperiment` is a simple static four-row comparison on the right; do not restore the rejected complex animated comparison there. `HistoryDependence` animates partial edit → historical-image search → reference selection → cross-attention, showing that preference is still carried by image pairs. `PreferenceMemory` remains future work. All diagrams are symbolic where measured tensors are unavailable.

## Evidence boundaries

The N→20→3 history construction is from the current manuscript. Archived revision 3c1dadc provides the shown encoder, attention and renderer dimensions but retrieves top-3 directly; this distinction stays in notes. Current values are 27.2 dB / 0.90, with ablations 22.1, 24.5 and 23.1 dB. Run configuration and checkpoint are unarchived. Never attach old predictions or defaults to these values. The rectangle composite is illustrative (~24.9%); training uses semantic regions covering approximately 40%. Preference-memory slots and attention diagrams do not contain measured values. No new experiment is proposed beyond the manuscript hypotheses.

## Playback and verification

Animated pages: 2, 4, 5, 6, 7, 8, 9, 11, 12, 13 and 14. Each supports previous/next, pause, continue, replay and reduced motion. Effects settle within 260 ms. Cue spacing is narration timing, not inference latency. Verify all fifteen pages, exact titles, all three achievements and four PSNR values, unresolved components, text collisions, footer clearance, image loading and scaled exports. Preserve backups and earlier deliverables.

---

# Archived v17 design contract

Date: 2026-09-20

Status: v17 is an eight-page technical walkthrough with redundant cover copy removed. It keeps source-verified tensor flow, official original images and recorded attention evidence; removes the independent output gallery from the core; and uses concise operation-focused copy. Text-guided partial edits appear only in Next. Workbench evidence expansion awaits the team leader’s clarification.

Deliverable: Slidev browser presentation, PPTX with embedded mechanism films, static PDF and a separate evidence companion.

## Agreed purpose and visual direction

Explain the inputs, tensor transformations, reference decisions and training objective to a technical audience. The user approved the existing anatomy, neutral engineering visuals and explanatory motion, then requested concise, rigorous technical language and removal of the independent output gallery. Real FiveK data and recorded diagnostics remain central. Further Workbench evidence is pending the user’s discussion with the team leader; no replacement experiment or metric is assumed.

The same flower specimen connects expert renditions, paired-edit encoding, recorded attention and measured outputs. Three.js provides a conceptual input → edit pairs → cross-attention → CNN → output cutaway on the cover. Detailed evidence pages inherit those coordinates in the footer and use the full available area for images and data.

No eyebrows, particles, neon, decorative widgets, generic card walls, generated experimental images or visible source-file paths. English on the slides; implementation/provenance details stay in presenter notes and the evidence workspace. No changes to the source repositories, local branches or README files.

## Current 8-page sequence

| Page | Topic | Evidence or interaction |
|---:|---|---|
| 1 | Reference-Guided Retouching | Conceptual anatomy and technical walkthrough identity. |
| 2 | Dynamic grouping from paired edits. | Shared edit encoder → mean pooling → Euclidean top-3; one group simulates a user. |
| 3 | FiveK: one original, five expert targets. | Real FiveK 0412 input and expert renditions A–E. |
| 4 | Regional reference selection and transfer. | Hard reference choice and soft spatial correspondence, with tensor dimensions. |
| 5 | Different regions select different references. | Recorded flower/dog reference choices and attention links; run unarchived. |
| 6 | Residual enhancement and training. | RGB plus edit features, bounded residual, full-image supervision and shared-encoder feedback. |
| 7 | Component ablations. | Original 17 September chart: full 26.70, random grouping 21.90, equal weights 25.40, CNN fusion 24.50 dB. |
| 8 | Next: text-guided partial edits. | Partial edit → retrieve similar edits → complete unspecified regions; labelled future schematic. |

The current core excludes the control demo. The evidence companion contains six printable pages: FiveK data, three full recorded panels, original comparison chart and historical architecture diagram.

## Evidence contract

### Official data and archived control executions

The flower scene is `a0412-_DGW6297`, visually matched against the official FiveK gallery. The original DNG and all five expert TIFFs were acquired from MIT. Expert images are real targets, not generated variants. The project's current preprocessing was reproduced: camera white balance for DNG, 8-bit RGB, Pillow TIFF conversion, max side 500 and 256-square calculation. No additional ICC conversion was applied. Standardising the ProPhoto TIFF and DNG colour treatment remains a reproduction consideration.

The exact Gen 1 network, reference adapter and checkpoint were read from revision `575cf72`. Strict CPU loading and four finite-output inference runs were completed. Their input shape is [1,3,256,256] and condition shape [1,4,256,256]. The retained Workbench component replays those saved outputs and metrics; it performs no browser inference. Since v13 this standalone replay is outside the core deck and current companion. Its component, measurements, outputs and earlier evidence PDFs remain archived.

Zero-control mean absolute edit is 0.027538985 on [0,1]. A residual network does not guarantee identity under zero conditioning. The Expert D reference trial uses the same image as an oracle reference, with adapter strength 0.7; it is not an unrelated-image transfer or held-out quality test. Full Qwen, Mask2Former and API execution were not performed here.

### Current source contract

Research revision `767cae8` encodes [original, expert, expert−original] as nine channels. The pooled edit descriptor has 64 dimensions. Euclidean top-3 retrieval excludes records sharing the query original. Candidate embeddings refresh each training chunk. Default input 256×256 gives 64×64 encoded features and a 32×32 Q/K scoring grid, with attention projection dimension 128.

Absolute scaled QK logits score each reference. A hard argmax chooses the reference per query region; softmax spatial correspondence operates within each reference/head. Value features retain their original encoded resolution; attention is lifted and renormalised. The renderer concatenates RGB and 64 edit features and predicts `clamp(I + 0.25*tanh(CNN(I,F)), 0,1)`. Default supervision is RGB L1 plus 0.001 mean absolute residual, with SSIM loss disabled.

This is supervised learning with discrete refreshed retrieval, not a reinforcement-learning objective. Query expert information is excluded from generation but still enters retrieval upstream. A persistent user-history store and deployment-safe query-only retrieval are unimplemented. Current defaults are train originals 1–400, validation 401–500 and downloader through 800. These defaults cannot be assigned retrospectively to recorded results without their run configuration.

### Recorded research results

| Sample | PSNR | SSIM | Query-region reference shares |
|---|---:|---:|---|
| Flowers | 26.496 | 0.7949 | 51.17%, 48.83%, 0% |
| Dog | 32.761 | 0.9531 | 0%, 34.38%, 65.62% |
| Books | 27.242 | 0.8946 | 45.61%, 51.95%, 2.44% |

Metrics are transcribed from supplied panels, not recalculated from JPEG crops. Reference percentages count query-region choices; they are not global mixing weights or confidence. Matching colours/IDs identify connected groups of strong attention edges; overlays are not hard selection masks. These diagnostics motivate a correspondence hypothesis and do not establish semantics or causality.

The original weights and raw tensors for these Gen 3 panels are unavailable. No new Gen 3 inference, synthetic attention or invented training trajectory is presented. Recorded output-change crops preserve their original limits: brightness ±0.0748, saturation ±1 and warmth proxy ±2. These are post-hoc diagnostics, not RGBC conditioning channels.

The earlier 26.6 dB / 0.88 SSIM milestone and research 26.70 dB comparison have separate scopes. External methods in the supplied comparison chart remain in the attachment because matched protocols are not documented. No statistical-significance claim is made from a single chart.

## Components and motion

| Component | Purpose |
|---|---|
| Scene / engine | Shared neutral Three.js anatomy with stored per-view PNG fallbacks. |
| ExpertStudy | Real A–E rendition switch and derived signed change maps. |
| Workbench | Measured controls, exact saved CNN outputs and run inspector. |
| AttentionWorkbench | Reference-pair switch, unchanged diagnostic crops and selection shares. |
| ChangeMaps | Recorded brightness/saturation/warmth crops and explicit scales. |
| ResultsGallery / EvidencePlate | Three sample triptychs and their recorded metrics. |
| MetricChart | Comparable within-project ablations with a zero-based PSNR axis. |

Transitions explain changed state: 260 ms ease-out part movement and 180–220 ms control feedback. No continuous animation loop remains after a transition. Reduced motion jumps to terminal state. Browser controls are keyboard-operable and text labels accompany colour. Prebaked snapshots supply static exports and a fallback when WebGL is unavailable.

## Validation and handover

`qa-show.mjs` checks all eight slides at 1280×720 for geometry overflow, loaded images, style application and browser errors, then verifies the expert and attention switches. Browser inspection additionally covers live 3D, reduced motion and the stored fallback. The PDF and PPTX each contain eight pages; the PPTX has eight notes and five embedded films on pages 2, 4, 5, 6 and 8. Package integrity and all slide media are checked. The six-page companion retains full figures for zooming and follow-up review.

Use the local presentation at `http://localhost:18335/`, overview at `/overview/` and full evidence at `/evidence.html`. Static outputs are under `exports/`; detailed hashes and source revisions remain under `evidence/`. The cover avoids the unresolved TH18_04 / TU18_04 group-code discrepancy while retaining team names.

Historical initial verification (before subsequent revisions): 13/13 slides clear in the production build, four evidence interactions passed, no missing images or browser errors. Live 3D transitions settle; reduced-motion and no-WebGL fallback passed. PPTX contains 13 slide images at 2560×1440 and 13 speaker-note pages. The core PDF has 13 pages and the evidence PDF six pages. Source worktrees remain clean.

## v5 text refinement · 2026-09-20

The user approved the visual and evidence quality and identified text clutter as the remaining issue. The revision keeps the 13-page sequence, evidence assets, measured values, Workbench behaviour and 3D model. Headlines are shorter; repeated explanations and status captions are consolidated; detailed qualifications remain in the full speaker notes. The visible reference-selection denominator, recorded-result scope, heatmap scales and query-target dependency remain explicit.

Typography now uses consistent roles for page headings, lead text, body, labels, captions and footer metadata. Body labels have clearer spacing; the run inspector gives the measured values more emphasis. Visible word count falls from 1,456 to 1,073 (26.3%), measured on the default state of each slide. All 13 original speaker-note blocks are retained, with three additional clarifications.

Current deliverables are `exports/Preference-Enhancement-Engine-v5.{pdf,pptx}` and `exports/Preference-Enhancement-Engine-v5-web.zip`. The unchanged evidence companion remains v4. The prior v4 exports and a source snapshot in `exports/revisions/v4/` support comparison. Copy counts are in `exports/copy-qa-v5.json`; package checks are in `exports/package-qa-v5.json`.

## v6 mechanism playback · 2026-09-20

User request: retain the approved evidence and concise presentation, but make mechanisms and results visibly unfold. Implementation follows the existing approved design. No new research execution or changed source repository is required.

1. Add shared slide-entry playback, replay, finish and reduced-motion handling. Verify that leaving cancels pending cues and headless exports settle on the complete evidence.
2. Animate pages 4, 6, 7, 8 and 10. The RGBC planes assemble into a conditioning packet; real paired images stack into nine channels; source-defined retrieval stages appear in order; recorded attention groups reveal over the query; true saved outputs wipe over originals. Verify intermediate geometry and evidence switches.
3. Export terminal-state PDF and a PPTX containing embedded H.264 clips of the five sequences, with static covers and all thirteen original speaker notes. Package the interactive web build and a shareable motion walkthrough. Verify codecs, relationships, slide counts, notes and playback assets.

Motion rules: movements take 180–260 ms, separated by deliberate explanation holds. The 3.5–4.5 second sequences do not depict inference duration or training convergence. One major focus changes at a time. Schematics use no numeric activations, fake learned descriptors or invented spatial connections. The panel-level bracket refers to the original matching colour/ID annotations; it is not a pixel-level attention trace. All metrics stay at their actual values. No perpetual loops. User-triggered controls respond immediately, and "Show all" jumps directly to the evidence.

The output comparison supports direct image dragging and a keyboard-operable native range input. A replay button is sufficient visible instruction; technical provenance stays in the existing notes. Source backup before this revision: `exports/revisions/v5/source.zip`.

## v7 core logic · 2026-09-20

The user's supplied dyNAmic Transfer Touch diagram is the narrative reference. Animation now explains retrieval, regional decisions, transferred edits and the learning loop. The Gen 1 controls on page 4 remain an interactive checkpoint comparison; the RGBC assembly sequence has been removed.

| Page | Question answered by the animation |
|---:|---|
| 6 | How does paired editing history become a useful reference? Encode the edit, exclude the same original, retrieve the nearest descriptors, then refresh after learning. |
| 7 | What does one query region decide? Follow a symbolic attention row through reference scoring, argmax selection and spatially weighted editing features. Click either decision node to hold its explanation. |
| 8 | What historical edit is being inspected? Reveal the actual recorded correspondence groups, then wipe between the historical original and expert edit. Switch between dog and flower evidence and their references. |
| 9 | How do these decisions affect training? Pass the local editing field to the residual renderer, add its correction to the original, compare with the target and trace the loss back to the network and next retrieval refresh. |
| 10 | What does the recorded result look like? Compare original, output and target across three actual samples with their unchanged metrics. |

The supplied diagram depicts an earlier design: two independent attention branches, a 128-dimensional retrieval descriptor and temperature-based global reference weights. Source revision 767cae8 instead uses a 64-dimensional pooled edit descriptor, shared cross-attention logits for regional scoring and spatial transfer, and a hard reference choice per query region. The softmax is across positions within a reference, not across whole-image reference scores. Current Q/K scoring is 32×32, while value features retain 64×64 resolution. These distinctions are explicit in the speaker notes and the diagram on page 7.

The attention matrix contains symbols and a highlighted query row only. Its values, measured scores and selection masks are not reconstructed. Retrieval is illustrated with the recorded flower reference set; candidate distances and that historical search execution are unavailable. Actual reference-original/expert wipes retain their recorded overlays. The output movies replay saved results and do not show new Gen 3 inference, learning curves or inference latency.

Five source-and-evidence sequences replace the previous motion priority. Each operator transition takes 220–260 ms with readable holds. At the user's request, cue times were shortened by about 25%: the core mechanism sequences now take 4.8–5.8 seconds, and the results reveal takes 2.9 seconds. Recorded evidence holds are 800 ms. Playback settles after one pass, can be replayed or skipped, and finishes immediately under reduced motion. The architecture revision backup is `exports/revisions/v6/source.zip`; the timing backup is `exports/revisions/v7-before-speed/source.zip`.

Manual playback controls on slides 6–10 let the presenter move every explanation backward and forward, with its diagram and a visible step count. Taking a step pauses the automatic timeline; Continue schedules the remaining steps using their original cue intervals, while Replay restarts the sequence. Arrow keys operate within the focused controls, and slide navigation remains available outside them. Boundary buttons disable at the first and last step. Reduced motion retains manual access; static exports hide these web controls. The existing PPTX films remain recorded playback. The control revision backup is `exports/revisions/v7-before-manual-playback/source.zip`.

Production validation: 13 pages have no geometry overflow, missing HTML/SVG images or browser errors. Motion QA passes replay, stage ordering, reference and sample switches, direct/keyboard image comparison, paused decision inspection, slide-leave cancellation, reentry and reduced motion. Five H.264 films are embedded in the PPTX, with all thirteen speaker-note pages. The standalone motion walkthrough and interactive web build are also exported as v7; the unchanged evidence appendix remains v4.

Native v7 PowerPoint playback could not be completed: the application returned an AppleEvent timeout and then -9074 while opening. The previously verified v6 file also failed to open in that application state. No forced quit or file save was performed. The timing revision regenerated the PPTX and web package; browser, motion, package and full H.264 decoding checks passed again, including all five 1920×1080 films. The walkthrough is now 58.3 seconds, down from 77.4 seconds (24.6% shorter). Native playback was not retried for this timing revision. This native validation limit is recorded in the package report; do not report v7 as successfully played in PowerPoint.


## v8 scope freeze · 2026-09-20

The user approved presenting the existing full-edit approach and moving the partial-edit proposal to the roadmap. Slides 6–9 explain the 767cae8 training baseline with reference edit pairs. The query’s full target guides retrieval; the generator uses the original and retrieved references. Slide 12 bounds that dependency to this version. Recorded metrics retain their original scope.

Slide 13 presents the partial-edit prototype as the next phase: preserve requested edits, complete other regions from one user’s history, and test that history’s contribution. The 19 September stable commit includes an exploratory partial-query test; 3c1dadc on 20 September integrates partial-edit conditioning into training and generation. Code availability does not establish a deployed language planner or long-term preference learning.

Full backups precede this revision. Layouts, images, numerical evidence and playback timings are preserved. The web deck, v8 PDF/PPTX, five newly recorded films and v5 evidence companion carry the same scope; checks are under exports. Native PowerPoint playback was not repeated.


## v9 narrative correction · 2026-09-20

The user found v8 too superficial and identified the cover as still suggesting a completed preference system. The cover is now Reference Guided Retouching. Slides 3–5 identify the existing explicit-control editor as separate from the reference research model. Slide 6 starts from a full expert target, slide 7 shows an RGB-only query encoder, and slide 9 explains whole-image supervision. Their captions were rewritten, while playback timing and interactions remain unchanged.

Slides 8 and 10 visibly state that the recorded experiment versions are unarchived. They are not labelled verified runs of the old baseline. The new partial-edit and user-history proposal appears only on slide 13. Existing photographs, measurements, layouts, colours and Three.js geometry remain; only the 3D text label changes to CONTROLS. v9 artifacts use the Reference-Guided-Retouching filename prefix.


## v10 closing mechanisms · 2026-09-20

The user requests the final two slides to match the explanatory richness of slides 6–9. Preserve the approved visual system and 13-slide structure. Page 12 becomes a two-mode experimental bench: target removal exposes an unvalidated deployment dependency; a saved zero-control output and amplified pixel difference expose the lack of an identity guarantee. Page 13 becomes an animated partial-edit composition and a controlled history experiment. A lifted image layer explains the simulated edit, retrieval and attention paths converge on a renderer, a direct copy path preserves specified pixels, and hatching identifies the region still requiring prediction. A second mode holds the clue fixed across same-user, other-user and no-history comparison conditions, with all scores left unmeasured.

Both components use the existing playback contract, six manually reachable steps, 220–260 ms local transitions, reduced motion and static terminal states. Inputs are real saved images; derived masks and composites are explicitly illustrative. Reference photos have no attributed user identities. No new inference, attention weights, preference scores or performance effects are simulated. The no-history comparison requires a separate ablation, since the current model rejects zero reference pairs.

Implementation and verification: generate deterministic assets and check masked pixels; inspect both modes and all steps in the browser; run existing full-deck and expanded motion checks; export 13-page PDF, seven-film PPTX and web package; verify media and publish through the existing Pages workflow. The complete v9 backup is in client-deployment-backups/2026-09-20_111348-before-v10-motion (58,249 files verified). Earlier design and exports remain available.


V10 delivery verification: the complete 13-page browser check and seven-scene motion check passed, including both closing modes, manual hold/resume, keyboard navigation and reduced motion. GitHub Actions run 35481491722 deployed commit 05eb2fd successfully; both live closing pages, asset requests and hash-route refresh were verified. Pages 1-11 and the research worktrees were preserved. PDF has 13 pages; PPTX has 13 notes and seven embedded 1080p H.264 films, with package and full decode verification. The six-page evidence companion remains v6. The recorder now detects a temporary calibration frame to trim the opening accurately and holds stage zero briefly; the calibration frame is absent from exported films. Native PowerPoint playback was not repeated.


## v11 team-confirmed content boundary

The user limits the narrative to the leader's two descriptions. Old: one shared network dynamically groups editing examples; each group simulates a user; within-group cross-attention guides regional changes. New: a user specifies partial edits, the system searches history for similar modifications, and cross-attention completes unspecified regions. The old full-edit encoding is verified in 767cae8, and partial-query conditioning appears in 3c1dadc. The grouping-as-user interpretation is the team-confirmed task setting.

Slide 6 restores that setting, slides 7 and 9 connect regional editing and shared-network training, and slide 13 removes the added history-control study. Slide 12 now presents the actual old grouping input and the saved zero-control observation, without unsupported deployment-failure conclusions or extra experimental commitments. The user requested the current source be uploaded for leader review before further discussion; commit 69ac948 was pushed to the existing main branch. V10 source snapshots and all v10 exports remain intact.


## v12 shorter core deck

Remove the original slide 4 and its speaker note, without adding a replacement. The final v11-to-v12 sequence is 1, 6, 2, 7, 8, 9, 10, 11, 3, 5, 12, 13. Grouping establishes the task before FiveK explains its paired inputs, and the two existing-demo pages follow the research evidence. The footer, note references, browser checks and film exporter follow that mapping. Existing geometry, imagery, timings and components are preserved. The evidence companion adds direct links to the four saved CPU outputs. V11 source/context archives and hashes of prior exports are retained under `exports/revisions/v11/`.

Validation and delivery results are recorded in the current handoff and v12 export checks.


## v13 research-only scope

The latest team message removes demo-related content and reserves text editing together with partial editing for Next. Remove the two control-demo pages and the mixed grouping/zero-control observation page. The remaining nine slides keep the approved mechanism visuals, evidence and interactions. The cover retains its geometry while relabelling the conceptual anatomy to match reference research. Next adds the planned text-to-partial-edit step; it still shows only an illustrative FiveK composition.

Six films now belong to pages 2, 4, 5, 6, 7 and 9. The current evidence companion removes the control checkpoint table and demo integration statements. V11 source and exports, plus the intermediate 12-slide source/context snapshot, remain available. The intermediate v12 film export was stopped before completion; v13 is the intended delivery.


## v14 original-image group

The grouping page displays the original-image group, before any regional attention explanation. Replace its right-hand diagnostic crops and expert partners with clean FiveK originals 0406, 0426 and 0490 decoded from official DNG files. Label the group and every image. Keep the original-plus-full-edit descriptor input and the group-as-simulated-user setting. The grouping captions no longer introduce attention. Source URLs, SHA-256 hashes and conversion details are recorded in `evidence/group-originals.json`; this asset substitution does not rerun retrieval. Preserve v13 before making the correction.


V14 delivery verified: nine core slides, nine PPTX speaker notes and six embedded 1920×1080 H.264 films. The grouping film is newly recorded; the other five match v13 byte for byte. PDF has nine pages; the evidence companion has six. All media decode, ZIP/XML structure, per-slide video references and preserved-export hashes pass. GitHub Actions 35484561399 deployed commit 6697602 successfully, including the complete nine-slide/six-sequence check. Live source-image hashes, grouping labels, manual steps, continuation, hash-route refresh, Next scope, all nine pages and the evidence download were verified. Native PowerPoint playback was not repeated.


## v15 tensor data flow

The team requested explicit data changes through each mechanism. Use the presentation baseline 767cae8, not the earlier architecture sketch's 128-dimensional grouping descriptor. Slide labels omit the batch axis and use the default 256×256 model input, independent of the preview asset resolution.

- Page 2: RGB original, expert and difference each have three channels. Concatenate to [9,256,256], encode to [64,64,64], then spatial mean to [64]. Compare the query with N candidate descriptors [N,64] using Euclidean distance, exclude candidates sharing its original, and return the three nearest reference pairs. The displayed group remains labelled original images.
- Page 4: Q/K encode at [64,64,64], resize to 32×32, flatten to [1024,64] and project to [1024,128]. Absolute scaled logits are [1024,1024]; max over reference positions yields three score rows [3,1024]. Argmax returns one reference index per query position. V uses the full 64×64 grid, [4096,128]; lifted, renormalised attention is [1024,4096]. Context is [1024,128], restored to 64×64 and projected to 64 channels before the local reference gate.
- Page 6: F [64,64,64] upsamples to [64,256,256]. Concatenate RGB to [67,256,256]; CNN predicts a three-channel correction, bounded by 0.25×tanh. Add and clamp to output [3,256,256], compare against the full target and backpropagate a scalar loss.

`evidence/tensor-flow.json` records a forward shape check of the baseline model with synthetic zero inputs and untrained weights. It verifies dimensions only; it is not trained inference, retrieval evidence or a quality measurement. Existing recorded results retain their unarchived experiment-version labels. Numeric distances, attention values and new scores are not introduced.

V14 source/context snapshots and hashes of all four existing exports are preserved in `exports/revisions/v14/`. Re-record films 2, 4 and 6; reuse unchanged films 5, 7 and 9. The nine-page sequence and evidence companion v8 remain unchanged. Keep forward/backward, pause, continuation, replay and reduced-motion behaviour. Verify all stages, including the grouping caption clearance above the footer, before publishing v15.


V15 delivery verified: nine slides and all six playback sequences pass, with all 18 stages on the three changed pages clear of the footer. Commit ea58847 deployed successfully through Actions 35485642557; live tensor labels, image requests, previous/next, resume/pause, refresh and the Next scope passed. The source repositories remain clean.

Final exports contain nine PDF pages, nine PPTX covers and notes, and six embedded 1080p H.264 films. Three changed films were re-recorded; the other three are byte-identical to v14. All films decode and match their embedded media. All covers match their PPTX images. Continuous screenshots of scaled pages reproduced misplaced SVG glyphs; the exporter now renders each cover in an isolated Chromium browser at 2560×1440 with deviceScaleFactor 1. The attention and Next covers exactly match independently inspected correct renders. PDF and web output are unaffected. Native PowerPoint playback was not repeated. V14 export hashes still match; evidence companion v8 is retained. Results: `exports/package-qa-v15.json`, `exports/live-v15.json`, `exports/v15-SHA256SUMS`.


## v16 technical audience and evidence wording

The user approved the fifth-page correction, questioned the standalone output page and specified a technical audience. Remove the old page 7 from the core, retain its component and evidence assets, and renumber ablations/Next to 7/8. Preserve the approved visual composition and mechanism timing. Titles and subtitles identify operations, inputs and outputs; the cover identifies a technical walkthrough.

Page 5 describes recorded regional reference choices, without claiming the figure establishes cross-semantic understanding. The percentage denominator is all query positions. Red overlays show linked regions rather than edit masks. Five stage-specific captions stay visible and support manual previous/next navigation. Further Workbench content awaits the user’s discussion with the team leader; neither new data nor a new experimental protocol is introduced.

Preserve v15 source/context and hashes of its four exports under `exports/revisions/v15/`. V16 has eight slides, eight notes and five newly recorded films because all page-count footers change. The evidence companion remains v8. Browser checks cover eight pages and all five playback sequences. Delivery and live verification are recorded in the handoff and V16 package report.


## v17 remove redundant cover text

The user identifies the cover subtitle and small labels as a source of the commercial tone. Remove the cover subtitle, Technical walkthrough tag, caption below the anatomy, and repeated cover footer scope. Retain the title, anatomy, course/client/tutor metadata and team names. Do not replace the removed subtitle with technical keyword lists. The eight-slide content and five mechanism sequences remain as v16. Preserve all v16 exports and source snapshots before this edit.

The five embedded films are copied byte-for-byte from v16; only static covers, PDF, PPTX and web package need regeneration. Final validation is recorded in exports/package-qa-v17.json and exports/live-v17.json. Native PowerPoint playback is not repeated.

V17 delivery verified: commit a25f705 deployed through Actions 35489663642 with eight-page and five-sequence checks. Live cover removal, loaded image, page count and refresh passed. PDF and PPTX each have eight pages; all eight notes, covers and five embedded films match. Films and combined MP4 are byte-identical to the decoded v16 media. V15/V16 export hashes are unchanged. Native PowerPoint playback was not repeated.
