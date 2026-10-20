<script setup>
const tests=[
  {id:'01',question:'Can the edit be represented?',method:'Encoder–decoder reconstruction',measure:'PSNR · SSIM · latent continuity',detail:'Establish the capacity of the 3D retouching space.',points:[38,75,63,104,130]},
  {id:'02',question:'Does prediction generalise?',method:'FiveK and PPSD evaluation',measure:'Fidelity · held-out expert / users',detail:'Evaluate personalization with fixed inference weights.',points:[42,65,87,93,123]},
  {id:'03',question:'What drives the prediction?',method:'Input ablations and Top-K coverage',measure:'PSNR changes · candidate coverage',detail:'Replace image or history; compare Top-1 with Best-of-K.',points:[110,70,42,80,130]},
  {id:'04',question:'What does inference cost?',method:'Controlled GPU benchmark',measure:'Latency · throughput · memory',detail:'Measure the candidate-generation stages and scope.',points:[30,48,66,98,128]}
]
</script>
<template>
  <div class="test-plan">
    <div class="test-stages">
      <article v-for="(test,i) in tests" :key="test.id"><span class="test-number">{{test.id}}</span><h2>{{test.question}}</h2>
        <svg viewBox="0 0 220 105" role="img" :aria-label="test.method+' schematic'">
          <g v-if="i===0"><rect x="8" y="15" width="52" height="70" fill="var(--surface)" stroke="var(--line)"/><path d="M75 49 H105 M95 42 L106 49 L95 56" stroke="var(--muted)" fill="none"/><rect v-for="j in 3" :key="j" :x="116+j*14" y="30" width="9" height="40" fill="var(--blue)"/><text x="35" y="59" text-anchor="middle">O,T</text><text x="150" y="94" text-anchor="middle">z ∈ ℝ³</text></g>
          <g v-else-if="i===1"><circle v-for="j in 4" :key="j" :cx="20+j*30" cy="34" r="11" fill="var(--pale)" stroke="var(--blue)"/><path d="M20 60 H155" stroke="var(--line)"/><circle cx="187" cy="34" r="11" fill="var(--blue)"/><text x="80" y="92" text-anchor="middle">Train</text><text x="187" y="92" text-anchor="middle">Held out</text></g>
          <g v-else-if="i===2"><line x1="20" y1="82" x2="201" y2="82" stroke="var(--line)"/><rect x="32" y="16" width="32" height="66" fill="var(--blue)"/><rect x="92" y="31" width="32" height="51" fill="var(--teal)"/><rect x="152" y="54" width="32" height="28" fill="var(--ink)"/></g>
          <g v-else><circle cx="87" cy="49" r="33" fill="none" stroke="var(--blue)" stroke-width="2"/><path d="M87 23 V49 L109 58 M78 6 H96" fill="none" stroke="var(--blue)" stroke-width="2"/><text x="161" y="56" text-anchor="middle">ms</text></g>
        </svg>
        <h3>{{test.method}}</h3><p>{{test.detail}}</p><div class="test-measure">{{test.measure}}</div>
      </article>
    </div>
    <div class="test-boundary"><h3>Keep prediction separate from scoring</h3><p>Query targets are excluded at inference. Record training splits, history selection and checkpoints. Ablations establish input dependence; Best-of-K establishes coverage.</p></div>
    <p class="source-caption">Evaluation plan from report §3.1. Diagrams above describe test categories; bars are schematic, not measured results.</p>
  </div>
</template>
<style scoped>
.test-plan{display:flex;flex-direction:column;gap:20px}.test-stages{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;flex:1}.test-stages article{display:flex;flex-direction:column;gap:14px;border-right:1px solid var(--line);padding-right:24px}.test-stages article:last-child{border:0;padding:0}.test-number{font-size:20px;color:var(--blue)}.test-stages h2{font-size:27px;line-height:1.22;letter-spacing:-.4px;margin:0;min-height:66px}.test-stages svg{width:100%;height:105px}.test-stages svg text{font:17px 'IBM Plex Sans',sans-serif;fill:var(--ink)}.test-stages h3{font-size:19px;margin:0;min-height:49px}.test-stages p{font-size:17px;color:var(--muted);line-height:1.4}.test-measure{font-size:15px;color:var(--blue);margin-top:auto;padding-top:10px;border-top:1px solid var(--line)}.test-boundary{display:grid;grid-template-columns:300px 1fr;gap:24px;border-top:1px solid var(--ink);padding-top:18px}.test-boundary h3{font-size:21px;margin:0}.test-boundary p{font-size:18px;color:var(--muted)}
</style>
