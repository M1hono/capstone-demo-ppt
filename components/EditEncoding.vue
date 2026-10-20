<script setup>
import { usePresentationPlayback } from '../composables/usePresentationPlayback'
const {stage,total,playing,runId,reduced,staticMode,play,finish,previous,next,pause,resume}=usePresentationPlayback([400,1500,2800,4200])
const base=import.meta.env.BASE_URL
const captions=[
  "For each original and expert-retouched image pair, we first extract and encode the complete editing relationship.",
  "The input contains the original image, the expert-retouched image, and their difference: I, G, and G - I.",
  "These inputs are processed by an editing encoder and converted into a latent editing representation.",
  "It is a dense representation learned by the neural network to describe what transformation occurred when the original image was converted into the expert-retouched image.",
  "As a result, every original-expert pair in FiveK obtains its own editing representation."
]
</script>
<template>
  <div class="encoding-scene technical-scene motion-scene" :data-stage="stage" :data-playing="playing" :data-run="runId">
    <div class="encoding-flow">
      <div class="encoding-pair"><figure><img :src="`${base}assets/fivek/cnn-input.png`" alt="FiveK 0412 original"/><figcaption>Original I</figcaption></figure><figure><img :src="`${base}assets/next-step/expert-target.png`" alt="FiveK 0412 Expert D target"/><figcaption>Target G</figcaption></figure><code>I, G: [3,H,W]</code></div>
      <span class="operation-arrow" aria-hidden="true">→</span>
      <div class="encoding-operation" :class="{'reached':stage>=1}"><b>Paired edit</b><code>[I, G, G − I]</code><span>[9,H,W]</span></div>
      <span class="operation-arrow" aria-hidden="true">→</span>
      <div class="encoding-operation" :class="{'reached':stage>=2}"><b>Edit encoder</b><div class="feature-stack" aria-hidden="true"><i v-for="i in 4" :key="i" :style="{'--layer':i}"/></div><span>[64,H/4,W/4]</span></div>
      <span class="operation-arrow" aria-hidden="true">→</span>
      <div class="encoding-operation descriptor-operation" :class="{'reached':stage>=3}"><b>Spatial mean</b><div class="descriptor-vector"><span>e₁</span><span>e₂</span><span>⋯</span><span>e₆₄</span></div><span>e ∈ ℝ⁶⁴</span></div>
    </div>
    <div class="encoding-definition"><span>Learned edit descriptor</span><code>e(I,G) = mean<sub>h,w</sub> E<sub>edit</sub>([I,G,G−I])</code><p>One vector per pair, shared across visual content.</p></div>
    <div class="mechanism-reading"><p :key="stage">{{captions[stage]}}</p><PlaybackControls v-if="!staticMode" :stage="stage" :total="total" :playing="playing" :reduced="reduced" @previous="previous" @next="next" @pause="pause" @resume="resume" @replay="play" @finish="finish"/></div>
    <p class="mechanism-provenance">Tensor example: H = W = 256 · batch omitted · feature diagram is schematic.</p>
  </div>
</template>
