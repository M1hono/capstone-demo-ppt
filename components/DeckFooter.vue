<script setup>
defineProps({page:Number,active:{type:Number,default:0},scope:{type:String,default:''}})
const steps=['Approach','Paired data','Transfer + training','Evidence','Next']
</script>
<template>
  <footer class="deck-footer">
    <nav aria-label="Presentation section"><span v-for="(step,i) in steps" :key="step" :class="{current:i===active}">{{step}}<i v-if="i<4">→</i></span></nav>
    <span class="footer-scope">{{scope}}</span><span class="page-number">{{String(page).padStart(2,'0')}} / 09</span>
  </footer>
</template>
