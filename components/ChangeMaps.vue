<script setup>
const base=import.meta.env.BASE_URL
const kinds=[['brightness','Brightness','0.0748'],['saturation','Saturation','1.0000'],['warmth','Warmth proxy','2.0000']]
</script>
<template>
  <div class="change-maps"><h3>Output − original</h3><div class="map-grid"><figure v-for="[key,label,limit] in kinds" :key="key"><figcaption>{{label}}</figcaption><img :src="`${base}assets/evidence/flowers-recorded-${key}.png`" :alt="`Recorded ${label} change diagnostic from the supplied panel`"/><div class="signed-scale"></div><div class="scale-ticks"><span>−{{limit}}</span><span>0</span><span>+{{limit}}</span></div></figure></div><p class="map-description"><span class="legend-colors"><i class="negative"></i> decrease <i class="positive"></i> increase</span><br>Recorded maps · separate symmetric scales</p></div>
</template>
