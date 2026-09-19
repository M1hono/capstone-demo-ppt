<script setup>
import { usePresentationPlayback } from '../composables/usePresentationPlayback'
const {stage,total,playing,runId,reduced,staticMode,play,finish,previous,next,pause,resume}=usePresentationPlayback([300,1400,2600,3850,5100])
const base=import.meta.env.BASE_URL
const references=[['1','0406 · Colosseum'],['2','0426 · Archway'],['3','0490 · Dam']]
const captions=['Each record preserves an original image and an expert edit.','The encoder describes how the image was edited.','Every rendition of the query’s original is excluded.','Retrieve the three nearest eligible edit descriptors.','Those pairs provide editing evidence for the current training chunk.','The loss updates the encoder; reference choices refresh next chunk.']
</script>
<template>
  <div class="retrieval-mechanism motion-scene" :data-stage="stage" :data-playing="playing" :data-run="runId">
    <div class="retrieval-layout">
      <div class="retrieval-query"><h3>Training query</h3><div class="retrieval-query-pair"><figure><img :src="`${base}assets/evidence/flowers-original.png`" alt="Recorded flower original"/><figcaption>Original I</figcaption></figure><figure><img :src="`${base}assets/evidence/flowers-target.png`" alt="Recorded flower expert target"/><figcaption>Expert target T</figcaption></figure></div><div class="edit-descriptor" :class="{'is-on':stage>=1}"><b>Encode the edit</b><span>[I, T, T − I] → pooled descriptor</span></div><p class="retrieval-query-limit">The query target still guides retrieval.</p></div>
      <div class="retrieval-rule"><span class="retrieval-wire" :class="{'is-on':stage>=1}" aria-hidden="true">→</span><div :class="{'is-on':stage>=2}"><strong>Exclude<br>same original</strong></div><span class="retrieval-wire" :class="{'is-on':stage>=3}" aria-hidden="true">→</span><div :class="{'is-on':stage>=3}"><strong>Nearest 3<br>edit descriptors</strong><small>Euclidean distance</small></div></div>
      <div class="retrieval-pool"><div class="pool-heading"><h3>Reference pairs</h3><span>Recorded flower example</span></div><div v-for="(reference,i) in references" :key="reference[0]" class="retrieved-pair" :class="{'is-retrieved':stage>=3}" :style="{'--reference':i}"><span>R{{reference[0]}}</span><img :src="`${base}assets/evidence/flowers-ref${reference[0]}-original.png`" :alt="`${reference[1]} original, recorded panel`"/><span class="pair-edit-arrow" aria-hidden="true">→</span><img :src="`${base}assets/evidence/flowers-ref${reference[0]}-expert.png`" :alt="`${reference[1]} expert edit, recorded panel`"/><b>{{reference[1]}}</b></div><div class="excluded-record" :class="{'is-excluded':stage>=2}"><img :src="`${base}assets/fivek/expert-D.png`" alt="Same flower original, another expert rendition"/><span>0412 · another expert rendition</span><b>{{stage>=2?'Excluded':'Same original'}}</b></div></div>
    </div>
    <div class="training-return" :class="{'is-on':stage>=5}"><span aria-hidden="true">↶</span><b>Train on the retrieved pairs</b><span>Loss → update encoder → refresh reference pool</span></div>
    <div class="mechanism-reading"><p :key="stage">{{captions[stage]}}</p><PlaybackControls v-if="!staticMode" :stage="stage" :total="total" :playing="playing" :reduced="reduced" @previous="previous" @next="next" @pause="pause" @resume="resume" @replay="play" @finish="finish"/></div>
    <p class="mechanism-provenance">Retrieval rule illustrated with recorded pairs; embedding distances and the original retrieval run are unavailable.</p>
  </div>
</template>
