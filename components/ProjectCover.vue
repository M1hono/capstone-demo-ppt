<script setup>
import e from '../data/report-evidence.json'
const base=import.meta.env.BASE_URL
</script>
<template>
  <div class="split wide-left cover-content">
    <div class="col"><h2 class="cover-title">{{ e.project.title }}</h2><p class="formula blue">p(z | current image, user history)</p><div class="row rule"><div><p class="small muted">Client</p><p>{{e.project.client}}</p></div><div><p class="small muted">Tutor</p><p>{{e.project.tutor}}</p></div></div><p class="small muted">{{e.project.group}}</p></div>
    <div class="col"><img class="photo" :src="base+'assets/fivek/original.png'" alt="FiveK original photograph a0412-_DGW6297" /><p class="small muted">Real FiveK input · a0412-_DGW6297</p><div class="expert-strip"><img v-for="expert in ['A','B','C','D','E']" :key="expert" :src="base+`assets/fivek/expert-${expert}.png`" :alt="`Recorded Expert ${expert} edit`"/></div><div class="members"><span v-for="member in e.project.members" :key="member">{{member}}</span></div></div>
  </div>
</template>
<style scoped>.cover-content{align-items:center;position:relative}.cover-content::before{content:"";position:absolute;left:-18px;top:2px;bottom:2px;width:6px;background:var(--blue)}.cover-title{font-size:49px!important;line-height:1.12!important;max-width:710px;letter-spacing:-1.5px}.cover-content .photo{height:212px;object-fit:cover;border:1px solid var(--line)}.expert-strip{display:grid;grid-template-columns:repeat(5,1fr);gap:5px}.expert-strip img{width:100%;height:52px;object-fit:cover;border:1px solid var(--paper)}.cover-content>.col{gap:13px}.members{display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:16px}.row{gap:64px}</style>
