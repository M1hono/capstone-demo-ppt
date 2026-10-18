<script setup>
import { computed, ref } from 'vue'
import pairs from '../data/history-pairs.json'
import e from '../data/report-evidence.json'
const base = import.meta.env.BASE_URL, shifted = ref(false)
const history = pairs.slice(0,8)
const target = i => shifted.value ? (i + 1) % 8 : i
const result = computed(() => e.pairingDiagnostic[shifted.value ? 1 : 0])
</script>
<template>
  <div class="stack visual-lab">
    <div class="row spread"><div class="tabs"><button :aria-pressed="!shifted" @click.stop="shifted = false">Correct pairing</button><button :aria-pressed="shifted" @click.stop="shifted = true">Shift historical edits</button></div><p class="small muted">Same image set · same edit set · different associations</p></div>
    <svg class="grow" viewBox="0 0 1180 337" role="img" aria-label="Image-to-edit pairing diagram">
      <defs><marker id="pair-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8" fill="#0f62fe"/></marker></defs>
      <g v-for="(p,i) in history" :key="p.id">
        <image :href="base + p.original" :x="16 + i * 146" y="8" width="126" height="84" preserveAspectRatio="xMidYMid meet"/>
        <text :x="79 + i * 146" y="116" text-anchor="middle" class="svg-value">O{{ i + 1 }}</text>
        <path :d="`M${79 + i * 146},128 C${79 + i * 146},170 ${79 + target(i) * 146},170 ${79 + target(i) * 146},202`" fill="none" stroke="#0f62fe" stroke-width="2" :style="{opacity:.65}" marker-end="url(#pair-arrow)"/>
        <image :href="base + p.edited" :x="16 + i * 146" y="212" width="126" height="84" preserveAspectRatio="xMidYMid meet"/>
        <text :x="79 + i * 146" y="326" text-anchor="middle" class="svg-value">z{{ i + 1 }} ← (O{{ i + 1 }}, T{{ i + 1 }})</text>
      </g>
    </svg>
    <div class="pairing-readout"><div><span>Archived Top-1 PSNR</span><strong data-pairing-psnr>{{ result.psnr.toFixed(3) }} <small>dB</small></strong></div><div><span>Archived NLL</span><strong>{{ result.nll.toFixed(3) }}</strong></div><p>The recorded PSNR changes by only 0.019 dB after shifting history z. This diagnostic suggests weak use of the image–edit association.</p></div>
    <p class="source-caption">Images illustrate the pairing operation; they are not the diagnostic query set. Historical z remains derived from each original/edit pair. Source: phase2_diag.txt.</p>
  </div>
</template>
<style scoped>.pairing-readout{display:grid;grid-template-columns:230px 180px 1fr;gap:30px;border-top:1px solid var(--line);padding-top:14px;align-items:center}.pairing-readout span{display:block;font-size:13px;color:var(--muted)}.pairing-readout strong{font-size:32px;font-weight:400}.pairing-readout small{font-size:17px}.pairing-readout p{font-size:16px}.visual-lab>svg{width:100%;min-height:0}</style>
