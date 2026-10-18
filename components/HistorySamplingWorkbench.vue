<script setup>
import { computed, ref } from 'vue'
import pairs from '../data/history-pairs.json'
const base = import.meta.env.BASE_URL, seed = ref(41)
const chosen = computed(() => {
  let state = seed.value
  const shuffled = [...pairs]
  for (let i = shuffled.length - 1; i > 0; i--) {
    state = (1664525 * state + 1013904223) >>> 0
    const j = Math.floor(state / 4294967296 * (i + 1))
    ;[shuffled[i],shuffled[j]] = [shuffled[j],shuffled[i]]
  }
  return shuffled.slice(0,8)
})
</script>
<template>
  <div class="stack visual-lab">
    <div class="row spread"><p class="readout">Eight pairs sampled without replacement</p><div class="row"><span class="small muted">Display seed {{ seed }}</span><button @click.stop="seed++">Resample history</button></div></div>
    <div class="sampling-layout grow">
      <div class="col query-panel"><figure class="photo-frame"><img class="photo" :src="base + 'assets/fivek/original.png'" alt="Query excluded from the history pool"/><figcaption>Query · a0412-_DGW6297</figcaption></figure><p class="small">The query is outside this 20-pair history pool.</p><p class="formula">H = {(Oᵢ,Tᵢ)}⁸</p><p class="small muted">Each selected pair stays together. All references belong to Expert C.</p></div>
      <div class="selected-history"><figure v-for="(p,i) in chosen" :key="p.id" class="photo-frame" :data-selected-history="p.id"><div><img :src="base + p.original" :alt="`Selected original ${p.id}`"/><img :src="base + p.edited" :alt="`Selected edit ${p.id}`"/></div><figcaption>H{{ i + 1 }} · pair {{ p.id }}<span>Original / Expert C</span></figcaption></figure></div>
    </div>
    <div class="history-pool"><figure v-for="p in pairs" :key="p.id" :class="{chosen:chosen.some(c => c.id === p.id)}"><img :src="base + p.original" :alt="`Pool image ${p.id}`"/><figcaption>{{ p.id }}</figcaption></figure></div>
    <p class="source-caption">Interactive sampling demonstration using real reference pairs. Blue outlines mark the selected eight; no checkpoint inference runs in this component.</p>
  </div>
</template>
<style scoped>.sampling-layout{display:grid;grid-template-columns:220px 1fr;gap:28px;min-height:0}.query-panel{gap:12px}.query-panel img{height:145px;object-fit:contain}.selected-history{display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:1fr 1fr;gap:16px;min-height:0}.selected-history figure{min-height:0;display:flex;flex-direction:column}.selected-history figure>div{display:grid;grid-template-columns:1fr 1fr;gap:4px;flex:1;min-height:0}.selected-history img{width:100%;height:100%;min-height:0;object-fit:contain;background:var(--surface)}.selected-history figcaption span{display:block;font-size:11px}.history-pool{display:grid;grid-template-columns:repeat(20,1fr);gap:5px}.history-pool figure{margin:0;padding:2px;border:2px solid transparent}.history-pool .chosen{border-color:var(--blue)}.history-pool img{width:100%;height:34px;object-fit:cover}.history-pool figcaption{font-size:10px;text-align:center;padding-top:3px}</style>
