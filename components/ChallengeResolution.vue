<script setup>
const rows = [
  {title:'Architecture kept changing', issue:'Diagrams, interfaces and evaluation drifted.', response:'Update mechanisms and align interfaces.', remaining:'Final-run linkage is incomplete.'},
  {title:'One edit did not capture preference', issue:'Nearest retrieval missed the recorded edit.', response:'Predict a distribution; sample alternatives.', remaining:'User preference remains untested.'},
  {title:'The representation has limits', issue:'Compact vectors constrain edit capacity.', response:'Use 3D vectors + global LUTs.', remaining:'Regional edits remain limited.'},
  {title:'Experiments were hard to compare', issue:'Splits, histories and selection differed.', response:'Bundle checkpoints, configs and evaluations.', remaining:'The final-run bundle is missing.'}
]
</script>
<template>
  <div class="challenge-grid"><article v-for="(r,i) in rows" :key="r.title"><div class="challenge-heading"><span>0{{i+1}}</span><h2>{{r.title}}</h2></div><p class="challenge-issue">{{r.issue}}</p><div class="challenge-response"><span>→</span><p>{{r.response}}</p></div><p class="remaining"><strong>Limit:</strong> {{r.remaining}}</p></article></div>
</template>
<style scoped>
.challenge-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px 54px;height:100%}.challenge-grid article{border-top:1px solid var(--line);padding-top:20px}.challenge-heading{display:flex;gap:19px;align-items:baseline}.challenge-heading>span{font-size:24px;color:var(--muted);font-weight:300}.challenge-heading h2{font-size:24px;margin:0}.challenge-issue{font-size:17px;color:var(--muted);margin:15px 0!important;max-width:490px}.challenge-response{display:flex;gap:17px;align-items:baseline;color:var(--blue)}.challenge-response>span{font-size:24px}.challenge-response p{font-size:21px;line-height:1.35}.remaining{font-size:14px;margin-top:17px!important;color:var(--muted)}.remaining strong{font-weight:500}
</style>
