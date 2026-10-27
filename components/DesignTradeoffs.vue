<script setup>
import { ref } from 'vue'
const selected = ref(0)
const decisions = [
  {name:'3D retouching space', symbol:'z ∈ ℝ³', benefit:'Compact, continuous density.', limit:'Limited edit capacity.', role:'Model the edit; preserve image content.'},
  {name:'Eight learnable LUT bases', symbol:'L = Σ aᵢBᵢ', benefit:'Compact global colour control.', limit:'No local masks or structural edits.', role:'Decode vectors into colour transforms.'},
  {name:'Transformer conditioning', symbol:'[E₁,z₁,…,E₀] → c', benefit:'Relates the query to historical pairs.', limit:'Weak pairing sensitivity in diagnostics.', role:'Infer context without per-user training.'},
  {name:'Conditional normalizing flow', symbol:'u ↔ z | c', benefit:'Exact likelihood; invertible sampling.', limit:'Density is not preference validation.', role:'Represent multiple plausible edits.'},
  {name:'Monte Carlo and clustering', symbol:'256 samples → 5 candidates', benefit:'Reduces samples to five candidates.', limit:'No guarantee of global maxima.', role:'Turn the density into inspectable choices.'}
]
</script>
<template>
  <div class="stack design-tradeoffs"><div class="decision-layout grow"><nav class="decision-menu" aria-label="Architectural decisions"><button v-for="(d, i) in decisions" :key="d.name" :aria-pressed="selected === i" @click.stop="selected=i"><span>0{{i + 1}}</span>{{d.name}}<b v-if="selected === i">→</b></button></nav><div class="decision-detail"><p class="decision-symbol">{{decisions[selected].symbol}}</p><p class="statement">{{decisions[selected].role}}</p><div class="decision-balance"><div><h3>Enables</h3><p>{{decisions[selected].benefit}}</p></div><div><h3>Constrains</h3><p>{{decisions[selected].limit}}</p></div></div></div></div><p class="source-caption">Report architecture; saved depth and ranking defaults differ. Details in source notes.</p></div>
</template>
<style scoped>
.decision-layout{display:grid;grid-template-columns:360px 1fr;gap:54px}.decision-menu{display:flex;flex-direction:column;justify-content:center}.decision-menu button{display:flex;gap:16px;text-align:left;padding:21px 0;font-size:18px;background:none!important;color:var(--ink)!important;border:0;border-bottom:1px solid var(--line)}.decision-menu button[aria-pressed=true]{color:var(--blue)!important}.decision-menu span{color:var(--muted);font-weight:300}.decision-menu b{margin-left:auto}.decision-detail{display:flex;flex-direction:column;justify-content:center;gap:27px}.decision-symbol{font-size:36px;color:var(--blue);letter-spacing:-1px}.decision-detail .statement{font-size:30px;max-width:680px}.decision-balance{display:grid;grid-template-columns:1fr 1fr;gap:30px;border-top:1px solid var(--line);padding-top:24px}.decision-balance p{font-size:18px;color:var(--muted)}
</style>
