<script setup>
import { computed, ref } from 'vue'
import d from '../data/image-diagnostics.json'
const base = import.meta.env.BASE_URL, expert = ref('C'), threshold = ref('25'), mode = ref('heat')
const record = computed(() => d.experts[expert.value])
const image = computed(() => mode.value === 'heat' ? record.value.heat : record.value.thresholds[threshold.value].image)
</script>
<template>
  <div class="stack visual-lab">
    <div class="row spread"><div class="tabs"><button :aria-pressed="mode === 'heat'" @click.stop="mode = 'heat'">Difference heatmap</button><button :aria-pressed="mode === 'mask'" @click.stop="mode = 'mask'">Threshold mask</button></div><div class="row"><label class="small">Expert <select v-model="expert" aria-label="Difference expert"><option v-for="c in ['A','B','C','D','E']" :key="c">{{ c }}</option></select></label><label class="small">Threshold <select v-model="threshold" aria-label="Difference threshold" @change="mode = 'mask'"><option v-for="n in [10,25,50]" :key="n" :value="String(n)">{{ n }} / 255</option></select></label></div></div>
    <div class="difference-images grow"><figure class="photo-frame"><img class="photo" :src="`${base}assets/fivek/expert-${expert}.png`" :alt="`Reference edit by Expert ${expert}`"/><figcaption>Expert {{ expert }} reference</figcaption></figure><figure class="photo-frame"><img class="photo" :src="base + image" :alt="mode === 'heat' ? 'Mean absolute RGB difference heatmap' : 'Pixels above the selected difference threshold'"/><figcaption>{{ mode === 'heat' ? 'Mean absolute RGB difference' : 'Teal pixels meet or exceed the threshold' }}</figcaption></figure></div>
    <div class="row spread"><div class="heat-key"><span>0</span><i></i><span>80+ levels</span></div><p class="readout">Mean difference <b>{{ record.mae.toFixed(2) }}</b> levels</p><p class="readout"><b class="teal" data-threshold-fraction>{{ (record.thresholds[threshold].fraction * 100).toFixed(1) }}%</b> above {{ threshold }}</p></div>
    <p class="source-caption">Per-pixel mean of |Rₜ − Rₒ|, |Gₜ − Gₒ| and |Bₜ − Bₒ|. Fixed heat scale across all experts; reference alignment is documented in the evidence index.</p>
  </div>
</template>
<style scoped>.difference-images{display:grid;grid-template-columns:1fr 1fr;gap:24px;min-height:0}.difference-images figure{display:flex;flex-direction:column;min-height:0}.difference-images img{height:100%;min-height:0;flex:1;object-fit:contain}.heat-key{display:flex;gap:10px;align-items:center;font-size:14px}.heat-key i{display:block;width:160px;height:14px;background:linear-gradient(90deg,#f5f7fa,#0f62fe,#6929c4)}</style>
