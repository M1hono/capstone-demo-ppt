<script setup>
import { useSequence } from '../composables/useSequence'
const stages=[
  ['Language + segmentation','Instructions → regions','Segmentation errors; still needs instructions.'],
  ['Dynamic grouping','Similar edits → groups','Edit groups did not represent real users.'],
  ['Memory slots','History → stored styles','Soft retrieval averaged edits; hard retrieval fixed styles.'],
  ['Similarity retrieval','Image → nearest edit','≈30% accuracy; one neighbour was unreliable.'],
  ['Conditional density','Image + history → p(z)','A distribution represents multiple possible edits.']
]
const sequence=useSequence(stages.map(s=>s[0]), { intervalMs:3000 })
</script>
<template>
  <div class="stack evolution">
    <div class="evolution-heading"><h2>From one edit to a distribution</h2><p>Experiments + client feedback</p></div>
    <div class="evolution-stages grow">
      <article v-for="(stage,i) in stages" :key="stage[0]" class="evolution-stage" :class="{active:!sequence.complete.value && sequence.step.value===i}" :data-evolution-stage="i+1">
        <div class="stage-number"><span>0{{i+1}}</span><span v-if="i<4">→</span><span v-else>✓</span></div>
        <h3>{{stage[0]}}</h3>
        <svg viewBox="0 0 190 115" role="img" :aria-label="stage[1]+' conceptual mechanism'">
          <g v-if="i===0"><rect v-for="j in 6" :key="j" :x="31+((j-1)%3)*43" :y="10+Math.floor((j-1)/3)*49" width="38" height="42" :fill="j%2?'var(--pale)':'var(--surface)'" stroke="var(--muted)"/></g>
          <g v-else-if="i===1"><g v-for="j in 3" :key="j"><circle :cx="37+(j-1)*58" :cy="j%2?42:77" r="27" fill="none" stroke="var(--muted)"/><circle v-for="k in 7" :key="k" :cx="37+(j-1)*58+Math.sin(k*2)*17" :cy="(j%2?42:77)+Math.cos(k*2)*17" r="3" fill="var(--purple)"/></g></g>
          <g v-else-if="i===2"><rect v-for="j in 4" :key="j" :x="29+(j-1)*35" y="17" width="25" height="80" fill="var(--pale)" stroke="var(--ink)"/></g>
          <g v-else-if="i===3"><circle v-for="j in 27" :key="j" :cx="94+Math.sin(j*2.4)*(20+j%35)" :cy="56+Math.cos(j*1.7)*(8+j%30)" r="3" fill="var(--purple)"/><circle cx="102" cy="61" r="6" fill="var(--ink)"/><circle cx="102" cy="61" r="19" fill="none" stroke="var(--ink)"/></g>
          <g v-else><path d="M7 101 C20 101 19 16 48 16 C76 16 63 100 95 100 C120 100 117 45 142 45 C166 45 164 101 183 101" fill="var(--pale)" stroke="var(--ink)" stroke-width="2.5"/><path d="M7 101 H183" stroke="var(--muted)"/></g>
        </svg>
        <p class="stage-mechanism">{{stage[1]}}</p><p class="stage-finding">{{stage[2]}}</p>
      </article>
    </div>

    <p class="source-caption">Regular client discussions and experimental findings shaped the architecture.</p>
  </div>
</template>
<style scoped>
.evolution{gap:22px}.evolution-heading{display:flex;justify-content:space-between;align-items:center;gap:20px}.evolution-heading h2{font-size:29px;margin:0}.evolution-heading p{font-size:18px;color:var(--muted)}.evolution-stages{display:grid;grid-template-columns:repeat(5,1fr);gap:15px;align-items:stretch}.evolution-stage{min-width:0;border-top:3px solid var(--line);background:var(--surface);padding:17px 15px;transition:background 300ms,border-color 300ms}.evolution-stage.active{border-top-color:var(--ink);background:var(--pale)}.stage-number{display:flex;justify-content:space-between;font:500 28px Saira;color:var(--muted)}.evolution-stage.active .stage-number{color:var(--ink)}.evolution-stage h3{font-size:23px;line-height:1.2;min-height:58px;margin:12px 0 10px}.evolution-stage svg{display:block;width:100%;height:106px;margin:10px 0 17px}.stage-mechanism{font-size:17px;line-height:1.35;min-height:46px;padding-bottom:10px;border-bottom:1px solid var(--line)}.stage-finding{font-size:18px;line-height:1.4;margin-top:13px;color:var(--muted)}
</style>
<style scoped>
.evolution-stage{padding:12px 15px}.evolution-stage h3{min-height:52px;margin:8px 0}.evolution-stage svg{height:82px;margin:8px 0 10px}.stage-finding{font-size:17px}
</style>
