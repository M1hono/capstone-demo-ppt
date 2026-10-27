<script setup>
import e from '../data/report-evidence.json'
const base=import.meta.env.BASE_URL+'assets/reference-deck/results/'
const experts=['A','B','C','D','E']
const views=[['target','Target'],['top1','Top-1'],['best3','Best-3*'],['best5','Best-5*'],['samples','Samples'],['density','Density']]
const keys=['top1','best3','best5']
</script>
<template>
  <div class="stack results">
    <div class="results-main">
      <div class="expert-examples"><div class="example-input"><img :src="base+'fivek-input.png'" alt="Same FiveK input image 0753"><div><h3>Same image · different expert histories</h3><p>Selected training-image diagnostic · not test averages</p></div></div><div class="expert-grid"><span/><span v-for="view in views" :key="view[0]" class="example-heading">{{view[1]}}</span><template v-for="expert in experts" :key="expert"><b class="expert-label">{{expert}}</b><img v-for="view in views" :key="view[0]" :src="base+'fivek-'+expert+'-'+view[0]+'.png'" :alt="'Expert '+expert+' '+view[1]+' from supplied results'" :data-expert-result="expert"/></template></div></div>
      <div class="result-numbers"><div class="result-heading"><h3>FiveK PSNR (dB)</h3><span>Expert E excluded from training</span></div><table class="evidence-table"><thead><tr><th>Expert</th><th class="numeric">Top-1</th><th class="numeric">Best-3*</th><th class="numeric">Best-5*</th></tr></thead><tbody><tr v-for="(expert,i) in e.fivek.experts" :key="expert" :class="{highlight:expert==='Mean'}"><td>{{expert}}</td><td v-for="key in keys" :key="key" class="numeric">{{e.fivek.psnr[key][i].toFixed(3)}}</td></tr></tbody></table><div class="result-metrics"><p><b>23.263 dB</b><span>Unseen Expert E · Top-1</span></p><p><b>0.8852</b><span>Mean Top-1 SSIM</span></p></div></div>
    </div>
    <div class="result-interpretation"><p><b>*Best-of-K uses the target offline.</b> Higher scores show candidate coverage, not automatic best-edit selection.</p><p class="source-caption">Thin rays: sampled z vectors; thick rays: representatives; black: target. Direction density is normalised per image.</p></div>
  </div>
</template>
<style scoped>
.results{gap:20px}.results-main{display:grid;grid-template-columns:1.18fr 1fr;gap:36px;flex:1;min-height:0;align-items:center}.example-input{display:flex;align-items:center;gap:15px;margin-bottom:12px}.example-input>img{width:58px;height:58px;object-fit:contain}.example-input h3{font-size:22px;margin:0 0 6px}.example-input p{font-size:14px;color:var(--muted)}.expert-grid{display:grid;grid-template-columns:22px repeat(6,1fr);gap:7px 5px;align-items:center}.expert-grid img{width:100%;height:64px;object-fit:contain}.example-heading{font-size:13px;text-align:center;color:var(--muted)}.expert-label{font-size:18px;font-weight:500}.result-heading{margin-bottom:14px}.result-heading h3{font-size:25px;margin:0 0 5px}.result-heading span{font-size:16px;color:var(--muted)}.result-numbers .evidence-table{font-size:17px}.result-numbers .evidence-table th{font-size:13px;padding:10px 8px}.result-numbers .evidence-table td{padding:9px 8px}.result-metrics{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px}.result-metrics p{display:grid;gap:5px}.result-metrics b{font:600 29px Saira}.result-metrics span{font-size:15px;color:var(--muted)}.result-interpretation{border-top:1px solid var(--ink);padding-top:14px;display:grid;gap:7px}.result-interpretation>p:first-child{font-size:18px}.result-interpretation b{font-weight:500}
</style>
