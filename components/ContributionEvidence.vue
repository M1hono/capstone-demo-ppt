<script setup>
import e from '../data/report-evidence.json'

const base = import.meta.env.BASE_URL
const members = e.contributions.map((member, index) => ({
  ...member,
  number: String(index + 1).padStart(2, '0'),
}))

function evidenceLabel(status) {
  if (/awaiting|role only/i.test(status)) return 'Role recorded · evidence pending'
  if (/source/i.test(status)) return 'Report + source history'
  return 'Report-supported record'
}

function evidenceTone(status) {
  return /awaiting|role only/i.test(status) ? 'pending' : 'supported'
}
</script>

<template>
  <div class="team-contributions">
    <div class="contribution-intro">
      <div>
        <p class="lead">Nine contributors, one delivery chain.</p>
        <p class="small muted">The report-backed map keeps research, application, presentation and coordination roles visible at the same scale.</p>
      </div>
      <div class="contribution-count"><strong>09</strong><span>members</span></div>
    </div>

    <div class="member-grid" role="list" aria-label="Team contribution summary">
      <article v-for="member in members" :key="member.name" class="member-card" role="listitem">
        <div class="member-top"><span class="member-number">{{ member.number }}</span><span class="member-status" :class="evidenceTone(member.status)">{{ evidenceLabel(member.status) }}</span></div>
        <h3>{{ member.name }}</h3>
        <p class="member-work">{{ member.work }}</p>
        <p class="member-source">{{ member.status }}</p>
      </article>
    </div>

    <div class="contribution-foot">
      <p>Detailed contribution statements, source records and evidence boundaries are maintained in the submission Markdown files.</p>
      <div class="link-row">
        <a :href="base + 'evidence/TEAM-CONTRIBUTIONS.md'" target="_blank" rel="noopener">Open team contribution record ↗</a>
        <a :href="base + 'evidence/XINGTANG-CHEN-EVIDENCE.md'" target="_blank" rel="noopener">Open detailed evidence portfolio ↗</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team-contributions{height:100%;display:flex;flex-direction:column;gap:14px}.contribution-intro{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid var(--line);padding-bottom:13px}.contribution-intro .lead{font-size:23px;line-height:1.2;margin:0 0 5px}.contribution-intro .small{margin:0;max-width:780px}.contribution-count{display:flex;align-items:baseline;gap:7px;color:var(--blue);white-space:nowrap}.contribution-count strong{font-size:42px;font-weight:300;letter-spacing:-2px}.contribution-count span{font-size:13px;color:var(--muted)}.member-grid{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,minmax(0,1fr));gap:10px;flex:1;min-height:0}.member-card{display:flex;flex-direction:column;min-height:0;overflow:hidden;border:1px solid var(--line);background:var(--surface);padding:12px 14px}.member-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.member-number{font:300 22px/1 Menlo,monospace;color:var(--blue)}.member-status{font-size:10px;line-height:1.2;letter-spacing:.02em;text-align:right;color:var(--blue);max-width:140px}.member-status.pending{color:var(--muted)}.member-card h3{font-size:17px;line-height:1.2;font-weight:500;margin:8px 0 5px}.member-work{font-size:13px;line-height:1.32;margin:0;flex:1;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3}.member-source{font-size:11px;line-height:1.25;color:var(--muted);border-top:1px solid var(--line);padding-top:7px;margin:9px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.contribution-foot{display:flex;justify-content:space-between;align-items:center;gap:20px;border-top:1px solid var(--ink);padding-top:10px}.contribution-foot p{font-size:12px;color:var(--muted);margin:0}.link-row{display:flex;gap:18px;white-space:nowrap}.link-row a{font-size:12px;color:var(--blue)}
.member-work{font-size:12.5px;line-height:1.3;-webkit-line-clamp:2}.member-source{font-size:10.5px;line-height:1.2;min-height:25px;white-space:normal;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.member-card{padding:9px 12px}.member-number{font-size:20px}.member-status{font-size:9.5px;max-width:125px}.member-card h3{font-size:16px;margin:5px 0 3px}.member-work{font-size:12px;line-height:1.25;min-height:30px;flex:none}.member-source{font-size:10px;line-height:1.15;min-height:18px;margin:4px 0 0;padding-top:5px;-webkit-line-clamp:1}
</style>
