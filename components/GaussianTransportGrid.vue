<script setup>
import { computed, ref } from 'vue'
const amount = ref(80)
const a = computed(() => .65 * amount.value / 100), b = computed(() => .7 * amount.value / 100)
const transform = (x,y) => [x,Math.exp(a.value * Math.tanh(x)) * y + b.value * Math.sin(x)]
const project = (x,y,offset) => `${offset + 175 + x * 66},${198 - y * 28}`
const grid = (offset,warped) => Array.from({length:18},(_,i) => Array.from({length:49},(_,j) => {const v = -2 + i % 9 * .5, t = -2.4 + j / 48 * 4.8;const [x,y] = i < 9 ? [v,t] : [t,v];const p = warped ? transform(x,y) : [x,y];return project(...p,offset)}).join(' '))
const point = computed(() => transform(1,.5))
const jacobian = computed(() => Math.exp(a.value * Math.tanh(1)))
</script>
<template>
  <div class="stack visual-lab">
    <div class="row spread"><label class="row small">Deformation <input v-model.number="amount" type="range" min="0" max="100" aria-label="Transport deformation"/><b>{{ amount }}%</b></label><span class="small muted">Analytic invertible example · no model weights</span></div>
    <svg viewBox="0 0 1180 390" class="grow" role="img" aria-label="Invertible grid deformation and Jacobian">
      <g v-for="(offset,k) in [25,480]" :key="offset"><text :x="offset + 175" y="27" text-anchor="middle" style="font-size:22px" fill="#18202b">{{ k ? 'Transformed coordinates z' : 'Gaussian coordinates u' }}</text><polyline v-for="(line,i) in grid(offset,!!k)" :key="i" :points="line" fill="none" :stroke="i === 4 || i === 13 ? '#18202b' : k ? '#0f62fe' : '#aab5c2'" :stroke-width="i === 4 || i === 13 ? 2 : 1"/><circle :cx="offset + 175 + (k ? point[0] : 1) * 66" :cy="198 - (k ? point[1] : .5) * 28" r="7" fill="#007d79" stroke="white" stroke-width="2"/><text :x="offset + 175" y="375" text-anchor="middle" class="svg-label">{{ k ? 'Stretch varies with the first coordinate' : 'Uniform coordinate grid' }}</text></g>
      <path d="M405 190 H455 M445 180 L455 190 L445 200" fill="none" stroke="#0f62fe" stroke-width="3"/>
      <text x="925" y="115" class="svg-label">At u = (1, 0.5)</text><text x="925" y="163" style="font-size:38px" fill="#007d79">{{ jacobian.toFixed(3) }}</text><text x="925" y="196" class="svg-label">det Jg &gt; 0</text><text x="925" y="257" class="svg-value">z = ({{ point[0].toFixed(2) }}, {{ point[1].toFixed(2) }})</text><text x="925" y="294" class="svg-label">Local area multiplier</text>
    </svg>
    <p class="formula" style="font-size:18px">z₁ = u₁; z₂ = exp(a tanh u₁) u₂ + b sin u₁; p(z) = p(u) / |det Jg|</p>
    <p class="source-caption">Positive scaling preserves invertibility. The inverse subtracts b sin z₁ and divides by exp(a tanh z₁); it exists at every slider position.</p>
  </div>
</template>
<style scoped>.visual-lab input{width:260px}.visual-lab>svg{width:100%;min-height:0}</style>
