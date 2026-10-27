<script setup>
import { useNav } from '@slidev/client'
const { isPrintMode } = useNav()
defineProps({ sequence:Object })
</script>
<template>
  <div v-if="!isPrintMode" class="controls" role="group" aria-label="Explanation playback" @keydown.stop @keyup.stop @click.stop>
    <span class="position" aria-live="polite">{{ sequence.step.value + 1 }} / {{ sequence.labels.length }}</span>
    <button v-if="!sequence.reduced.value" :aria-label="sequence.playing.value ? 'Pause explanation' : sequence.step.value === sequence.labels.length - 1 ? 'Replay explanation' : 'Play explanation'" @click="sequence.playing.value ? sequence.pause() : sequence.play()">{{ sequence.playing.value ? 'Pause' : sequence.step.value === sequence.labels.length - 1 ? 'Replay' : 'Play' }}</button>
    <span class="step-label">{{ sequence.labels[sequence.step.value] }}</span>
  </div>
</template>
