<script setup>
import e from '../data/report-evidence.json'
const base=import.meta.env.BASE_URL
</script>
<template><div class="stack reconstruction-evaluation"><div class="reconstruction-metrics"><div v-for="r in e.reconstruction" :key="r.dataset"><strong>{{r.psnr.toFixed(1)}} <small>dB</small></strong><p>{{r.dataset}} reconstruction PSNR</p></div><div><strong>3D</strong><p>Compact retouching space</p></div></div><figure class="reconstruction-reference grow"><img :src="base+'assets/reference-deck/direction-grid-transparent.png'" alt="Supplied retouching-space figure showing different directions and their decoded edits"></figure><p class="reconstruction-takeaway">Preserves substantial global colour and tone information.</p></div></template>
<style scoped>
.reconstruction-evaluation{gap:23px}.reconstruction-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:40px}.reconstruction-metrics>div{border-top:2px solid var(--ink);padding-top:15px}.reconstruction-metrics strong{font:600 47px/1 Saira}.reconstruction-metrics small{font-size:25px}.reconstruction-metrics p{font-size:18px;color:var(--muted);margin-top:10px}.reconstruction-reference{margin:0;display:flex;align-items:center;min-height:0}.reconstruction-reference img{width:100%;max-height:330px;object-fit:contain;background:transparent}.reconstruction-takeaway{font-size:23px;border-top:1px solid var(--line);padding-top:16px}
</style>
