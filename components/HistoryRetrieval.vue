<script setup>
import { computed } from 'vue'
import { historyPairs, referencePairs } from '../data/history-examples'
const base=import.meta.env.BASE_URL
const props=defineProps({mode:{type:String,default:'history'}})
const query=computed(()=>props.mode==='query')
const caption=computed(()=>query.value?'Complete ground-truth editing information is unavailable during real-world inference.':'Network learns editing representations → editing representations determine relationships between samples → reconstructed sample relationships are reused for further training.')
</script>
<template>
  <div class="history-scene technical-scene">
    <div class="history-query-line"><div><b>{{query?'Partial-edit query':'Complete-edit query'}}</b><code>{{query?'e(I,P)':'e(I,G)'}} ∈ ℝ⁶⁴</code><span>{{query?'[I, P, P − I]':'[I, G, G − I]'}}</span></div><div class="history-distance"><b>Euclidean distance</b><code>dⱼ = ‖e<sub>query</sub> − e(Iⱼ,Gⱼ)‖₂</code><span>{{query?'Search within the 20-pair history':'Rank complete-edit descriptors across the candidate pool'}}</span></div><div class="history-count"><b>{{query?'Reference set':'Simulated history'}}</b><code>{{query?'20 → 3':'N → 20'}}</code><span>{{query?'Similar current intent':'Similar complete edits'}}</span></div></div>
    <div class="history-pool-row">
      <div class="history-pool-diagram">
        <div class="pool-caption"><b>ℋ: 20 original–edit pairs</b><span>One simulated user</span></div>
        <div class="history-grid"><figure v-for="(pair,i) in historyPairs" :key="pair.id" class="history-token" :class="{'selected':query && referencePairs.includes(pair)}">
          <img :src="`${base}${pair.original}`" :alt="`FiveK ${pair.id} original`"/><img :src="`${base}${pair.edited}`" :alt="`FiveK ${pair.id} Expert C edit`"/><figcaption>H{{i+1}}</figcaption>
        </figure></div>
        <small>Original → Expert C · real FiveK pairs; illustrative pool and selection.</small>
      </div>
      <span class="history-connector" aria-hidden="true">{{query?'→':'↶'}}</span>
      <div v-if="query" class="reference-output"><b>3 selected pairs</b>
        <div class="reference-pair-labels"><span/><span>Original Iᵣ</span><span>Expert Gᵣ</span></div>
        <div v-for="(pair,i) in referencePairs" :key="pair.id" class="reference-photo-pair"><span>R{{i+1}}</span><img :src="`${base}${pair.original}`" :alt="`Reference ${i+1}: FiveK ${pair.id} original`"/><img :src="`${base}${pair.edited}`" :alt="`Reference ${i+1}: FiveK ${pair.id} Expert C edit`"/></div>
        <span>Regional cross-attention →</span>
      </div>
      <div v-else class="history-refresh"><b>Refresh during training</b><p>The grouping is not permanently fixed.</p><code>weights → descriptors → ℋ</code><span>The dataset structure adapts together with the model.</span></div>
    </div>
    <div class="mechanism-reading"><p>{{caption}}</p></div>
  </div>
</template>
