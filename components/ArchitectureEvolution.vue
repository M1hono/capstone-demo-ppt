<script setup>
import { computed } from 'vue'
import { useSequence } from '../composables/useSequence'
const stages=[
  ['Language + segmentation','Spatial instruction maps','Segmentation errors; still needs instructions.','Instructions','Region map'],
  ['Dynamic grouping','Transfer between similar edits','Edit groups did not represent real users.','Similar edits','Virtual users'],
  ['Memory slots','Compress history into slots','Soft retrieval averaged edits; hard retrieval fixed styles.','History','Memory'],
  ['Similarity retrieval','Choose the nearest historical edit','≈30% retrieval accuracy on FiveK; one neighbour was unreliable.','Image distance','Nearest edit'],
  ['Conditional density','Model more than one possible edit','Image + history define a distribution of possible edits.','Image + history','p(z | O, H)']
]
const sequence=useSequence(stages.map(s=>s[0]));const current=computed(()=>stages[sequence.step.value])
const dots=Array.from({length:100},(_,i)=>({x:110+Math.sin(i*2.4)*(20+i%35),y:100+Math.cos(i*1.7)*(8+i%30)}))
</script>
<template>
  <div class="stack evolution">
    <div class="timeline"><button v-for="(s,i) in stages" :key="s[0]" :aria-pressed="sequence.step.value===i" @click.stop="sequence.seek(i)"><span>0{{i+1}}</span>{{s[0]}}</button></div>
    <div class="evolution-body">
      <div class="evolution-copy"><h2>{{current[1]}}</h2><p>{{current[2]}}</p><p class="shift">Research shift<br><b>From one edit<br>to a distribution.</b></p></div>
      <svg viewBox="0 0 610 300" role="img" :aria-label="current[0]+' conceptual mechanism'">
        <text x="125" y="30" text-anchor="middle">{{current[3]}}</text><text x="465" y="30" text-anchor="middle">{{current[4]}}</text>
        <g v-for="(d,i) in dots.slice(0,32)" :key="i"><circle :cx="d.x" :cy="d.y+35" r="4" :fill="['var(--blue)','var(--teal)','var(--purple)'][i%3]"/></g>
        <path d="M220 135 H337 M327 127 L338 135 L327 143" fill="none" stroke="var(--ink)" stroke-width="2"/>
        <g v-if="sequence.step.value===0"><rect v-for="i in 6" :key="i" :x="388+(i%3)*46" :y="76+Math.floor((i-1)/3)*65" width="40" height="57" :fill="i%2?'var(--pale)':'var(--surface)'" stroke="var(--line)"/></g>
        <g v-else-if="sequence.step.value===1"><g v-for="i in 3" :key="i"><circle :cx="380+i*43" :cy="i%2?100:170" r="31" fill="none" :stroke="['var(--blue)','var(--teal)','var(--purple)'][i-1]"/><circle v-for="j in 7" :key="j" :cx="380+i*43+Math.sin(j*2)*19" :cy="(i%2?100:170)+Math.cos(j*2)*19" r="3" :fill="['var(--blue)','var(--teal)','var(--purple)'][i-1]"/></g></g>
        <g v-else-if="sequence.step.value===2"><rect v-for="i in 4" :key="i" :x="370+i*34" y="85" width="25" height="105" fill="var(--pale)" stroke="var(--blue)"/><path d="M394 205 H535" stroke="var(--ink)"/><text x="465" y="240" text-anchor="middle">Averaged / fixed styles</text></g>
        <g v-else-if="sequence.step.value===3"><circle v-for="(d,i) in dots.slice(0,30)" :key="i" :cx="d.x+350" :cy="d.y+35" r="4" fill="var(--line)"/><circle cx="470" cy="142" r="9" fill="var(--blue)"/><circle cx="470" cy="142" r="22" fill="none" stroke="var(--blue)"/><text x="465" y="240" text-anchor="middle">Top-1 retrieval</text></g>
        <g v-else><path d="M355 205 C374 205 373 70 408 70 C446 70 422 205 459 205 C486 205 483 116 514 116 C546 116 544 205 572 205" fill="var(--pale)" stroke="var(--blue)" stroke-width="3"/><line x1="355" x2="574" y1="205" y2="205" stroke="var(--muted)"/><text x="464" y="240" text-anchor="middle">Multiple plausible regions</text></g>
        <text x="125" y="240" text-anchor="middle" class="detail">Editing history</text>
        <text x="305" y="287" text-anchor="middle" class="detail">Five approaches / conceptual mechanisms</text>
      </svg>
    </div>
    <SequenceControls :sequence="sequence"/>
  </div>
</template>
<style scoped>
.evolution{gap:24px}.timeline{display:grid;grid-template-columns:repeat(5,1fr);gap:0;border-bottom:1px solid var(--line)}.timeline button{border:0;border-bottom:3px solid transparent;text-align:left;padding:10px 12px 16px;line-height:1.35;font-size:16px;background:transparent}.timeline button[aria-pressed=true]{background:var(--pale);color:var(--ink);border-color:var(--blue)}.timeline span{display:block;font-size:27px;color:var(--blue);margin-bottom:10px}.evolution-body{display:grid;grid-template-columns:.9fr 1.2fr;gap:50px;flex:1;min-height:0;align-items:center}.evolution-copy h2{font-size:33px;line-height:1.2;letter-spacing:-.6px}.evolution-copy>p{font-size:21px;line-height:1.45;color:var(--muted)}.evolution-copy .shift{margin-top:24px;padding-top:18px;border-top:1px solid var(--line);font-size:15px}.shift b{display:block;font-weight:400;color:var(--ink);font-size:23px;margin-top:6px}.evolution-body svg{width:100%;max-height:320px}.evolution-body svg text{font:20px 'IBM Plex Sans',sans-serif;fill:var(--ink)}.evolution-body svg .detail{font-size:15px;fill:var(--muted)}
</style>
