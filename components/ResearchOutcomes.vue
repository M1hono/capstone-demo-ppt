<script setup>
const goals = [
  ['01', 'Automatic', 'No editing instructions', '3D space', 'Compact retouching representation'],
  ['02', 'Generalizable', 'No user-specific fine-tuning', 'Transformer', 'Image and history conditioning'],
  ['03', 'Multimodal', 'Several candidate edits', 'Flow', 'Continuous conditional density']
]
</script>
<template>
  <div class="stack outcomes">
    <p class="outcome-intro">Three objectives. One shared model.</p>
    <div class="goal-columns grow"><article v-for="[id,title,detail,value,label] in goals" :key="id"><span class="goal-id">OBJECTIVE {{id}}</span><h2>{{title}}</h2><p>{{detail}}</p><div class="goal-result"><strong>{{value}}</strong><span>{{label}}</span></div></article></div>
    <div class="goal-architecture"><span><b>3D</b> edit space</span><span>→</span><span>Transformer condition</span><span>→</span><span>Conditional Flow</span></div>
    <p class="source-caption">A two-stage architecture supports automatic, training-free, multimodal retouching.</p>
  </div>
</template>
<style scoped>
.outcomes{gap:27px}.outcome-intro{font-size:25px;color:var(--muted)}.goal-columns{display:grid;grid-template-columns:repeat(3,1fr);gap:42px;align-items:center}.goal-columns article{border-top:2px solid var(--ink);padding-top:20px}.goal-id{font:16px Saira;color:var(--muted);letter-spacing:1.4px}.goal-columns h2{font-size:38px;margin:22px 0 10px}.goal-columns p{font-size:21px;color:var(--muted)}.goal-result{display:grid;gap:6px;margin-top:40px}.goal-result strong{font:600 38px/1.1 Saira}.goal-result span{font-size:17px;color:var(--muted)}.goal-architecture{display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--ink);padding-top:22px;font-size:23px}.goal-architecture b{font-weight:600}
</style>
