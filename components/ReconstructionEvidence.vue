<script setup>
import { ref } from 'vue'
import e from '../data/report-evidence.json'
const base = import.meta.env.BASE_URL
const selected = ref(3)
const x = v => 76 + v / 0.3 * 545
const y = v => 274 - (v - 26) / 5 * 220
</script>
<template>
  <div class="stack">
    <div class="reconstruction grow">
      <div class="reference-column">
        <div class="reference-pair">
          <figure class="photo-frame"><img class="photo" :src="base + 'assets/fivek/original.png'" alt="FiveK original reference" /><figcaption>Original O</figcaption></figure>
          <figure class="photo-frame"><img class="photo" :src="base + 'assets/fivek/expert-C.png'" alt="FiveK Expert C reference edit" /><figcaption>Expert target T</figcaption></figure>
        </div>
        <p class="formula">[O, T, T − O] → z → T̂</p>
        <p class="small muted">The edit encoder receives both images during reconstruction. These photographs show the available input/reference pair.</p>
        <div class="row rule"><div v-for="r in e.reconstruction" :key="r.dataset"><p class="small">{{ r.dataset }} · report</p><p class="big" style="font-size:44px">{{ r.psnr.toFixed(1) }}<small> dB</small></p></div></div>
      </div>
      <div class="col">
        <div class="row spread"><h3>Latent-noise sensitivity</h3><span class="small muted">10-image diagnostic</span></div>
        <svg viewBox="0 0 690 330" role="img" aria-label="Reconstruction PSNR versus latent noise scale" class="grow">
          <g v-for="tick in [26,27,28,29,30,31]" :key="tick"><line x1="76" x2="621" :y1="y(tick)" :y2="y(tick)" stroke="#d5dce4" /><text x="58" :y="y(tick) + 5" text-anchor="end" class="svg-label">{{ tick }}</text></g>
          <text x="76" y="30" class="svg-label">PSNR (dB)</text>
          <polyline :points="e.robustness.rows.map(r => `${x(r.scale)},${y(r.psnr)}`).join(' ')" fill="none" stroke="#0f62fe" stroke-width="3" />
          <circle v-for="(r,i) in e.robustness.rows" :key="r.scale" :cx="x(r.scale)" :cy="y(r.psnr)" :r="selected === i ? 8 : 5" fill="#0f62fe" stroke="white" stroke-width="2" />
          <g v-for="tick in [0,.1,.2,.3]" :key="tick"><text :x="x(tick)" y="300" text-anchor="middle" class="svg-label">{{ tick }}</text></g>
          <text x="350" y="327" text-anchor="middle" class="svg-label">Noise scale × training-set latent standard deviation</text>
        </svg>
        <div class="row spread"><label class="small">Noise scale <select v-model.number="selected" aria-label="Noise scale"><option v-for="(r,i) in e.robustness.rows" :value="i" :key="r.scale">{{ r.scale }}</option></select></label><p class="readout"><b class="blue">{{ e.robustness.rows[selected].psnr.toFixed(3) }} dB</b></p></div>
      </div>
    </div>
    <p class="source-caption">Dataset aggregates and the ten-image diagnostic are separate measurements. The reference photographs are not model reconstructions. Source: report §3.4; archived diagnostic §8.</p>
  </div>
</template>
<style scoped>.reconstruction{display:grid;grid-template-columns:410px 1fr;gap:36px}.reference-column{display:flex;flex-direction:column;gap:24px}.reference-pair{display:grid;grid-template-columns:1fr 1fr;gap:12px}.reference-pair img{height:151px;object-fit:contain}.reference-column .row{gap:36px}.reconstruction svg{min-height:0;width:100%}</style>
