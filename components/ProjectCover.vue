<script setup>
import e from '../data/report-evidence.json'
const base=import.meta.env.BASE_URL
</script>
<template>
  <div class="split wide-left cover-content">
    <div class="col"><h2 class="cover-title">{{ e.project.title }}</h2><p class="formula blue">p(z | current image, user history)</p><div class="row rule"><div><p class="small muted">Client</p><p>{{e.project.client}}</p></div><div><p class="small muted">Tutor</p><p>{{e.project.tutor}}</p></div></div><p class="small muted">{{e.project.group}}</p></div>
    <div class="col"><img class="photo" :src="base+'assets/fivek/original.png'" alt="FiveK original photograph a0412-_DGW6297" /><p class="small muted">Real FiveK input · a0412-_DGW6297</p><div class="members"><span v-for="member in e.project.members" :key="member">{{member}}</span></div></div>
  </div>
</template>
<style scoped>.cover-content{align-items:center}.cover-title{font-size:47px!important;line-height:1.12!important;max-width:710px;letter-spacing:-1.5px}.cover-content .photo{height:235px;object-fit:cover}.members{display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:16px}.row{gap:64px}</style>
