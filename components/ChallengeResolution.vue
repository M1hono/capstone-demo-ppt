<script setup>
const rows = [
  {title:'Architecture kept changing', issue:'Earlier diagrams, interfaces and evaluation assumptions became stale.', response:'Replace obsolete mechanisms and coordinate component interfaces.', remaining:'Tie the final configuration to each result.'},
  {title:'One edit did not capture preference', issue:'Nearest-neighbour retrieval often missed the recorded adjustment.', response:'Model a conditional distribution and generate alternatives.', remaining:'Validate alternatives with users.'},
  {title:'The representation has limits', issue:'Compact vectors help density modelling but constrain expressiveness.', response:'Use a 3D latent representation with global LUT rendering.', remaining:'Extend to regional and structural edits.'},
  {title:'Experiments were hard to compare', issue:'Splits, history counts and selection strategies changed across versions.', response:'Keep checkpoint, configuration and evaluation records together.', remaining:'Archive the complete final-run bundle.'}
]
</script>
<template>
  <div class="challenge-grid"><article v-for="(r,i) in rows" :key="r.title"><div class="challenge-heading"><span>0{{i+1}}</span><h2>{{r.title}}</h2></div><p class="challenge-issue">{{r.issue}}</p><div class="challenge-response"><span>→</span><p>{{r.response}}</p></div><p class="remaining"><strong>Next:</strong> {{r.remaining}}</p></article></div>
</template>
<style scoped>
.challenge-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px 54px;height:100%}.challenge-grid article{border-top:1px solid var(--line);padding-top:20px}.challenge-heading{display:flex;gap:19px;align-items:baseline}.challenge-heading>span{font-size:24px;color:var(--muted);font-weight:300}.challenge-heading h2{font-size:24px;margin:0}.challenge-issue{font-size:17px;color:var(--muted);margin:15px 0!important;max-width:490px}.challenge-response{display:flex;gap:17px;align-items:baseline;color:var(--blue)}.challenge-response>span{font-size:24px}.challenge-response p{font-size:21px;line-height:1.35}.remaining{font-size:14px;margin-top:17px!important;color:var(--muted)}.remaining strong{font-weight:500}
</style>
