<script setup>
import { computed, ref } from 'vue'
const base = import.meta.env.BASE_URL
const expert = ref('C'), x = ref(50), y = ref(45), zoom = ref(3)
const extent = computed(() => ({w:500 / zoom.value, h:332 / zoom.value}))
const left = computed(() => (500 - extent.value.w) * x.value / 100)
const top = computed(() => (332 - extent.value.h) * y.value / 100)
const box = computed(() => `${left.value} ${top.value} ${extent.value.w} ${extent.value.h}`)
</script>
<template>
  <div class="stack visual-lab">
    <div class="row spread"><label class="small row">Horizontal <input v-model.number="x" type="range" min="0" max="100" aria-label="Crop horizontal position" /></label><label class="small row">Vertical <input v-model.number="y" type="range" min="0" max="100" aria-label="Crop vertical position" /></label><label class="small">Zoom <select v-model.number="zoom" aria-label="Crop zoom"><option :value="2">2×</option><option :value="3">3×</option><option :value="5">5×</option></select></label><label class="small">Expert <select v-model="expert" aria-label="Crop expert"><option v-for="c in ['A','B','C','D','E']" :key="c">{{ c }}</option></select></label></div>
    <div class="loupe-layout grow">
      <div class="col"><svg viewBox="0 0 500 332" role="img" aria-label="Original image with selected crop region"><image :href="base + 'assets/fivek/original.png'" width="500" height="332"/><rect :x="left" :y="top" :width="extent.w" :height="extent.h" fill="none" stroke="white" stroke-width="5"/><rect :x="left" :y="top" :width="extent.w" :height="extent.h" fill="none" stroke="#0f62fe" stroke-width="2"/></svg><p class="small muted">Selected region · {{ Math.round(extent.w) }} × {{ Math.round(extent.h) }} display pixels</p></div>
      <figure class="photo-frame"><svg :viewBox="box" role="img" aria-label="Magnified original crop"><image :href="base + 'assets/fivek/original.png'" width="500" height="332"/></svg><figcaption>Original crop · {{ zoom }}×</figcaption></figure>
      <figure class="photo-frame"><svg :viewBox="box" role="img" :aria-label="`Magnified Expert ${expert} reference crop`"><image :href="`${base}assets/image-diagnostics/expert-${expert}-aligned.png`" width="500" height="332"/></svg><figcaption>Expert {{ expert }} crop · same coordinates</figcaption></figure>
    </div>
    <p class="source-caption">Synchronous crops of real display images. Magnification does not add detail; the reference is resampled to the original 500 × 332 display grid.</p>
  </div>
</template>
<style scoped>.loupe-layout{display:grid;grid-template-columns:.85fr 1fr 1fr;align-items:center;gap:22px}.loupe-layout svg{display:block;width:100%;height:auto;background:var(--surface)}.loupe-layout figure svg{height:310px}.loupe-layout .col{gap:12px}.visual-lab input{width:150px}</style>
