<template>
  <div class="achievement-summary">
    <svg viewBox="0 0 500 391" role="img" aria-label="Three achievements: explicit edits and historical preference, FiveK reconstruction into intent and history, and accurate expert-target reconstruction at 27.2 dB and 0.90 SSIM.">
      <defs><marker id="achievement-summary-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#437a95"/></marker></defs>
      <g>
        <text x="0" y="23" class="achievement-title">Clearer definition of personalization</text>
        <g><text x="0" y="69">Explicit edit</text><text x="0" y="107">Historical preference</text><path d="M172 64 H260" class="achievement-wire"/><path d="M172 102 H260" class="achievement-wire history-wire"/><g v-for="r in 3" :key="r"><rect v-for="c in 6" :key="c" :x="279+(c-1)*34" :y="43+(r-1)*26" width="29" height="22" :class="r===2 && c>=2 && c<=4?'achievement-explicit':'achievement-history'"/></g></g>
      </g>
      <path d="M0 139 H500" class="achievement-rule"/>
      <g>
        <text x="0" y="166" class="achievement-title">Dynamically reconstruct FiveK</text>
        <g><rect x="0" y="191" width="48" height="47" class="achievement-pair"/><rect x="54" y="191" width="48" height="47" class="achievement-pair edited"/><text x="24" y="222" text-anchor="middle">I</text><text x="78" y="222" text-anchor="middle">G</text><text x="51" y="263" text-anchor="middle" class="achievement-small">FiveK pairs</text><path d="M112 215 H155 V197 H197 M155 215 V241 H197" class="achievement-wire"/><text x="208" y="203">Current explicit user intent</text><text x="208" y="247">Historical user preference</text></g>
      </g>
      <path d="M0 278 H500" class="achievement-rule"/>
      <g>
        <text x="0" y="306" class="achievement-title">Strong quantitative performance</text>
        <g><text x="0" y="350" class="achievement-metric">27.2 dB</text><text x="122" y="350" class="achievement-small">PSNR</text><text x="270" y="350" class="achievement-metric">0.90</text><text x="348" y="350" class="achievement-small">SSIM</text><text x="0" y="380" class="achievement-small">Accurate reconstruction of the expert-retouched target</text></g>
      </g>
    </svg>
    <div class="mechanism-reading"><p>Strong quantitative performance under this new task formulation.</p></div>
  </div>
</template>
