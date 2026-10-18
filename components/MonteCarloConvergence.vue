<script setup>
import { computed, ref } from 'vue'
const count = ref(256)
let state = 1761
const random = () => {state = (1664525 * state + 1013904223) >>> 0; return (state + 1) / 4294967297}
const normal = () => Math.sqrt(-2 * Math.log(random())) * Math.cos(2 * Math.PI * random())
const all = Array.from({length:4096},() => {const left = random() < .65; return {left,x: (left ? -1.15 : 1.2) + normal() * .5,y: (left ? .55 : -.5) + normal() * .6}})
const samples = computed(() => all.slice(0,count.value))
const fraction = computed(() => samples.value.filter(p => p.left).length / count.value)
const bins = computed(() => {const out = Array(32).fill(0);for(const p of samples.value){const i = Math.floor((p.x + 4) / 8 * 32);if(i >= 0 && i < 32)out[i]++}return out})
const pdf = x => {const f = m => Math.exp(-.5 * ((x - m) / .5) ** 2) / (.5 * Math.sqrt(2 * Math.PI));return .65 * f(-1.15) + .35 * f(1.2)}
const curve = Array.from({length:161},(_,i) => `${740 + i / 160 * 385},${310 - pdf(-4 + i / 160 * 8) * 350}`).join(' ')
</script>
<template>
  <div class="stack visual-lab">
    <div class="row spread"><div class="tabs"><button v-for="n in [32,128,256,1024,4096]" :key="n" :aria-pressed="count === n" @click.stop="count = n">{{ n }} samples</button></div><span class="small muted">Fixed seed · nested sample sets · illustrative mixture</span></div>
    <svg viewBox="0 0 1180 395" class="grow" role="img" aria-label="Monte Carlo samples and empirical marginal density">
      <defs><clipPath id="mc-plot"><rect x="60" y="30" width="550" height="310"/></clipPath></defs>
      <rect x="60" y="30" width="550" height="310" fill="#f5f7fa"/>
      <g clip-path="url(#mc-plot)"><circle v-for="(p,i) in samples" :key="i" data-mc-point :cx="335 + p.x * 68.75" :cy="185 - p.y * 51.67" :r="count > 1024 ? 1.5 : 2.5" :fill="p.left ? '#0f62fe' : '#007d79'" :style="{opacity:count > 1024 ? .35 : .65}"/></g>
      <g v-for="v in [-4,-2,0,2,4]" :key="v"><text :x="335 + v * 68.75" y="365" text-anchor="middle" class="svg-label">{{ v }}</text></g>
      <text x="335" y="392" text-anchor="middle" class="svg-label">Illustrative adjustment z₁</text><text x="75" y="54" class="svg-label">z₂</text>
      <text x="740" y="40" style="font-size:22px" fill="#18202b">Empirical marginal</text><text x="740" y="70" class="svg-label">Bars: sample density · line: exact density</text>
      <rect v-for="(n,i) in bins" :key="i" :x="740 + i * 385 / 32" :y="310 - n / count / .25 * 350" :width="385 / 32 - 1" :height="n / count / .25 * 350" fill="#a6c8ff"/>
      <polyline :points="curve" fill="none" stroke="#18202b" stroke-width="2"/>
      <line x1="740" x2="1125" y1="310" y2="310" stroke="#56616e"/>
      <text x="740" y="335" class="svg-label">−4</text><text x="932" y="335" class="svg-label">0</text><text x="1125" y="335" text-anchor="end" class="svg-label">4</text>
      <text x="740" y="382" class="svg-value">Left component: {{ (fraction * 100).toFixed(1) }}% · true mass 65%</text>
    </svg>
    <p class="source-caption">More samples improve statistical approximation on average, not necessarily at every step. Colours identify known synthetic mixture components; this is not a measured convergence result for flow5.</p>
  </div>
</template>
<style scoped>.visual-lab>svg{width:100%;min-height:0}</style>
