<script setup>
import { computed, ref } from 'vue'
import { useSequence } from '../composables/useSequence'
const training = ref(false)
const sequence = useSequence(['Start in the input space', 'Apply the invertible map', 'Account for changes in volume', 'Read the result'])
const samples = Array.from({ length:256 }, (_, i) => {
  const radius = Math.sqrt(-2 * Math.log((i + 0.5) / 256))
  const angle = i * 2.3999632297
  return { x:radius * Math.cos(angle), y:radius * Math.sin(angle) }
})
function warp(p) { return { x:p.x + 1.45 * Math.tanh(p.x * 2), y:0.7 * p.y + 0.3 * Math.sin(p.x * 1.4) } }
function origin(p) { return { x:170 + p.x * 38, y:171 - p.y * 38 } }
function target(p) { const z = warp(p); return { x:666 + z.x * 31, y:171 - z.y * 48 } }
const progress = computed(() => [0, 0.33, 0.7, 1][sequence.step.value])
function position(p) {
  const a = training.value ? target(p) : origin(p)
  const b = training.value ? origin(p) : target(p)
  return { x:a.x + (b.x - a.x) * progress.value, y:a.y + (b.y - a.y) * progress.value }
}
function ring(radius, warped = false) {
  return Array.from({ length:97 }, (_, i) => {
    const angle = i / 96 * Math.PI * 2
    const p = { x:Math.cos(angle) * radius, y:Math.sin(angle) * radius }
    const q = warped ? target(p) : origin(p)
    return `${q.x},${q.y}`
  }).join(' ')
}
const explanation = computed(() => training.value ? [
  'Start with the target edit vector z and the condition c produced by the image and history.',
  'Map z into the base space through the conditional invertible transformation f.',
  'The Jacobian corrects for local stretching or compression of the retouching space.',
  'Maximise the conditional log-likelihood of the observed target edits.'
][sequence.step.value] : [
  'Draw 256 samples from a standard Gaussian. The same condition c is shared by all samples.',
  'Apply the inverse flow to each sample; the map can stretch and bend the base distribution.',
  'Different local volume changes produce different densities in the retouching space.',
  'Each resulting z is a possible edit vector. Candidate selection follows this sampling step.'
][sequence.step.value])
</script>
<template>
  <div class="stack conditional-flow">
    <div class="row spread"><div class="tabs"><button :aria-pressed="training" @click.stop="training=true">Training · z → u</button><button :aria-pressed="!training" @click.stop="training=false">Inference · u → z</button></div><span class="small muted">Same condition c · reversible mapping</span></div>
    <div class="flow-explanation grow">
      <svg viewBox="0 0 850 330" role="img" aria-label="Illustrative Gaussian samples move through an invertible transformation into a retouching distribution; switch direction to explain training">
        <text x="170" y="25" text-anchor="middle" class="space-title">Gaussian base</text><text x="666" y="25" text-anchor="middle" class="space-title">Retouching space</text>
        <g v-for="x in [170, 666]" :key="x" class="axes"><path :d="`M${x - 144} 171 H${x + 144} M${x} 47 V296`"/></g>
        <polyline v-for="r in [1, 2, 3]" :key="'u'+r" :points="ring(r)" fill="none" stroke="var(--teal)" :style="{opacity:0.25}"/>
        <polyline v-for="r in [1, 2, 3]" :key="'z'+r" :points="ring(r, true)" fill="none" stroke="var(--blue)" :style="{opacity:0.25}"/>
        <g v-if="sequence.step.value > 0" class="transport-lines">
          <path v-for="p in samples.filter((_, i) => i % 13 === 0)" :key="p.x" :d="`M${origin(p).x} ${origin(p).y} C370 ${origin(p).y} 470 ${target(p).y} ${target(p).x} ${target(p).y}`" fill="none" stroke="var(--line)" stroke-width=".8"/>
        </g>
        <g class="particles"><circle v-for="(p, i) in samples" :key="i" :cx="position(p).x" :cy="position(p).y" r="2.6" :fill="p.x < 0 ? 'var(--blue)' : 'var(--teal)'" :style="{opacity:0.8}" :data-flow-sample="i"/></g>
        <text x="423" y="92" text-anchor="middle" class="map-symbol">{{training ? 'f' : 'f⁻¹'}}</text>
        <text x="423" y="119" text-anchor="middle" class="map-label">conditioned on c</text>
        <path :d="training ? 'M468 252 H378 M389 244 L378 252 L389 260' : 'M378 252 H468 M457 244 L468 252 L457 260'" stroke="var(--ink)" stroke-width="1.8" fill="none"/>
        <text x="170" y="323" text-anchor="middle" class="space-formula">u ∼ N(0, I)</text><text x="666" y="323" text-anchor="middle" class="space-formula">z ∼ p(z | c)</text>
      </svg>
      <aside>
        <p class="section-title">{{training ? 'Learning the density' : 'Generating alternatives'}}</p>
        <p class="flow-formula">{{training ? 'u = f(z; c)' : 'z = f⁻¹(u; c)'}}</p>
        <p class="readout" aria-live="polite">{{explanation}}</p>
        <p class="source-caption">Illustrative 2D map and samples. The trained flow operates in ℝ³; no model checkpoint is being run here.</p>
      </aside>
    </div>
    <div class="likelihood"><p v-if="training" class="formula">log p(z | c) = log pₙ(f(z; c)) + log |det Jf|</p><p v-else class="formula">256 Gaussian samples → 256 possible edit vectors</p><p class="small muted">{{training ? 'Base log-density + change of volume' : 'The benchmark retains five candidates after sampling and selection.'}}</p></div>
    <SequenceControls :sequence="sequence"/>
  </div>
</template>
<style scoped>
.conditional-flow{gap:14px}.flow-explanation{display:grid;grid-template-columns:2.35fr 1fr;gap:30px;min-height:0}.flow-explanation svg{width:100%;height:100%;min-height:0}.flow-explanation aside{display:flex;flex-direction:column;justify-content:center;gap:18px;border-left:1px solid var(--line);padding-left:24px}.flow-formula{font-size:31px;color:var(--blue);letter-spacing:-1px}.space-title{font-size:22px;fill:var(--ink)}.space-formula{font-size:20px;fill:var(--ink)}.axes path{stroke:var(--line);stroke-width:1;fill:none}.map-symbol{font-size:44px;fill:var(--blue);font-style:italic}.map-label{font-size:15px;fill:var(--muted)}.particles circle{transition:cx .8s cubic-bezier(.22,1,.36,1),cy .8s cubic-bezier(.22,1,.36,1)}.likelihood{border-top:1px solid var(--line);padding-top:12px}.likelihood .formula{font-size:22px}
</style>
