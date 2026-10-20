<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  animate: { type: Boolean, default: true },
  max: { type: Number, default: 27 },
  groups: {
    type: Array,
    default: () => [
      {
        title: 'Overall reconstruction quality (PSNR, dB)',
        bars: [
          { label: 'PPSD', value: 24.5 },
          { label: 'FiveK', value: 23.8 },
        ],
      },
      {
        title: 'Strict personalization — target expert unseen (PSNR, dB)',
        bars: [
          { label: 'Ours', value: 23.5, accent: true },
          { label: 'RefRetouch', value: 21.3 },
          { label: 'PieNet', value: 20.8 },
        ],
      },
    ],
  },
})

const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const shown = ref(!(props.animate && !reduced))
onMounted(() => {
  if (!shown.value)
    requestAnimationFrame(() => (shown.value = true))
})
</script>

<template>
  <div class="metric-bars">
    <section v-for="grp in groups" :key="grp.title" class="mb-group">
      <h3>{{ grp.title }}</h3>
      <div v-for="b in grp.bars" :key="b.label" class="mb-row">
        <span class="mb-label" :class="{ 'mb-accent-label': b.accent }">{{ b.label }}</span>
        <div class="mb-track">
          <div class="mb-fill" :class="{ accent: b.accent }" :style="{ width: shown ? `${(b.value / max) * 100}%` : '0%' }" />
        </div>
        <span class="mb-value">{{ b.value.toFixed(1) }}</span>
      </div>
    </section>
    <p class="mb-note">Numbers: W13 group report draft §1.3 · higher is better · run-level provenance pending result-CSV archival</p>
  </div>
</template>

<style scoped>
.metric-bars{font-family:inherit;color:#1b1d20;display:flex;flex-direction:column;gap:22px}
.mb-group h3{font-size:17px;font-weight:600;margin:0 0 12px}
.mb-row{display:grid;grid-template-columns:120px 1fr 64px;align-items:center;gap:12px;margin:0 0 10px}
.mb-label{font-size:15px;color:#333;text-align:right}
.mb-accent-label{font-weight:700}
.mb-track{height:26px;background:#eceff2;border-radius:4px;overflow:hidden}
.mb-fill{height:100%;background:#2980bd;transition:width .9s cubic-bezier(.2,.7,.2,1)}
.mb-fill.accent{background:#b3261e}
.mb-value{font-size:16px;font-weight:600;font-variant-numeric:tabular-nums}
.mb-note{font-size:12px;color:#8a9099;margin:4px 0 0}
@media (prefers-reduced-motion: reduce){.mb-fill{transition:none}}
</style>
