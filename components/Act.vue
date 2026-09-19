<script setup>
defineProps({
  n: { type: [Number, String], required: true },
  label: { type: String, required: true },
  kicker: { type: String, default: 'CLIENT DEPLOYMENT / LIVE STAGE' },
})
</script>

<template>
  <div class="act-hud" aria-hidden="true">
    <span class="act-kicker">{{ kicker }}</span>
    <span class="act-index">ACT {{ String(n).padStart(2, '0') }}</span>
    <span class="act-label">{{ label }}</span>
  </div>
</template>
