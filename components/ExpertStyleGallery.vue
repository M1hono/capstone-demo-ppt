<script setup>
import { ref } from 'vue'
const base = import.meta.env.BASE_URL
const selected = ref('C')
</script>
<template>
  <div class="stack visual-lab">
    <div class="expert-gallery grow">
      <figure class="photo-frame"><img class="photo" :src="base + 'assets/fivek/original.png'" alt="Unedited FiveK scene" /><figcaption>Original · a0412-_DGW6297</figcaption></figure>
      <figure class="photo-frame"><img class="photo" :src="`${base}assets/fivek/expert-${selected}.png`" :alt="`Expert ${selected} retouched reference`" /><figcaption>Expert {{ selected }} · recorded reference edit</figcaption></figure>
    </div>
    <div class="expert-filmstrip">
      <button v-for="expert in ['A','B','C','D','E']" :key="expert" :aria-pressed="selected === expert" @click.stop="selected = expert"><img :src="`${base}assets/fivek/expert-${expert}.png`" :alt="`Expert ${expert} preview`" /><span>Expert {{ expert }}</span></button>
    </div>
    <p class="source-caption">Five recorded edits of one scene. Differences across experts illustrate variation between people; they do not establish multiple acceptable edits for one person.</p>
  </div>
</template>
<style scoped>.expert-gallery{display:grid;grid-template-columns:1fr 1fr;gap:24px;min-height:0}.expert-gallery figure{display:flex;flex-direction:column;min-height:0}.expert-gallery img{height:100%;min-height:0;flex:1;object-fit:contain}.expert-filmstrip{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}.expert-filmstrip button{padding:5px;display:flex;align-items:center;gap:12px;font-size:15px}.expert-filmstrip img{width:108px;height:72px;object-fit:contain}</style>
