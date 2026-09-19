<script setup>
import { computed, ref } from 'vue'
import specimen from '../evidence/fivek-specimen.json'
const props=defineProps({initial:{type:String,default:'warm'}})
const selected=ref(props.initial)
const names={warm:'Warm control',cool:'Cool control',zero:'Zero control',reference:'Expert D reference'}
const run=computed(()=>specimen.checkpoint_run.runs.find(r=>r.name===selected.value))
const base=import.meta.env.BASE_URL
const fixed=n=>(n>0?'+':'')+n.toFixed(3)
</script>
<template>
  <div class="checkpoint-workbench">
    <div class="bench-toolbar"><strong>FiveK 0412 · saved runs</strong><div class="bench-tabs"><button v-for="(label,key) in names" :key="key" :aria-pressed="selected===key" @click.stop="selected=key">{{label}}</button></div><span>CPU · 256 × 256</span></div>
    <div class="bench-body">
      <figure class="bench-input"><figcaption>Input</figcaption><img :src="`${base}assets/fivek/cnn-input.png`" alt="Actual 256 by 256 input used in checkpoint replay" /></figure>
      <div class="bench-controls"><h3>DiffMap</h3><p>Uniform RGBC field</p><div v-for="(label,i) in ['Red','Green','Blue','Contrast']" :key="label" class="control-row"><span>{{label}}</span><b>{{fixed(run.controls[i])}}</b><div class="value-track"><i :style="{transform:`translateX(${run.controls[i]*240}px)`}"></i></div></div><div class="tensor-label">4 × 256 × 256<br><span>+ RGB → 7 channels</span></div></div>
      <div class="bench-render compact-render"><div class="compact-cnn" aria-hidden="true"><i v-for="i in 4" :key="i" :style="{'--layer':i}"></i></div><b>Residual CNN</b><span class="render-arrow" aria-hidden="true">→</span></div>
      <figure class="bench-output"><figcaption>Output</figcaption><ImageComparison :before="`${base}assets/fivek/cnn-input.png`" :after="`${base}assets/fivek/cnn-${selected}.png`" :label="`${names[selected]} checkpoint output`" :reveal="100" /></figure>
      <aside class="run-inspector evidence-ready"><h3>Measured output</h3><p class="run-validity">Strict load · finite output</p><dl><dt>Pixel range</dt><dd>{{run.min.toFixed(3)}}–{{run.max.toFixed(3)}}</dd><dt>Mean |output − input|</dt><dd>{{run.mean_absolute_edit.toFixed(4)}}</dd></dl></aside>
    </div>
    <div class="bench-caption"><span aria-live="polite"><template v-if="selected==='reference'"><b>Experimental</b> · Same-image Expert D · strength 0.7 · cross-image transfer untested.</template><template v-else-if="selected==='zero'"><b>Observed limit</b> · Zero control still changes pixels. Mean absolute edit: 0.0275.</template><template v-else>Saved checkpoint outputs; drag the divider to compare.</template></span></div>
  </div>
</template>
