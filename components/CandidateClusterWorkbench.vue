<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  clusters: { type: Number, default: 5 },
  samples: { type: Number, default: 256 },
})
const ranking = ref('size')
const colors = ['#d35b4e', '#4d83a4', '#d48b34', '#5f9a78', '#8b6cae']
const centers = [[24,62],[42,36],[59,64],[73,35],[82,70]]
const cloud = computed(() => Array.from({ length: props.clusters * 12 }, (_, index) => {
  const cluster = index % props.clusters
  const dx = ((index * 17) % 17) - 8
  const dy = ((index * 23) % 19) - 9
  return { cluster, x: centers[cluster][0] + dx, y: centers[cluster][1] + dy, rank: cluster + 1 }
}))
const candidates = computed(() => centers.map((point, index) => ({ ...point, index, score: ranking.value === 'size' ? 0.88 - index * 0.09 : 0.96 - index * 0.06 })))
const perCluster = computed(() => Math.floor(props.samples / props.clusters))
</script>

<template>
  <div class="candidate-workbench">
    <div class="candidate-header"><span><b>Monte Carlo samples → K-means → Top-K</b></span><div><button :aria-pressed="ranking==='size'" @click.stop="ranking='size'">Rank by cluster size</button><button :aria-pressed="ranking==='logp'" @click.stop="ranking='logp'">Rank by log p</button></div></div>
    <div class="candidate-body"><div class="candidate-plot"><span class="axis axis-x">z₁</span><span class="axis axis-y">z₂</span><i v-for="(point,index) in cloud" :key="index" class="candidate-dot" :style="{left:`${point.x}%`,top:`${point.y}%`,background:colors[point.cluster]}"/><div v-for="candidate in candidates" :key="candidate.index" class="cluster-center" :style="{left:`${candidate.x}%`,top:`${candidate.y}%`,'--cluster':colors[candidate.index]}"><span>Top {{ candidate.index + 1 }}</span></div></div><div class="candidate-list"><span class="list-label">Representative retouching vectors</span><div v-for="candidate in candidates" :key="candidate.index" class="candidate-row"><i :style="{background:colors[candidate.index]}"/><b>Top {{ candidate.index + 1 }}</b><code>log p {{ candidate.score.toFixed(2) }}</code><span>{{ perCluster }} samples / cluster</span></div></div></div>
    <div class="candidate-note">K = {{ clusters }} from the flow5 configuration. Points and scores are deterministic fixtures until the actual run payload is connected.</div>
  </div>
</template>

<style scoped>
.candidate-workbench { border:1px solid var(--line); background:var(--surface); }.candidate-header { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:9px 13px; border-bottom:1px solid var(--line); font-size:12px; }.candidate-header button { padding:5px 8px; border:1px solid var(--line); background:var(--paper); font-size:10px; }.candidate-header button[aria-pressed=true] { color:#fff; background:var(--blue); border-color:var(--blue); }.candidate-body { display:grid; grid-template-columns:1fr 260px; gap:20px; padding:15px; }.candidate-plot { position:relative; height:205px; border-left:1px solid var(--ink); border-bottom:1px solid var(--ink); background:radial-gradient(#d2dfe2 1px,transparent 1px); background-size:14px 14px; }.axis { position:absolute; color:var(--muted); font:10px var(--mono); }.axis-x { right:2px; bottom:-19px; }.axis-y { left:-24px; top:2px; transform:rotate(-90deg); }.candidate-dot { position:absolute; width:6px; height:6px; border-radius:50%; transform:translate(-50%,-50%); opacity:.72; }.cluster-center { position:absolute; width:16px; height:16px; border:2px solid var(--cluster); border-radius:50%; transform:translate(-50%,-50%); background:var(--paper); }.cluster-center span { position:absolute; left:11px; top:-9px; white-space:nowrap; color:var(--cluster); font:10px var(--mono); }.candidate-list { border-left:1px solid var(--line); padding-left:14px; }.list-label { display:block; color:var(--muted); font-size:11px; margin-bottom:7px; }.candidate-row { display:grid; grid-template-columns:12px 55px 75px 1fr; gap:6px; align-items:center; padding:8px 0; border-top:1px solid var(--line); font-size:10px; }.candidate-row i { width:10px; height:10px; border-radius:50%; }.candidate-row code { font:10px var(--mono); color:var(--blue); }.candidate-row span { color:var(--muted); text-align:right; }.candidate-note { padding:8px 13px; border-top:1px solid var(--line); color:var(--muted); font-size:10px; }
</style>
