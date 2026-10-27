<script setup>
import { useSequence } from '../composables/useSequence'
const sequence = useSequence(['One recorded edit', 'Several possible regions', 'Condition on image and history'])
</script>
<template>
  <div class="stack preference-density">
    <div class="density-layout grow"><aside><div class="retrieval"><strong>≈30%</strong><span>Early similarity-retrieval accuracy</span></div><h2>Similarity alone<br>is not enough.</h2><p class="formula">P(z | image, history)</p></aside>
      <svg viewBox="0 0 730 350" role="img" aria-label="A single recorded edit and an illustrative multimodal probability density">
        <path d="M65 280 H700 M65 280 V30" fill="none" stroke="var(--muted)"/>
        <text x="70" y="22">Density</text><text x="380" y="332" text-anchor="middle">Continuous retouching space</text>
        <g :class="{dim:sequence.step.value<1}"><path d="M65 280 C100 280 107 70 190 70 C264 70 254 270 325 270 C387 270 391 135 461 135 C535 135 534 280 700 280" fill="var(--pale)" stroke="var(--ink)" stroke-width="3"/><text x="190" y="50" text-anchor="middle">Possible edit A</text><text x="465" y="115" text-anchor="middle">Possible edit B</text></g>
        <path d="M211 280 V178" stroke="var(--muted)" stroke-dasharray="5 5"/><circle cx="211" cy="280" r="7" fill="var(--ink)"/><text x="211" y="306" text-anchor="middle">Recorded target</text>
        <g :class="{dim:sequence.step.value<2}"><rect x="405" y="28" width="290" height="42" fill="var(--surface)"/><text x="550" y="56" text-anchor="middle">Current image + 8 history pairs</text></g>
      </svg>
    </div>
    <p class="readout">One recorded edit is an observation; a conditional density can represent several possible edits.</p>
    <p class="source-caption">Conceptual density. A single recorded target cannot validate every candidate preference.</p>
  </div>
</template>
<style scoped>
.preference-density{gap:18px}.density-layout{display:grid;grid-template-columns:340px 1fr;gap:40px;align-items:center}.density-layout aside{display:grid;gap:25px}.retrieval{display:grid;gap:4px}.retrieval strong{font:600 78px/1 Saira}.retrieval span{font-size:17px;color:var(--muted)}.density-layout h2{font-size:32px;line-height:1.2;margin:0}.density-layout .formula{font-size:22px}.density-layout svg{width:100%}.density-layout svg text{font:18px 'IBM Plex Sans';fill:var(--muted)}.density-layout g{transition:opacity 450ms}.dim{opacity:.08}
</style>
