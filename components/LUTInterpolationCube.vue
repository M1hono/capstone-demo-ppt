<script setup>
import { computed, ref } from 'vue'
const r = ref(.35), g = ref(.6), b = ref(.45), mode = ref('identity')
const corners = computed(() => Array.from({length:8},(_,i) => {const rgb = [i & 1,(i >> 1) & 1,(i >> 2) & 1];const weight = rgb.reduce((p,v,k) => p * (v ? [r.value,g.value,b.value][k] : 1 - [r.value,g.value,b.value][k]),1);const out = mode.value === 'identity' ? rgb : [Math.min(1,rgb[0] * .85 + .15),rgb[1] * .9,rgb[2] * .7];return {rgb,weight,out}}))
const result = computed(() => [0,1,2].map(k => corners.value.reduce((s,c) => s + c.weight * c.out[k],0)))
const colour = rgb => `rgb(${rgb.map(v => Math.round(v * 255)).join(',')})`
const project = p => [242 + (p[0] - p[2]) * 140,315 - p[1] * 195 - (p[0] + p[2]) * 60]
const edges = Array.from({length:8},(_,i) => [1,2,4].filter(bit => !(i & bit)).map(bit => [i,i | bit])).flat()
</script>
<template>
  <div class="stack visual-lab">
    <div class="row spread"><div class="tabs"><button :aria-pressed="mode === 'identity'" @click.stop="mode = 'identity'">Identity LUT</button><button :aria-pressed="mode === 'toy'" @click.stop="mode = 'toy'">Toy warm LUT</button></div><span class="small muted">Exact trilinear interpolation · eight corners of one cell</span></div>
    <div class="lut-lab grow">
      <svg viewBox="0 0 490 365" role="img" aria-label="RGB cube with interpolated point">
        <line v-for="([i,j],k) in edges" :key="k" :x1="project(corners[i].rgb)[0]" :y1="project(corners[i].rgb)[1]" :x2="project(corners[j].rgb)[0]" :y2="project(corners[j].rgb)[1]" stroke="#8794a5" stroke-width="2"/>
        <g v-for="(c,i) in corners" :key="i"><circle :cx="project(c.rgb)[0]" :cy="project(c.rgb)[1]" :r="8 + c.weight * 16" :fill="colour(c.out)" stroke="#18202b" stroke-width="1.5"/><text :x="project(c.rgb)[0] + 13" :y="project(c.rgb)[1] + 19" style="font-size:13px" fill="#56616e">{{ c.rgb.join('') }}</text></g>
        <circle :cx="project([r,g,b])[0]" :cy="project([r,g,b])[1]" r="10" :fill="colour(result)" stroke="#0f62fe" stroke-width="3"/>
        <text x="242" y="359" text-anchor="middle" class="svg-label">Corner size reflects interpolation weight</text>
      </svg>
      <div class="col interpolation-panel">
        <label v-for="(name,i) in ['Red','Green','Blue']" :key="name" class="channel-control"><span>{{ name }}</span><input v-if="i === 0" v-model.number="r" type="range" min="0" max="1" step=".01" aria-label="LUT red"/><input v-else-if="i === 1" v-model.number="g" type="range" min="0" max="1" step=".01" aria-label="LUT green"/><input v-else v-model.number="b" type="range" min="0" max="1" step=".01" aria-label="LUT blue"/><b>{{ [r,g,b][i].toFixed(2) }}</b></label>
        <div class="weight-strip"><div v-for="(c,i) in corners" :key="i"><span>{{ c.rgb.join('') }}</span><i :style="{height:`${5 + c.weight * 100}px`,background:colour(c.out)}"></i><b>{{ c.weight.toFixed(3) }}</b></div></div>
        <div class="row spread"><div class="colour-chip" :style="{background:colour([r,g,b])}"></div><span class="arrow">→</span><div class="colour-chip" :style="{background:colour(result)}"></div><p class="small">Output RGB<br/><b data-lut-output>{{ result.map(v => v.toFixed(3)).join(' · ') }}</b><br/>Σ weights = {{ corners.reduce((s,c) => s + c.weight,0).toFixed(3) }}</p></div>
      </div>
    </div>
    <p class="source-caption">One colour interpolation cell, not the eight learned basis LUTs. The toy LUT is defined here for explanation and is not a trained decoder or a model prediction.</p>
  </div>
</template>
<style scoped>.lut-lab{display:grid;grid-template-columns:.95fr 1.2fr;gap:40px;min-height:0}.lut-lab>svg{width:100%;height:100%}.interpolation-panel{justify-content:center;gap:16px}.channel-control{display:grid;grid-template-columns:50px 1fr 42px;gap:16px;align-items:center;font-size:15px}.weight-strip{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;height:128px}.weight-strip>div{display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:6px;font-size:11px}.weight-strip i{width:32px;min-height:5px;border:1px solid #aab5c2}.weight-strip b{font-weight:400}.colour-chip{width:85px;height:58px;border:1px solid #aab5c2}</style>
