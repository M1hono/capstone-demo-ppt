<script setup>
import { usePresentationPlayback } from '../composables/usePresentationPlayback'
const {stage,total,playing,runId,reduced,staticMode,play,finish,previous,next,pause,resume}=usePresentationPlayback([300,1400,2600,3850,5100])
const base=import.meta.env.BASE_URL
const references=[['1','0406 · Colosseum'],['2','0426 · Archway'],['3','0490 · Dam']]
const captions=['Start with the original and its full expert target.','Encode their complete edit into one retrieval descriptor.','Exclude every expert version of the same original.','Select the three closest original–expert pairs.','Use the selected pairs to train the enhancement network.','Update the encoder, then repeat retrieval for the next chunk.']
</script>
<template>
  <div class="retrieval-mechanism motion-scene" :data-stage="stage" :data-playing="playing" :data-run="runId">
    <div class="retrieval-layout">
      <div class="retrieval-query"><h3>Query original + target</h3><div class="retrieval-query-pair"><figure><img :src="`${base}assets/evidence/flowers-original.png`" alt="Recorded flower original"/><figcaption>Original I</figcaption></figure><figure><img :src="`${base}assets/evidence/flowers-target.png`" alt="Recorded flower expert target"/><figcaption>Full expert target T</figcaption></figure></div><div class="edit-descriptor" :class="{'is-on':stage>=1}"><b>Describe the complete edit</b><span>[I, T, T − I] → pooled descriptor</span></div><p class="retrieval-query-limit">Full target information enters this search.</p></div>
      <div class="retrieval-rule"><span class="retrieval-wire" :class="{'is-on':stage>=1}" aria-hidden="true">→</span><div :class="{'is-on':stage>=2}"><strong>Exclude<br>same original</strong></div><span class="retrieval-wire" :class="{'is-on':stage>=3}" aria-hidden="true">→</span><div :class="{'is-on':stage>=3}"><strong>Nearest 3<br>edit descriptors</strong><small>Euclidean distance</small></div></div>
      <div class="retrieval-pool"><div class="pool-heading"><h3>Reference pairs</h3><span>Recorded flower example</span></div><div v-for="(reference,i) in references" :key="reference[0]" class="retrieved-pair" :class="{'is-retrieved':stage>=3}" :style="{'--reference':i}"><span>R{{reference[0]}}</span><img :src="`${base}assets/evidence/flowers-ref${reference[0]}-original.png`" :alt="`${reference[1]} original, recorded panel`"/><span class="pair-edit-arrow" aria-hidden="true">→</span><img :src="`${base}assets/evidence/flowers-ref${reference[0]}-expert.png`" :alt="`${reference[1]} expert edit, recorded panel`"/><b>{{reference[1]}}</b></div><div class="excluded-record" :class="{'is-excluded':stage>=2}"><img :src="`${base}assets/fivek/expert-D.png`" alt="Same flower original, another expert rendition"/><span>0412 · another expert rendition</span><b>{{stage>=2?'Excluded':'Same original'}}</b></div></div>
    </div>
    <div class="training-return" :class="{'is-on':stage>=5}"><span aria-hidden="true">↶</span><b>Fit the complete expert target</b><span>Loss → updated edit encoder → new reference choices</span></div>
    <div class="mechanism-reading"><p :key="stage">{{captions[stage]}}</p><PlaybackControls v-if="!staticMode" :stage="stage" :total="total" :playing="playing" :reduced="reduced" @previous="previous" @next="next" @pause="pause" @resume="resume" @replay="play" @finish="finish"/></div>
    <p class="mechanism-provenance">Recorded references illustrate the rule; retrieval distances are unavailable.</p>
  </div>
</template>
