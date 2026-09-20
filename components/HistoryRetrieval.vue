<script setup>
import { computed } from 'vue'
const props=defineProps({mode:{type:String,default:'history'}})
const query=computed(()=>props.mode==='query')
const caption=computed(()=>query.value?'Complete ground-truth editing information is unavailable during real-world inference.':'Network learns editing representations → editing representations determine relationships between samples → reconstructed sample relationships are reused for further training.')
</script>
<template>
  <div class="history-scene technical-scene">
    <div class="history-query-line"><div><b>{{query?'Partial-edit query':'Complete-edit query'}}</b><code>{{query?'e(I,P)':'e(I,G)'}} ∈ ℝ⁶⁴</code><span>{{query?'[I, P, P − I]':'[I, G, G − I]'}}</span></div><div class="history-distance"><b>Euclidean distance</b><code>dⱼ = ‖e<sub>query</sub> − e(Iⱼ,Gⱼ)‖₂</code><span>{{query?'Search within the 20-pair history':'Rank complete-edit descriptors across the candidate pool'}}</span></div><div class="history-count"><b>{{query?'Reference set':'Simulated history'}}</b><code>{{query?'20 → 3':'N → 20'}}</code><span>{{query?'Similar current intent':'Similar complete edits'}}</span></div></div>
    <div class="history-pool-row">
      <div class="history-pool-diagram"><div class="pool-caption"><b>ℋ: 20 original–edit pairs</b><span>One simulated user</span></div><div class="history-grid"><div v-for="i in 20" :key="i" class="history-token" :class="{'selected':query && i<=3}"><span>H{{i}}</span><i/><i/></div></div><small>Pair slots shown schematically; no measured retrieval ranking.</small></div>
      <span class="history-connector" aria-hidden="true">{{query?'→':'↶'}}</span>
      <div v-if="query" class="reference-output"><b>3 selected pairs</b><div v-for="i in 3" :key="i"><span>R{{i}}</span><code>(Iᵣ, Gᵣ)</code></div><span>Regional cross-attention →</span></div>
      <div v-else class="history-refresh"><b>Refresh during training</b><p>The grouping is not permanently fixed.</p><code>weights → descriptors → ℋ</code><span>The dataset structure adapts together with the model.</span></div>
    </div>
    <div class="mechanism-reading"><p>{{caption}}</p></div>
  </div>
</template>
