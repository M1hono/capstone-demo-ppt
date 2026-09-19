<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ before: String, after: String, label: String, reveal: { type: Number, default: 100 }, interactive: { type: Boolean, default: true } })
const amount = ref(props.reveal)
const dragging = ref(false)
watch(() => [props.reveal, props.after], () => { amount.value = props.reveal })
function move(event) {
  if (!props.interactive || !dragging.value || event.target.tagName === 'INPUT') return
  const box=event.currentTarget.getBoundingClientRect()
  amount.value=Math.round(Math.max(0,Math.min(100,(event.clientX-box.left)/box.width*100)))
}
function start(event) {
  if (!props.interactive || event.target.tagName === 'INPUT') return
  dragging.value=true
  event.currentTarget.setPointerCapture(event.pointerId)
  move(event)
}
</script>
<template>
  <div class="image-comparison" :class="{ 'is-dragging': dragging }" :data-reveal="amount" @pointerdown.stop="start" @pointermove="move" @pointerup="dragging=false" @pointercancel="dragging=false" @dragstart.prevent>
    <img class="comparison-original" :src="before" :alt="`${label}: original`" draggable="false" />
    <img class="comparison-result" :src="after" :alt="label" draggable="false" :style="{ clipPath: `inset(0 ${100 - amount}% 0 0)` }" />
    <span v-if="amount > 0 && amount < 100" class="comparison-divider" :style="{ left: `${amount}%` }" aria-hidden="true"><i>↔</i></span>
    <input v-if="interactive" class="comparison-slider" type="range" min="0" max="100" step="1" v-model.number="amount" :aria-label="`Compare original and ${label}`" :aria-valuetext="`${amount}% output revealed`" @pointerdown.stop="dragging = true" @pointerup="dragging = false" @pointercancel="dragging = false" @click.stop @keydown.stop />
  </div>
</template>
