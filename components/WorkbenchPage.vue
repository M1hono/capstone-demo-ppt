<script setup>
import { nextTick, onMounted, onScopeDispose, ref } from 'vue'
import { onSlideEnter } from '@slidev/client'
import evidence from '../data/report-evidence.json'
const props = defineProps({ number:Number, title:String, component:String, section:String, usage:String })
const topic = evidence.topics.find(t => t.number === props.number)
const base = import.meta.env.BASE_URL
const pageRoot = ref(null)
let diagramObserver
let textSettleTimer
function resolveDiagramText() {
  pageRoot.value?.querySelectorAll('svg text').forEach(text => {
    text.getBBox()
    // Screen-space measurement also invalidates Chromium's stale glyph transform.
    text.getBoundingClientRect()
  })
}
async function settleDiagramText() {
  await nextTick()
  await document.fonts.ready
  requestAnimationFrame(() => {
    // Chromium can retain stale SVG glyph positions after webfont/flex sizing.
    // Resolve text geometry once after fonts load and when the slide becomes visible.
    resolveDiagramText()
    clearTimeout(textSettleTimer)
    // Slidev finishes its parent-scale transition after the first SVG layout.
    textSettleTimer = setTimeout(resolveDiagramText, 240)
  })
}
onMounted(() => {
  settleDiagramText()
  diagramObserver = new ResizeObserver(() => requestAnimationFrame(resolveDiagramText))
  pageRoot.value?.querySelectorAll('svg').forEach(svg => diagramObserver.observe(svg))
})
onScopeDispose(() => { diagramObserver?.disconnect(); clearTimeout(textSettleTimer) })
onSlideEnter(settleDiagramText)
function keepControlKeys(event) {
  if (event.target.closest('button, input, select, a')) event.stopPropagation()
}
</script>
<template>
  <section ref="pageRoot" class="workbench" :data-topic="number" @keydown="keepControlKeys" @keyup="keepControlKeys">
    <header><h1>{{ title || topic?.title }}</h1></header>
    <main class="workbench-body"><slot /></main>
    <footer><span>{{ section || `Report ${topic?.section}` }}</span><span><a :href="base+'evidence/index.html'" target="_blank" rel="noopener">Evidence index</a> · {{ String(number).padStart(2,'0') }}</span></footer>
  </section>
</template>
