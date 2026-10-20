<script setup>
import {ref,computed} from 'vue';import e from '../data/report-evidence.json'
const selection=ref(0);const item=computed(()=>e.discrepancies[selection.value]);const base=import.meta.env.BASE_URL
</script>
<template><div class="split wide-right"><div class="audit-list"><button v-for="(d,i) in e.discrepancies" :key="d.id" :aria-pressed="selection===i" @click.stop="selection=i"><span class="mono">{{d.id}}</span> {{d.item}}</button></div><div class="col"><h2>{{item.item}}</h2><div class="node"><h3>Report</h3><p>{{item.report}}</p></div><div class="node"><h3>Available source / record</h3><p>{{item.evidence}}</p></div><div class="sequence-emphasis"><h3>Presentation decision</h3><p>{{item.decision}}</p></div><div class="source-links"><a :href="base+'evidence/index.html'" target="_blank" rel="noopener">All evidence and missing assets</a><a :href="base+'evidence/source-manifest.json'" target="_blank" rel="noopener">Pinned source hashes</a></div></div></div></template>
<style scoped>.audit-list{display:flex;flex-direction:column;gap:5px}.audit-list button{text-align:left;padding:10px 14px}.audit-list span{margin-right:10px;font-size:12px}</style>
