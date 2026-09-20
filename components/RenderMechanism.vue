<script setup>
import { usePresentationPlayback } from '../composables/usePresentationPlayback'
const {stage,total,playing,runId,reduced,staticMode,play,finish,previous,next,pause,resume}=usePresentationPlayback([400,1550,2850,4100,5400])
const base=import.meta.env.BASE_URL
const captions=[
  "To control computational cost, Cross-Attention is performed in a lower-resolution feature space.",
  "After Cross-Attention, the modification features are interpolated back to the original image resolution.",
  "The final enhancement network then receives four major sources of information.",
  "These features are jointly processed by the final enhancement network to generate the complete enhanced image.",
  "During training, the final output is still compared against the complete FiveK expert-retouched image.",
  "It must also reproduce the detailed editing operations and their magnitude closely enough to match the complete expert target."
]
</script>
<template>
  <div class="render-mechanism motion-scene" :data-stage="stage" :data-playing="playing" :data-run="runId">
    <svg viewBox="0 0 1168 424" role="img" aria-label="I, P, mask M and interpolated historical features are concatenated into 71 channels. The CNN predicts a residual. The final output preserves explicit edits and is supervised against G.">
      <defs><marker id="render-flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="currentColor"/></marker></defs>
      <g>
        <image :href="`${base}assets/fivek/cnn-input.png`" x="0" y="44" width="58" height="58"/><text x="74" y="63">Original I</text><text x="74" y="89" class="diagram-shape">[3,H,W]</text>
        <image :href="`${base}assets/next-step/partial-clue.png`" x="0" y="127" width="58" height="58"/><text x="74" y="147">Partial edit P</text><text x="74" y="173" class="diagram-shape">[3,H,W]</text>
        <image :href="`${base}assets/next-step/illustrative-mask.png`" x="0" y="210" width="58" height="58"/><text x="74" y="230">Explicit mask M</text><text x="74" y="256" class="diagram-shape">[1,H,W]</text>
        <g class="render-edit-field"><rect x="0" y="293" width="254" height="76"/><text x="127" y="322" text-anchor="middle" class="diagram-title">Interpolate history F</text><text x="127" y="351" text-anchor="middle" class="diagram-shape">[64,64,64] → [64,H,W]</text></g>
      </g>
      <g class="logic-path" :class="{'is-on':stage>=1}"><path pathLength="1" d="M240 75 H280 V206 H328"/><path pathLength="1" d="M240 157 H280"/><path pathLength="1" d="M240 240 H280 V206"/><path pathLength="1" d="M265 332 H280 V240"/></g>
      <g class="logic-node" :class="{'is-on':stage>=1,'is-focused':stage===1}"><rect x="341" y="164" width="185" height="85"/><text x="433" y="199" text-anchor="middle" class="diagram-title">Concat → CNN</text><text x="433" y="228" text-anchor="middle" class="diagram-shape">[71,H,W]</text></g>
      <g class="logic-path" :class="{'is-on':stage>=2}"><path pathLength="1" d="M538 206 H562"/><path pathLength="1" d="M137 35 V17 H698 V152"/><text x="479" y="42" text-anchor="middle" class="diagram-small">Original I · residual connection</text></g>
      <g class="logic-node" :class="{'is-on':stage>=2,'is-focused':stage===2}"><rect x="575" y="164" width="242" height="85"/><text x="696" y="199" text-anchor="middle" class="diagram-title">B = clamp(I + ΔI)</text><text x="696" y="228" text-anchor="middle" class="diagram-shape">[3,H,W]</text></g>
      <g class="delta-correction" :class="{'is-on':stage>=2}"><text x="696" y="285" text-anchor="middle" class="diagram-shape">ΔI = 0.25 · tanh(CNN(…))</text></g>
      <g class="logic-path" :class="{'is-on':stage>=3}"><path pathLength="1" d="M829 206 H871"/><path pathLength="1" d="M1021 108 V152"/><text x="1021" y="67" text-anchor="middle">Explicit edit P + M</text><text x="1021" y="93" text-anchor="middle" class="diagram-small">Preserve specified pixels</text></g>
      <g class="logic-node" :class="{'is-on':stage>=3,'is-focused':stage===3}"><rect x="884" y="164" width="274" height="85"/><text x="1021" y="199" text-anchor="middle" class="diagram-title">Ŷ = M⊙P + (1−M)⊙B</text><text x="1021" y="228" text-anchor="middle" class="diagram-shape">[3,H,W]</text></g>
      <g class="logic-path" :class="{'is-on':stage>=4}"><path pathLength="1" d="M1021 261 V305"/><path pathLength="1" d="M1157 336 H1093"/></g>
      <g class="logic-node" :class="{'is-on':stage>=4,'is-focused':stage===4}"><rect x="947" y="317" width="135" height="55"/><text x="1014" y="350" text-anchor="middle" class="diagram-title">Loss (Ŷ, G)</text></g>
      <text x="1122" y="315" text-anchor="middle" class="diagram-small">Target G</text>
      <g class="logic-path" :class="{'is-on':stage>=5}"><path pathLength="1" d="M1014 383 V414 H433 V261"/><text x="694" y="405" text-anchor="middle" class="diagram-small">Update encoders · attention · CNN</text></g>
    </svg>
    <div class="mechanism-reading"><p :key="stage">{{captions[stage]}}</p><PlaybackControls v-if="!staticMode" :stage="stage" :total="total" :playing="playing" :reduced="reduced" @previous="previous" @next="next" @pause="pause" @resume="resume" @replay="play" @finish="finish"/></div>
    <p class="mechanism-provenance">Illustrative I/P/M inputs · Ŷ is symbolic, not a recorded prediction · tensor example omits batch.</p>
  </div>
</template>
