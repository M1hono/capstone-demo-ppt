<script setup>
import { ref } from 'vue'
import pairs from '../data/history-pairs.json'
const base = import.meta.env.BASE_URL
const selected = ref(0)
const requirements = [
  {id:'FR-01', title:'Automatic retouching', mechanism:'Infer preferences from examples', detail:'Query + history → condition c.', output:'Personalized retouching candidates', test:'Fidelity under correct conditions.'},
  {id:'FR-02', title:'Adapt without retraining', mechanism:'Keep model weights fixed', detail:'Change history, keep weights fixed.', output:'Adapted predictions for a new user', test:'Held-out E / 50 PPSD users; final run pending.'},
  {id:'FR-03', title:'Multiple plausible edits', mechanism:'Sample a conditional density', detail:'Sample multiple adjustment directions.', output:'Multiple candidate edit vectors', test:'Best-of-K coverage; user validation pending.'}
]
</script>
<template>
  <div class="stack requirements"><div class="tabs"><button v-for="(r,i) in requirements" :key="r.id" :aria-pressed="selected===i" @click.stop="selected=i">{{r.id}}</button></div><h2>{{requirements[selected].title}}</h2>
    <div class="requirement-route grow"><div class="requirement-input"><img class="query-photo" :src="base+'assets/fivek/original.png'" alt="Current FiveK original"/><div class="mini-history"><img v-for="p in pairs.slice(0,8)" :key="p.id" :src="base+p.edited" :alt="`Historical Expert C edit ${p.id}`"/></div><h3>Image + eight historical pairs</h3><p>Past edits supply user context.</p></div><span class="route-arrow">→</span><div class="requirement-mechanism"><p class="requirement-formula">p(z | O, H)</p><h3>{{requirements[selected].mechanism}}</h3><p>{{requirements[selected].detail}}</p></div><span class="route-arrow">→</span><div class="requirement-output"><div class="vector-fan"><span v-for="i in 5" :key="i" :style="{transform:`translate(${(i-1)*23}px, ${(i-1)*9}px)`}">z{{i}}</span></div><h3>{{requirements[selected].output}}</h3><p>Same original, multiple edit vectors.</p></div></div>
    <div class="requirement-check"><span>Acceptance evidence</span><p>{{requirements[selected].test}}</p></div><p class="source-caption">Real input examples; schematic vectors. No editing instructions required.</p>
  </div>
</template>
<style scoped>
.requirements{gap:18px}.requirements h2{font-size:30px;margin:0}.requirement-route{display:grid;grid-template-columns:1fr 35px 1fr 35px .9fr;gap:16px;align-items:center}.requirement-input,.requirement-mechanism,.requirement-output{min-width:0}.query-photo{width:127px;height:88px;object-fit:cover;margin-bottom:9px}.mini-history{display:grid;grid-template-columns:repeat(8,1fr);gap:3px;margin-bottom:18px}.mini-history img{width:100%;height:37px;object-fit:cover}.requirement-route h3{font-size:21px;line-height:1.3}.requirement-route p:not(.requirement-formula){font-size:17px;color:var(--muted)}.route-arrow{font-size:30px;color:var(--muted)}.requirement-formula{font-size:37px;color:var(--blue);margin-bottom:25px}.requirement-mechanism{border-top:1px solid var(--blue);padding-top:25px}.vector-fan{position:relative;height:128px;margin-bottom:14px}.vector-fan span{position:absolute;left:20px;top:5px;width:78px;height:78px;display:grid;place-items:center;border:1px solid var(--blue);background:var(--paper);color:var(--blue);font-size:23px}.requirement-check{display:grid;grid-template-columns:200px 1fr;gap:25px;padding-top:18px;border-top:1px solid var(--line);font-size:18px}.requirement-check>span{color:var(--muted);font-size:15px}
</style>
