<script setup>
const measures = [
  {label:'Inference time', value:'39.735', unit:'ms', scope:'One query · fresh history encoding', detail:'Cached historical z, GPU-resident inputs.'},
  {label:'Peak allocated memory', value:'115.9', unit:'MiB', scope:'Monte Carlo · batch size 1', detail:'Allocated CUDA memory, not total process VRAM.'},
  {label:'User history', value:'8', unit:'pairs', scope:'Shared model · fixed inference weights', detail:'No user-specific training or fine-tuning.'}
]
</script>
<template>
  <div class="stack quality-objectives">
    <div class="quality-measures"><article v-for="item in measures" :key="item.label"><h3>{{item.label}}</h3><p class="measurement">{{item.value}} <span>{{item.unit}}</span></p><p>{{item.scope}}</p><p class="small muted">{{item.detail}}</p></article></div>
    <div class="quality-boundaries"><article><h3>Reliability</h3><p>Controlled input perturbations test dependence on image and history.</p></article><article><h3>Reproducibility</h3><p>Versioned code and a saved diagnostic are available; the final run bundle is missing.</p></article><article><h3>Usability and diversity</h3><p>Several candidate outputs are supported; subjective preference has not been tested.</p></article></div>
    <p class="source-caption">RTX 4060 Laptop GPU · 256 × 256 inputs · 256 Monte Carlo samples · research benchmark, with no production service guarantee.</p>
  </div>
</template>
<style scoped>
.quality-objectives{justify-content:space-between;gap:26px}.quality-measures{display:grid;grid-template-columns:repeat(3,1fr);gap:42px;padding:22px 0 30px}.quality-measures article{border-top:1px solid var(--ink);padding-top:18px}.measurement{font-size:59px!important;letter-spacing:-2px;font-weight:300;color:var(--blue);margin:18px 0!important}.measurement span{font-size:23px;letter-spacing:0;color:var(--muted)}.quality-measures article>p:not(.measurement){font-size:18px;margin-top:10px}.quality-boundaries{display:grid;grid-template-columns:repeat(3,1fr);gap:42px;padding:26px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.quality-boundaries p{font-size:18px;color:var(--muted)}
</style>
