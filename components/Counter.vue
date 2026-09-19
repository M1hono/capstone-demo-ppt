<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  suffix: { type: String, default: '' },
  decimals: { type: Number, default: 0 },
})

const shown = ref(0)

onMounted(() => {
  if (typeof navigator !== 'undefined' && navigator.webdriver) {
    shown.value = props.value
    return
  }
  const start = performance.now()
  const duration = 850
  const tick = (now) => {
    const progress = Math.min(1, (now - start) / duration)
    const eased = 1 - (1 - progress) ** 3
    shown.value = props.value * eased
    if (progress < 1)
      requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
</script>

<template>
  <span class="counter">{{ shown.toFixed(decimals) }}{{ suffix }}</span>
</template>
