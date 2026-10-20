<script setup>
import { computed, ref } from 'vue'
import e from '../data/report-evidence.json'
const metric=ref('psnr');const rows=computed(()=>e.fivek[metric.value]);const colors=['#0f62fe','#007d79','#6929c4'];const keys=['top1','best3','best5'];const names=['Top-1','Best-of-3','Best-of-5']
const y = value => metric.value === 'psnr'
  ? 260 - (value - 20) / 8 * 220
  : 260 - (value - 0.86) / 0.07 * 220
const ticks=computed(()=>metric.value==='psnr'?[20,22,24,26,28]:[.86,.88,.90,.92])
const format=v=>v.toFixed(metric.value==='psnr'?3:4)
</script>
<template>
  <div class="stack results">
    <div class="row spread"><div class="tabs" aria-label="Result metric"><button :aria-pressed="metric==='psnr'" @click.stop="metric='psnr'">PSNR (dB)</button><button :aria-pressed="metric==='ssim'" @click.stop="metric='ssim'">SSIM</button></div><p class="result-scope">FiveK · five experts and mean</p></div>
    <div class="results-main">
      <div class="result-plot"><svg viewBox="0 0 640 310" role="img" :aria-label="`FiveK ${metric} by expert, with offline Best-of-3 and Best-of-5`"><g v-for="t in ticks" :key="t"><line x1="55" x2="610" :y1="y(t)" :y2="y(t)" class="grid-lines"/><text x="44" :y="y(t)+5" text-anchor="end">{{metric==='psnr'?t:t.toFixed(2)}}</text></g><rect x="552" y="30" width="64" height="235" fill="var(--pale)"/><line v-for="(expert,i) in e.fivek.experts" :key="expert" :x1="78+i*102" :x2="78+i*102" :y1="y(rows.top1[i])" :y2="y(rows.best5[i])" stroke="#b9c3cf" stroke-width="3"/><g v-for="(key,k) in keys" :key="key"><circle v-for="(v,i) in rows[key]" :key="i" :cx="78+i*102" :cy="y(v)" r="7" :fill="colors[k]"/></g><text v-for="(expert,i) in e.fivek.experts" :key="expert" :x="78+i*102" y="289" text-anchor="middle">{{expert}}</text></svg><div class="result-legend"><span v-for="(name,i) in names" :key="name"><i :style="{background:colors[i]}"/>{{name}}{{i?'*':''}}</span></div></div>
      <div class="result-numbers"><table class="evidence-table"><thead><tr><th>Expert</th><th v-for="name in names" :key="name" class="numeric">{{name}}</th></tr></thead><tbody><tr v-for="(expert,i) in e.fivek.experts" :key="expert" :class="{highlight:expert==='Mean'}"><td>{{expert}}</td><td v-for="key in keys" :key="key" class="numeric">{{format(rows[key][i])}}</td></tr></tbody></table><p class="ppsd-result">PPSD: <b>24.500 dB</b> · SSIM 0.841†</p></div>
    </div>
    <div class="result-interpretation"><p><b>*Best-of-K uses the target.</b> It measures candidate coverage, not an automatic selection rule.</p><p class="source-caption">PSNR: archived 120-query diagnostic. SSIM: report only. †PPSD SSIM is inconsistent across report sections. Full protocols and discrepancies are in the evidence index.</p></div>
  </div>
</template>
<style scoped>
.results{gap:22px}.result-scope{font-size:18px;color:var(--muted)}.results-main{display:grid;grid-template-columns:1.27fr 1fr;gap:36px;flex:1;min-height:0;align-items:center}.result-plot svg{width:100%;overflow:visible}.result-plot svg text{font:20px 'IBM Plex Sans',sans-serif;fill:var(--muted)}.result-legend{display:flex;justify-content:center;gap:23px;font-size:18px;margin-top:18px}.result-legend i{display:inline-block;width:11px;height:11px;margin-right:8px;border-radius:50%}.result-numbers .evidence-table{font-size:18px}.result-numbers .evidence-table th{font-size:15px;padding:12px 10px}.result-numbers .evidence-table td{padding:12px 10px}.ppsd-result{font-size:18px;margin-top:24px!important;color:var(--muted)}.ppsd-result b{color:var(--ink);font-weight:500}.result-interpretation{border-top:1px solid var(--ink);padding-top:15px;display:grid;gap:11px}.result-interpretation>p:first-child{font-size:20px}.result-interpretation b{font-weight:500}
</style>
