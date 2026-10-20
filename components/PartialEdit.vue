<script setup>
import { usePresentationPlayback } from '../composables/usePresentationPlayback'
const {stage,total,playing,runId,reduced,staticMode,play,finish,previous,next,pause,resume}=usePresentationPlayback([400,1700,3000,4300])
const base=import.meta.env.BASE_URL
const captions=[
  "For the current input image, we first perform semantic segmentation.",
  "We then select semantic regions covering approximately 40 percent of the total image pixels.",
  "For these selected regions, the original pixels are replaced by the corresponding pixels from the expert-retouched target image.",
  "All remaining regions are kept unchanged from the original image.",
  "The partial edit represents the user’s current explicit editing intent, while the complete expert-retouched image represents the final result that the user actually wants."
]
</script>
<template>
  <div class="partial-scene technical-scene motion-scene" :data-stage="stage" :data-playing="playing" :data-run="runId">
    <div class="partial-specimens">
      <figure><figcaption>Original I <small>[3,H,W]</small></figcaption><img :src="`${base}assets/fivek/cnn-input.png`" alt="Original FiveK 0412"/></figure>
      <figure class="partial-mask" :class="{'reached':stage>=1}"><figcaption>Explicit mask M <small>[1,H,W]</small></figcaption><img :src="`${base}assets/next-step/illustrative-mask.png`" alt="Illustrative rectangular binary mask, not a semantic segmentation output"/><span>1: specified · 0: unspecified</span></figure>
      <figure><figcaption>Partial edit P <small>[3,H,W]</small></figcaption><ImageComparison :before="`${base}assets/fivek/cnn-input.png`" :after="`${base}assets/next-step/partial-clue.png`" label="illustrative partial edit" :reveal="stage<2?0:100"/></figure>
      <figure><figcaption>Target G <small>[3,H,W]</small></figcaption><img :src="`${base}assets/next-step/expert-target.png`" alt="Complete Expert D target; not a prediction"/></figure>
    </div>
    <div class="partial-equation"><code>P = M ⊙ G + (1 − M) ⊙ I</code><span>Supervised task: (I, P, M, ℋ) → G</span></div>
    <div class="mechanism-reading"><p :key="stage">{{captions[stage]}}</p><PlaybackControls v-if="!staticMode" :stage="stage" :total="total" :playing="playing" :reduced="reduced" @previous="previous" @next="next" @pause="pause" @resume="resume" @replay="play" @finish="finish"/></div>
    <p class="mechanism-provenance">FiveK 0412 + Expert D · rectangle illustrates composition; training uses semantic regions (≈40%).</p>
  </div>
</template>
