<script setup>
const high = [
  {title:'Understand historical image–edit relationships', action:'Improve conditioning beyond a user’s average editing tendency.', verification:'Unseen-user metrics + historical pairing ablations'},
  {title:'Validate several acceptable edits', action:'Collect multiple edits for the same image and user.', verification:'Preference coverage + subjective user evaluation'},
  {title:'Compare methods under one protocol', action:'Match users, splits, reference counts and candidate selection.', verification:'PSNR / SSIM + complete run records'}
]
</script>
<template>
  <div class="stack priorities"><div class="priority-heading"><span>High priority</span><p>Strengthen personalization and the evidence used to judge it.</p></div><div class="priority-list"><article v-for="(item,i) in high" :key="item.title"><span class="priority-number">0{{i+1}}</span><div><h3>{{item.title}}</h3><p>{{item.action}}</p></div><div class="verify"><span>Verify with</span><p>{{item.verification}}</p></div></article></div><div class="later-priorities"><div><span class="small muted">Medium priority</span><h3>Regional edits and better candidate ranking</h3><p>Verify regional reconstruction and automatic Top-1 accuracy.</p></div><div><span class="small muted">Low priority</span><h3>Inference optimisation and repeatability</h3><p>Measure end-to-end latency, memory use and repeated runs.</p></div></div></div>
</template>
<style scoped>
.priorities{gap:22px}.priority-heading{display:flex;gap:28px;align-items:baseline}.priority-heading>span{font-size:16px;color:var(--blue)}.priority-heading p{font-size:24px;font-weight:400}.priority-list{flex:1}.priority-list article{display:grid;grid-template-columns:45px 1.6fr 1fr;gap:22px;border-top:1px solid var(--line);padding:21px 0}.priority-number{font-size:27px;font-weight:300;color:var(--blue)}.priority-list h3{font-size:21px;margin-bottom:7px}.priority-list p{font-size:17px;color:var(--muted)}.verify>span{font-size:13px;color:var(--muted)}.verify p{font-size:16px;color:var(--ink);margin-top:8px}.later-priorities{display:grid;grid-template-columns:1fr 1fr;gap:45px;border-top:1px solid var(--ink);padding-top:18px}.later-priorities h3{font-size:19px;margin:7px 0}.later-priorities p{font-size:15px;color:var(--muted)}
</style>
