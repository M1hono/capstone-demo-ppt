<template>
  <div class="learning-results">
    <div class="learning-head"><span>What the project demonstrated</span><span></span><span>What the evidence taught us</span></div>
    <article><div><h2>A compact edit representation</h2><p>3D latent space with eight learned LUT bases.</p><p class="learning-evidence">Reconstruction: FiveK 28.5 dB · PPSD 28.2 dB</p></div><span class="lesson-arrow">→</span><div><h3>Capacity is a trade-off.</h3><p>Global colour and tone are tractable. Regional and structural edits remain limited.</p></div></article>
    <article><div><h2>Conditional candidate generation</h2><p>Image and user history condition multiple possible edits.</p><p class="learning-evidence">FiveK: 23.562 Top-1 → 26.214 Best-of-5 dB</p></div><span class="lesson-arrow">→</span><div><h3>Coverage needs user validation.</h3><p>Best-of-K shows target coverage. It does not prove that all alternatives are preferred.</p></div></article>
    <article><div><h2>Practical model-side inference</h2><p>Shared weights, without user-specific fine-tuning.</p><p class="learning-evidence">39.735 ms / query · RTX 4060 Laptop GPU</p></div><span class="lesson-arrow">→</span><div><h3>Claims depend on their scope.</h3><p>Cached edits and GPU-resident inputs reduce the measured cost. End-to-end deployment remains untested.</p></div></article>
    <p class="source-caption">Report §5.1–5.2. Reconstruction and inference values retain their reported protocols. Input ablations also identify historical-pairing weaknesses.</p>
  </div>
</template>
<style scoped>
.learning-results{display:flex;flex-direction:column;gap:0;justify-content:space-between}.learning-head,.learning-results article{display:grid;grid-template-columns:1.2fr 60px 1fr;gap:24px;align-items:center}.learning-head{font-size:16px;color:var(--muted);padding-bottom:14px}.learning-results article{border-top:1px solid var(--line);padding:21px 0}.learning-results h2{font-size:26px;line-height:1.2;margin:0 0 9px}.learning-results h3{font-size:23px;margin:0 0 9px}.learning-results article p{font-size:19px;color:var(--muted)}.learning-results article .learning-evidence{font-size:17px;color:var(--blue);margin-top:10px}.lesson-arrow{font-size:32px;font-weight:300;color:var(--muted)}.learning-results>.source-caption{border-top:1px solid var(--line);padding-top:14px}
</style>
