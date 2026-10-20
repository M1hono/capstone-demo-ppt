<script setup>
const conditions=[
  {label:'Current model',score:27.2},
  {label:'Completely random historical samples',score:22.1},
  {label:'Randomly selecting reference images within the constructed user history',score:24.5},
  {label:'Removing Cross-Attention; reference and current images into the CNN',score:23.1},
]
</script>
<template>
  <div class="achievement-ablations">
    <p>Three ablation experiments</p>
    <table class="achievement-table"><thead><tr><th>Condition</th><th>PSNR · dB</th></tr></thead><tbody>
      <tr v-for="(condition,i) in conditions" :key="condition.label" :class="{'full-model':i===0}"><td>{{condition.label}}</td><td><b>{{condition.score.toFixed(1)}}</b><span class="psnr-track"><i :style="{'--score':condition.score}"/></span></td></tr>
    </tbody></table>
    <p class="ablation-scale">PSNR bars: 0–30 dB</p>
  </div>
</template>
