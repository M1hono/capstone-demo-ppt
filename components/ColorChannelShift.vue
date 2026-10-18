<script setup>
import { ref } from 'vue'
import d from '../data/image-diagnostics.json'
const base = import.meta.env.BASE_URL, selected = ref('C')
const colours = ['#b82742','#007d79','#0043ce']
const x = value => 395 + value / 80 * 270
</script>
<template>
  <div class="stack visual-lab">
    <div class="row spread"><p class="readout">Mean signed RGB change from the same original</p><div class="tabs"><button v-for="e in ['A','B','C','D','E']" :key="e" :aria-pressed="selected === e" @click.stop="selected = e">Expert {{ e }}</button></div></div>
    <div class="image-analysis grow">
      <div class="image-rail"><figure class="photo-frame"><img class="photo" :src="base + 'assets/fivek/original.png'" alt="Channel-shift original"/><figcaption>Original</figcaption></figure><figure class="photo-frame"><img class="photo" :src="`${base}assets/fivek/expert-${selected}.png`" :alt="`Channel-shift expert ${selected}`"/><figcaption>Expert {{ selected }} reference</figcaption></figure></div>
      <svg viewBox="0 0 760 390" role="img" aria-label="Mean RGB shifts for five expert edits">
        <g v-for="tick in [-80,-40,0,40,80]" :key="tick"><line :x1="x(tick)" :x2="x(tick)" y1="22" y2="330" :stroke="tick === 0 ? '#18202b' : '#d5dce4'"/><text :x="x(tick)" y="358" text-anchor="middle" class="svg-label">{{ tick > 0 ? '+' : '' }}{{ tick }}</text></g>
        <g v-for="(e,i) in ['A','B','C','D','E']" :key="e" :style="{opacity:e === selected ? 1 : .7}"><text x="20" :y="52 + i * 62" class="svg-value">Expert {{ e }}</text><g v-for="(v,c) in d.experts[e].meanShift" :key="c"><line :x1="x(0)" :x2="x(v)" :y1="34 + i * 62 + c * 15" :y2="34 + i * 62 + c * 15" :stroke="colours[c]" stroke-width="3"/><circle :cx="x(v)" :cy="34 + i * 62 + c * 15" r="5" :fill="colours[c]"/><text :x="x(v) + (v < 0 ? -11 : 11)" :text-anchor="v < 0 ? 'end' : 'start'" :y="39 + i * 62 + c * 15" :fill="colours[c]" style="font-size:13px">{{ ['R','G','B'][c] }} {{ v.toFixed(1) }}</text></g></g>
        <text x="395" y="387" text-anchor="middle" class="svg-label">Mean reference − original · encoded 8-bit levels</text>
      </svg>
    </div>
    <p class="source-caption">Signed averages describe colour shifts in this scene. They are not inferred editing parameters and do not measure preference quality.</p>
  </div>
</template>
