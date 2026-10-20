# Appendix copy-ready text

## A.1 Versioned implementation and delivery evidence

The final presentation is maintained in the `M1hono/capstone-demo-ppt` repository. The published workbench contains 52 English pages covering the report narrative, mechanism explanations, real FiveK references, measured diagnostics and the evidence ledger. The final revision is recorded at [commit 40cef56](https://github.com/M1hono/capstone-demo-ppt/commit/40cef56ca014ffa77c5e4a61db1a0a3eab2c6c2e). The hosted presentation is available at [capstone.mihono.cn](https://capstone.mihono.cn/), and the successful Pages workflow is recorded in [workflow run 39353435520](https://github.com/M1hono/capstone-demo-ppt/actions/runs/39353435520).

The contribution and presentation history is captured in the [commit-history evidence page](https://capstone.mihono.cn/evidence/appendix/commit-history.html). Key source-controlled milestones are the component workbench ([b93dc12](https://github.com/M1hono/capstone-demo-ppt/commit/b93dc1254cc787867559c3f23a3b6fa005953af0)), real FiveK history-pair preparation ([43cb672](https://github.com/M1hono/capstone-demo-ppt/commit/43cb672089b441f66120ef55c15078da18302d3f)), mechanism communication ([ea58847](https://github.com/M1hono/capstone-demo-ppt/commit/ea58847de017b4d532416e056c15fbfba6b5dd73)), browser delivery checks ([db72d88](https://github.com/M1hono/capstone-demo-ppt/commit/db72d886635cff572eb32a091cf7c31195996d54)), and the preserved legacy, intermediate and revision archives ([legacy branch](https://github.com/M1hono/capstone-demo-ppt/tree/archive/legacy-preference-workbench), [Flow5 branch](https://github.com/M1hono/capstone-demo-ppt/tree/archive/flow5-intermediate-workbench), [revision ledger](https://github.com/M1hono/capstone-demo-ppt/tree/archive/revision-ledger)).

## A.2 Screenshot evidence pack

The [appendix evidence pack](https://capstone.mihono.cn/evidence/appendix/) provides the images below. Each image is a populated screenshot; no model-output frame is represented as an empty placeholder.

| Evidence | Caption for the report | Link |
|---|---|---|
| Team map | Team organisation and contributions; XingTang Chen is shown within the balanced nine-member delivery chain. | [Open screenshot](https://capstone.mihono.cn/evidence/appendix/01-team-contributions.png) |
| Transformer conditioning | Interleaved historical image/edit tokens and the query condition. | [Open screenshot](https://capstone.mihono.cn/evidence/appendix/02-transformer-conditioning.png) |
| Conditional flow | Training direction, Gaussian base, retouching space and log-likelihood objective. | [Open screenshot](https://capstone.mihono.cn/evidence/appendix/03-conditional-flow.png) |
| GPU benchmark | Recorded latency, throughput and allocated CUDA memory evidence. | [Open screenshot](https://capstone.mihono.cn/evidence/appendix/04-gpu-benchmark.png) |
| Expert E reference | FiveK original/reference evidence used to explain cross-expert variation. | [Open screenshot](https://capstone.mihono.cn/evidence/appendix/05-expert-e-reference.png) |
| History pair 20 | Attributable original/edit pair used in the history evidence view. | [Open screenshot](https://capstone.mihono.cn/evidence/appendix/06-history-pair-20.png) |
| Inference benchmark | Batch-eight fresh-history result: 48.507 ms/batch, 164.92 images/s and 314.9 MiB. | [Open screenshot](https://capstone.mihono.cn/evidence/appendix/07-inference-performance.png) |
| Evidence index | Source manifest, report figures, missing evidence and discrepancy ledger. | [Open screenshot](https://capstone.mihono.cn/evidence/appendix/08-evidence-index.png) |
| MeetingMinutes gallery | Nine derived evidence views from Weeks 4–10 and two status forms. | [Open screenshot](https://capstone.mihono.cn/evidence/appendix/09-meeting-minutes-index.png) |
| Commit history | Exact presentation/evidence hashes, messages, branches and changed paths. | [Open screenshot](https://capstone.mihono.cn/evidence/appendix/10-commit-history.png) |

## A.3 Contribution records

The [team contribution record](https://github.com/M1hono/capstone-demo-ppt/blob/main/docs/TEAM-CONTRIBUTIONS.md) balances all nine members. The [XingTang Chen evidence portfolio](https://github.com/M1hono/capstone-demo-ppt/blob/main/docs/XINGTANG-CHEN-EVIDENCE.md) records the supported scope: application-layer framing, early prototype and client-demo presentation work, report and presentation support, reusable Slidev/Vue/Three.js evidence components, real FiveK image-pair preparation, provenance records and browser delivery checks. The [MeetingMinutes gallery](https://capstone.mihono.cn/evidence/personal/meeting-minutes/index.html) preserves the source filename and SHA-256 for each derived snapshot.

The contribution claim is presentation and evidence engineering. The model architecture, training process and final held-out experiment bundle remain team research outputs; they are not claimed as an individual checkpoint or training contribution.

## A.4 Reproduction and verification note

The final hosted workflow completed successfully with 52 pages, 100 browser states and zero reported problems. The local verification command was:

```text
npm ci
npm run build
SHOW_BASE=http://127.0.0.1:4173 npm run test:slides
npm run test:data
```

The presentation evidence is report-backed and source-linked. Where final checkpoints, per-query predictions or a complete final-run split bundle are unavailable, the evidence index labels the gap and the appendix does not present an illustrative diagram or archived diagnostic as a verified final model output.
