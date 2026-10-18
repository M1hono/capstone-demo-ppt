<script setup>
import { ref } from 'vue'
const expert = ref('C')
const reveal = ref(50)
const base = import.meta.env.BASE_URL
</script>
<template>
  <div class="split wide-left problem">
    <div class="col">
      <div class="row spread"><div class="tabs" role="group" aria-label="Expert selection"><button v-for="e in ['A','B','C','D','E']" :key="e" :aria-pressed="expert===e" @click.stop="expert=e">Expert {{e}}</button></div><span class="small muted">Same original, five experts</span></div>
      <div class="image-comparison">
        <img :src="base+'assets/fivek/original.png'" alt="Original FiveK photograph"/>
        <img class="comparison-target" :src="base+`assets/fivek/expert-${expert}.png`" :alt="`Real Expert ${expert} edit of the same photograph`" :style="{clipPath:`inset(0 0 0 ${reveal}%)`}"/>
        <div class="comparison-divider" :style="{left:reveal+'%'}"><span>↔</span></div>
        <span class="image-label original-label">Original</span><span class="image-label target-label">Expert {{expert}}</span>
      </div>
      <label class="compare-control"><span>Original</span><input v-model.number="reveal" type="range" min="0" max="100" aria-label="Original versus expert comparison" @keydown.stop/><span>Recorded edit</span></label>
      <p class="source-caption">Real FiveK photographs · a0412-_DGW6297. Cross-expert differences illustrate personalization.</p>
    </div>
    <div class="col problem-explanation">
      <p class="statement">The desired edit depends on the image and the user.</p>
      <article><h3>Learn from a small history</h3><p>A shared model adapts to a new user without updating its weights.</p></article>
      <article><h3>Allow several plausible edits</h3><p>Predict a continuous distribution rather than a single fixed style.</p></article>
      <p class="source-caption">The report’s ≈30% similarity-retrieval accuracy motivates this formulation. Multiple valid preferences for one user remain a hypothesis.</p>
    </div>
  </div>
</template>
<style scoped>
.problem{grid-template-columns:1.65fr 1fr;gap:42px}.problem .col{gap:13px}.image-comparison{position:relative;flex:1;min-height:275px;overflow:hidden;background:var(--surface)}.image-comparison img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.comparison-divider{position:absolute;top:0;bottom:0;width:2px;background:white;pointer-events:none}.comparison-divider span{position:absolute;top:50%;left:-17px;width:36px;height:36px;display:grid;place-items:center;color:var(--ink);background:white;border:1px solid var(--line);font-size:22px}.image-label{position:absolute;top:14px;background:var(--paper);font-size:14px;padding:5px 10px}.original-label{left:14px}.target-label{right:14px}.compare-control{display:flex;align-items:center;gap:16px;font-size:14px;color:var(--muted)}.compare-control input{flex:1}.problem-explanation{padding-top:16px;justify-content:space-between}.problem-explanation article{border-top:1px solid var(--line);padding-top:18px}.problem-explanation .statement{font-size:34px;font-weight:400}.problem-explanation article p{font-size:18px;line-height:1.45}
</style>
