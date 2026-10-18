<script setup>
defineProps({ sequence:Object })
</script>
<template>
  <div class="controls" role="group" aria-label="Explanation playback" @keydown.stop @keyup.stop @click.stop>
    <button aria-label="Previous step" :disabled="sequence.step.value === 0" @click="sequence.seek(sequence.step.value - 1)">← Previous</button>
    <span class="position" aria-live="polite">{{ sequence.step.value + 1 }} / {{ sequence.labels.length }}</span>
    <button aria-label="Next step" :disabled="sequence.step.value === sequence.labels.length - 1" @click="sequence.seek(sequence.step.value + 1)">Next →</button>
    <button v-if="!sequence.reduced.value" :aria-label="sequence.playing.value ? 'Pause explanation' : 'Play explanation'" @click="sequence.playing.value ? sequence.pause() : sequence.play()">{{ sequence.playing.value ? 'Pause' : 'Play' }}</button>
    <button @click="sequence.seek(sequence.labels.length - 1)">Show all</button>
    <span class="step-label">{{ sequence.labels[sequence.step.value] }}</span>
  </div>
</template>
