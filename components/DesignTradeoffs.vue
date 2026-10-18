<script setup>
import { ref } from 'vue'
const selected = ref(0)
const decisions = [
  {name:'3-dimensional retouching space', symbol:'z ∈ ℝ³', benefit:'Compact enough to model a continuous density.', limit:'A narrow latent space limits the edits that can be represented.', role:'Represent the adjustment, while the original retains image content.'},
  {name:'Eight learnable LUT bases', symbol:'L = Σ aᵢBᵢ', benefit:'A few coefficients control global colour and tone.', limit:'Global LUTs do not supply local masks or structural editing.', role:'Decode each sampled vector into a reusable colour transformation.'},
  {name:'Transformer conditioning', symbol:'[E₁,z₁,…,E₀] → c', benefit:'Relates the current image to paired historical examples.', limit:'Pairing sensitivity is weak in the archived diagnostic.', role:'Infer image-dependent context without per-user weight updates.'},
  {name:'Conditional normalizing flow', symbol:'u ↔ z | c', benefit:'Continuous likelihood evaluation and invertible sampling.', limit:'A learned density alone does not validate subjective preferences.', role:'Represent several possible retouching adjustments.'},
  {name:'Monte Carlo and clustering', symbol:'256 samples → 5 candidates', benefit:'Condenses a sample pool into a manageable set of outputs.', limit:'Approximate selection cannot guarantee global density maxima.', role:'Turn a probability distribution into alternatives a user can inspect.'}
]
</script>
<template>
  <div class="stack design-tradeoffs"><div class="decision-layout grow"><nav class="decision-menu" aria-label="Architectural decisions"><button v-for="(d, i) in decisions" :key="d.name" :aria-pressed="selected === i" @click.stop="selected=i"><span>0{{i + 1}}</span>{{d.name}}<b v-if="selected === i">→</b></button></nav><div class="decision-detail"><p class="decision-symbol">{{decisions[selected].symbol}}</p><p class="statement">{{decisions[selected].role}}</p><div class="decision-balance"><div><h3>Enables</h3><p>{{decisions[selected].benefit}}</p></div><div><h3>Constrains</h3><p>{{decisions[selected].limit}}</p></div></div></div></div><p class="source-caption">Report design. The audited code adds global colour adjustments and has different Transformer-depth and candidate-ranking defaults; see the evidence index.</p></div>
</template>
<style scoped>
.decision-layout{display:grid;grid-template-columns:360px 1fr;gap:54px}.decision-menu{display:flex;flex-direction:column;justify-content:center}.decision-menu button{display:flex;gap:16px;text-align:left;padding:21px 0;font-size:18px;background:none!important;color:var(--ink)!important;border:0;border-bottom:1px solid var(--line)}.decision-menu button[aria-pressed=true]{color:var(--blue)!important}.decision-menu span{color:var(--muted);font-weight:300}.decision-menu b{margin-left:auto}.decision-detail{display:flex;flex-direction:column;justify-content:center;gap:27px}.decision-symbol{font-size:36px;color:var(--blue);letter-spacing:-1px}.decision-detail .statement{font-size:30px;max-width:680px}.decision-balance{display:grid;grid-template-columns:1fr 1fr;gap:30px;border-top:1px solid var(--line);padding-top:24px}.decision-balance p{font-size:18px;color:var(--muted)}
</style>
