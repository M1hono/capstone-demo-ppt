<template>
  <div class="history-dependence manuscript-scene">
    <p class="limitation-statement">It does not yet construct an independent and persistent representation of the user.</p>
    <svg viewBox="0 0 1168 310" role="img" aria-label="Current inference depends on the historical image database: partial edit, history search, reference selection and cross-attention. The user preference remains distributed across image pairs.">
      <defs><marker id="history-dependence-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#437a95"/></marker></defs>
      <g><text x="99" y="33" text-anchor="middle">Partial Edit</text><rect x="17" y="69" width="164" height="146" class="dependence-panel"/><g v-for="r in 3" :key="r"><rect v-for="c in 4" :key="c" :x="30+(c-1)*35" :y="83+(r-1)*39" width="31" height="34" :class="r===2 && (c===2 || c===3)?'dependence-specified':'dependence-cell'"/></g></g>
      <g class="dependence-wire"><path d="M195 141 H309"/></g>
      <g class="dependence-database"><text x="433" y="33" text-anchor="middle">Search Historical Images</text><path d="M325 66 L546 55 L546 228 L325 239z" class="dependence-back"/><rect x="314" y="72" width="220" height="171" class="dependence-panel"/><g v-for="n in 6" :key="n"><rect :x="331+(n-1)%3*65" :y="91+Math.floor((n-1)/3)*67" width="55" height="52" class="dependence-pair" :class="{'chosen':[1,3,5].includes(n)}"/><path :d="`M${357+(n-1)%3*65} ${99+Math.floor((n-1)/3)*67} v36`" class="dependence-rule"/></g><text x="426" y="279" text-anchor="middle" class="dependence-small">Historical image-edit pairs</text></g>
      <g class="dependence-wire"><path d="M560 141 H650"/></g>
      <g class="dependence-reference"><text x="739" y="33" text-anchor="middle">Select References</text><g v-for="n in 3" :key="n" :transform="`translate(${686+(n-1)*13},${92+(n-1)*14})`"><rect width="85" height="91" class="dependence-selected"/><path d="M42 10 V78" class="dependence-rule"/></g></g>
      <g class="dependence-wire"><path d="M816 141 H927"/></g>
      <g class="dependence-attention"><text x="1048" y="33" text-anchor="middle">Cross-Attention</text><rect x="940" y="83" width="218" height="132" class="dependence-panel"/><g v-for="r in 4" :key="r"><rect v-for="c in 6" :key="c" :x="957+(c-1)*31" :y="99+(r-1)*25" width="27" height="21" :class="r===2?'dependence-specified':'dependence-cell'"/></g></g>
    </svg>
    <p class="limitation-definition">history-conditioned personalized image enhancement</p>
    <div class="mechanism-reading"><p>The user’s preference currently remains distributed across the historical image database instead of being compressed into an explicit internal representation.</p></div>
    <p class="mechanism-provenance">Schematic image pairs and attention; no measured retrieval or attention values.</p>
  </div>
</template>
