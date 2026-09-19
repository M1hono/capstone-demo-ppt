<script setup>
defineProps({
  title: { type: String, default: 'LIVE REQUEST' },
  lines: { type: Array, required: true },
  accent: { type: String, default: 'blue' },
})
</script>

<template>
  <div class="terminal" :class="`terminal-${accent}`">
    <div class="terminal-bar"><span class="terminal-dots"><i></i><i></i><i></i></span><b>{{ title }}</b><span>127.0.0.1</span></div>
    <div class="terminal-body">
      <p v-for="(line, index) in lines" :key="index" :class="{ 'terminal-result': index === lines.length - 1 }"><span class="terminal-prompt">{{ index === lines.length - 1 ? '✓' : '$' }}</span>{{ line }}</p>
    </div>
  </div>
</template>
