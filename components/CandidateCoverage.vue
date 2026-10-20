<script setup>
import {ref,computed} from 'vue'
import e from '../data/report-evidence.json'
const expert=ref(5)
const values=computed(()=>[e.fivek.psnr.top1[expert.value],e.fivek.psnr.best3[expert.value],e.fivek.psnr.best5[expert.value]])
const y = value => 258 - (value - 20) / 8 * 220
const labels=['Top-1','Best-of-3','Best-of-5']
</script>
<template>
  <div class="stack coverage">
    <div class="row spread"><label>FiveK expert <select v-model.number="expert" aria-label="Coverage expert" @keydown.stop><option v-for="(label,i) in e.fivek.experts" :key="label" :value="i">{{label}}</option></select></label><p class="coverage-takeaway">More candidates increase <b>target coverage.</b></p></div>
    <div class="coverage-main">
      <svg viewBox="0 0 690 320" role="img" aria-label="PSNR for automatic Top-1 selection and offline Best-of-3 and Best-of-5 coverage">
        <rect x="270" y="33" width="395" height="225" fill="var(--surface)"/>
        <g v-for="v in [20,22,24,26,28]" :key="v"><line x1="65" x2="665" :y1="y(v)" :y2="y(v)" stroke="var(--line)"/><text x="49" :y="y(v)+6" text-anchor="end">{{v}}</text></g>
        <text x="0" y="21">PSNR / dB</text><text x="467" y="21" text-anchor="middle">Offline best-of-K</text>
        <path :d="`M360 ${y(values[1])} L575 ${y(values[2])}`" fill="none" stroke="var(--teal)" stroke-width="2"/>
        <g v-for="(v,i) in values" :key="i"><circle :cx="145+i*215" :cy="y(v)" r="8" :fill="i?'var(--teal)':'var(--blue)'"/><text :x="145+i*215" :y="y(v)-20" text-anchor="middle" class="point-value">{{v.toFixed(3)}}</text><text :x="145+i*215" y="296" text-anchor="middle" class="point-label">{{labels[i]}}</text></g>
      </svg>
      <div class="selection-rules"><article><span class="rule-symbol automatic">1</span><div><h3>At inference</h3><p>The system ranks candidates without seeing the query target.</p></div></article><article><span class="rule-symbol oracle">K</span><div><h3>During evaluation</h3><p>Best-of-K chooses the closest candidate using the known target.</p></div></article><p class="interpretation">Coverage does not show that every candidate is preferred.</p></div>
    </div>
    <div class="candidate-pipeline"><span>Sample edit vectors</span><span>→</span><span>Select five candidates</span><span>→</span><span>Render with the same original</span></div>
    <p class="source-caption">Detailed FiveK report values, also present in the archived diagnostic. Final-run candidate images are unavailable; the chart compares recorded scores.</p>
  </div>
</template>
<style scoped>
.coverage{gap:22px}.coverage label{font-size:17px}.coverage select{margin-left:12px}.coverage-takeaway{font-size:22px;color:var(--muted)}.coverage-takeaway b{font-weight:500;color:var(--ink)}.coverage-main{display:grid;grid-template-columns:1.5fr 1fr;gap:50px;flex:1;min-height:0;align-items:center}.coverage-main svg{width:100%;max-height:340px;overflow:visible}.coverage-main svg text{font:18px 'IBM Plex Sans',sans-serif;fill:var(--muted)}.coverage-main svg .point-value{font-size:26px;font-weight:500;fill:var(--ink)}.coverage-main svg .point-label{font-size:20px;fill:var(--ink)}.selection-rules{display:flex;flex-direction:column;gap:26px}.selection-rules article{display:flex;gap:18px}.rule-symbol{font-size:38px;line-height:1;font-weight:300;min-width:35px}.automatic{color:var(--blue)}.oracle{color:var(--teal)}.selection-rules h3{font-size:23px;margin-bottom:8px}.selection-rules article p{font-size:19px;color:var(--muted)}.interpretation{font-size:20px;border-top:1px solid var(--line);padding-top:18px}.candidate-pipeline{display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--ink);padding-top:18px;font-size:19px}.candidate-pipeline>span:nth-child(even){color:var(--blue)}
</style>
