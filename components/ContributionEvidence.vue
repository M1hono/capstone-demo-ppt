<script setup>
import { computed, ref } from 'vue'
import e from '../data/report-evidence.json'
import artifacts from '../data/personal-artifacts.json'
const view = ref('personal')
const selected = ref(0)
const artifact = computed(() => artifacts[selected.value])
const base = import.meta.env.BASE_URL
</script>
<template>
  <div class="stack contributions">
    <div class="row spread"><div class="tabs"><button :aria-pressed="view==='personal'" @click.stop="view='personal'">XingTang Chen</button><button :aria-pressed="view==='team'" @click.stop="view='team'">All nine members</button></div><span class="small muted">Presentation engineering · xche0557 / M1hono</span></div>
    <template v-if="view==='personal'">
      <div class="contribution-layout grow">
        <div class="contribution-list"><button v-for="(item, i) in e.personalEvidence" :key="item.hash" :aria-pressed="selected===i" @click.stop="selected=i"><span class="contribution-number">0{{i+1}}</span><span><strong>{{item.title}}</strong><small>{{item.description}}</small></span></button></div>
        <article class="source-document">
          <div class="source-document-header"><span>Original source artifact</span><a :href="artifact.url" target="_blank" rel="noopener">{{artifact.short}} ↗</a></div>
          <h3>{{artifact.path}}</h3><p class="small muted">{{artifact.author}} · {{artifact.date}} · lines {{artifact.start}}–{{artifact.end}}</p>
          <pre><code><span v-for="(line, i) in artifact.excerpt.split('\n')" :key="i"><b>{{artifact.start+i}}</b>{{line}}<br/></span></code></pre>
          <div class="source-links"><a :href="base+artifact.asset" target="_blank" rel="noopener">Open complete file</a><a :href="base+'evidence/personal/index.json'" target="_blank" rel="noopener">Source hashes</a></div>
          <p v-if="selected===2" class="source-caption">Earlier architecture: evidence of tensor-flow documentation, not the final flow5 model.</p>
        </article>
      </div>
      <p class="contribution-scope">The report records PPT ownership, report assistance and Week 2 minute-taking. Lunyan Wang reviewed research content. Model development and training remain team research contributions.</p>
    </template>
    <table v-else class="evidence-table compact"><thead><tr><th>Member</th><th>Supported contribution</th><th>Evidence status</th></tr></thead><tbody><tr v-for="member in e.contributions" :key="member.name" :class="{highlight:member.name==='XingTang Chen'}"><td style="white-space:nowrap">{{member.name}}</td><td>{{member.work}}</td><td>{{member.status}}</td></tr></tbody></table>
  </div>
</template>
<style scoped>
.contributions{gap:20px}.contribution-layout{display:grid;grid-template-columns:1fr 1.35fr;gap:38px;min-height:0}.contribution-list{display:flex;flex-direction:column;justify-content:center}.contribution-list button{display:flex;gap:18px;padding:17px 0;border:0;border-bottom:1px solid var(--line);background:none!important;color:var(--ink)!important;text-align:left}.contribution-list button[aria-pressed=true] strong{color:var(--blue)}.contribution-number{font-size:25px;font-weight:300;color:var(--muted)}.contribution-list strong{display:block;font-size:20px;font-weight:500}.contribution-list small{display:block;font-size:14px;line-height:1.45;color:var(--muted);margin-top:7px}.source-document{display:flex;flex-direction:column;gap:10px;background:var(--surface);padding:21px 24px;min-width:0;min-height:0}.source-document-header{display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;color:var(--muted)}.source-document h3{font-size:19px;overflow-wrap:anywhere;margin:0}.source-document pre{flex:1;min-height:0;font:12px/1.7 Menlo,monospace;white-space:pre-wrap;overflow:auto;margin:8px 0;background:transparent!important;padding:0!important}.source-document code{padding:0!important;background:none!important}.source-document code b{display:inline-block;width:28px;color:#788493;font-weight:400;user-select:none}.source-document .source-links{padding-top:8px;border-top:1px solid var(--line)}.contribution-scope{font-size:15px;color:var(--muted);border-top:1px solid var(--line);padding-top:14px}
</style>
