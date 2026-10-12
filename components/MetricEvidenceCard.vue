<script setup>
const rows = [
  ['FiveK', '23.8 dB'],
  ['PPSD', '24.5 dB'],
  ['Unseen-expert FiveK', '23.5 dB'],
  ['PieNet', '20.8 dB'],
  ['RefRetouch', '21.3 dB'],
  ['Phase 1 report', '29.3 dB'],
]
</script>

<template>
  <figure class="metric-evidence-card">
    <div class="metric-head"><b>Reported quantitative evidence</b><span>PSNR · dB</span></div>
    <div class="metric-rows"><div v-for="([label,value],index) in rows" :key="label" class="metric-row"><span>{{ label }}</span><i><b :style="{ width: `${Math.min(100, parseFloat(value) / 32 * 100)}%` }"/></i><code>{{ value }}</code></div></div>
    <figcaption>Values transcribed from the final group report. They belong to different datasets or phases; this card does not imply one shared evaluation setup.</figcaption>
  </figure>
</template>

<style scoped>
.metric-evidence-card { margin:0; border:1px solid var(--line); background:var(--surface); }.metric-head { display:flex; justify-content:space-between; padding:11px 13px; border-bottom:1px solid var(--line); font-size:13px; }.metric-head span { color:var(--muted); font:11px var(--mono); }.metric-rows { padding:7px 13px; }.metric-row { display:grid; grid-template-columns:145px 1fr 70px; gap:10px; align-items:center; padding:9px 0; border-bottom:1px solid var(--line); font-size:11px; }.metric-row:last-child { border-bottom:0; }.metric-row i { display:block; height:9px; background:#d9e3e5; }.metric-row i b { display:block; height:100%; background:var(--blue); }.metric-row code { text-align:right; font:12px var(--mono); color:var(--ink); }.metric-evidence-card figcaption { padding:9px 13px; border-top:1px solid var(--line); color:var(--muted); font-size:10px; line-height:1.4; }
</style>
