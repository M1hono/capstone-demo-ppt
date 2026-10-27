<script setup>
import { nextTick, onMounted, onScopeDispose, ref } from 'vue'
import { onSlideEnter, onSlideLeave, useNav } from '@slidev/client'
import evidence from '../data/report-evidence.json'
const props = defineProps({ number:Number, title:String, component:String, section:String, usage:String })
const topic = evidence.topics.find(t => t.number === props.number)
const { isPrintMode } = useNav()
const pageRoot = ref(null)
const entered = ref(false)
let diagramObserver
let textSettleTimer
let textSettleFrame
function resolveDiagramText() {
  pageRoot.value?.querySelectorAll('svg').forEach(svg => {
    if (!svg.getClientRects().length) return
    const labels = [...svg.querySelectorAll('text')].map(text => ({
      text,
      value: text.style.getPropertyValue('font-size'),
      priority: text.style.getPropertyPriority('font-size'),
      size: parseFloat(getComputedStyle(text).fontSize),
    }))
    // Invalidate Chromium's cached glyph scale without replacing Vue-owned nodes.
    labels.forEach(({ text, size }) => text.style.setProperty('font-size', `${size + 0.01}px`, 'important'))
    svg.getBoundingClientRect()
    labels.forEach(({ text, value, priority }) => {
      if (value) text.style.setProperty('font-size', value, priority)
      else text.style.removeProperty('font-size')
    })
    svg.getBoundingClientRect()
    // Repaint the old glyph region as well; geometry refresh alone can leave ghost pixels.
    const display = svg.style.getPropertyValue('display')
    const displayPriority = svg.style.getPropertyPriority('display')
    svg.style.setProperty('display', 'none', 'important')
    svg.parentElement.getBoundingClientRect()
    if (display) svg.style.setProperty('display', display, displayPriority)
    else svg.style.removeProperty('display')
    svg.parentElement.getBoundingClientRect()
  })
}
async function settleDiagramText() {
  await nextTick()
  await document.fonts.ready
  if (!pageRoot.value) return
  cancelAnimationFrame(textSettleFrame)
  clearTimeout(textSettleTimer)
  textSettleFrame = requestAnimationFrame(() => {
    resolveDiagramText()
    // Slidev finishes its parent-scale transition after the first SVG layout.
    textSettleTimer = setTimeout(resolveDiagramText, 240)
  })
}
onMounted(() => {
  settleDiagramText()
  diagramObserver = new ResizeObserver(settleDiagramText)
  pageRoot.value?.querySelectorAll('svg').forEach(svg => diagramObserver.observe(svg))
  window.addEventListener('resize', settleDiagramText)
})
onScopeDispose(() => {
  diagramObserver?.disconnect()
  window.removeEventListener('resize', settleDiagramText)
  cancelAnimationFrame(textSettleFrame)
  clearTimeout(textSettleTimer)
})
onSlideEnter(() => { entered.value = true; settleDiagramText() })
onSlideLeave(() => { entered.value = false })
function keepControlKeys(event) {
  if (event.target.closest('button, input, select, a')) event.stopPropagation()
}
</script>
<template>
  <section ref="pageRoot" class="workbench" :class="{entered, 'static-view':isPrintMode, 'no-motion':number!==12}" :data-topic="number" :data-section="number <= 25 ? 'report' : 'lab'" @keydown="keepControlKeys" @keyup="keepControlKeys">
    <header><div class="page-index" aria-hidden="true"><span>{{ String(number).padStart(2,'0') }}</span></div><h1>{{ title || topic?.title }}</h1></header>
    <main class="workbench-body"><slot /></main>
    <footer><span>{{ section || `Report ${topic?.section}` }}</span><span class="page-total">{{ String(number).padStart(2,'0') }} / 25</span></footer>
  </section>
</template>
