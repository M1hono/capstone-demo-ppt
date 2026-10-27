import { computed, onScopeDispose, ref } from 'vue'
import { onSlideEnter, onSlideLeave, useNav } from '@slidev/client'
import timing from '../data/playback-timing.json'

export function useSequence(labels, { intervalMs, animate = false } = {}) {
  const { isPrintMode, currentSlideNo } = useNav()
  const step = ref(labels.length - 1)
  const playing = ref(false)
  const reduced = ref(false)
  const media = typeof window === 'undefined' ? null : window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced.value = media?.matches ?? false
  let timer
  let interval = 800
  function pause() { clearTimeout(timer); playing.value = false }
  function seek(value) { pause(); step.value = Math.max(0, Math.min(labels.length - 1, value)) }
  function tick() {
    timer = setTimeout(() => {
      if (step.value >= labels.length - 1) return pause()
      step.value++
      if (step.value === labels.length - 1) pause()
      else tick()
    }, interval)
  }
  function play() {
    if (!animate || reduced.value || isPrintMode.value) return
    pause()
    if (step.value === labels.length - 1) step.value = 0
    playing.value = true
    tick()
  }
  function enter() {
    pause()
    const words = timing.scriptWords[currentSlideNo.value - 1] || 60
    interval = intervalMs ?? Math.round(Math.min(1200, Math.max(650, words * 35 / Math.max(1, labels.length - 1))))
    step.value = labels.length - 1
    if (animate && !reduced.value && !isPrintMode.value) play()
  }
  function onPreference(event) {
    reduced.value = event.matches
    if (event.matches) { pause(); step.value = labels.length - 1 }
  }
  media?.addEventListener('change', onPreference)
  onSlideEnter(enter)
  onSlideLeave(pause)
  onScopeDispose(() => { pause(); media?.removeEventListener('change', onPreference) })
  const complete = computed(() => !animate || reduced.value || isPrintMode.value)
  return { step, playing, reduced, complete, labels, pause, play, seek }
}
