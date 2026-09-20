<script setup>
import { usePresentationPlayback } from '../composables/usePresentationPlayback'
const {stage,total,playing,runId,reduced,staticMode,play,finish,previous,next,pause,resume}=usePresentationPlayback([300,1400,2600,3850,5100])
const base=import.meta.env.BASE_URL
const captions=['The renderer receives the original RGB and transferred edit features.','Predict a bounded RGB residual for the whole image.','Add the residual to the original and clamp the output.','Compare every output pixel with the full expert target.','Backpropagate the full-image loss through the renderer and attention.','Refresh the retrieval descriptors with the updated encoder.']
</script>
<template>
  <div class="render-mechanism motion-scene" :data-stage="stage" :data-playing="playing" :data-run="runId">
    <svg viewBox="0 0 1168 334" role="img" aria-label="Local edit features and the original feed a CNN. Add its bounded correction to the original, compare the result with the target, and update the network before refreshing references.">
      <defs><marker id="render-flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path pathLength="1" d="M0 0 L10 5 L0 10z" fill="currentColor"/></marker></defs>
      <g class="render-original"><text x="80" y="21" text-anchor="middle">Original I</text><image :href="`${base}assets/evidence/flowers-original.png`" x="0" y="38" width="160" height="160"/></g>
      <g class="render-edit-field"><rect x="204" y="38" width="153" height="57"/><text x="280" y="61" text-anchor="middle" class="diagram-title">Local edit field F</text><text x="280" y="82" text-anchor="middle" class="diagram-small">Selected per region</text></g>
      <g class="logic-path" :class="{'is-on':stage>=1}"><path pathLength="1" d="M173 154 H205"/><path pathLength="1" d="M281 100 V119"/><path pathLength="1" d="M357 154 H413"/></g>
      <g class="logic-node" :class="{'is-on':stage>=1,'is-focused':stage===1}"><rect x="204" y="122" width="153" height="68"/><text x="280" y="149" text-anchor="middle" class="diagram-title">Residual CNN</text><text x="280" y="174" text-anchor="middle" class="diagram-small">Predict the correction</text></g>
      <g class="delta-correction" :class="{'is-on':stage>=1}"><text x="445" y="146" text-anchor="middle" class="delta-symbol">ΔI</text><text x="445" y="176" text-anchor="middle" class="diagram-small">0.25 · tanh(…)</text></g>
      <g class="logic-path original-bypass" :class="{'is-on':stage>=2}"><path pathLength="1" d="M80 210 V249 H555 V180"/><path pathLength="1" d="M480 154 H532"/><path pathLength="1" d="M582 154 H648"/><text x="430" y="242" text-anchor="middle" class="diagram-small">Add a residual to the whole image.</text></g>
      <g class="residual-add" :class="{'is-on':stage>=2}"><circle cx="556" cy="154" r="23"/><path pathLength="1" d="M544 154 H568 M556 142 V166"/></g>
      <g><text x="740" y="21" text-anchor="middle">Recorded output</text><text x="1085" y="21" text-anchor="middle">Full expert target</text></g>
      <foreignObject x="660" y="38" width="160" height="160"><ImageComparison :before="`${base}assets/evidence/flowers-original.png`" :after="`${base}assets/evidence/flowers-output.png`" label="recorded flower output" :reveal="stage<2?0:100"/></foreignObject>
      <image :href="`${base}assets/evidence/flowers-target.png`" x="1005" y="38" width="160" height="160" :opacity="stage>=3?1:.22"/>
      <g class="logic-path" :class="{'is-on':stage>=3}"><path pathLength="1" d="M828 120 H854"/><path pathLength="1" d="M997 120 H974"/></g>
      <g class="logic-node loss-node" :class="{'is-on':stage>=3,'is-focused':stage===3}"><rect x="861" y="88" width="107" height="67"/><text x="914" y="116" text-anchor="middle" class="diagram-title">Loss</text><text x="914" y="141" text-anchor="middle" class="diagram-small">Full-image L1</text></g>
      <g class="logic-path learning-feedback" :class="{'is-on':stage>=4}"><path pathLength="1" d="M915 166 V300 H280 V204"/><text x="658" y="291" text-anchor="middle">Update encoders · attention · CNN</text></g>
      <g class="retrieval-refresh" :class="{'is-on':stage>=5}"><text x="657" y="328" text-anchor="middle" class="diagram-small">Next chunk: re-encode the candidate pool and retrieve again.</text></g>
    </svg>
    <div class="render-diagnostics"><strong>Recorded changes<small>Blue − · red +</small></strong><figure v-for="[kind,label,limit] in [['brightness','Brightness','0.0748'],['saturation','Saturation','1'],['warmth','Warmth proxy','2']]" :key="kind"><img :src="`${base}assets/evidence/flowers-recorded-${kind}.png`" :alt="`Recorded ${label} diagnostic`"/><figcaption>{{label}}<small>±{{limit}} · separate scale</small></figcaption></figure><p>Full-image loss<br><span>L1 + 0.001 · mean |output − input|</span></p></div>
    <div class="mechanism-reading"><p :key="stage">{{captions[stage]}}</p><PlaybackControls v-if="!staticMode" :stage="stage" :total="total" :playing="playing" :reduced="reduced" @previous="previous" @next="next" @pause="pause" @resume="resume" @replay="play" @finish="finish"/></div>
  </div>
</template>
