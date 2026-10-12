<script setup>
import { onMounted, ref } from 'vue'

// null value = awaiting run-level export; rendered as "TBD" so no number is invented
const rows = [
  { label: 'Full conditioning (history + image)', value: 23.5, accent: true },
  { label: 'Wrong history (shuffled user)', value: null },
  { label: 'Wrong image (mismatched context)', value: null },
]

const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const shown = ref(!reduced)
onMounted(() => {
  if (!shown.value)
    requestAnimationFrame(() => (shown.value = true))
})
</script>

<template>
  <div class="abl-bars">
    <h3>Conditioning ablations — strict personalization setting (PSNR, dB)</h3>
    <div v-for="r in rows" :key="r.label" class="ab-row">
      <span class="ab-label" :class="{ 'ab-accent-label': r.accent }">{{ r.label }}</span>
      <div class="ab-track">
        <div v-if="r.value !== null" class="ab-fill" :class="{ accent: r.accent }" :style="{ width: shown ? `${(r.value / 27) * 100}%` : '0%' }" />
        <div v-else class="ab-tbd" :style="{ width: shown ? '100%' : '0%' }">value awaiting run-level export</div>
      </div>
      <span class="ab-value">{{ r.value !== null ? r.value.toFixed(1) : '—' }}</span>
    </div>
    <p class="ab-note">Ablations named in W13 group report draft §1.3 · wrong-history / wrong-image deltas intentionally left blank until run CSVs are archived — no placeholder numbers</p>
  </div>
</template>

<style scoped>
.abl-bars{font-family:inherit;color:#1b1d20}
h3{font-size:17px;font-weight:600;margin:0 0 16px}
.ab-row{display:grid;grid-template-columns:300px 1fr 56px;align-items:center;gap:12px;margin:0 0 12px}
.ab-label{font-size:15px;color:#333;text-align:right}
.ab-accent-label{font-weight:700}
.ab-track{height:26px;background:#eceff2;border-radius:4px;overflow:hidden}
.ab-fill{height:100%;background:#2980bd;transition:width .9s cubic-bezier(.2,.7,.2,1)}
.ab-fill.accent{background:#b3261e}
.ab-tbd{height:100%;background:repeating-linear-gradient(45deg,#f4f6f9 0 12px,#eceff3 12px 24px);color:#9aa0a8;font-size:12px;display:flex;align-items:center;padding-left:12px;transition:width .9s}
.ab-value{font-size:16px;font-weight:600;font-variant-numeric:tabular-nums}
.ab-note{font-size:12px;color:#8a9099;margin:6px 0 0}
@media (prefers-reduced-motion: reduce){.ab-fill,.ab-tbd{transition:none}}
</style>
