<script setup>
import { useSequence } from '../composables/useSequence'
const stages = [
  ['Research', 'Review literature', 'Agree on a testable hypothesis.'],
  ['Prototype', 'Build & integrate', 'Coordinate model interfaces in GitHub.'],
  ['Evaluate', 'Run experiments', 'Compare findings and feasibility.'],
  ['Review', 'Discuss with client', 'Adjust priorities and responsibilities.']
]
const sequence = useSequence(stages.map(s=>s[0]))
</script>
<template>
  <div class="stack collaboration">
    <div class="collaboration-tools"><div><span>ENGINEERING</span><h2>GitHub</h2><p>Version control · integration</p></div><div><span>COMMUNICATION</span><h2>Zoom + WeChat</h2><p>Client reviews · team alignment</p></div><div><span>DELIVERY</span><h2>9 members</h2><p>Shared, evolving responsibilities</p></div></div>
    <div class="collaboration-loop grow"><article v-for="(stage,i) in stages" :key="stage[0]" :class="{active:!sequence.complete.value && sequence.step.value===i}"><div class="stage-head"><span>0{{i+1}}</span><b v-if="i<3">→</b><b v-else>↺</b></div><h3>{{stage[0]}}</h3><p>{{stage[1]}}</p><p class="stage-detail">{{stage[2]}}</p></article></div>

    <p class="source-caption">Self-managed research workflow with regular client communication.</p>
  </div>
</template>
<style scoped>
.collaboration{gap:26px}.collaboration-tools{display:grid;grid-template-columns:1fr 1fr 1fr;gap:45px}.collaboration-tools>div{border-bottom:1px solid var(--line);padding-bottom:22px}.collaboration-tools span{font-size:13px;letter-spacing:1.8px;color:var(--muted)}.collaboration-tools h2{font-size:30px;margin:12px 0 5px}.collaboration-tools p{font-size:18px;color:var(--muted)}.collaboration-loop{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;align-content:center}.collaboration-loop article{border-top:3px solid var(--line);padding:15px 20px 20px;background:var(--surface);transition:background 300ms,border-color 300ms}.collaboration-loop article.active{border-color:var(--ink);background:var(--pale)}.stage-head{display:flex;justify-content:space-between;font:29px Saira;color:var(--muted)}.stage-head b{font-weight:400}.collaboration-loop h3{font-size:26px;margin:20px 0 8px}.collaboration-loop p{font-size:19px;color:var(--muted)}
</style>
<style scoped>.collaboration-loop .stage-detail{font-size:18px;line-height:1.4;border-top:1px solid var(--line);margin-top:18px;padding-top:15px}</style>
