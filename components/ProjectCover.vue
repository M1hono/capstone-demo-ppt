<script setup>
import e from '../data/report-evidence.json'
const base = import.meta.env.BASE_URL
const views = [{file:'original.png', label:'Original'}, {file:'expert-B.png', label:'Expert B'}, {file:'expert-E.png', label:'Expert E'}]
</script>
<template>
  <div class="cover">
    <div class="cover-main">
      <div class="cover-copy">
        <h2>{{ e.project.title }}</h2>
        <p class="cover-question">Learning how a user edits,<br>from their editing history.</p>
        <p class="cover-equation">p(z | image, history)</p>
      </div>
      <div class="cover-visual">
        <figure v-for="(view,i) in views" :key="view.file" :class="{original:i===0}">
          <img :src="base + 'assets/fivek/' + view.file" :alt="view.label + ' photograph, FiveK scene a0412'">
          <figcaption>{{view.label}}</figcaption>
        </figure>
        <p>One scene, different recorded edits.<br>FiveK references, not model predictions.</p>
      </div>
    </div>
    <div class="cover-credits">
      <div class="project-people"><span><b>Client</b> {{e.project.client}}</span><span><b>Tutor</b> {{e.project.tutor}}</span><span>{{e.project.group}}</span></div>
      <div class="members"><span v-for="member in e.project.members" :key="member">{{member}}</span></div>
    </div>
  </div>
</template>
<style scoped>
.cover{display:flex;flex-direction:column;gap:24px;height:100%}.cover-main{display:grid;grid-template-columns:1.35fr 1fr;gap:52px;flex:1;min-height:0;align-items:center}.cover-copy h2{font-size:48px;line-height:1.08;letter-spacing:-1.7px;font-weight:500;margin:0 0 25px;max-width:650px}.cover-question{font-size:23px;line-height:1.35;color:var(--muted)}.cover-equation{font:23px/1.4 Menlo,monospace;color:var(--blue);margin-top:22px}.cover-visual{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-content:center}.cover-visual figure{margin:0;position:relative;min-width:0}.cover-visual .original{grid-column:1/-1}.cover-visual img{display:block;width:100%;height:102px;object-fit:cover}.cover-visual .original img{height:173px}.cover-visual figcaption{position:absolute;bottom:0;left:0;padding:4px 10px;background:var(--paper);font-size:15px}.cover-visual>p{grid-column:1/-1;font-size:14px;line-height:1.4;color:var(--muted)}.cover-credits{display:grid;grid-template-columns:1.35fr 1fr;gap:52px;border-top:1px solid var(--line);padding-top:18px}.project-people{display:flex;flex-direction:column;gap:6px;font-size:16px;color:var(--muted)}.project-people b{font-weight:500;color:var(--ink);display:inline-block;width:58px}.members{display:grid;grid-template-columns:repeat(3,1fr);gap:9px 12px;font-size:15px;align-content:center}
</style>
