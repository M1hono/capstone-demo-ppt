<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  basisCount: { type: Number, default: 8 },
  vector: { type: Array, default: () => [0.34, -0.12, 0.58] },
})
const vector = computed(() => props.vector)

const active = ref(0)
const weights = computed(() => Array.from({ length: props.basisCount }, (_, index) => {
  const raw = 0.15 + Math.abs(Math.sin(index * 1.37 + props.vector[index % props.vector.length] * 4))
  return raw
}))
const normalized = computed(() => {
  const total = weights.value.reduce((sum, value) => sum + value, 0)
  return weights.value.map(value => value / total)
})
const bases = computed(() => Array.from({ length: props.basisCount }, (_, index) => ({
  hue: 195 + index * 19,
  weight: normalized.value[index],
})))
</script>

<template>
  <div class="lut-assembly">
    <div class="lut-header"><span><b>z → 8 coefficients</b><code>[0.34, −0.12, 0.58]</code></span><span class="fixture-label">mechanism fixture · coefficients illustrative</span></div>
    <div class="lut-body">
      <div class="lut-vector"><span class="lut-label">Retouching vector z</span><div class="vector-stack"><i v-for="(value,index) in vector" :key="index" :style="{ '--value': value }"><b>{{ value.toFixed(2) }}</b></i></div><span class="lut-dim">z ∈ ℝ³</span></div>
      <span class="lut-arrow">→</span>
      <div class="lut-bases"><span class="lut-label">Learnable LUT bases</span><div class="basis-grid"><button v-for="(base,index) in bases" :key="index" :class="{active:active===index}" @click.stop="active=index"><span class="lut-cube" :style="{ '--hue': base.hue }"><i/><i/><i/></span><b>LUT{{ index + 1 }}</b><small>w{{ index + 1 }} {{ base.weight.toFixed(2) }}</small></button></div></div>
      <span class="lut-arrow">→</span>
      <div class="lut-output"><span class="lut-label">Weighted sum</span><div class="output-cube" :style="{ '--hue': bases[active].hue }"><i/><i/><i/></div><code>Σ wᵢ LUTᵢ</code><span>Final LUT → original image</span></div>
    </div>
    <div class="lut-note">Eight learnable bases are combined by weights predicted from z. The final image output requires a checkpoint payload.</div>
  </div>
</template>

<style scoped>
.lut-assembly { border:1px solid var(--line); background:var(--surface); }
.lut-header { display:flex; justify-content:space-between; align-items:center; gap:14px; padding:10px 13px; border-bottom:1px solid var(--line); font-size:13px; }.lut-header code { margin-left:14px; font:12px var(--mono); color:var(--blue); }.fixture-label { font-size:11px; color:var(--muted); }
.lut-body { display:grid; grid-template-columns:110px 24px 1fr 24px 125px; align-items:center; gap:10px; padding:16px 15px; }.lut-label { display:block; color:var(--muted); font-size:11px; margin-bottom:10px; }.lut-arrow { color:var(--blue); font-size:25px; text-align:center; }
.lut-vector,.lut-output { display:flex; flex-direction:column; align-items:center; gap:8px; text-align:center; }.vector-stack { width:45px; display:flex; flex-direction:column; gap:3px; }.vector-stack i { display:flex; justify-content:flex-end; align-items:center; height:29px; padding-right:5px; border:1px solid #8ea1ac; background:linear-gradient(90deg,#b8cbd3 calc(50% + var(--value)*40%),#e5eaea calc(50% + var(--value)*40%)); font-style:normal; }.vector-stack b { font:10px var(--mono); color:var(--ink); }.lut-dim,.lut-output span { font-size:11px; color:var(--muted); }.lut-output code { font:12px var(--mono); color:var(--blue); }
.basis-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:7px; }.basis-grid button { min-height:72px; padding:6px 3px; border:1px solid var(--line); background:var(--paper); text-align:center; }.basis-grid button.active { border-color:var(--blue); background:#e2edf0; }.basis-grid b,.basis-grid small { display:block; }.basis-grid b { font-size:10px; margin-top:2px; }.basis-grid small { font:9px var(--mono); color:var(--muted); margin-top:3px; }
.lut-cube,.output-cube { position:relative; display:block; width:30px; height:30px; margin:auto; transform:rotate(-28deg) skewY(10deg); }.lut-cube i,.output-cube i { position:absolute; inset:0; display:block; border:1px solid hsl(var(--hue) 35% 36%); }.lut-cube i:nth-child(1),.output-cube i:nth-child(1) { background:linear-gradient(135deg,hsl(var(--hue) 72% 70%),hsl(calc(var(--hue) + 55) 55% 52%)); transform:translate(5px,-5px); }.lut-cube i:nth-child(2),.output-cube i:nth-child(2) { background:linear-gradient(135deg,hsl(calc(var(--hue) + 35) 60% 60%),hsl(var(--hue) 60% 42%)); transform:translate(-5px,5px); }.lut-cube i:nth-child(3),.output-cube i:nth-child(3) { background:linear-gradient(135deg,hsl(calc(var(--hue) + 75) 65% 65%),hsl(calc(var(--hue) - 20) 65% 35%)); }
.output-cube { width:65px; height:65px; transform:rotate(-28deg) skewY(10deg); margin:8px auto 14px; }.lut-note { padding:9px 13px; border-top:1px solid var(--line); color:var(--muted); font-size:11px; }
</style>
