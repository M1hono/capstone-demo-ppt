<script setup>
import { computed, ref } from 'vue'
import d from '../data/image-diagnostics.json'
const base = import.meta.env.BASE_URL, expert = ref('C')
const cells = computed(() => d.experts[expert.value].tone.flatMap((row,y) => row.map((count,x) => ({x,y,count}))).filter(v => v.count > 0))
const max = computed(() => Math.max(...cells.value.map(c => c.count)))
</script>
<template>
  <div class="stack visual-lab">
    <div class="row spread"><p class="readout">Where do dark and bright pixels move?</p><label class="small">Reference <select v-model="expert" aria-label="Tone-map expert"><option v-for="c in ['A','B','C','D','E']" :key="c">{{ c }}</option></select></label></div>
    <div class="tone-layout grow">
      <svg viewBox="0 0 510 410" role="img" aria-label="Joint distribution of input and reference luma">
        <rect x="85" y="15" width="320" height="320" fill="#f5f7fa"/>
        <rect v-for="cell in cells" :key="`${cell.x}-${cell.y}`" :x="85 + cell.x * 10" :y="325 - cell.y * 10" width="10" height="10" fill="#0f62fe" :style="{opacity:.12 + .88 * Math.log1p(cell.count) / Math.log1p(max)}" />
        <line x1="85" y1="335" x2="405" y2="15" stroke="#18202b" stroke-dasharray="5 5" />
        <g v-for="v in [0,64,128,192,256]" :key="v"><text :x="85 + v * 1.25" y="359" text-anchor="middle" class="svg-label">{{ v }}</text><text x="72" :y="340 - v * 1.25" text-anchor="end" class="svg-label">{{ v }}</text></g>
        <text x="245" y="394" text-anchor="middle" class="svg-label">Original luma Y′</text><text transform="translate(22 175) rotate(-90)" text-anchor="middle" class="svg-label">Expert reference luma Y′</text>
      </svg>
      <div class="col"><div class="tone-images"><figure class="photo-frame"><img class="photo" :src="base + 'assets/fivek/original.png'" alt="Tone-map original"/><figcaption>Original</figcaption></figure><figure class="photo-frame"><img class="photo" :src="`${base}assets/fivek/expert-${expert}.png`" :alt="`Tone-map expert ${expert}`"/><figcaption>Expert {{ expert }}</figcaption></figure></div><div class="tone-key"><span>Above diagonal</span><b>Brighter reference pixels</b><span>Below diagonal</span><b>Darker reference pixels</b><span>Stronger blue</span><b>More pixels · log count scale</b></div><p class="small muted">This is a measured pixel correspondence. It is not a learned tone curve or a fit to the flow model.</p></div>
    </div>
    <p class="source-caption">32 × 32 joint histogram · {{ d.pixels.toLocaleString() }} aligned display pixels · diagonal denotes equal encoded luma.</p>
  </div>
</template>
<style scoped>.tone-layout{display:grid;grid-template-columns:1fr 1.1fr;gap:32px;min-height:0}.tone-layout>svg{width:100%;height:100%;min-height:0}.tone-images{display:grid;grid-template-columns:1fr 1fr;gap:12px}.tone-images img{height:168px;object-fit:contain}.tone-key{display:grid;grid-template-columns:170px 1fr;gap:12px;font-size:16px}.tone-key span{color:var(--muted)}.tone-key b{font-weight:500}</style>
