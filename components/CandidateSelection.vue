<script setup>
import { computed, ref } from 'vue'
import { useSequence } from '../composables/useSequence'
const source = ref(true)
const sequence = useSequence(['Draw the sample cloud', 'Retain or group samples', 'Rank the representatives', 'Return five candidates'])
const colors = ['#0f62fe', '#007d79', '#6929c4', '#9f4b00', '#9f1853']
// Deterministic teaching geometry, not an inference export or measured cluster sizes.
const centers = computed(() => source.value ? [[-1.6, 0.8], [1.2, 1], [-0.7, -1], [1.8, -0.8]] : [[-1.7, 1], [0.4, 1.4], [1.9, 0.3], [0.6, -1.1], [-1.5, -0.9]])
const samples = computed(() => Array.from({ length:256 }, (_, i) => {
  const group = i % centers.value.length
  const radius = 0.13 + Math.sqrt((i % 64) / 64) * 0.85
  const angle = i * 2.3999632297
  return { x:centers.value[group][0] + Math.cos(angle) * radius, y:centers.value[group][1] + Math.sin(angle) * radius, group, retained:i % 64 < 32 }
}))
const stages = computed(() => source.value ? [
  ['Sample 256 z', 'Invert the flow for each Gaussian sample.'],
  ['Keep 128 by log p', 'Retain half the sample pool before clustering.'],
  ['Cluster into 4 centres', 'The saved rank=size setting orders clusters by membership.'],
  ['Prepend f⁻¹(0; c)', 'The base-zero vector comes first, followed by four cluster centres.']
] : [
  ['Sample z', 'Invert the conditional flow for a Monte Carlo sample pool.'],
  ['K-means into K groups', 'Nearby vectors are grouped in the retouching space.'],
  ['Mean sample log p', 'The report ranks each cluster by its average sample log-density.'],
  ['Select representatives', 'Choose one representative from each ranked cluster.']
])
const px = x => 283 + x * 78
const py = y => 170 - y * 65
</script>
<template>
  <div class="stack candidate-selection">
    <div class="row spread"><div class="tabs"><button :aria-pressed="source" @click.stop="source=true">Audited implementation</button><button :aria-pressed="!source" @click.stop="source=false">Report description</button></div><span class="small muted">Illustrative geometry · no measured cluster sizes</span></div>
    <div class="selection-layout grow">
      <div class="sample-plot">
        <svg viewBox="0 0 580 345" role="img" aria-label="Illustrative sample pool with retained samples, cluster centres and returned candidate vectors">
          <path d="M40 170 H550 M283 22 V318" stroke="var(--line)" fill="none"/>
          <text x="541" y="193" class="diagram-note">z₁</text><text x="294" y="33" class="diagram-note">z₂</text>
          <g v-if="sequence.step.value >= 2">
            <ellipse v-for="(center, i) in centers" :key="i" :cx="px(center[0])" :cy="py(center[1])" rx="64" ry="52" :fill="colors[i]" fill-opacity=".045" :stroke="colors[i]" stroke-opacity=".4" stroke-dasharray="4 4"/>
          </g>
          <circle v-for="(p, i) in samples" :key="i" :cx="px(p.x)" :cy="py(p.y)" :r="sequence.step.value === 3 ? 2 : 3.2" :fill="sequence.step.value >= 2 ? colors[p.group] : 'var(--blue)'" :style="{opacity:source && sequence.step.value > 0 && !p.retained ? 0.08 : sequence.step.value === 3 ? 0.55 : 0.8}" :data-sample-retained="p.retained"/>
          <g v-if="sequence.step.value >= 2">
            <g v-for="(center, i) in centers" :key="i" :transform="`translate(${px(center[0])}, ${py(center[1])})`">
              <path d="M0 -9 L9 0 L0 9 L-9 0 Z" :fill="colors[i]" stroke="white" stroke-width="2"/><text x="14" y="-10" :fill="colors[i]" class="center-label">c{{i + 1}}</text>
            </g>
          </g>
          <g v-if="source && sequence.step.value === 3" class="base-zero"><circle cx="283" cy="170" r="9" fill="var(--ink)" stroke="white" stroke-width="2"/><text x="299" y="163" class="diagram-note">f⁻¹(0; c)</text></g>
          <text x="40" y="339" class="diagram-note">2D projection of a 3D retouching space</text>
        </svg>
      </div>
      <div class="selection-steps">
        <button v-for="(stage, i) in stages" :key="i" :aria-pressed="sequence.step.value === i" class="selection-step" @click.stop="sequence.seek(i)"><span class="step-number">0{{i + 1}}</span><span><strong>{{stage[0]}}</strong><small>{{stage[1]}}</small></span><span v-if="sequence.step.value === i" class="current-mark">←</span></button>
      </div>
    </div>
    <div class="candidate-return" :class="{pending:sequence.step.value < 3}"><span class="small muted">Return to the decoder</span><span v-if="source" class="returned-vector base-vector">1 · f⁻¹(0; c)</span><span v-for="i in (source ? 4 : 5)" :key="i" class="returned-vector" :style="{color:colors[(i - 1) % 5]}">{{source ? i + 1 : i}} · {{source ? 'centre ' + i : 'representative'}}</span><span class="small muted">+ query O₀ → images</span></div>
    <SequenceControls :sequence="sequence"/>
    <p class="source-caption">{{source ? 'MODE_CAND=True · KEEP_FRAC=0.5 · rank=size. Base-zero is not a guaranteed z-density maximum.' : 'The report’s ranking rule differs from the saved implementation. A final run configuration is needed to resolve the difference.'}}</p>
  </div>
</template>
<style scoped>
.candidate-selection{gap:14px}.selection-layout{display:grid;grid-template-columns:1.15fr 1fr;gap:40px;min-height:0}.sample-plot{min-height:0}.sample-plot svg{display:block;width:100%;height:100%;max-height:100%}.sample-plot circle{transition:opacity .4s,r .4s}.center-label{font-size:18px;font-weight:500}.selection-steps{display:flex;flex-direction:column;justify-content:center}.selection-steps .selection-step{display:flex;gap:18px;text-align:left;padding:10px 0;background:none;color:var(--ink);border:0;border-bottom:1px solid var(--line)}.selection-step .step-number{font-size:23px;font-weight:300;color:var(--muted)}.selection-step strong{font-size:19px;display:block;font-weight:500}.selection-step small{font-size:14px;line-height:1.4;display:block;color:var(--muted);margin-top:5px;max-width:370px}.selection-steps .selection-step[aria-pressed=true]{color:var(--blue)}.current-mark{margin-left:auto;font-size:24px;align-self:center}.candidate-return{display:flex;align-items:center;gap:9px;transition:opacity .4s}.candidate-return.pending{opacity:.18}.returned-vector{font-size:14px;padding:11px 13px;border:1px solid var(--line);white-space:nowrap}.base-vector{background:var(--surface)}.candidate-return>span:last-child{margin-left:auto}
</style>
