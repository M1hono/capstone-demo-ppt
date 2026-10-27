<script setup>
const measures = [
  {label:'Inference time', value:'39.735', unit:'ms', scope:'1 query / fresh image encoding', detail:'Cached z / inputs on GPU.'},
  {label:'Peak allocated memory', value:'115.9', unit:'MiB', scope:'Monte Carlo · batch size 1', detail:'Allocated memory, not total VRAM.'},
  {label:'User history', value:'8', unit:'pairs', scope:'Shared model / fixed weights', detail:'No per-user fine-tuning.'}
]
</script>
<template>
  <div class="stack quality-objectives">
    <div class="quality-measures"><article v-for="item in measures" :key="item.label"><h3>{{item.label}}</h3><p class="measurement">{{item.value}} <span>{{item.unit}}</span></p><p>{{item.scope}}</p><p class="small muted">{{item.detail}}</p></article></div>
    <div class="quality-boundaries"><article><h3>Reliability</h3><p>Ablations test image and history dependence.</p></article><article><h3>Reproducibility</h3><p>Code and diagnostic saved; final run missing.</p></article><article><h3>Usability and diversity</h3><p>Multiple candidates; user preference untested.</p></article></div>
    <p class="source-caption">RTX 4060 Laptop / 256 × 256 inputs / 256 samples / model-side benchmark.</p>
  </div>
</template>
<style scoped>
.quality-objectives{justify-content:space-between;gap:26px}.quality-measures{display:grid;grid-template-columns:repeat(3,1fr);gap:42px;padding:22px 0 30px}.quality-measures article{border-top:1px solid var(--ink);padding-top:18px}.measurement{font-size:59px!important;letter-spacing:-2px;font-weight:300;color:var(--blue);margin:18px 0!important}.measurement span{font-size:23px;letter-spacing:0;color:var(--muted)}.quality-measures article>p:not(.measurement){font-size:18px;margin-top:10px}.quality-boundaries{display:grid;grid-template-columns:repeat(3,1fr);gap:42px;padding:26px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.quality-boundaries p{font-size:18px;color:var(--muted)}
</style>
