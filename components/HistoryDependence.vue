<script setup>
import { databasePairs, referencePairs } from '../data/history-examples'
const base=import.meta.env.BASE_URL
</script>
<template>
  <div class="history-dependence manuscript-scene">
    <p class="limitation-statement">It does not yet construct an independent and persistent representation of the user.</p>
    <svg viewBox="0 0 1168 310" role="img" aria-label="Current inference depends on the historical image database: partial edit, history search, reference selection and cross-attention. The user preference remains distributed across image pairs.">
      <defs><marker id="history-dependence-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#437a95"/></marker></defs>
      <g><text x="99" y="33" text-anchor="middle">Partial Edit</text><rect x="17" y="69" width="164" height="146" class="dependence-panel"/><image :href="`${base}assets/next-step/partial-clue.png`" x="26" y="69" width="146" height="146" preserveAspectRatio="xMidYMid meet"/></g>
      <g class="dependence-wire"><path d="M195 141 H309"/></g>
      <g class="dependence-database"><text x="433" y="33" text-anchor="middle">Search Historical Images</text><path d="M325 66 L546 55 L546 228 L325 239z" class="dependence-back"/><rect x="314" y="72" width="220" height="171" class="dependence-panel"/>
        <g v-for="(pair,i) in databasePairs" :key="pair.id" :transform="`translate(${323+i%2*105},${83+Math.floor(i/2)*50})`"><rect width="98" height="43" class="dependence-pair" :class="{'chosen':referencePairs.includes(pair)}"/><image :href="`${base}${pair.original}`" x="3" y="3" width="44" height="37" preserveAspectRatio="xMidYMid meet"/><image :href="`${base}${pair.edited}`" x="51" y="3" width="44" height="37" preserveAspectRatio="xMidYMid meet"/></g>
        <text x="426" y="279" text-anchor="middle" class="dependence-small">Historical image-edit pairs</text>
      </g>
      <g class="dependence-wire"><path d="M560 141 H650"/></g>
      <g class="dependence-reference"><text x="739" y="33" text-anchor="middle">Select References</text><g v-for="(pair,i) in referencePairs" :key="pair.id" :transform="`translate(671,${75+i*51})`"><rect width="139" height="47" class="dependence-selected"/><image :href="`${base}${pair.original}`" x="4" y="4" width="62" height="39" preserveAspectRatio="xMidYMid meet"/><image :href="`${base}${pair.edited}`" x="74" y="4" width="62" height="39" preserveAspectRatio="xMidYMid meet"/></g></g>
      <g class="dependence-wire"><path d="M816 141 H927"/></g>
      <g class="dependence-attention"><text x="1048" y="33" text-anchor="middle">Cross-Attention</text><rect x="940" y="83" width="218" height="132" class="dependence-panel"/><g v-for="r in 4" :key="r"><rect v-for="c in 6" :key="c" :x="957+(c-1)*31" :y="99+(r-1)*25" width="27" height="21" :class="r===2?'dependence-specified':'dependence-cell'"/></g></g>
    </svg>
    <p class="limitation-definition">history-conditioned personalized image enhancement</p>
    <div class="mechanism-reading"><p>The user’s preference currently remains distributed across the historical image database instead of being compressed into an explicit internal representation.</p></div>
    <p class="mechanism-provenance">Original → Expert C · real FiveK pairs; partial edit and reference selection are illustrative.</p>
  </div>
</template>
