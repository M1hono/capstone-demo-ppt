<script setup>
defineProps({ stage: Number, total: Number, playing: Boolean, reduced: Boolean })
defineEmits(['replay', 'finish', 'previous', 'next', 'pause', 'resume'])
</script>
<template>
  <div class="playback-controls" role="group" aria-label="Presentation playback" @keydown.left.stop.prevent="$emit('previous')" @keydown.right.stop.prevent="$emit('next')" @keydown.space.stop @keydown.enter.stop @keyup.stop>
    <button class="step-playback" aria-label="Previous explanation" title="Previous explanation (←)" :disabled="stage===0" @click.stop="$emit('previous')"><span aria-hidden="true">←</span></button>
    <span class="playback-position" :aria-label="`Step ${stage+1} of ${total}`">{{stage+1}} / {{total}}</span>
    <button class="step-playback" aria-label="Next explanation" title="Next explanation (→)" :disabled="stage>=total-1" @click.stop="$emit('next')"><span aria-hidden="true">→</span></button>
    <button v-if="!reduced && stage<total-1" class="toggle-playback" :aria-label="playing?'Pause mechanism':'Continue mechanism'" @click.stop="$emit(playing?'pause':'resume')">{{playing?'Pause':'Continue'}}</button>
    <button v-if="!reduced" class="step-playback" aria-label="Replay mechanism" title="Replay from the beginning" @click.stop="$emit('replay')"><span aria-hidden="true">↻</span></button>
    <button v-if="stage<total-1" class="finish-playback" aria-label="Show final evidence" @click.stop="$emit('finish')">Show all</button>
  </div>
</template>
