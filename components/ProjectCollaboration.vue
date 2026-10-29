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
    <div class="collaboration-tools">
      <div class="tool-card"><span class="tool-index">01</span><span class="tool-type">ENGINEERING</span><h2>GitHub</h2><p>Version control · integration</p></div>
      <div class="tool-card"><span class="tool-index">02</span><span class="tool-type">COMMUNICATION</span><h2>Zoom + WeChat</h2><p>Client reviews · team alignment</p></div>
      <div class="tool-card"><span class="tool-index">03</span><span class="tool-type">DELIVERY</span><h2>9 members</h2><p>Shared, evolving responsibilities</p></div>
    </div>
    <div class="collaboration-loop grow"><article v-for="(stage,i) in stages" :key="stage[0]" :class="{active:!sequence.complete.value && sequence.step.value===i}"><div class="stage-head"><span>0{{i+1}}</span><b v-if="i<3">→</b><b v-else>↺</b></div><h3>{{stage[0]}}</h3><p>{{stage[1]}}</p><p class="stage-detail">{{stage[2]}}</p></article></div>

    <p class="source-caption">Self-managed research workflow with regular client communication.</p>
  </div>
</template>
<style scoped>
.collaboration{gap:20px}
.collaboration-tools{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.tool-card{position:relative;min-height:124px;padding:15px 18px 16px;border:1px solid var(--line);background:var(--panel);border-radius:6px;box-shadow:inset 0 1px 0 rgba(255,255,255,.55)}
.tool-card:nth-child(2),.tool-card:nth-child(3){background:var(--panel)}
.tool-index{position:absolute;right:15px;top:14px;font:650 12px/1 Saira;color:var(--muted)}
.tool-type{font:650 10px/1.2 Saira;letter-spacing:1.4px;color:var(--muted)}
.collaboration-tools h2{font-size:29px;margin:18px 0 5px;letter-spacing:-.3px}
.collaboration-tools p{font-size:16px;color:var(--muted)}
.collaboration-loop{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;align-content:center}
.collaboration-loop article{position:relative;border:1px solid var(--line);border-top:1px solid var(--ink);padding:14px 17px 17px;background:var(--surface);border-radius:4px;transition:background 300ms,border-color 300ms,transform 300ms}
.collaboration-loop article:nth-child(2),.collaboration-loop article:nth-child(3),.collaboration-loop article:nth-child(4){border-top-color:var(--ink)}
.collaboration-loop article.active{border-color:var(--ink);background:var(--pale);transform:translateY(-2px)}
.stage-head{display:flex;justify-content:space-between;font:650 27px Saira;color:var(--muted)}
.stage-head b{font-weight:400;color:var(--muted)}
.collaboration-loop h3{font-size:24px;margin:18px 0 7px}
.collaboration-loop p{font-size:17px;color:var(--muted)}
</style>
<style scoped>.collaboration-loop .stage-detail{font-size:16px;line-height:1.4;border-top:1px solid var(--line);margin-top:16px;padding-top:12px}</style>
