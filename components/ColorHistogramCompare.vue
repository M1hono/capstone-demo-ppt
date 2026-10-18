<script setup>
import { computed, ref } from 'vue'
import d from '../data/image-diagnostics.json'
const base = import.meta.env.BASE_URL
const expert = ref('C'), channel = ref('Y')
const series = computed(() => [d.images.original.histograms[channel.value], d.images[`expert-${expert.value}`].histograms[channel.value]])
const peak = computed(() => Math.max(...series.value.flat()) * 1.08)
const points = values => values.map((v,i) => `${68 + (i + .5) / 64 * 652},${296 - v / peak.value * 248}`).join(' ')
const colours = {Y:'#0f62fe',R:'#b82742',G:'#007d79',B:'#0043ce'}
</script>
<template>
  <div class="stack visual-lab">
    <div class="row spread"><div class="tabs"><button v-for="c in ['Y','R','G','B']" :key="c" :aria-pressed="channel === c" @click.stop="channel = c">{{ c === 'Y' ? 'Luma' : c }}</button></div><label class="small">Reference <select v-model="expert" aria-label="Histogram expert"><option v-for="c in ['A','B','C','D','E']" :key="c">{{ c }}</option></select></label></div>
    <div class="image-analysis grow">
      <div class="image-rail"><figure class="photo-frame"><img class="photo" :src="base + 'assets/fivek/original.png'" alt="Histogram original" /><figcaption>Original · grey line</figcaption></figure><figure class="photo-frame"><img class="photo" :src="`${base}assets/fivek/expert-${expert}.png`" :alt="`Histogram reference expert ${expert}`" /><figcaption>Expert {{ expert }} · coloured line</figcaption></figure></div>
      <svg viewBox="0 0 770 365" role="img" :aria-label="`${channel} histogram of input and Expert ${expert}`">
        <g v-for="tick in [0,.25,.5,.75,1]" :key="tick"><line x1="68" x2="720" :y1="296 - tick * 248" :y2="296 - tick * 248" stroke="#d5dce4"/><text x="57" :y="301 - tick * 248" text-anchor="end" class="svg-label">{{ (peak * tick / d.pixels * 100).toFixed(1) }}%</text></g>
        <polyline :points="points(series[0])" fill="none" stroke="#7b8794" stroke-width="2" stroke-dasharray="6 4" />
        <polyline :points="points(series[1])" fill="none" :stroke="colours[channel]" stroke-width="3" />
        <g v-for="tick in [0,64,128,192,255]" :key="tick"><text :x="68 + tick / 256 * 652" y="321" text-anchor="middle" class="svg-label">{{ tick }}</text></g>
        <text x="68" y="25" class="svg-label">Pixels per bin (%)</text><text x="394" y="353" text-anchor="middle" class="svg-label">Encoded channel level · 64 bins</text>
      </svg>
    </div>
    <p class="source-caption">Measured from {{ d.pixels.toLocaleString() }} display pixels per image. Y′ = 0.2126R + 0.7152G + 0.0722B, without linearisation. Reference comparison, not model performance.</p>
  </div>
</template>
