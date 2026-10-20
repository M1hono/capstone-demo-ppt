<script setup>
import { ref } from 'vue'

const props = defineProps({
  samples: { type: Number, default: 256 },
  layers: { type: Number, default: 3 },
  bins: { type: Number, default: 8 },
})
const mode = ref('inference')
const points = Array.from({ length: 64 }, (_, index) => ({ x: ((index * 37) % 100) / 100, y: ((index * 61 + 13) % 100) / 100 }))
</script>

<template>
  <div class="flow-workbench">
    <div class="flow-header"><div><button :aria-pressed="mode==='training'" @click.stop="mode='training'">Training</button><button :aria-pressed="mode==='inference'" @click.stop="mode='inference'">Inference</button></div><span>Conditional normalizing flow · {{ layers }} layers · {{ bins }} RQS bins · bound ±6</span></div>
    <div class="flow-body">
      <div class="flow-panel"><b>{{ mode==='training'?'Ground-truth z':'Gaussian samples u' }}</b><div class="flow-cloud"><i v-for="(point,index) in points" :key="index" :style="{left:`${point.x*100}%`,top:`${point.y*100}%`,opacity:mode==='training'?.35:.65}"/></div><code>{{ mode==='training'?'z → u':'u ~ N(0,I)' }}</code><small>{{ mode==='training'?'one observed retouching vector':'N = '+samples+' Monte Carlo samples' }}</small></div>
      <div class="flow-arrow"><span>↔</span><small>invertible</small></div>
      <div class="flow-network"><b>Conditional flow</b><div class="flow-blocks"><i v-for="i in layers" :key="i" :style="{'--layer':i}"/></div><code>u = f(z,c)<br>z = f⁻¹(u,c)</code><small>conditioned on c ∈ ℝ³²</small></div>
      <div class="flow-arrow"><span>→</span><small>candidate z</small></div>
      <div class="flow-panel z-space"><b>Retouching space</b><div class="z-cloud"><i v-for="(point,index) in points" :key="index" :style="{left:`${(22+point.x*56)}%`,top:`${(18+point.y*64)}%`,background:index%3===0?'var(--coral)':index%3===1?'var(--blue)':'var(--mint)'}"/></div><code>z ∈ ℝ³</code><small>continuous preference distribution</small></div>
    </div>
    <div class="flow-note">Training maximises conditional log-likelihood. Inference samples multiple plausible retouching vectors; no checkpoint density is embedded in this fixture.</div>
  </div>
</template>

<style scoped>
.flow-workbench { border:1px solid var(--line); background:var(--surface); }.flow-header { display:flex; justify-content:space-between; align-items:center; padding:9px 13px; border-bottom:1px solid var(--line); color:var(--muted); font-size:11px; }.flow-header button { padding:5px 9px; border:1px solid var(--line); background:var(--paper); font-size:11px; }.flow-header button[aria-pressed=true] { color:#fff; background:var(--blue); border-color:var(--blue); }.flow-body { display:grid; grid-template-columns:1fr 55px 1fr 55px 1fr; gap:12px; align-items:center; padding:17px 14px; }.flow-panel,.flow-network { min-height:172px; padding:10px; border:1px solid var(--line); background:var(--paper); text-align:center; }.flow-panel>b,.flow-network>b { display:block; font-size:12px; }.flow-panel code,.flow-network code { display:block; margin-top:8px; font:10px var(--mono); color:var(--blue); }.flow-panel small,.flow-network small,.flow-arrow small { display:block; margin-top:5px; font-size:10px; color:var(--muted); }.flow-cloud,.z-cloud { position:relative; width:125px; height:105px; margin:13px auto 0; border:1px solid #d1dadd; background-image:radial-gradient(#cad7dc 1px,transparent 1px); background-size:10px 10px; }.flow-cloud i,.z-cloud i { position:absolute; width:4px; height:4px; border-radius:50%; background:var(--blue); }.z-cloud { border-radius:50%; background-color:#e8f0f1; }.flow-arrow { color:var(--blue); text-align:center; }.flow-arrow span { display:block; font-size:29px; }.flow-network { display:flex; flex-direction:column; justify-content:center; }.flow-blocks { display:flex; justify-content:center; gap:6px; margin:20px 0 10px; }.flow-blocks i { display:block; width:18px; height:62px; border:1px solid #7e9aaa; background:linear-gradient(180deg,#d2e0e5,calc(100% - var(--layer)*6%),#99b5c1); transform:skewY(-14deg); }.flow-note { padding:8px 13px; border-top:1px solid var(--line); color:var(--muted); font-size:11px; }
</style>
