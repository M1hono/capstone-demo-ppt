<script setup>
import { useSequence } from '../composables/useSequence'
const sequence = useSequence(['Predict eight coefficients', 'Weight the learned bases', 'Sum into one colour transform', 'Render the original image'])
const base = import.meta.env.BASE_URL
const symbols = '₁₂₃₄₅₆₇₈'
const captions = [
  'A fully connected network maps the three-dimensional edit vector into eight coefficients.',
  'Each coefficient controls the contribution of one learned basis LUT; the coefficients need not sum to one.',
  'The weighted basis sum forms one LUT that maps input RGB colours to output RGB colours.',
  'Apply the combined LUT to the original image using trilinear interpolation to obtain the retouched output.'
]
</script>
<template>
  <div class="stack lut-assembly">
    <div class="row spread"><p class="formula">z ∈ ℝ³ → FC → (a₁, …, a₈)</p><span class="source-caption">Structural illustration · learned values unavailable</span></div>
    <svg viewBox="0 0 1188 340" class="lut-figure" role="img" aria-label="Eight coefficient-weighted LUT bases combine into one image-wide colour lookup table">
      <defs><g id="basis-cube"><path d="M0 20 L32 0 L64 20 L64 65 L32 85 L0 65 Z M0 20 L32 40 L64 20 M32 40 V85"/><path d="M11 13 L43 33 V78 M22 7 L54 27 V71 M0 35 L32 55 L64 35 M0 50 L32 70 L64 50" :style="{opacity:0.3}"/></g></defs>
      <g v-for="i in 8" :key="i" :transform="`translate(${20+((i-1)%4)*117}, ${16+Math.floor((i-1)/4)*145})`" class="basis-group" :class="{weighted:sequence.step.value>=1}">
        <text x="32" y="117" text-anchor="middle">a{{symbols[i-1]}} · B{{symbols[i-1]}}</text><use href="#basis-cube" fill="none" stroke="currentColor" stroke-width="1.4"/>
      </g>
      <g class="combination" :class="{dim:sequence.step.value<2}">
        <path v-for="i in 8" :key="i" :d="`M${84+((i-1)%4)*117} ${59+Math.floor((i-1)/4)*145} C510 ${59+Math.floor((i-1)/4)*145} 520 153 550 153`" fill="none" stroke="var(--blue)" :style="{opacity:0.18}"/>
        <text x="563" y="166" text-anchor="middle" class="sum-symbol">Σ</text>
        <path d="M590 153 H633 M625 147 L633 153 L625 159" fill="none" stroke="var(--muted)"/>
        <use href="#basis-cube" transform="translate(655 91) scale(1.55)" fill="var(--pale)" stroke="var(--blue)" stroke-width="1.2"/>
        <text x="706" y="254" text-anchor="middle">Combined LUT</text><text x="706" y="279" text-anchor="middle" class="detail">L(z) = Σᵢ aᵢ(z)Bᵢ</text>
      </g>
      <g class="render-route" :class="{dim:sequence.step.value<3}">
        <image :href="base+'assets/fivek/original.png'" x="876" y="12" width="120" height="82" preserveAspectRatio="xMidYMid slice"/>
        <text x="936" y="117" text-anchor="middle" class="detail">Original O</text>
        <path d="M936 125 V148 M930 140 L936 148 L942 140 M778 153 H849 M841 147 L849 153 L841 159" fill="none" stroke="var(--muted)"/>
        <rect x="864" y="155" width="250" height="59" fill="var(--surface)"/><text x="989" y="191" text-anchor="middle">Trilinear interpolation</text>
        <path d="M989 225 V255 M983 247 L989 255 L995 247" fill="none" stroke="var(--muted)"/>
        <text x="989" y="293" text-anchor="middle" class="result-symbol">T̂ = L(z)(O)</text>
      </g>
      <text x="0" y="333" class="detail">The vector controls the colour transform. The original supplies all image pixels.</text>
    </svg>
    <p class="readout" aria-live="polite">{{captions[sequence.step.value]}}</p>
    <SequenceControls :sequence="sequence"/>
    <p class="source-caption">Source detail: GlobalAdjust precedes an identity-plus-residual LUT and clamping. A zero z does not guarantee the original image.</p>
  </div>
</template>
<style scoped>
.lut-assembly{gap:12px}.lut-figure{width:100%;flex:1;min-height:0}.lut-figure text{font-size:19px;fill:var(--ink)}.lut-figure .detail{font-size:14px;fill:var(--muted)}.lut-figure .sum-symbol{font-size:45px}.lut-figure .result-symbol{font-size:28px;fill:var(--blue)}.basis-group{color:#aab5c2;transition:color .4s}.basis-group.weighted{color:var(--blue)}.combination,.render-route{transition:opacity .4s}.dim{opacity:.1}.lut-assembly .readout{min-height:48px;font-size:17px}
</style>
