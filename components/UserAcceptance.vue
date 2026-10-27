<script setup>
const rows = [
  ['FR-01', 'No instructions or query targets', 'FiveK / PPSD · PSNR and SSIM'],
  ['FR-02', '8 history pairs · fixed weights', 'Expert E + 50 unseen PPSD users'],
  ['FR-03', 'Multiple sampled edit candidates', 'Density analysis + Top-1 / Best-of-K']
]
</script>
<template>
  <div class="stack acceptance">
    <table class="evidence-table"><thead><tr><th>Requirement</th><th>Acceptance check</th><th>Evaluation evidence</th></tr></thead><tbody><tr v-for="row in rows" :key="row[0]"><td v-for="cell in row" :key="cell">{{cell}}</td></tr></tbody></table>
    <div class="constraint-map"><h2>Constraints</h2><div><span>Compute budget</span><span>History availability</span><span>Leakage prevention</span><span>Fixed model weights</span></div></div>
    <p class="acceptance-takeaway">The query target enters scoring only after prediction.</p>
  </div>
</template>
<style scoped>
.acceptance{gap:38px;justify-content:center}.acceptance .evidence-table{font-size:21px}.acceptance .evidence-table td{padding-top:28px;padding-bottom:28px}.constraint-map{display:flex;align-items:center;gap:40px}.constraint-map h2{font-size:27px;margin:0}.constraint-map>div{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;flex:1}.constraint-map span{font-size:17px;padding:18px;background:var(--surface);border-top:2px solid var(--line)}.acceptance-takeaway{font-size:24px;border-left:5px solid var(--signal);padding-left:18px}
</style>
