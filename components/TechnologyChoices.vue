<script setup>
const stages=[['CNN','Image features','Computer vision'],['3D z + LUTs','Compact edits','Representation learning'],['Transformer','History context','Sequence learning'],['Flow','Conditional density','Probabilistic modelling']]
</script>
<template>
  <div class="stack technology">
    <div class="tool-strip"><span>Python</span><span>PyTorch</span><span>CUDA</span><p>One integrated research pipeline</p></div>
    <div class="technology-pipeline grow"><article v-for="(stage,i) in stages" :key="stage[0]"><div class="tech-top"><span>0{{i+1}}</span><b v-if="i<3">→</b></div><h2>{{stage[0]}}</h2><p>{{stage[1]}}</p><small>{{stage[2]}}</small></article></div>
    <div class="benchmark-summary"><article><strong>≈39.7 <small>ms</small></strong><p>Monte Carlo inference</p></article><article><strong>115.9 <small>MiB</small></strong><p>Peak CUDA allocation</p></article><article><strong>RTX 4060</strong><p>Laptop GPU · 256 × 256</p></article></div>
    <p class="source-caption">Batch 1, fresh history; inputs on GPU, historical z cached. Model-side timing excludes loading, disk I/O and application overhead.</p>
  </div>
</template>
<style scoped>
.technology{gap:30px}.tool-strip{display:flex;gap:12px;align-items:center}.tool-strip span{background:var(--ink);color:var(--panel);padding:9px 19px;font:18px Saira}.tool-strip p{font-size:20px;margin-left:auto;color:var(--muted)}.technology-pipeline{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;align-content:center}.technology-pipeline article{border-top:2px solid var(--ink);padding-top:14px}.tech-top{display:flex;justify-content:space-between;font:24px Saira;color:var(--muted)}.tech-top b{font-weight:400}.technology-pipeline h2{font-size:31px;margin:23px 0 8px}.technology-pipeline p{font-size:21px}.technology-pipeline small{display:block;font-size:16px;color:var(--muted);margin-top:14px}.benchmark-summary{display:grid;grid-template-columns:1fr 1fr 1fr;gap:45px;border-top:1px solid var(--ink);padding-top:24px}.benchmark-summary strong{font:600 42px/1.1 Saira}.benchmark-summary small{font-size:23px}.benchmark-summary p{font-size:18px;color:var(--muted);margin-top:8px}
</style>
