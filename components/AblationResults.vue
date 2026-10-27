<script setup>
import e from '../data/report-evidence.json'
const rows=e.ablations
const x = v => 240 + v / 25 * 490
</script>
<template>
  <div class="stack ablation-results">
    <p class="ablation-intro">Both conditions contribute. Current-image information has the larger effect.</p>
    <div class="ablation-layout grow"><svg class="ablation-chart" viewBox="0 0 800 405" role="img" aria-label="PSNR: original image 18.3, expert-average 22.1, wrong image 20.2, wrong history 22.3, complete model 23.5 dB">
      <g v-for="tick in [0,5,10,15,20,25]" :key="tick"><line :x1="x(tick)" :x2="x(tick)" y1="16" y2="350" stroke="var(--line)"/><text :x="x(tick)" y="377" text-anchor="middle">{{tick}}</text></g>
      <g v-for="(row,i) in rows" :key="row.name"><text x="220" :y="i*65+43" text-anchor="end">{{row.name}}</text><rect x="240" :y="i*65+21" :width="x(row.psnr)-240" height="32" :fill="i===4?'var(--ink)':'var(--purple)'" class="chart-bar"/><text :x="x(row.psnr)+10" :y="i*65+43" class="bar-label">{{row.psnr.toFixed(1)}}</text></g>
      <text x="485" y="402" text-anchor="middle">PSNR (dB) ↑</text>
    </svg><aside><div><strong>−3.3 <small>dB</small></strong><p>Wrong current image</p></div><div><strong>−1.2 <small>dB</small></strong><p>Wrong user history</p></div><p class="source-caption">Relative to the complete model: 23.5 dB.</p></aside></div>
    <div class="ablation-path"><span>Current image</span><span>+</span><span>Historical preferences</span><span>→</span><b>Conditional prediction</b></div>
  </div>
</template>
<style scoped>
.ablation-results{gap:25px}.ablation-intro{font-size:23px;color:var(--muted)}.ablation-layout{display:grid;grid-template-columns:2.8fr 1fr;gap:35px;align-items:center}.ablation-chart{width:100%}.ablation-chart text{font:17px 'IBM Plex Sans';fill:var(--muted)}.ablation-chart .bar-label{font-weight:600;fill:var(--ink)}.ablation-layout aside{display:grid;gap:28px;border-left:1px solid var(--line);padding-left:30px}.ablation-layout strong{font:600 45px/1.15 Saira}.ablation-layout small{font-size:23px}.ablation-layout aside p{font-size:18px;color:var(--muted);margin-top:6px}.ablation-layout aside .source-caption{font-size:14px}.ablation-path{display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--ink);padding-top:22px;font-size:22px}.ablation-path b{font-weight:500}
</style>
