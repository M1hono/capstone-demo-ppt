import { onScopeDispose, ref } from 'vue'
import { onSlideLeave } from '@slidev/client'

export function useSequence(labels) {
  const step = ref(labels.length - 1)
  const playing = ref(false)
  const reduced = ref(false)
  const media = typeof window === 'undefined' ? null : window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced.value = media?.matches ?? false
  let timer
  function pause() { clearTimeout(timer); playing.value = false }
  function seek(value) { pause(); step.value = Math.max(0, Math.min(labels.length - 1, value)) }
  function tick() {
    timer = setTimeout(() => {
      if (step.value >= labels.length - 1) return pause()
      step.value++
      if (step.value === labels.length - 1) pause()
      else tick()
    }, 1600)
  }
  function play() {
    if (reduced.value) return
    pause()
    if (step.value === labels.length - 1) step.value = 0
    playing.value = true
    tick()
  }
  function onPreference(event) { reduced.value = event.matches; if (event.matches) pause() }
  media?.addEventListener('change', onPreference)
  onSlideLeave(pause)
  onScopeDispose(() => { pause(); media?.removeEventListener('change', onPreference) })
  return { step, playing, reduced, labels, pause, play, seek }
}
