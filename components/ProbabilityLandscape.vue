<script setup>
import { computed, ref } from 'vue'
const weight = ref(65)
const gaussian = (x,y,mx,my,s) => Math.exp(-((x - mx) ** 2 + (y - my) ** 2) / (2 * s * s)) / (2 * Math.PI * s * s)
const density = (x,y) => weight.value / 100 * gaussian(x,y,-1.25,.7,.55) + (1 - weight.value / 100) * gaussian(x,y,1.15,-.55,.8)
const cells = computed(() => Array.from({length:1800},(_,i) => {const x = i % 50, y = Math.floor(i / 50);return {x,y,p:density(-3 + (x + .5) * 6 / 50,2.4 - (y + .5) * 4.8 / 36)}}))
const marginal = computed(() => Array.from({length:151},(_,i) => {const x = -3 + i / 150 * 6;const f = (m,s) => Math.exp(-.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));return `${770 + i / 150 * 340},${300 - (weight.value / 100 * f(-1.25,.55) + (1 - weight.value / 100) * f(1.15,.8)) * 300}`}).join(' '))
</script>
<template>
  <div class="stack visual-lab">
    <div class="row spread"><label class="row small">Left-mode probability <input v-model.number="weight" type="range" min="5" max="95" aria-label="Left-mode probability"/><b>{{ weight }}%</b></label><span class="small muted">Illustrative two-dimensional mixture · not learned flow samples</span></div>
    <svg viewBox="0 0 1180 410" class="grow" role="img" aria-label="Two-mode probability landscape and marginal density">
      <g v-for="c in cells" :key="`${c.x}-${c.y}`"><rect :x="75 + c.x * 11" :y="22 + c.y * 9" width="11.2" height="9.2" fill="#0f62fe" :style="{opacity:.025 + .975 * Math.min(c.p / .53,1)}"/></g>
      <line x1="75" x2="625" y1="346" y2="346" stroke="#56616e"/><line x1="75" x2="75" y1="22" y2="346" stroke="#56616e"/>
      <g v-for="v in [-3,-2,-1,0,1,2,3]" :key="v"><text :x="75 + (v + 3) / 6 * 550" y="371" text-anchor="middle" class="svg-label">{{ v }}</text></g>
      <g v-for="v in [-2,0,2]" :key="v"><text x="60" :y="189 - v * 67.5" text-anchor="end" class="svg-label">{{ v }}</text></g>
      <text x="350" y="402" text-anchor="middle" class="svg-label">Illustrative adjustment axis z₁</text><text transform="translate(24 190) rotate(-90)" text-anchor="middle" class="svg-label">Illustrative adjustment axis z₂</text>
      <text x="770" y="55" style="font-size:24px" fill="#18202b">Marginal density p(z₁)</text>
      <text x="770" y="90" class="svg-label">Integrate over z₂</text>
      <line x1="770" x2="1110" y1="300" y2="300" stroke="#56616e"/><polyline :points="marginal" fill="none" stroke="#0f62fe" stroke-width="3"/>
      <text x="770" y="325" class="svg-label">−3</text><text x="940" y="325" class="svg-label">0</text><text x="1110" y="325" text-anchor="end" class="svg-label">3</text>
      <text x="770" y="378" class="svg-value">Mass: {{ weight }}% / {{ 100 - weight }}%</text>
    </svg>
    <p class="source-caption">A density can support distinct editing regions. The slider changes mixture mass; peak height also depends on spread. This illustration explains the hypothesis, not verified user preferences.</p>
  </div>
</template>
<style scoped>.visual-lab input{width:260px}.visual-lab>svg{width:100%;min-height:0}</style>
