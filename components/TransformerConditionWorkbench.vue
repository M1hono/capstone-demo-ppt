<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  historyCount: { type: Number, default: 8 },
  layers: { type: Number, default: 4 },
  heads: { type: Number, default: 4 },
})
const focused = ref('condition')
const base = import.meta.env.BASE_URL
const tokens = computed(() => Array.from({ length: props.historyCount }, (_, index) => ({ image: `E${index + 1}`, edit: `z${index + 1}` })).concat([{ image: 'E₀', edit: null }]))
</script>

<template>
  <div class="transformer-workbench">
    <div class="transformer-header"><span><b>Current image + history → condition vector c</b></span><span class="fixture-label">flow5 config: {{ layers }} layers · {{ heads }} heads · DIM 32</span></div>
    <div class="transformer-body">
      <div class="transformer-inputs"><figure><img :src="`${base}assets/evidence/flowers-original.png`" alt="Current query image"/><figcaption>E₀ · current image</figcaption></figure><div class="history-mini"><span>History examples</span><div v-for="i in Math.min(historyCount,4)" :key="i"><img :src="`${base}assets/history-pairs/${String(i).padStart(4,'0')}-original.jpg`" :alt="`history original ${i}`"/><i>z{{ i }}</i></div><small>… {{ historyCount }} pairs</small></div></div>
      <div class="token-lane"><span class="lane-label">Alternating token sequence</span><button v-for="token in tokens" :key="token.image" :class="{focused:focused===token.image, query:token.image==='E₀'}" @click.stop="focused=token.image"><span>{{ token.image }}</span><b v-if="token.edit">{{ token.edit }}</b></button><code>(E₁,z₁,…,Eₙ,zₙ,E₀)</code></div>
      <div class="transformer-stack"><span class="lane-label">Transformer</span><button v-for="layer in layers" :key="layer" :class="{focused:focused==='layer'+layer}" @click.stop="focused='layer'+layer">Layer {{ layer }}</button><small>self-attention updates E₀</small></div>
      <div class="condition-output"><span class="lane-label">Condition vector</span><div class="condition-bars"><i v-for="i in 6" :key="i" :class="{active:focused==='condition' || i===2}"/></div><code>c ∈ ℝ³²</code><b @click.stop="focused='condition'">c</b></div>
    </div>
    <div class="transformer-note">The report describes two Transformer layers; the current flow5 code config is four. This component keeps the values explicit instead of merging versions.</div>
  </div>
</template>

<style scoped>
.transformer-workbench { border:1px solid var(--line); background:var(--surface); }.transformer-header { display:flex; justify-content:space-between; align-items:center; gap:15px; padding:10px 13px; border-bottom:1px solid var(--line); font-size:13px; }.fixture-label,.transformer-note { color:var(--muted); font-size:11px; }.transformer-body { display:grid; grid-template-columns:235px 1fr 130px 92px; gap:16px; align-items:center; padding:15px; }.transformer-inputs { display:grid; grid-template-columns:112px 1fr; gap:10px; }.transformer-inputs figure { margin:0; }.transformer-inputs figure img { width:108px; height:108px; object-fit:contain; }.transformer-inputs figcaption,.history-mini>span,.lane-label { display:block; font-size:11px; color:var(--muted); }.history-mini>div { display:flex; align-items:center; gap:4px; margin-top:6px; }.history-mini img { width:34px; height:25px; object-fit:cover; }.history-mini i { font:9px var(--mono); font-style:normal; color:var(--blue); }.history-mini small { display:block; margin-top:5px; color:var(--muted); font-size:10px; }
.token-lane { min-height:155px; padding-left:14px; border-left:1px solid var(--line); }.token-lane button { display:inline-flex; flex-direction:column; justify-content:center; min-width:31px; height:56px; margin:21px 2px 0 0; padding:3px; border:1px solid #aec0c8; background:var(--paper); vertical-align:top; }.token-lane button.focused { background:#d9e9ed; border-color:var(--blue); transform:translateY(-4px); }.token-lane button.query { border-color:var(--mint); }.token-lane button span { font:10px var(--mono); }.token-lane button b { font:9px var(--mono); color:var(--coral); margin-top:6px; }.token-lane code { display:block; margin-top:12px; font-size:10px; color:var(--muted); }
.transformer-stack { padding-left:12px; border-left:1px solid var(--line); }.transformer-stack button { display:block; width:100%; margin-top:8px; padding:7px 4px; border:1px solid #c2ced3; background:var(--paper); font-size:11px; }.transformer-stack button.focused { background:#e2edf0; border-color:var(--blue); }.transformer-stack small { display:block; margin-top:8px; font-size:10px; color:var(--muted); }.condition-output { padding-left:10px; border-left:1px solid var(--line); text-align:center; }.condition-bars { display:flex; align-items:end; justify-content:center; gap:3px; height:60px; margin-top:13px; }.condition-bars i { width:8px; height:20px; background:#b9cbd2; }.condition-bars i:nth-child(2n) { height:38px; }.condition-bars i:nth-child(3n) { height:50px; }.condition-bars i.active { background:var(--blue); }.condition-output code { display:block; margin-top:7px; font-size:10px; }.condition-output b { display:block; margin-top:9px; color:var(--blue); font:22px var(--mono); cursor:pointer; }.transformer-note { padding:8px 13px; border-top:1px solid var(--line); }
</style>
