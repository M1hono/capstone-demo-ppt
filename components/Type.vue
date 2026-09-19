<script setup>
defineProps({
  text: { type: String, required: true },
  accent: { type: Boolean, default: false },
})
</script>

<template>
  <span class="type-line" :class="{ 'type-accent': accent }" :style="{ '--type-chars': text.length }">{{ text }}</span>
</template>
