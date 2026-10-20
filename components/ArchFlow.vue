<script setup>
defineProps({
  // steps: [{ title, body }] — the conditional multimodal pipeline
  steps: {
    type: Array,
    default: () => [
      { title: 'Inputs', body: 'current image x₀ + user history (x₁,z₁)…(xₙ,zₙ)' },
      { title: 'Encoders', body: 'ConvNeXtV2-femto image encoder + history encoder → tokens E₁,z₁…Eₙ,zₙ,E₀' },
      { title: 'Transformer', body: 'condition sequence fused into a conditioning vector c' },
      { title: 'Conditional flow', body: 'RQS coupling layers model p(z | x₀, history) over the 3-D retouching sphere' },
      { title: 'MC candidates', body: 'sample → density mode + top-logp K-means → Top-1/2/3 candidate directions' },
    ],
  },
})
</script>

<template>
  <div class="arch-flow">
    <ol class="af-track">
      <li v-for="(s, i) in steps" :key="s.title">
        <span class="af-idx">{{ i + 1 }}</span>
        <div class="af-card">
          <p class="af-title">{{ s.title }}</p>
          <p class="af-body">{{ s.body }}</p>
        </div>
      </li>
    </ol>
    <p class="af-note">Phase-2 conditional multimodal modelling · W13 group report draft §1.1/§2.2 · code-verified on feature/flow5</p>
  </div>
</template>

<style scoped>
.arch-flow{font-family:inherit;color:#1b1d20}
.af-track{list-style:none;display:flex;gap:14px;margin:0;padding:0;align-items:stretch}
.af-track li{flex:1;display:flex;flex-direction:column;gap:10px;position:relative}
.af-idx{width:30px;height:30px;border-radius:50%;background:#1b1d20;color:#fff;font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center}
.af-track li:not(:last-child)::after{content:"";position:absolute;top:14px;right:-11px;width:8px;height:8px;border-top:2px solid #b9bec6;border-right:2px solid #b9bec6;transform:rotate(45deg)}
.af-card{background:#f7f8fa;border:1px solid #e0e3e8;border-radius:8px;padding:12px 12px 10px;flex:1}
.af-title{font-size:14px;font-weight:700;margin:0 0 6px}
.af-body{font-size:12.5px;line-height:1.45;color:#444;margin:0}
.af-note{font-size:12px;color:#8a9099;margin:16px 2px 0}
</style>
