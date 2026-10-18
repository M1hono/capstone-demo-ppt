<script setup>
import { ref, computed } from 'vue'
import e from '../data/report-evidence.json'
const selection = ref('D05')
const item = computed(() => e.discrepancies.find(d => d.id === selection.value))
const groups = [
  {name:'Model and inference', ids:['D05','D06','D08']},
  {name:'Results', ids:['D01','D03','D04']},
  {name:'Protocol and provenance', ids:['D02','D07','D09','D10']}
]
const base = import.meta.env.BASE_URL
</script>
<template>
  <div class="audit-layout">
    <nav class="audit-list" aria-label="Evidence discrepancies"><section v-for="group in groups" :key="group.name"><h3>{{group.name}}</h3><button v-for="id in group.ids" :key="id" :aria-pressed="selection===id" @click.stop="selection=id"><span>{{id}}</span>{{e.discrepancies.find(d=>d.id===id).item}}</button></section></nav>
    <article class="audit-detail"><div class="row spread"><p class="small muted">{{item.id}} · report / source comparison</p><a class="small" :href="base+'evidence/source-manifest.json'" target="_blank" rel="noopener">Source @ 9d85b9b ↗</a></div><h2>{{item.item}}</h2><div class="audit-comparison"><div><h3>Report</h3><p>{{item.report}}</p></div><div><h3>Available record</h3><p>{{item.evidence}}</p></div></div><div class="audit-decision"><h3>Presentation decision</h3><p>{{item.decision}}</p></div><div class="source-links"><a :href="base+'evidence/index.html'" target="_blank" rel="noopener">All evidence and missing assets</a><a :href="base+'evidence/phase2_diag.txt'" target="_blank" rel="noopener">Open the saved diagnostic</a></div></article>
  </div>
</template>
<style scoped>
.audit-layout{display:grid;grid-template-columns:325px 1fr;gap:48px;height:100%}.audit-list{display:flex;flex-direction:column;gap:18px}.audit-list h3{font-size:13px;color:var(--muted);margin:0 0 5px;font-weight:400}.audit-list button{width:100%;display:flex;gap:14px;text-align:left;padding:8px 12px;border:0;background:none;font-size:16px}.audit-list button span{font-size:12px;font-family:Menlo,monospace;align-self:center}.audit-list button[aria-pressed=true]{background:var(--pale);color:var(--blue)}.audit-detail{display:flex;flex-direction:column;gap:24px;padding-top:8px}.audit-detail h2{font-size:36px;margin:0}.audit-comparison{display:grid;grid-template-columns:1fr 1fr;gap:32px;border-top:1px solid var(--line);padding:26px 0}.audit-comparison h3{font-size:14px;color:var(--muted);font-weight:400;margin-bottom:16px}.audit-comparison p{font-size:23px;line-height:1.4}.audit-decision{padding-top:24px;border-top:1px solid var(--blue)}.audit-decision h3{font-size:16px;color:var(--blue)}.audit-decision p{font-size:24px}.audit-detail .source-links{margin-top:auto;padding-bottom:12px}
</style>
