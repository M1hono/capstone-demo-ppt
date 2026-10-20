<script setup>
import evidence from '../data/report-evidence.json'
const props = defineProps({ number:Number, title:String, component:String, section:String, usage:String })
const topic = evidence.topics.find(t => t.number === props.number)
const base = import.meta.env.BASE_URL
function keepControlKeys(event) {
  if (event.target.closest('button, input, select, a')) event.stopPropagation()
}
</script>
<template>
  <section class="workbench" :data-topic="number" @keydown="keepControlKeys" @keyup="keepControlKeys">
    <header><h1>{{ title || topic?.title }}</h1><div class="usage"><code>&lt;{{ component || topic?.component }} /&gt;</code><span>{{ usage || topic?.usage }}</span></div></header>
    <main class="workbench-body"><slot /></main>
    <footer><span>{{ section || `Report ${topic?.section}` }}</span><span><a :href="base+'evidence/index.html'" target="_blank" rel="noopener">Evidence index</a> · {{ String(number).padStart(2,'0') }}</span></footer>
  </section>
</template>
