<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import { ensureEngine } from './engine.js'
const props=defineProps({act:{type:Number,default:0}})
const root=ref(null)
const snapshot=computed(()=>`${import.meta.env.BASE_URL}assets/engine/act-${props.act}.png`)
const {$nav,$page}=useSlideContext()
const automated=typeof navigator!=='undefined' && navigator.webdriver
async function show(){
  if(automated || !window.WebGL2RenderingContext || $nav.value.currentSlideNo!==$page.value || !root.value)return
  try {
    const engine=ensureEngine();await engine.ready
    if($nav.value.currentSlideNo===$page.value && root.value)engine.follow(props.act,root.value)
  } catch(error) {
    console.warn('3D view unavailable; using the saved product view.',error.message)
  }
}
onMounted(show)
watch(()=>$nav.value.currentSlideNo,n=>{if(n===$page.value)show()})
</script>
<template>
  <div ref="root" class="engine-view" role="img" aria-label="Exploded editor anatomy: input, edit controls, DiffMap, residual CNN, output">
    <img v-if="snapshot" class="scene-snapshot" :src="snapshot" alt="" />
  </div>
</template>
