import { onScopeDispose, ref } from 'vue'
import { onSlideEnter, onSlideLeave, useIsSlideActive } from '@slidev/client'

// Cue times pace the explanation; they do not represent inference latency.
export function usePresentationPlayback(cues) {
  const active = useIsSlideActive()
  const stage = ref(cues.length)
  const playing = ref(false)
  const runId = ref(0)
  const media = typeof window === 'undefined' ? null : window.matchMedia('(prefers-reduced-motion: reduce)')
  const reduced = ref(media?.matches ?? false)
  const params = typeof window === 'undefined' ? new URLSearchParams() : new URLSearchParams(window.location.search)
  const staticMode = typeof navigator === 'undefined' || (navigator.webdriver && params.get('motion') !== '1') || params.get('motion') === '0' || params.has('print')
  let timers = []

  function clear() {
    timers.forEach(clearTimeout)
    timers = []
  }
  function finish() {
    clear()
    stage.value = cues.length
    playing.value = false
  }
  function seek(nextStage) {
    clear()
    stage.value=Math.max(0,Math.min(cues.length,nextStage))
    playing.value=false
  }
  function previous() { seek(stage.value - 1) }
  function next() { seek(stage.value + 1) }
  function pause() { seek(stage.value) }
  function resume() {
    clear()
    if (!active.value || reduced.value || staticMode || stage.value === cues.length) return finish()
    const current = stage.value
    const offset = current === 0 ? 0 : cues[current - 1]
    playing.value = true
    cues.forEach((time, i) => {
      if (i >= current) timers.push(setTimeout(() => { stage.value = i + 1 }, time - offset))
    })
    timers.push(setTimeout(() => { playing.value = false; timers = [] }, cues.at(-1) - offset + 300))
  }
  function play() {
    if (!active.value || reduced.value || staticMode) return finish()
    runId.value++
    stage.value = 0
    resume()
  }
  function preferenceChanged(event) {
    reduced.value = event.matches
    if (event.matches) finish()
  }
  media?.addEventListener('change', preferenceChanged)
  onSlideEnter(play)
  onSlideLeave(finish)
  onScopeDispose(() => { clear(); media?.removeEventListener('change', preferenceChanged) })
  return { stage, total: cues.length + 1, playing, runId, reduced, staticMode, play, finish, seek, previous, next, pause, resume }
}
