<script setup>
import { useSequence } from '../composables/useSequence'
const base = import.meta.env.BASE_URL
const sequence = useSequence(['Read the original and edit', 'Concatenate nine channels', 'Compress the adjustment', 'Supervise reconstruction'])
const captions = [
  'A real FiveK original and Expert C edit provide the observed adjustment; the difference is display-scaled.',
  'Concatenate O, T and T − O along the channel axis: three RGB inputs become a 9-channel tensor.',
  'Convolutional downsampling and a fully connected head compress the adjustment into z ∈ ℝ³.',
  'Decode z with the original image O, then compare the reconstruction T̂ against the target T.'
]
</script>
<template>
  <div class="stack encoder">
    <svg viewBox="0 0 1188 375" class="encoder-figure" role="img" aria-label="Real original, edited and difference photographs become a nine-channel tensor, a compact vector and a reconstruction loss">
      <defs><marker id="encoder-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10" fill="var(--muted)"/></marker></defs>
      <g v-for="(file,i) in ['original.png','expert-C.png','pair-difference.png']" :key="file" :transform="`translate(${i*162}, 30)`">
        <text x="72" y="0" text-anchor="middle" class="photo-title">{{['Original O','Expert edit T','Difference T − O'][i]}}</text>
        <image :href="base+'assets/fivek/'+file" x="0" y="20" width="146" height="116" preserveAspectRatio="xMidYMid slice"/>
        <text x="72" y="161" text-anchor="middle" class="detail">3 RGB channels</text>
      </g>
      <g class="encoder-stage" :class="{dim:sequence.step.value<1}">
        <path d="M8 210 V223 H465 V210 M236 223 V243 H562 V177" class="route"/>
        <g v-for="i in 9" :key="i" :transform="`translate(${512+(i-1)*7}, ${84-(i-1)*5})`"><rect width="65" height="105" :fill="i<4?'#edf3ff':i<7?'#e1f0ee':'#f0e7fc'" :stroke="i<4?'var(--blue)':i<7?'var(--teal)':'var(--purple)'" stroke-width="1"/></g>
        <text x="564" y="216" text-anchor="middle">9 × H × W</text>
        <path d="M637 114 H676" class="route"/>
      </g>
      <g class="encoder-stage" :class="{dim:sequence.step.value<2}">
        <g v-for="(size,i) in [98,70,45]" :key="size" :transform="`translate(${688+i*77}, ${114-size/2})`"><path :d="`M0 0 H32 L45 -10 H13 Z M32 0 L45 -10 V${size-10} L32 ${size} Z M0 0 H32 V${size} H0 Z`" fill="var(--pale)" stroke="var(--blue)"/></g>
        <text x="785" y="216" text-anchor="middle">Convolution → pooling → FC</text>
        <path d="M902 114 H959" class="route"/>
        <g transform="translate(1032 126)"><path d="M-40 35 L60 -40 M0 53 V-63 M-48 -24 L62 36" fill="none" stroke="var(--line)"/><path d="M0 0 L44 -36" stroke="var(--blue)" stroke-width="3"/><circle cx="44" cy="-36" r="6" fill="var(--blue)"/><text x="54" y="-40" class="latent-symbol">z</text></g>
        <text x="1050" y="216" text-anchor="middle">3 coordinates · one edit</text>
      </g>
      <g class="encoder-stage" :class="{dim:sequence.step.value<3}">
        <path d="M1050 231 V270 H887" class="route"/>
        <rect x="675" y="245" width="200" height="52" fill="var(--pale)"/><text x="775" y="277" text-anchor="middle">LUT decoder + O</text>
        <path d="M664 270 H583" class="route"/>
        <rect x="492" y="244" width="78" height="54" fill="none" stroke="var(--blue)"/><text x="531" y="279" text-anchor="middle" class="latent-symbol">T̂</text>
        <path d="M480 270 H347" class="route"/>
        <text x="36" y="279" class="loss">Reconstruction loss (T̂, T)</text>
        <text x="36" y="307" class="detail">Gradients update encoder, decoder and LUT bases</text>
      </g>
      <text x="0" y="368" class="detail">Tensor geometry is schematic; convolution widths and depths are not asserted.</text>
      <text x="1188" y="368" text-anchor="end" class="detail">Report reconstruction: FiveK 28.5 dB</text>
    </svg>
    <p class="readout" aria-live="polite">{{captions[sequence.step.value]}}</p>
    <SequenceControls :sequence="sequence"/>
    <p class="source-caption">Audited source adds colour-bin statistics and a stochastic latent head. The photographs are data, not checkpoint reconstructions.</p>
  </div>
</template>
<style scoped>
.encoder{gap:12px}.encoder-figure{width:100%;flex:1;min-height:0}.encoder-figure text{font-size:18px;fill:var(--ink)}.encoder-figure .detail{font-size:14px;fill:var(--muted)}.encoder-figure .latent-symbol{font-size:29px}.encoder-figure .loss{font-size:23px}.route{fill:none;stroke:var(--muted);stroke-width:1.3;marker-end:url(#encoder-arrow)}.encoder-stage{transition:opacity .4s}.dim{opacity:.1}.encoder .readout{min-height:27px}
</style>
