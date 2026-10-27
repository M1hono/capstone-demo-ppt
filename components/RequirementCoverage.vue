<script setup>
const groups = [
  {id:'FR-01',title:'Automatic retouching',cases:[['01','PSNR / SSIM'],['02','Existing methods'],['05','Wrong history'],['06','Wrong image']]},
  {id:'FR-02',title:'Unseen users',cases:[['03','Held-out Expert E'],['04','50 PPSD users']]},
  {id:'FR-03',title:'Multiple candidates',cases:[['07','History-conditioned density'],['08','Top-1 / Best-of-K'],['09','Candidate comparisons']]}
]
</script>
<template>
  <div class="stack coverage-map">
    <div class="coverage-summary"><span><b>9</b> controlled checks</span><span><b>3</b> requirements</span><span><b>Fixed</b> inference weights</span></div>
    <div class="coverage-columns grow"><article v-for="group in groups" :key="group.id"><p class="requirement-id">{{group.id}}</p><h2>{{group.title}}</h2><ol><li v-for="[id,label] in group.cases" :key="id"><span>TC-{{id}}</span>{{label}}</li></ol></article></div>
    <p class="coverage-boundary">Prediction → held-out evaluation → conditioning and candidate analysis</p>
    <p class="source-caption">Nine experimental checks evaluate automatic retouching, unseen-user adaptation and multimodal prediction.</p>
  </div>
</template>
<style scoped>
.coverage-map{gap:25px}.coverage-summary{display:flex;gap:80px;border-bottom:1px solid var(--line);padding-bottom:18px;font-size:18px;color:var(--muted)}.coverage-summary b{font:600 34px Saira;color:var(--ink);margin-right:9px}.coverage-columns{display:grid;grid-template-columns:1fr 1fr 1fr;gap:36px}.coverage-columns article{border-right:1px solid var(--line);padding-right:25px}.coverage-columns article:last-child{border:0}.requirement-id{font:20px Menlo;color:var(--muted)}.coverage-columns h2{font-size:27px;margin:14px 0 24px}.coverage-columns ol{list-style:none;padding:0;margin:0;display:grid;gap:21px}.coverage-columns li{font-size:19px;display:flex;align-items:center;gap:16px}.coverage-columns li span{font:14px Menlo;white-space:nowrap;padding:8px;background:var(--pale)}.coverage-boundary{font-size:20px;border-top:1px solid var(--ink);padding-top:18px}
</style>
