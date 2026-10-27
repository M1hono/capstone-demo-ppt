<script setup>
const base=import.meta.env.BASE_URL
</script>
<template>
  <div class="conclusion">
    <div class="conclusion-main"><div class="conclusion-argument"><h2>Personalization as<br>a distribution of edits.</h2><p class="formula">P(z | image, history)</p><div class="conclusion-limit"><h3>Current limitations</h3><p>Weaker history dependence</p><p>Global colour and tone edits only</p><p>Limited subjective preference validation</p></div></div>
      <div class="conclusion-model"><div class="ending-images"><img :src="base+'assets/fivek/original.png'" alt="Original FiveK scene"><img :src="base+'assets/fivek/expert-E.png'" alt="Recorded Expert E edit of the same scene"></div><p class="source-caption">Original and recorded expert edit, FiveK a0412.</p>
        <svg viewBox="0 0 470 180" role="img" aria-label="Conditional distribution with two plausible regions, an illustration of the research objective"><line x1="20" y1="145" x2="450" y2="145" stroke="var(--line)"/><path d="M20 145 C55 145 65 28 120 28 C177 28 173 142 226 142 C280 142 270 66 330 66 C390 66 407 145 450 145" fill="var(--pale)" stroke="var(--blue)" stroke-width="3"/><text x="235" y="174" text-anchor="middle">Illustrative preference density</text></svg>
      </div>
    </div>
    <div class="conclusion-close"><div class="closing-facts"><span><b>3D + LUTs</b> compact edits</span><span><b>Transformer</b> history context</span><span><b>Flow</b> multiple candidates</span></div><div class="questions">Thank you / Q&amp;A</div></div>
  </div>
</template>
<style scoped>
.conclusion{height:100%;display:flex;flex-direction:column;gap:28px}.conclusion-main{display:grid;grid-template-columns:1.2fr 1fr;gap:70px;align-items:center;flex:1;min-height:0}.conclusion-argument h2{font-size:45px;font-weight:400;line-height:1.14;letter-spacing:-1.3px;margin-bottom:28px}.conclusion-argument .formula{font-size:25px;color:var(--blue)}.conclusion-limit{font-size:20px;line-height:1.5;color:var(--muted);margin-top:23px!important}.ending-images{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ending-images img{width:100%;height:150px;object-fit:cover}.conclusion-model .source-caption{margin-top:8px}.conclusion-model svg{width:100%;height:180px;margin-top:12px}.conclusion-model svg text{font:16px 'IBM Plex Sans',sans-serif;fill:var(--muted)}.conclusion-close{display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--ink);padding-top:22px}.closing-facts{display:flex;gap:42px;font-size:18px;color:var(--muted)}.closing-facts b{font-size:25px;display:block;font-weight:500;color:var(--ink);margin-bottom:4px}.questions{font-size:39px;font-weight:300;letter-spacing:-1px}
</style>
<style scoped>
.conclusion-argument h2{font-size:42px}.conclusion-limit{border-top:1px solid var(--line);padding-top:18px}.conclusion-limit h3{font-size:22px;color:var(--ink);margin-bottom:10px}.conclusion-limit p{font-size:19px;line-height:1.7}.questions{font-size:31px}
</style>
