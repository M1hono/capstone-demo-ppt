<script setup>
import { computed, ref } from 'vue'
const base = import.meta.env.BASE_URL
const selected = ref(0)
const figures = [
  ['fivek-psnr', 'FiveK · PSNR', 'Per-expert Top-1 and oracle coverage from the archived diagnostic.'],
  ['fivek-ssim', 'FiveK · SSIM', 'Reported structural similarity for all five experts.'],
  ['ppsd-comparison', 'PPSD comparison', 'Published context with different evaluation protocols.'],
  ['conditioning-ablations', 'Conditioning ablations', 'Reported changes when the image or user history is replaced.'],
  ['inference-benchmark', 'GPU benchmark', 'Recorded model-side measurements on an RTX 4060 Laptop GPU.'],
  ['decoder-robustness', 'Decoder robustness', 'Separate ten-image latent-noise diagnostic.'],
]
const current = computed(() => figures[selected.value])
</script>
<template>
  <div class="stack">
    <div class="figure-gallery grow">
      <nav aria-label="Evidence figures">
        <button v-for="(figure, i) in figures" :key="figure[0]" :aria-label="figure[1]" :aria-pressed="selected === i" @click.stop="selected = i">
          <img :src="`${base}figures/${figure[0]}.svg`" :alt="`${figure[1]} thumbnail`" />
          <span>{{ figure[1] }}</span>
        </button>
      </nav>
      <figure class="selected-figure">
        <img :src="`${base}figures/${current[0]}.svg`" :alt="current[1]" />
        <figcaption>{{ current[2] }}</figcaption>
      </figure>
    </div>
    <div class="source-links">
      <a :href="`${base}figures/${current[0]}.svg`" target="_blank" rel="noopener">Open SVG</a>
      <a :href="`${base}figures/${current[0]}.png`" download>Download PNG</a>
      <a :href="`${base}figures/${current[0]}.pdf`" download>Download PDF</a>
      <a :href="`${base}evidence/phase2_diag.txt`" target="_blank" rel="noopener">Archived diagnostic</a>
    </div>
  </div>
</template>
<style scoped>
.figure-gallery{display:grid;grid-template-columns:270px 1fr;gap:32px}.figure-gallery nav{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-content:start}.figure-gallery button{padding:6px;text-align:left;font-size:13px}.figure-gallery button img{width:100%;height:92px;object-fit:contain;background:white}.figure-gallery button span{display:block;padding:6px 2px}.selected-figure{margin:0;display:flex;flex-direction:column;min-height:0}.selected-figure>img{width:100%;height:390px;object-fit:contain}.selected-figure figcaption{font-size:15px;color:var(--muted);padding-top:12px}
</style>
