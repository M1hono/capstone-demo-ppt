<script setup>
const stories = [
  {id:'US-01 / FR-01', need:'“Choose edits for me.”', input:'Image + editing history', result:'Automatic personalized candidates', check:'No parameters or prompts.'},
  {id:'US-02 / FR-02', need:'“Learn from a few examples.”', input:'8 original/edit pairs', result:'Adaptation with fixed model weights', check:'No per-user training.'},
  {id:'US-03 / FR-03', need:'“Give me several options.”', input:'1 query / multiple outputs', result:'Distinct samples from p(z | O, H)', check:'Several edits of one image.'}
]
</script>
<template>
  <div class="stack acceptance">
    <div class="acceptance-head"><span>User need</span><span>What the user provides</span><span>Observable acceptance</span></div>
    <article v-for="story in stories" :key="story.id" class="acceptance-row"><div><p class="small blue">{{story.id}}</p><h2>{{story.need}}</h2></div><p class="given">{{story.input}}</p><div><h3>{{story.result}}</h3><p>{{story.check}}</p></div></article>
    <p class="source-caption">Report-derived stories, not user-study quotes. User satisfaction remains untested.</p>
  </div>
</template>
<style scoped>
.acceptance{gap:0;justify-content:space-between}.acceptance-head,.acceptance-row{display:grid;grid-template-columns:1.1fr .9fr 1.1fr;gap:42px}.acceptance-head{font-size:14px;color:var(--muted);padding-bottom:14px}.acceptance-row{border-top:1px solid var(--line);padding:22px 0;align-items:center}.acceptance-row h2{font-size:25px;margin:9px 0 0}.acceptance-row h3{font-size:20px}.acceptance-row p:not(.small){font-size:18px;color:var(--muted)}.given{padding-right:20px}.acceptance .source-caption{padding-top:16px;border-top:1px solid var(--line)}
</style>
