<script setup>
import { computed, ref } from 'vue'
import pairs from '../data/history-pairs.json'
const base = import.meta.env.BASE_URL
const index = ref(0)
const pair = computed(() => pairs[index.value])
</script>
<template>
  <div class="stack visual-lab">
    <div class="row spread"><p class="readout">{{ pair.scene }} <span class="muted">· Expert C</span></p><div class="row"><button @click.stop="index = (index + 19) % 20" aria-label="Previous history pair">← Previous</button><span class="small">{{ index + 1 }} / 20</span><button @click.stop="index = (index + 1) % 20" aria-label="Next history pair">Next →</button></div></div>
    <div class="pair-view grow"><figure class="photo-frame"><img class="photo" :src="base + pair.original" :alt="`Original ${pair.scene}`" /><figcaption>Original Oᵢ</figcaption></figure><figure class="photo-frame"><img class="photo" :src="base + pair.edited" :alt="`Expert C edit ${pair.scene}`" /><figcaption>Historical edit Tᵢ</figcaption></figure></div>
    <div class="history-contact"><button v-for="(p,i) in pairs" :key="p.id" :aria-pressed="index === i" :aria-label="`History pair ${i + 1}`" @click.stop="index = i"><img :src="base + p.original" :alt="p.scene" /><span>{{ p.id }}</span></button></div>
    <p class="source-caption">Twenty original/edit pairs from FiveK. Full source URLs and file hashes are available in the evidence index.</p>
  </div>
</template>
<style scoped>.pair-view{display:grid;grid-template-columns:1fr 1fr;gap:24px;min-height:0}.pair-view figure{display:flex;flex-direction:column;min-height:0}.pair-view img{height:100%;min-height:0;flex:1;object-fit:contain}.history-contact{display:grid;grid-template-columns:repeat(10,1fr);gap:6px}.history-contact button{padding:3px;display:flex;align-items:center;gap:4px;font-size:11px}.history-contact img{width:63px;height:42px;object-fit:cover}</style>
