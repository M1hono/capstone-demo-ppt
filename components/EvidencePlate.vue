<script setup>
defineProps({sample:{type:String,default:'flowers'},compact:Boolean,reveal:{type:Number,default:100},evidenceReady:{type:Boolean,default:true}})
const metrics={flowers:['26.496','0.7949','0412'],dog:['32.761','0.9531','0407'],books:['27.242','0.8946','0408']}
const base=import.meta.env.BASE_URL
</script>
<template>
  <figure class="evidence-plate" :class="{compact,'evidence-ready':evidenceReady}">
    <div class="triptych"><div v-for="(label,key) in {original:'Original',output:'Model output',target:'Expert target'}" :key="key" :class="`triptych-${key}`"><span>{{label}}</span><ImageComparison v-if="key==='output'" :before="`${base}assets/evidence/${sample}-original.png`" :after="`${base}assets/evidence/${sample}-output.png`" :label="`${sample} model output`" :reveal="reveal"/><img v-else :src="`${base}assets/evidence/${sample}-${key}.png`" :alt="`${sample}: ${label}`" /></div></div>
    <figcaption><strong>FiveK {{metrics[sample][2]}}</strong><span>PSNR {{metrics[sample][0]}} dB</span><span>SSIM {{metrics[sample][1]}}</span></figcaption>
  </figure>
</template>
