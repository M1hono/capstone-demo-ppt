<script setup>
import { ref } from 'vue'

const stages = [
  {
    name: 'NL + segmentation',
    years: 'v1',
    desc: 'Natural-language commands drive semantic segmentation; enhancement regions follow scene parsing.',
  },
  {
    name: 'Dynamic grouping',
    years: 'v2',
    desc: 'Complete edits encoded and clustered; cross-attention transfers group edits onto the input image.',
  },
  {
    name: 'Memory slots',
    years: 'v3',
    desc: 'User history compressed into memory slots; decoder reads slots to personalize the output.',
  },
  {
    name: 'Similarity retrieval',
    years: 'v4',
    desc: 'Retrieve similar retouched pairs as conditioning; measured ~30% top-1 accuracy — the motivation for a probabilistic model.',
  },
  {
    name: 'Conditional multimodal modelling',
    years: 'v5 · current',
    desc: 'Preference treated as a conditional multimodal density over retouching parameters: Transformer conditioning + normalizing flow + MC Top-K candidates.',
    current: true,
  },
]

const active = ref(4)
</script>

<template>
  <div class="evo-timeline">
    <ol class="evo-track">
      <li v-for="(s, i) in stages" :key="s.name" :class="{ current: s.current, active: i === active }" @click="active = i">
        <span class="evo-step">{{ i + 1 }}</span>
        <span class="evo-name">{{ s.name }}</span>
        <span class="evo-years">{{ s.years }}</span>
      </li>
    </ol>
    <p class="evo-desc" :key="active">{{ stages[active].desc }}</p>
    <p class="evo-note">Five-stage evolution · W13 group report draft §2.7 · click a stage to read its summary</p>
  </div>
</template>

<style scoped>
.evo-timeline{font-family:inherit;color:#1b1d20}
.evo-track{list-style:none;display:flex;gap:0;margin:0;padding:0;align-items:stretch}
.evo-track li{flex:1;position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 10px 12px;cursor:pointer;background:#f2f4f7;border:1px solid #e0e3e8;border-right:none;transition:background .2s}
.evo-track li:first-child{border-radius:8px 0 0 8px}
.evo-track li:last-child{border-right:1px solid #e0e3e8;border-radius:0 8px 8px 0}
.evo-track li.active{background:#fff}
.evo-track li.current{background:#fdf0ef}
.evo-step{width:34px;height:34px;border-radius:50%;background:#d7dbe1;color:#1b1d20;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:16px}
.current .evo-step{background:#b3261e;color:#fff}
.evo-name{font-size:14px;font-weight:600;text-align:center;line-height:1.25}
.evo-years{font-size:12px;color:#8a9099}
.evo-track li:not(:last-child)::after{content:"";position:absolute;right:-7px;top:50%;transform:translateY(-50%);width:0;height:0;border:7px solid transparent;border-left-color:#b9bec6;z-index:1}
.evo-desc{font-size:16px;line-height:1.5;color:#333;margin:18px 4px 0;min-height:52px}
.evo-note{font-size:12px;color:#8a9099;margin:10px 4px 0}
</style>
