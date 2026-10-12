<script setup>
const rows = [
  { condition: 'Full model', change: 'Top-3 retrieval + regional cross-attention', psnr: '26.70', delta: '—' },
  { condition: 'Random references', change: 'Nearest-neighbour retrieval replaced by random selection', psnr: '21.90', delta: '−4.80' },
  { condition: 'Equal reference weights', change: 'Attention scoring disabled; references averaged', psnr: '25.40', delta: '−1.30' },
  { condition: 'CNN fusion', change: 'Attention transfer replaced by CNN feature fusion', psnr: '24.50', delta: '−2.20' },
]
const protocol = [
  { k: 'Metric', v: 'PSNR = −10·log₁₀ MSE per (original, expert) pair, mean over split' },
  { k: 'Data', v: 'FiveK originals 1–400 train · 401–500 val · five expert targets each' },
  { k: 'Selection', v: 'Best validation-PSNR checkpoint' },
  { k: 'Loss', v: 'RGB L1 + 0.001 · mean |output − input| · λ SSIM = 0' },
  { k: 'Setup', v: 'AdamW 2e-4 · batch 4 · T 0.01 · top-3 refs · seed 1337' },
]
</script>
<template>
  <figure class="metric-chart">
    <table class="ablation-table">
      <thead><tr><th>Condition</th><th>Change vs full model</th><th class="num">PSNR dB</th><th class="num">Δ dB</th></tr></thead>
      <tbody><tr v-for="row in rows" :key="row.condition"><td>{{ row.condition }}</td><td>{{ row.change }}</td><td class="num">{{ row.psnr }}</td><td class="num dim">{{ row.delta }}</td></tr></tbody>
    </table>
    <aside class="eval-protocol">
      <p v-for="item in protocol" :key="item.k"><b>{{ item.k }}</b><span>{{ item.v }}</span></p>
    </aside>
    <figcaption>Values transcribed from the archived comparison figure (17 September); its run configuration, seeds and repeated-run uncertainty are not archived. Protocol describes the baseline source at 767cae8.</figcaption>
  </figure>
</template>
