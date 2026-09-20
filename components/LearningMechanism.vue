<script setup>
import { usePresentationPlayback } from '../composables/usePresentationPlayback'
const {stage,total,playing,runId,reduced,staticMode,play,finish,previous,next,pause,resume}=usePresentationPlayback([300,1400,2600,3850,5100])
const base=import.meta.env.BASE_URL
const references=[['1','0406 · Colosseum'],['2','0426 · Archway'],['3','0490 · Dam']]
const captions=['Start with paired originals and complete expert edits.','The shared network encodes how each image was edited.','Exclude other expert versions of the same original.','Group similar editing examples; each group simulates one user.','Use references from that group to learn regional edits through cross-attention.','Train the same network, then refresh its groups.']
</script>
<template>
  <div class="retrieval-mechanism motion-scene" :data-stage="stage" :data-playing="playing" :data-run="runId">
    <div class="retrieval-layout">
      <div class="retrieval-query"><h3>Original + complete edit</h3><div class="retrieval-query-pair"><figure><img :src="`${base}assets/evidence/flowers-original.png`" alt="Recorded flower original"/><figcaption>Original I</figcaption></figure><figure><img :src="`${base}assets/evidence/flowers-target.png`" alt="Recorded flower expert target"/><figcaption>Full expert target T</figcaption></figure></div><div class="edit-descriptor" :class="{'is-on':stage>=1}"><b>Shared edit encoder</b><span>[I, T, T − I] → pooled descriptor</span></div><p class="retrieval-query-limit">Complete edits guide the old grouping step.</p></div>
      <div class="retrieval-rule"><span class="retrieval-wire" :class="{'is-on':stage>=1}" aria-hidden="true">→</span><div :class="{'is-on':stage>=2}"><strong>Exclude<br>same original</strong></div><span class="retrieval-wire" :class="{'is-on':stage>=3}" aria-hidden="true">→</span><div :class="{'is-on':stage>=3}"><strong>Group similar<br>editing examples</strong><small>Nearest 3 edit descriptors</small></div></div>
      <div class="retrieval-pool"><div class="pool-heading"><h3>One group → one simulated user</h3><span>Example references</span></div><div v-for="(reference,i) in references" :key="reference[0]" class="retrieved-pair" :class="{'is-retrieved':stage>=3}" :style="{'--reference':i}"><span>R{{reference[0]}}</span><img :src="`${base}assets/evidence/flowers-ref${reference[0]}-original.png`" :alt="`${reference[1]} original, recorded panel`"/><span class="pair-edit-arrow" aria-hidden="true">→</span><img :src="`${base}assets/evidence/flowers-ref${reference[0]}-expert.png`" :alt="`${reference[1]} expert edit, recorded panel`"/><b>{{reference[1]}}</b></div><div class="excluded-record" :class="{'is-excluded':stage>=2}"><img :src="`${base}assets/fivek/expert-D.png`" alt="Same flower original, another expert rendition"/><span>0412 · another expert rendition</span><b>{{stage>=2?'Excluded':'Same original'}}</b></div></div>
    </div>
    <div class="training-return" :class="{'is-on':stage>=5}"><span aria-hidden="true">↶</span><b>Group and enhance together</b><span>Editing loss → shared encoder → refreshed groups</span></div>
    <div class="mechanism-reading"><p :key="stage">{{captions[stage]}}</p><PlaybackControls v-if="!staticMode" :stage="stage" :total="total" :playing="playing" :reduced="reduced" @previous="previous" @next="next" @pause="pause" @resume="resume" @replay="play" @finish="finish"/></div>
    <p class="mechanism-provenance">Recorded references illustrate the grouping rule; distances are unavailable.</p>
  </div>
</template>
