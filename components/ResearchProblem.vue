<script setup>
import { ref } from 'vue'
const expert=ref('C')
const base=import.meta.env.BASE_URL
</script>
<template>
  <div class="split wide-left">
    <div class="col"><div class="tabs" role="group" aria-label="Expert selection"><button v-for="e in ['A','B','C','D','E']" :key="e" :aria-pressed="expert===e" @click.stop="expert=e">Expert {{e}}</button></div><div class="photo-grid" style="grid-template-columns:1fr 1fr"><figure class="photo-frame"><img class="photo" style="height:270px;object-fit:contain" :src="base+'assets/fivek/original.png'" alt="Original FiveK photograph"/><figcaption>Original image O</figcaption></figure><figure class="photo-frame"><img class="photo" style="height:270px;object-fit:contain" :src="base+`assets/fivek/expert-${expert}.png`" :alt="`Real Expert ${expert} edit of the same photograph`"/><figcaption>Recorded Expert {{expert}} edit T</figcaption></figure></div><p class="note">These are real expert edits. Cross-expert differences illustrate personalization; they do not prove multiple preferences for one user.</p></div>
    <div class="col"><p class="statement">The desired edit depends on the image and the user.</p><div class="steps"><article><span>01</span><div><h3>Adapt without retraining</h3><p>Use a small editing history to condition a shared model.</p></div></article><article><span>02</span><div><h3>Represent more than one answer</h3><p>Model a continuous, potentially multimodal preference distribution.</p></div></article></div><p class="small muted">Similarity experiment: approximately 30% retrieval accuracy in the report. This motivates a hypothesis; it does not establish multimodality.</p></div>
  </div>
</template>
