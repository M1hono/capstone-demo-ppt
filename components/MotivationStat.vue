<script setup>
import { onMounted, ref } from 'vue'

defineProps({
  accuracy: { type: Number, default: 0.3 },
  caption: {
    type: String,
    default: 'Stage-4 image-similarity retrieval: only ~3 in 10 queries pulled the right expert direction — similarity alone cannot recover preference, motivating the conditional multimodal model.',
  },
})

const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const shown = ref(!reduced)
onMounted(() => {
  if (!shown.value)
    setTimeout(() => (shown.value = true), 150)
})
</script>

<template>
  <div class="motivation-stat">
    <div class="ms-left">
      <p class="ms-kicker">Why not just retrieve a similar image?</p>
      <p class="ms-number"><span class="ms-num" :class="{ shown }">≈30%</span></p>
      <p class="ms-sub">top-1 accuracy of expert retrieval<br>by image similarity</p>
    </div>
    <div class="ms-right">
      <div class="ms-grid" aria-hidden="true">
        <i v-for="k in 100" :key="k" :class="{ hit: k <= 30, shown }" :style="{ transitionDelay: `${Math.min(k * 12, 900)}ms` }" />
      </div>
      <p class="ms-legend"><i class="dot hit" /> retrieved the right expert <i class="dot miss" /> wrong expert</p>
    </div>
    <p class="ms-caption">{{ caption }}<br><span class="ms-prov">W13 group report draft §2.2 · run-level provenance pending</span></p>
  </div>
</template>

<style scoped>
.motivation-stat{font-family:inherit;color:#1b1d20;display:grid;grid-template-columns:1fr 1.2fr;gap:28px;align-items:center}
.ms-kicker{font-size:17px;margin:0 0 6px;color:#555}
.ms-number{margin:0}
.ms-num{font-size:88px;font-weight:800;letter-spacing:-2px;color:#c8cdd4;transition:color .6s ease .3s}
.ms-num.shown{color:#b3261e}
.ms-sub{font-size:15px;color:#555;margin:6px 0 0}
.ms-grid{display:grid;grid-template-columns:repeat(10, 18px);gap:5px}
.ms-grid i{width:18px;height:18px;background:#e6e9ed;border-radius:3px;opacity:0;transform:translateY(6px);transition:all .35s ease}
.ms-grid i.shown{opacity:1;transform:none}
.ms-grid i.hit{background:#b3261e}
.ms-legend{font-size:13px;color:#555;margin:14px 0 0}
.dot{display:inline-block;width:11px;height:11px;border-radius:3px;margin:0 5px 0 14px;vertical-align:-1px}
.dot.hit{background:#b3261e;margin-left:0}
.dot.miss{background:#e6e9ed}
.ms-caption{grid-column:1 / -1;font-size:14px;color:#444;margin:8px 0 0;border-top:1px solid #e3e5e9;padding-top:12px}
.ms-prov{color:#8a9099;font-size:12px}
</style>
