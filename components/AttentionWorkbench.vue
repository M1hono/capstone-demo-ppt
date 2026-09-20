<script setup>
import { computed, ref, watch } from 'vue'
import { usePresentationPlayback } from '../composables/usePresentationPlayback'
const props=defineProps({sample:{type:String,default:'flowers'},initial:{type:Number,default:1}})
const selected=ref(props.initial)
const sample=ref(props.sample)
const records={flowers:{id:'0412',shares:[51.17,48.83,0],names:['0406 · Colosseum','0426 · Archway','0490 · Dam']},dog:{id:'0407',shares:[0,34.38,65.62],names:['0476 · Leaves, edit 1','0476 · Leaves, edit 2','0417 · Lily']}}
const record=computed(()=>records[sample.value])
const base=import.meta.env.BASE_URL
const {stage,total,playing,runId,reduced,staticMode,play,finish,previous,next,pause,resume}=usePresentationPlayback([250,1500,2900,4500])
watch([selected,sample],play)
function chooseSample(value){sample.value=value;selected.value=value==='dog'?2:1}
</script>
<template>
  <div class="attention-workbench motion-scene" :data-stage="stage" :data-playing="playing" :data-run="runId">
    <div class="reference-list"><span>Reference selection<small>% of query regions</small></span><button v-for="(name,i) in record.names" :key="name" :aria-pressed="selected===i+1" @click.stop="selected=i+1"><img :src="`${base}assets/evidence/${sample}-ref${i+1}-expert.png`" :alt="name" /><div><strong>{{name}}</strong><b>{{record.shares[i].toFixed(2)}}<small>%</small></b></div></button></div>
    <div class="attention-inspector"><div class="inspection-heading"><strong>Reference {{selected}} · recorded groups</strong><div class="attention-sample-tabs"><button :aria-pressed="sample==='flowers'" @click.stop="chooseSample('flowers')">Flowers</button><button :aria-pressed="sample==='dog'" @click.stop="chooseSample('dog')">Dog</button></div></div>
      <div class="attention-images">
        <figure class="attention-query"><div class="attention-overlay"><img class="recorded-overlay" :src="`${base}assets/evidence/${sample}-ref${selected}-query.png`" :alt="`Query ${record.id}, recorded attention group overlay`"/><img class="clean-query" :src="`${base}assets/evidence/${sample}-original.png`" :alt="`Query ${record.id}, original`" :aria-hidden="stage>=2" /></div><figcaption>Query {{record.id}}</figcaption></figure>
        <figure class="attention-original"><img :src="`${base}assets/evidence/${sample}-ref${selected}-original.png`" alt="Reference original, recorded attention groups"/><figcaption>Reference original</figcaption></figure>
        <figure class="attention-expert"><ImageComparison :before="`${base}assets/evidence/${sample}-ref${selected}-original.png`" :after="`${base}assets/evidence/${sample}-ref${selected}-expert.png`" label="reference expert edit, recorded attention groups" :reveal="stage<3?0:stage===3?52:100"/><figcaption>Reference expert edit</figcaption></figure>
      </div>
      <div class="correspondence-bracket" aria-hidden="true"><span></span></div>
      <div class="attention-explanation"><b>{{stage===3?'The reference pair supplies an edit to learn from.':'Matching colour + ID links query and reference.'}}</b><p>{{stage<4?'Inspect the correspondence, then compare the reference edit.':'Shares count which reference each query region selected.'}}</p></div>
      <div class="selection-totals"><span v-for="(share,i) in record.shares" :key="i" :style="{flex:Math.max(share,0.01)}" :class="`ref-${i}`">{{share>5?`R${i+1} · ${share}%`:''}}</span></div>
      <div class="attention-foot"><p class="micro-note">Qualitative correspondence; semantic and causal claims remain untested.</p><PlaybackControls v-if="!staticMode" :stage="stage" :total="total" :playing="playing" :reduced="reduced" @previous="previous" @next="next" @pause="pause" @resume="resume" @replay="play" @finish="finish" /></div>
    </div>
  </div>
</template>
