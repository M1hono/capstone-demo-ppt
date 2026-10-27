<script setup>
import e from '../data/report-evidence.json'
import pairs from '../data/history-pairs.json'
const base = import.meta.env.BASE_URL
</script>
<template>
  <div class="outcomes">
    <div class="objective">
      <h2>Learn a user’s<br>range of preferences.</h2>
      <div class="input-pair"><figure><img :src="base+'assets/fivek/original.png'" alt="Current FiveK original"><figcaption>Current image</figcaption></figure><span>+</span><div class="history"><img v-for="pair in pairs.slice(0,4)" :key="pair.id" :src="base+pair.edited" :alt="'Historical expert edit '+pair.id"><p>Editing history</p></div></div>
      <p class="density-formula">p(z | image, history)</p>
      <p class="objective-detail">3D edits / 8 history pairs / fixed weights</p>
    </div>
    <div class="outcome-results">
      <h3>Reported image fidelity</h3>
      <svg viewBox="0 0 590 260" role="img" aria-label="FiveK Top-1 23.562 dB and offline Best-of-5 26.214 dB; PPSD reported 24.500 dB">
        <g v-for="n in [20,22,24,26,28]" :key="n"><line :x1="78+(n-20)*58" y1="55" :x2="78+(n-20)*58" y2="204" stroke="var(--line)"/><text :x="78+(n-20)*58" y="237" text-anchor="middle">{{n}}</text></g>
        <text x="0" y="28">PSNR / dB</text>
        <line :x1="78+(e.fivek.psnr.top1[5]-20)*58" y1="100" :x2="78+(e.fivek.psnr.best5[5]-20)*58" y2="100" stroke="var(--ink)" stroke-width="2"/>
        <circle :cx="78+(e.fivek.psnr.top1[5]-20)*58" cy="100" r="8" fill="var(--blue)"/><circle :cx="78+(e.fivek.psnr.best5[5]-20)*58" cy="100" r="8" fill="var(--teal)"/>
        <text :x="78+(e.fivek.psnr.top1[5]-20)*58" y="77" text-anchor="middle" class="result-value">23.562</text><text :x="78+(e.fivek.psnr.best5[5]-20)*58" y="77" text-anchor="middle" class="result-value">26.214</text>
        <text x="0" y="106">FiveK</text><text x="285" y="137" text-anchor="middle">Top-1</text><text x="438" y="137" text-anchor="middle">Best-of-5*</text>
        <text x="0" y="194">PPSD</text><path d="M339 180 L347 188 L339 196 L331 188 Z" fill="var(--ink)"/><text x="360" y="195" class="result-value">24.500</text>
      </svg>
      <div class="result-reading"><p><b>Top-1</b> Automatic selection.</p><p><b>Best-of-5*</b> Offline, target-assisted coverage.</p></div>
      <p class="source-caption">FiveK: report + archived diagnostic. PPSD: report only. Final run unavailable.</p>
    </div>
  </div>
</template>
<style scoped>
.outcomes{display:grid;grid-template-columns:.95fr 1.2fr;gap:64px;padding:14px 0}.objective{display:flex;flex-direction:column;gap:20px}.objective h2{font-size:34px;line-height:1.18;letter-spacing:-.6px;margin:0}.input-pair{display:flex;gap:18px;align-items:center}.input-pair figure{margin:0;width:176px}.input-pair figure img{width:176px;height:117px;object-fit:cover}.input-pair figcaption,.history p{font-size:16px;color:var(--muted);padding-top:6px}.input-pair>span{font-size:28px;color:var(--muted)}.history{display:grid;grid-template-columns:repeat(2,70px);gap:5px}.history img{width:70px;height:52px;object-fit:cover}.history p{grid-column:1/-1}.density-formula{font:25px/1.4 Menlo,monospace;color:var(--blue);border-top:1px solid var(--line);padding-top:20px}.objective-detail{font-size:20px;color:var(--muted)}.outcome-results{display:flex;flex-direction:column;gap:18px;border-left:1px solid var(--line);padding-left:36px;justify-content:center}.outcome-results h3{font-size:23px;font-weight:500}.outcome-results svg{width:100%;overflow:visible}.outcome-results svg text{font-family:inherit;font-size:17px;fill:var(--muted)}.outcome-results svg .result-value{font-size:23px;fill:var(--ink);font-weight:500}.result-reading{border-top:1px solid var(--line);padding-top:18px;display:grid;gap:10px;font-size:19px}.result-reading b{font-weight:500}.outcome-results .source-caption{font-size:14px}
</style>
