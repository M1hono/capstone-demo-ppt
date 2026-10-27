<script setup>
const methods = [
  ['01', 'User-specific training', 'AdaInt / RSFNet', 'A separate user or expert model.'],
  ['02', 'Additional instructions', 'DiffRetouch / PerTouch', 'Explicit editing guidance.'],
  ['03', 'One preference vector', 'PieNet', 'History compressed into one representation.']
]
</script>
<template>
  <div class="methods">
    <div class="method-list"><article v-for="[id,title,names,limit] in methods" :key="id"><span>{{id}}</span><div><h2>{{title}}</h2><p>{{names}}</p><small>{{limit}}</small></div></article></div>
    <div class="core-idea"><p class="eyebrow">OUR CORE IDEA</p><h2>Learn a distribution<br>of possible edits.</h2>
      <svg viewBox="0 0 530 180" role="img" aria-label="A conceptual density with several possible editing regions"><path d="M20 145 C60 145 58 30 115 30 C170 30 170 145 220 145 C273 145 270 65 330 65 C390 65 390 145 510 145" fill="var(--pale)" stroke="var(--ink)" stroke-width="3"/><line x1="20" x2="510" y1="145" y2="145" stroke="var(--muted)"/><text x="265" y="174" text-anchor="middle">Retouching space · conceptual</text></svg>
      <p class="formula">P(z | current image, user history)</p><p class="source-caption">Hypothesis: one image and user may admit several acceptable edits.</p>
    </div>
  </div>
</template>
<style scoped>
.methods{display:grid;grid-template-columns:1fr 1.1fr;gap:60px;height:100%;align-items:center}.method-list{display:grid;gap:28px}.method-list article{display:flex;gap:20px;border-top:1px solid var(--line);padding-top:22px}.method-list article>span{font:24px Saira;color:var(--muted)}.method-list h2{font-size:27px;margin:0 0 7px}.method-list p{font-size:20px}.method-list small{display:block;font-size:16px;color:var(--muted);margin-top:7px}.core-idea{border-left:1px solid var(--line);padding-left:36px;display:grid;gap:18px}.eyebrow{font-size:15px;letter-spacing:2px}.core-idea h2{font-size:38px;line-height:1.15;margin:0}.core-idea svg{width:100%}.core-idea svg text{font-size:16px;fill:var(--muted)}.core-idea .formula{font-size:21px;white-space:nowrap}
</style>
