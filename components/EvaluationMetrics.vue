<script setup>
const base=import.meta.env.BASE_URL
</script>
<template>
  <div class="metrics-explained">
    <div class="fidelity">
      <h2>Does it match<br>the recorded edit?</h2>
      <div class="metric-images"><figure><img :src="base+'assets/fivek/original.png'" alt="FiveK original reference"><figcaption>Original reference</figcaption></figure><figure><img :src="base+'assets/fivek/expert-C.png'" alt="FiveK Expert C recorded target"><figcaption>Recorded target</figcaption></figure></div>
      <div class="metric-definition"><h3>PSNR</h3><p>Pixel-error fidelity.<span>10 log₁₀(MAX² / MSE)</span></p></div>
      <div class="metric-definition"><h3>SSIM</h3><p>Luminance, contrast and structure.<span>Report separately from PSNR.</span></p></div>
      <p class="source-caption">Reference images, not predictions. Use consistent preprocessing and aggregation.</p>
    </div>
    <div class="coverage-explanation"><h2>Does the candidate set<br>cover the target?</h2>
      <div class="selection-diagram"><span v-for="i in 5" :key="i">z{{['₁','₂','₃','₄','₅'][i-1]}}</span></div>
      <p class="selection-label">Five candidate vectors (schematic)</p>
      <div class="selection-definition"><b>Top-1</b><p>Automatic ranking.<br>No query target at inference.</p></div>
      <div class="selection-definition"><b>Best-of-K</b><p>Target-assisted scoring.<br>Evaluation only.</p></div>
      <p class="metric-limit">Fidelity ≠ user preference.</p>
    </div>
  </div>
</template>
<style scoped>
.metrics-explained{display:grid;grid-template-columns:1fr 1fr;gap:70px;padding-top:8px}.metrics-explained h2{font-size:29px;line-height:1.2;letter-spacing:-.5px;margin-bottom:23px}.fidelity{display:flex;flex-direction:column;gap:16px}.metric-images{display:grid;grid-template-columns:1fr 1fr;gap:14px}.metric-images figure{margin:0}.metric-images img{width:100%;height:120px;object-fit:cover}.metric-images figcaption{font-size:15px;color:var(--muted);padding-top:7px}.metric-definition{display:grid;grid-template-columns:75px 1fr;gap:12px;border-top:1px solid var(--line);padding-top:15px}.metric-definition h3{font-size:23px;color:var(--blue);margin:0}.metric-definition p{font-size:20px}.metric-definition span{display:block;font-size:16px;color:var(--muted);padding-top:5px}.fidelity .source-caption{margin-top:auto}.coverage-explanation{border-left:1px solid var(--line);padding-left:42px;display:flex;flex-direction:column}.selection-diagram{display:flex;gap:14px;margin:10px 0 9px}.selection-diagram span{height:56px;flex:1;display:grid;place-items:center;border:1px solid var(--line);font-size:28px;color:var(--muted)}.selection-label{font-size:16px;color:var(--muted);margin-bottom:23px!important}.selection-definition{display:grid;grid-template-columns:116px 1fr;gap:18px;border-top:1px solid var(--line);padding:20px 0;font-size:20px}.selection-definition b{font-weight:500}.selection-definition p{color:var(--muted)}.metric-limit{font-size:23px;line-height:1.35;margin-top:auto!important;padding-top:18px;border-top:1px solid var(--ink)}
</style>
