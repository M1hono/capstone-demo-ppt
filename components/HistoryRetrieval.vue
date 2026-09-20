<script setup>
import { computed } from 'vue'
import { usePresentationPlayback } from '../composables/usePresentationPlayback'
const props=defineProps({mode:{type:String,default:'history'}})
const query=computed(()=>props.mode==='query')
const {stage,total,playing,runId,reduced,staticMode,play,finish,previous,next,pause,resume}=usePresentationPlayback([400,1600,2900,4300])
const captions=computed(()=>query.value?["The next stage is a second retrieval process.", "The model is only allowed to use the partial modification information that represents the current user input.", "The model then uses this partial editing representation to search within the 20 samples belonging to the simulated user history.", "From these 20 historical samples, the three most relevant reference examples are selected.", "Complete ground-truth editing information is unavailable during real-world inference."]:["We calculate the vector distance between different editing representations.", "For each current training sample, we retrieve the 20 samples with the most similar complete editing representations.", "These 20 samples are then treated as the editing history of a simulated user.", "This differs from simply treating FiveK Experts A, B, C, D, and E as five fixed users.", "Network learns editing representations → editing representations determine relationships between samples → reconstructed sample relationships are reused for further training."])
</script>
<template>
  <div class="history-scene technical-scene motion-scene" :data-stage="stage" :data-playing="playing" :data-run="runId">
    <div class="history-query-line"><div><b>{{query?'Partial-edit query':'Complete-edit query'}}</b><code>{{query?'e(I,P)':'e(I,G)'}} ∈ ℝ⁶⁴</code><span>{{query?'[I, P, P − I]':'[I, G, G − I]'}}</span></div><div class="history-distance" :class="{'reached':stage>=1}"><b>Euclidean distance</b><code>dⱼ = ‖e<sub>query</sub> − e(Iⱼ,Gⱼ)‖₂</code><span>{{query?'Search within the 20-pair history':'Rank complete-edit descriptors across the candidate pool'}}</span></div><div class="history-count" :class="{'reached':stage>=2}"><b>{{query?'Reference set':'Simulated history'}}</b><code>{{query?'20 → 3':'N → 20'}}</code><span>{{query?'Similar current intent':'Similar complete edits'}}</span></div></div>
    <div class="history-pool-row">
      <div class="history-pool-diagram" :class="{'reached':query || stage>=2}"><div class="pool-caption"><b>ℋ: 20 original–edit pairs</b><span>One simulated user</span></div><div class="history-grid"><div v-for="i in 20" :key="i" class="history-token" :class="{'selected':query && stage>=3 && i<=3}"><span>H{{i}}</span><i/><i/></div></div><small>Pair slots shown schematically; no measured retrieval ranking.</small></div>
      <span class="history-connector" aria-hidden="true">{{query?'→':'↶'}}</span>
      <div v-if="query" class="reference-output" :class="{'reached':stage>=3}"><b>3 selected pairs</b><div v-for="i in 3" :key="i"><span>R{{i}}</span><code>(Iᵣ, Gᵣ)</code></div><span>Regional cross-attention →</span></div>
      <div v-else class="history-refresh" :class="{'reached':stage>=4}"><b>Refresh during training</b><p>The grouping is not permanently fixed.</p><code>weights → descriptors → ℋ</code><span>The dataset structure adapts together with the model.</span></div>
    </div>
    <div class="mechanism-reading"><p :key="stage">{{captions[stage]}}</p><PlaybackControls v-if="!staticMode" :stage="stage" :total="total" :playing="playing" :reduced="reduced" @previous="previous" @next="next" @pause="pause" @resume="resume" @replay="play" @finish="finish"/></div>
  </div>
</template>
