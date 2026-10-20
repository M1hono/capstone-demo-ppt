<script setup>
import {computed,ref} from 'vue'
import e from '../data/report-evidence.json'
const metric=ref('mean');const labels={mean:'Mean ms / batch',p95:'P95 ms / batch',throughput:'Images / second',memory:'Peak allocated MiB'}
const max=computed(()=>Math.ceil(Math.max(...e.benchmark.rows.map(r=>r[metric.value]))/(metric.value==='memory'?50:metric.value==='throughput'?50:10))*(metric.value==='memory'?50:metric.value==='throughput'?50:10))
const format=value=>value.toFixed(metric.value==='memory'?1:metric.value==='throughput'?2:3)
</script>
<template>
  <div class="stack runtime">
    <div class="row spread"><div class="tabs"><button v-for="(label,key) in labels" :key="key" :aria-pressed="metric===key" @click.stop="metric=key">{{label}}</button></div><span class="runtime-device">RTX 4060 Laptop GPU</span></div>
    <div class="runtime-chart"><div class="runtime-axis"><span>Batch · configuration · history</span><div><span>0</span><span>{{max/2}}</span><span>{{max}}</span></div><span>{{metric==='memory'?'MiB':metric==='throughput'?'img/s':'ms'}}</span></div><div v-for="(r,i) in e.benchmark.rows" :key="i" class="bar-row"><span><b>{{r.batch}}</b> {{r.mode}} · {{r.history}}</span><div class="bar-track"><div class="bar-value" :style="{width:`${r[metric]/max*100}%`,background:r.batch===8?'var(--teal)':'var(--blue)'}"/></div><span class="bar-number">{{format(r[metric])}}</span></div></div>
    <div class="benchmark-context"><p><b>Measured configuration</b>256 × 256 RGB · 8 history pairs<br>256 samples · 5 candidates</p><p><b>Measurement window</b>3 warm-ups · 10 repetitions<br>Model stages only, with GPU-resident inputs</p><p><b>Interpretation</b>P95 is a small-sample estimate.<br>Allocated memory is not total VRAM.</p></div>
    <p class="source-caption">Historical z cached; “fresh” re-encodes images. Excludes I/O, checkpoint loading, transfers and spherical-grid search. Full software and precision settings are in the evidence index.</p>
  </div>
</template>
<style scoped>
.runtime{gap:16px}.runtime-device{font-size:17px;color:var(--muted)}.runtime-chart{display:grid;gap:12px;padding:10px 0;flex:1;align-content:center}.bar-row,.runtime-axis{display:grid;grid-template-columns:290px 1fr 95px;gap:20px;align-items:center;font-size:18px}.bar-row>span:first-child b{font-weight:500;display:inline-block;width:30px;color:var(--muted)}.bar-track{height:29px;background:var(--surface)}.bar-number{font-size:22px}.runtime-axis{font-size:14px;color:var(--muted);padding-bottom:4px}.runtime-axis>div{display:flex;justify-content:space-between}.runtime-axis>span:last-child{text-align:right}.benchmark-context{display:grid;grid-template-columns:repeat(3,1fr);gap:36px;border-top:1px solid var(--ink);padding-top:18px;font-size:17px;color:var(--muted)}.benchmark-context b{display:block;font-size:19px;font-weight:500;color:var(--ink);margin-bottom:9px}
</style>
