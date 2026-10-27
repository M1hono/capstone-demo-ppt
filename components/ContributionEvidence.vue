<script setup>
import e from '../data/report-evidence.json'
const summaries = {
  'Yuchen Deng':'Prototype; integration; client coordination.',
  'Gary Xu':'Completed work not specified in Table 6.',
  'Sihan Fang':'Completed work not specified in Table 6.',
  'Yiming Chen':'Progress reflections; presentation and demo review.',
  'Yiheng Guo':'Doomsayer; deliverables not specified.',
  'Lunyan Wang':'Flow5 model; training; evaluation.',
  'Weishao Su':'Team management; meeting minutes.',
  'XingTang Chen':'Interactive slides; FiveK preparation; report.',
  'Zihao Zhang':'Tracker; deliverables not specified.'
}
</script>
<template>
  <div class="team-contributions">
    <p class="team-intro">Nine contributors, one delivery chain.</p>
    <div class="member-grid" role="list" aria-label="Team contribution summary">
      <article v-for="member in e.contributions" :key="member.name" class="member-card" role="listitem"><div class="member-heading"><span class="member-initials">{{member.name.split(' ').map(n=>n[0]).join('')}}</span><div><h3>{{member.name}}</h3></div></div><p>{{summaries[member.name]}}</p></article>
    </div>
    <div class="contribution-foot"><p>Contributions: report Table 6. Deliverable gaps remain explicit.</p><span>Research → development → evaluation → delivery</span></div>
  </div>
</template>
<style scoped>
.team-contributions{display:flex;flex-direction:column;gap:20px;height:100%}.team-intro{font-size:21px;color:var(--muted)}.member-grid{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);column-gap:32px;row-gap:0;flex:1;min-height:0}.member-card{border-top:1px solid var(--line);padding:18px 8px 16px 0;display:flex;flex-direction:column;gap:10px;min-height:0}.member-card h3{font-size:23px;font-weight:500;line-height:1.2;margin:0}.member-card p{font-size:18px;line-height:1.4;color:var(--muted);margin:0;max-width:33ch}.contribution-foot{display:flex;gap:40px;justify-content:space-between;border-top:1px solid var(--ink);padding-top:16px;align-items:center}.contribution-foot p{font-size:14px;color:var(--muted);max-width:760px}.contribution-foot a{font-size:16px;white-space:nowrap}
</style>

<style scoped>
.member-heading{display:flex;gap:14px;align-items:center}.member-initials{font:500 23px Saira;display:grid;place-items:center;background:var(--pale);width:48px;height:48px;flex:none}.member-heading small{font-size:13px;letter-spacing:.6px;color:var(--muted)}.member-card{padding-top:14px;padding-bottom:12px;gap:8px}.member-card h3{font-size:21px}.member-card p{font-size:16px}.team-contributions{gap:14px}
</style>
