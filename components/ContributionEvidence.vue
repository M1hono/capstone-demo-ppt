<script setup>
import e from '../data/report-evidence.json'
const summaries = {
  'Yuchen Deng':'React/FastAPI prototype; setup documentation; client and demo coordination.',
  'Gary Xu':'Completed contributions are not specified in the supplied evidence table.',
  'Sihan Fang':'Completed contributions are not specified in the supplied evidence table.',
  'Yiming Chen':'Progress-report reflections; presentation assistance; web-demo review.',
  'Yiheng Guo':'Recorded role: Doomsayer. Completed deliverables are not specified.',
  'Lunyan Wang':'Flow5 model, training pipeline and evaluation implementation.',
  'Weishao Su':'Team management and recorded meeting minutes.',
  'XingTang Chen':'Interactive presentation; FiveK image preparation; report assistance.',
  'Zihao Zhang':'Recorded role: Tracker. Completed deliverables are not specified.'
}
</script>
<template>
  <div class="team-contributions">
    <p class="team-intro">Nine contributors, one delivery chain.</p>
    <div class="member-grid" role="list" aria-label="Team contribution summary">
      <article v-for="member in e.contributions" :key="member.name" class="member-card" role="listitem"><h3>{{member.name}}</h3><p>{{summaries[member.name]}}</p></article>
    </div>
    <div class="contribution-foot"><p>Contribution scope follows report Table 6. The presentation implementation and its revision history are publicly available.</p><a href="https://github.com/M1hono/capstone-demo-ppt/commits/main/" target="_blank" rel="noopener">Presentation commit history ↗</a></div>
  </div>
</template>
<style scoped>
.team-contributions{display:flex;flex-direction:column;gap:20px;height:100%}.team-intro{font-size:21px;color:var(--muted)}.member-grid{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);column-gap:32px;row-gap:0;flex:1;min-height:0}.member-card{border-top:1px solid var(--line);padding:18px 8px 16px 0;display:flex;flex-direction:column;gap:10px;min-height:0}.member-card h3{font-size:23px;font-weight:500;line-height:1.2;margin:0}.member-card p{font-size:18px;line-height:1.4;color:var(--muted);margin:0;max-width:33ch}.contribution-foot{display:flex;gap:40px;justify-content:space-between;border-top:1px solid var(--ink);padding-top:16px;align-items:center}.contribution-foot p{font-size:14px;color:var(--muted);max-width:760px}.contribution-foot a{font-size:16px;white-space:nowrap}
</style>
