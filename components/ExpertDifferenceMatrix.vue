<script setup>
import { computed, ref } from 'vue'
import d from '../data/image-diagnostics.json'
const base = import.meta.env.BASE_URL, first = ref(1), second = ref(3)
const names = ['Original','Expert A','Expert B','Expert C','Expert D','Expert E']
const src = i => `${base}assets/fivek/${i === 0 ? 'original' : 'expert-' + 'ABCDE'[i - 1]}.png`
const peak = Math.max(...d.matrix.flat())
const value = computed(() => d.matrix[first.value][second.value])
</script>
<template>
  <div class="stack visual-lab">
    <div class="matrix-layout grow">
      <div class="matrix" role="group" aria-label="Pairwise reference differences">
        <span></span><span v-for="n in names" :key="n" class="matrix-label">{{ n.replace('Expert ','') }}</span>
        <template v-for="(row,i) in d.matrix" :key="i"><span class="matrix-label">{{ names[i] }}</span><button v-for="(v,j) in row" :key="j" :aria-label="`${names[i]} versus ${names[j]}: ${v.toFixed(2)}`" :aria-pressed="first === i && second === j" :style="{background:`rgba(15,98,254,${.04 + .78 * v / peak})`,color:v / peak > .5 ? 'white' : '#18202b'}" @click.stop="first = i; second = j">{{ v.toFixed(1) }}</button></template>
      </div>
      <div class="col matrix-detail"><div class="matrix-photos"><figure class="photo-frame"><img class="photo" :src="src(first)" :alt="names[first]"/><figcaption>{{ names[first] }}</figcaption></figure><figure class="photo-frame"><img class="photo" :src="src(second)" :alt="names[second]"/><figcaption>{{ names[second] }}</figcaption></figure></div><p class="big blue" data-pair-difference>{{ value.toFixed(2) }}<small> / 255</small></p><h3>Mean absolute RGB difference</h3><p class="small muted">Select a cell to compare its two images. Zero on the diagonal means an image is compared with itself.</p></div>
    </div>
    <p class="source-caption">All 36 comparisons use the same 500 × 332 display grid. Image differences describe this scene; they are not model errors or preference distances.</p>
  </div>
</template>
<style scoped>.matrix-layout{display:grid;grid-template-columns:1.1fr 1fr;gap:44px;align-items:center}.matrix{display:grid;grid-template-columns:85px repeat(6,1fr);gap:5px;align-items:stretch}.matrix button{height:49px;padding:4px;font-size:16px;border:0;font-variant-numeric:tabular-nums}.matrix button[aria-pressed=true]{outline:3px solid #18202b;outline-offset:0}.matrix-label{display:flex;align-items:center;justify-content:center;font-size:13px}.matrix-photos{display:grid;grid-template-columns:1fr 1fr;gap:12px}.matrix-photos img{height:165px;object-fit:contain}.matrix-detail{gap:14px}.matrix-detail h3{margin:0}</style>
