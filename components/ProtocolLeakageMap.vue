<script setup>
import { ref } from 'vue'
import pairs from '../data/history-pairs.json'
const base = import.meta.env.BASE_URL, stage = ref('inference')
</script>
<template>
  <div class="stack visual-lab">
    <div class="row spread"><div class="tabs"><button v-for="s in ['training','inference','scoring']" :key="s" :aria-pressed="stage === s" @click.stop="stage = s">{{ {training:'Shared training',inference:'Unseen-user inference',scoring:'Offline scoring'}[s] }}</button></div><p class="small muted">Reported holdout protocol · final-run proof remains in the evidence ledger</p></div>
    <svg viewBox="0 0 1180 365" class="grow" role="img" aria-label="Training, inference and scoring data boundaries">
      <defs><marker id="protocol-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8" fill="#0f62fe"/></marker></defs>
      <rect x="450" y="38" width="300" height="274" fill="#edf3ff" stroke="#0f62fe"/>
      <text x="600" y="87" text-anchor="middle" style="font-size:25px" fill="#18202b">Shared flow5 model</text>
      <text x="600" y="121" text-anchor="middle" class="svg-label">Encoder → Transformer → Flow</text>
      <g v-for="i in 17" :key="i"><rect :x="484 + (i - 1) % 9 * 26" :y="153 + Math.floor((i - 1) / 9) * 29" width="18" height="20" :fill="i % 2 ? '#0f62fe' : '#007d79'"/></g>
      <text x="600" y="252" text-anchor="middle" class="svg-value">{{ stage === 'training' ? 'Optimise shared parameters θ' : 'Fixed parameters θ' }}</text>
      <image :href="base + 'assets/fivek/original.png'" x="25" y="25" width="160" height="106"/>
      <text x="105" y="153" text-anchor="middle" class="svg-label">{{ stage === 'training' ? 'Training original' : 'Current original O₀' }}</text>
      <path d="M200 80 H425" stroke="#0f62fe" stroke-width="3" fill="none" marker-end="url(#protocol-arrow)"/>
      <g v-for="(p,i) in pairs.slice(0,4)" :key="p.id"><image :href="base + p.original" :x="24 + i * 82" y="200" width="74" height="49"/><image :href="base + p.edited" :x="24 + i * 82" y="255" width="74" height="49"/></g>
      <text x="188" y="339" text-anchor="middle" class="svg-label">{{ stage === 'training' ? 'Training users · A–D in report' : 'User history · 8 pairs, 4 shown' }}</text>
      <path d="M358 245 H425" stroke="#0f62fe" stroke-width="3" fill="none" marker-end="url(#protocol-arrow)"/>
      <path d="M775 94 H966" stroke="#0f62fe" stroke-width="3" fill="none" marker-end="url(#protocol-arrow)"/>
      <text x="1008" y="80" text-anchor="middle" style="font-size:25px" fill="#0f62fe">{{ stage === 'training' ? 'log p(z | c)' : 'z₁ … z₅' }}</text>
      <text x="1008" y="112" text-anchor="middle" class="svg-label">{{ stage === 'training' ? 'Likelihood objective' : 'Retouching candidates' }}</text>
      <image :href="base + 'assets/fivek/expert-C.png'" x="930" y="195" width="160" height="106"/>
      <text x="1010" y="333" text-anchor="middle" class="svg-label">{{ stage === 'training' ? 'Training target' : 'Query ground truth T₀' }}</text>
      <path v-if="stage === 'training'" d="M910 250 H775" stroke="#0f62fe" stroke-width="3" fill="none" marker-end="url(#protocol-arrow)"/>
      <g v-else-if="stage === 'inference'"><line x1="770" x2="908" y1="250" y2="250" stroke="#b82742" stroke-dasharray="7 5"/><path d="M830 234 L852 266 M852 234 L830 266" stroke="#b82742" stroke-width="4"/><text x="840" y="295" text-anchor="middle" style="font-size:14px" fill="#b82742">Blocked</text></g>
      <g v-else><path d="M1010 185 V137" stroke="#0f62fe" stroke-width="3" fill="none" marker-end="url(#protocol-arrow)"/><text x="810" y="213" class="svg-label">PSNR / SSIM</text><text x="810" y="238" class="svg-label">Best-of-K coverage</text></g>
    </svg>
    <p class="readout">{{ stage === 'training' ? 'The report excludes Expert E from parameter training.' : stage === 'inference' ? 'The current target never enters the prediction path. User history supplies the preference evidence.' : 'Ground truth is used only after prediction to calculate metrics and oracle Best-of-K coverage.' }}</p>
    <p class="source-caption">Reference photographs illustrate data roles, not the final experimental partition. Report/source split differences are documented on page 35.</p>
  </div>
</template>
