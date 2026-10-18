<script setup>
import { ref } from 'vue'
import e from '../data/report-evidence.json'
const rows = e.benchmark.rows, selected = ref(3), x = v => 80 + v / 55 * 630, y = v => 345 - v / 220 * 290
</script>
<template>
  <div class="stack visual-lab">
    <div class="row spread"><p class="readout">Latency, throughput and allocated memory</p><span class="small muted">RTX 4060 Laptop GPU · 256 × 256 · 10 timed repetitions</span></div>
    <div class="benchmark-map grow">
      <svg viewBox="0 0 780 405" role="img" aria-label="Latency versus throughput for six inference configurations">
        <g v-for="v in [0,50,100,150,200]" :key="v"><line x1="80" x2="710" :y1="y(v)" :y2="y(v)" stroke="#d5dce4"/><text x="63" :y="y(v) + 5" text-anchor="end" class="svg-label">{{ v }}</text></g>
        <g v-for="v in [0,10,20,30,40,50]" :key="v"><text :x="x(v)" y="371" text-anchor="middle" class="svg-label">{{ v }}</text></g>
        <text x="80" y="27" class="svg-label">Throughput (images/s)</text><text x="395" y="401" text-anchor="middle" class="svg-label">Mean latency (ms / batch)</text>
        <g v-for="(r,i) in rows" :key="i" :style="{opacity:selected === i ? 1 : .55}"><circle :cx="x(r.mean)" :cy="y(r.throughput)" :r="Math.sqrt(r.memory / 98) * 13" :fill="r.batch === 8 ? '#007d79' : '#0f62fe'" stroke="white" stroke-width="2"/><text :x="x(r.mean)" :y="y(r.throughput) + 5" text-anchor="middle" style="font-size:13px" fill="white">{{ i + 1 }}</text></g>
      </svg>
      <div class="configuration-list"><button v-for="(r,i) in rows" :key="i" :aria-pressed="selected === i" @click.stop="selected = i"><b>{{ i + 1 }}</b><span>{{ r.mode }} · batch {{ r.batch }}<small>{{ r.history }} history</small></span></button><div class="runtime-detail"><strong>{{ rows[selected].mean.toFixed(3) }} <small>ms/batch</small></strong><span>{{ rows[selected].throughput.toFixed(2) }} images/s · {{ rows[selected].memory.toFixed(1) }} MiB</span><span>P95 {{ rows[selected].p95.toFixed(3) }} ms/batch</span></div></div>
    </div>
    <p class="source-caption">Circle area scales with peak allocated CUDA memory. Batch-eight throughput is eight images per batch time. GPU inputs and historical z are cached; I/O and full application overhead are excluded.</p>
  </div>
</template>
<style scoped>.benchmark-map{display:grid;grid-template-columns:1.9fr 1fr;gap:26px;min-height:0}.benchmark-map>svg{height:100%;width:100%;min-height:0}.configuration-list{display:flex;flex-direction:column;gap:5px;justify-content:center}.configuration-list button{display:flex;gap:15px;align-items:center;text-align:left;padding:8px 12px}.configuration-list button>b{font-size:19px;font-weight:400}.configuration-list small{display:block;font-size:11px;margin-top:3px}.runtime-detail{display:flex;flex-direction:column;gap:7px;padding-top:10px;font-size:13px}.runtime-detail strong{font-size:31px;font-weight:400}.runtime-detail strong small{display:inline;font-size:15px}</style>
