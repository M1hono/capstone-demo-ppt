<script setup>
import { ref } from 'vue'
const selected=ref('A')
const letters=['A','B','C','D','E']
const base=import.meta.env.BASE_URL
</script>
<template>
  <div class="expert-study">
    <div class="original-specimen"><span>Original · FiveK 0412</span><img :src="`${base}assets/fivek/original.png`" alt="FiveK 0412 original flower photograph" /><p>Same scene.<br>Different edit targets.</p></div>
    <div class="expert-renditions"><div class="expert-gallery"><button v-for="letter in letters" :key="letter" :aria-pressed="selected===letter" @click.stop="selected=letter"><img :src="`${base}assets/fivek/expert-${letter}.png`" :alt="`FiveK 0412 retouched by expert ${letter}`" /><span>Expert {{letter}}</span></button></div>
      <div class="pair-explanation"><div class="subtraction">E<sub>{{selected}}</sub> − I <span>→</span> Δ<sub>{{selected}}</sub></div><p>One <b>(original, expert)</b> pair<br>is one training example.</p></div>
      <div class="expert-measures"><div v-for="kind in ['luminance','saturation','warmth']" :key="kind"><img :src="`${base}assets/fivek/expert-${selected}-${kind}.png`" :alt="`${kind} difference for expert ${selected}`" /><span>Δ {{kind==='warmth'?'warmth proxy':kind}}</span></div><p>Measured pixel changes<br><span class="legend-colors"><i class="negative"></i> decrease <i class="positive"></i> increase</span><small>Shared scale across experts.</small></p></div>
    </div>
  </div>
</template>
