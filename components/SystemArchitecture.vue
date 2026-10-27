<script setup>
import { useSequence } from '../composables/useSequence'
import pairs from '../data/history-pairs.json'
const base = import.meta.env.BASE_URL
const sequence = useSequence(['Learn the retouching space', 'Encode the user’s history', 'Predict a conditional distribution', 'Sample, select and render'])
const descriptions = [
  'Original + expert edit → 3D edit vector.',
  '8 history pairs + query original → 17 tokens.',
  'Transformer context c conditions the flow.',
  'Sample → select five vectors → render.'
]
</script>
<template>
  <div class="stack architecture">
    <svg class="architecture-map" viewBox="0 0 1188 390" role="img" aria-label="Two-stage architecture showing real image inputs, a three-dimensional edit representation, seventeen conditioning tokens, flow sampling and LUT rendering">
      <defs><marker id="architecture-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10" fill="var(--muted)"/></marker></defs>
      <text x="0" y="20" class="lane-heading">Stage 1</text><text x="90" y="20" class="lane-subheading">Learn the edit space</text>
      <line x1="0" y1="38" x2="1188" y2="38" class="grid-lines"/>
      <g>
        <g v-for="(file, i) in ['original.png', 'expert-C.png', 'pair-difference.png']" :key="file" :transform="`translate(${i * 78}, 57)`">
          <image :href="base + 'assets/fivek/' + file" width="70" height="63" preserveAspectRatio="xMidYMid slice"/>
          <text x="35" y="84" text-anchor="middle">{{ ['O', 'T', 'T − O'][i] }}</text>
        </g>
        <text x="113" y="166" text-anchor="middle" class="diagram-detail">Concatenate · 9 channels</text>
        <path d="M239 90 H284" class="connection"/>
        <path d="M294 59 L379 72 L379 116 L294 130 Z" class="tensor-shape"/>
        <path d="M306 62 V127 M319 64 V125 M332 66 V123" class="tensor-lines"/>
        <text x="338" y="151" text-anchor="middle">Edit encoder</text>
        <path d="M389 90 H441" class="connection"/>
        <g transform="translate(455 65)"><rect width="25" height="52" fill="var(--blue)"/><rect x="30" width="25" height="52" fill="var(--teal)"/><rect x="60" width="25" height="52" fill="var(--purple)"/></g>
        <text x="497" y="151" text-anchor="middle">z ∈ ℝ³</text>
        <path d="M553 90 H595" class="connection"/><text x="678" y="55" text-anchor="middle" class="diagram-detail">α(z): eight coefficients</text>
        <g v-for="i in 8" :key="i" :transform="`translate(${608 + (i - 1) * 17}, ${71 + (i % 2) * 8})`"><path d="M0 0 L14 -7 L27 0 L27 27 L14 34 L0 27 Z M0 0 L14 7 L27 0 M14 7 V34" class="lut-wire"/></g>
        <text x="680" y="151" text-anchor="middle">Weighted LUT sum</text><text x="680" y="175" text-anchor="middle" class="diagram-detail">Σⱼ αⱼ(z) · LUTⱼ</text>
        <path d="M770 90 H815" class="connection"/>
        <rect x="830" y="63" width="157" height="57" fill="var(--pale)"/>
        <text x="908" y="98" text-anchor="middle">LUT decoder + O</text>
        <path d="M998 90 H1050" class="connection"/>
        <rect x="1067" y="56" width="104" height="72" fill="none" stroke="var(--blue)" stroke-width="1.5"/>
        <text x="1119" y="100" text-anchor="middle" class="large-symbol">T̂</text>
        <text x="1119" y="151" text-anchor="middle">Reconstruction</text>
        <text x="1119" y="171" text-anchor="middle" class="diagram-detail">Loss against target T</text>
      </g>
      <text x="0" y="214" class="lane-heading">Stage 2</text><text x="90" y="214" class="lane-subheading">Predict from image + history</text>
      <line x1="0" y1="232" x2="1188" y2="232" class="grid-lines"/>
      <g :class="{ unrevealed: sequence.step.value < 1 }" class="stage-group" data-architecture-stage="history">
        <g v-for="(p, i) in pairs.slice(0, 8)" :key="p.id" :transform="`translate(${(i % 4) * 44}, ${248 + Math.floor(i / 4) * 40})`">
          <image :href="base + p.original" width="40" height="18" preserveAspectRatio="xMidYMid slice"/>
          <image :href="base + p.edited" y="20" width="40" height="18" preserveAspectRatio="xMidYMid slice"/>
        </g>
        <text x="84" y="341" text-anchor="middle">8 history pairs</text>
        <image :href="base + 'assets/fivek/original.png'" x="195" y="261" width="64" height="48" preserveAspectRatio="xMidYMid slice"/>
        <text x="227" y="341" text-anchor="middle">Query O₀</text>
        <path d="M273 283 H309" class="connection"/>
        <g v-for="i in 17" :key="i" :transform="`translate(${325 + (i - 1) * 7}, 264)`"><rect width="5" height="43" :fill="i === 17 ? 'var(--ink)' : i % 2 ? 'var(--blue)' : 'var(--teal)'"/></g>
        <text x="382" y="341" text-anchor="middle">17 paired tokens</text>
      </g>
      <g :class="{ unrevealed: sequence.step.value < 2 }" class="stage-group" data-architecture-stage="condition">
        <path d="M451 283 H485" class="connection"/>
        <rect x="497" y="252" width="142" height="26" fill="var(--pale)" stroke="var(--blue)"/>
        <rect x="497" y="287" width="142" height="26" fill="var(--pale)" stroke="var(--blue)"/>
        <path v-for="i in 6" :key="i" :d="`M${510 + i * 16} 278 L${623 - i * 16} 287`" stroke="var(--blue)" :style="{opacity:0.4}"/>
        <text x="568" y="341" text-anchor="middle">Transformer</text>
        <path d="M649 283 H689" class="connection"/>
        <text x="666" y="263" class="condition-label">c</text>
        <path d="M705 256 C735 256 735 310 765 310 M705 270 C735 270 735 296 765 296 M705 296 C735 296 735 270 765 270 M705 310 C735 310 735 256 765 256" fill="none" stroke="var(--blue)" stroke-width="2"/>
        <text x="738" y="341" text-anchor="middle">Flow</text>
      </g>
      <g :class="{ unrevealed: sequence.step.value < 3 }" class="stage-group" data-architecture-stage="candidates">
        <path d="M784 283 H816" class="connection"/>
        <circle v-for="i in 48" :key="i" :cx="846 + Math.sin(i * 2.4) * (15 + i % 17)" :cy="283 + Math.cos(i * 1.9) * (8 + i % 20)" r="2.6" :fill="['var(--blue)', 'var(--teal)', 'var(--purple)'][i % 3]" :style="{opacity:0.7}"/>
        <text x="850" y="341" text-anchor="middle">Sample + select</text>
        <path d="M891 283 H929" class="connection"/>
        <rect x="940" y="257" width="112" height="54" fill="var(--pale)"/>
        <text x="996" y="290" text-anchor="middle">Decoder + O₀</text>
        <path d="M1062 283 H1090" class="connection"/>
        <g v-for="i in 5" :key="i" :transform="`translate(${1099 + (i - 1) * 13}, ${256 + (i - 1) * 7})`"><rect width="35" height="35" fill="var(--paper)" stroke="var(--blue)"/><path d="M6 24 L13 14 L19 20 L25 10 L30 24" fill="none" stroke="var(--blue)"/></g>
        <text x="1138" y="341" text-anchor="middle">Candidates</text>
      </g>
      <text x="0" y="382" class="diagram-detail">FiveK inputs / report architecture / illustrative samples</text>
      <text x="1188" y="382" text-anchor="end" class="diagram-detail">No query target T₀ at inference</text>
    </svg>
    <p class="sequence-caption" aria-live="polite">{{ descriptions[sequence.step.value] }}</p>
    <SequenceControls :sequence="sequence"/>
  </div>
</template>
<style scoped>
.architecture{gap:12px}.architecture-map{width:100%;flex:1;min-height:0}.architecture-map text{font-family:inherit;font-size:18px;fill:var(--ink)}.architecture-map .lane-heading{font-weight:600;font-size:18px}.architecture-map .lane-subheading{font-size:18px;fill:var(--muted)}.architecture-map .diagram-detail{font-size:15px;fill:var(--muted)}.architecture-map .large-symbol{font-size:31px}.connection{fill:none;stroke:var(--muted);stroke-width:1.4;marker-end:url(#architecture-arrow)}.tensor-shape{fill:var(--pale);stroke:var(--blue);stroke-width:1.5}.tensor-lines,.lut-wire{fill:none;stroke:var(--blue);stroke-width:1}.stage-group{transition:opacity .5s ease-out}.unrevealed{opacity:.12}.condition-label{fill:var(--blue)!important;font-style:italic}.sequence-caption{font-size:20px;min-height:25px}
</style>
