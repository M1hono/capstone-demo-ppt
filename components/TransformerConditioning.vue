<script setup>
import { ref } from 'vue'
import pairs from '../data/history-pairs.json'
import { useSequence } from '../composables/useSequence'
const base = import.meta.env.BASE_URL
const pair = ref(1)
const source = ref(false)
const sequence = useSequence(['Encode each historical pair', 'Interleave image and edit tokens', 'Mix context with self-attention', 'Read the updated query token'])
const descriptions = [
  'A shared image encoder produces Eᵢ. The edit encoder produces zᵢ from the original and retouched pair.',
  'Project each zᵢ to the image-token dimension, then interleave eight pairs and append the query E₀.',
  'Self-attention lets the query exchange information with the historical image and edit tokens.',
  'Read only the updated E₀ as condition c. Model weights stay fixed when a new user supplies history.'
]
function tokenPosition(i) {
  if (sequence.step.value === 0 && i < 16) return `translate(${18 + Math.floor(i / 2) * 132}, ${i % 2 ? 55 : 3})`
  return `translate(${18 + i * 68}, 3)`
}
</script>
<template>
  <div class="stack transformer">
    <div class="row spread"><div class="tabs"><button :aria-pressed="!source" @click.stop="source=false">Report · 2 layers</button><button :aria-pressed="source" @click.stop="source=true">Saved default · 4 layers</button></div><span class="small muted">8 pairs + query · 17 tokens</span></div>
    <div class="history-rail">
      <button v-for="(p, i) in pairs.slice(0, 8)" :key="p.id" class="history-pair" :class="{ selected:pair === i + 1 }" :aria-label="`E${i + 1}`" :aria-pressed="pair === i + 1" @click.stop="pair=i + 1">
        <span class="pair-images"><img :src="base+p.original" :alt="`Historical original ${i + 1}`"/><img :src="base+p.edited" :alt="`Historical Expert C edit ${i + 1}`"/></span><span>H{{i + 1}}</span>
      </button>
      <div class="query-image"><img :src="base+'assets/fivek/original.png'" alt="Current original image"/><span>Query O₀</span></div>
    </div>
    <div class="token-scene">
      <svg viewBox="0 0 1188 116" role="img" aria-label="Seventeen tokens assemble into an interleaved sequence; their connections lead to the updated query condition">
        <g v-for="i in 17" :key="i" class="moving-token" :transform="tokenPosition(i - 1)" :data-token="i - 1">
          <rect width="52" height="35" :fill="i === 17 ? 'var(--ink)' : i % 2 ? 'var(--pale)' : '#e1f0ee'" :stroke="i < 17 && Math.ceil(i / 2) === pair ? 'var(--blue)' : 'none'" stroke-width="2"/>
          <text x="26" y="24" text-anchor="middle" :fill="i === 17 ? 'white' : 'var(--ink)'">{{i === 17 ? 'E₀' : (i % 2 ? 'E' : 'z') + Math.ceil(i / 2)}}</text>
        </g>
        <g class="context-links" :class="{hidden:sequence.step.value < 2}">
          <path v-for="i in 16" :key="i" :d="`M${44 + (i - 1) * 68} 42 Q${44 + (i - 1) * 68} 83 1132 83`" fill="none" :stroke="Math.ceil(i / 2) === pair ? 'var(--blue)' : 'var(--line)'" :stroke-width="Math.ceil(i / 2) === pair ? 2 : 1"/>
          <path d="M1132 42 V81" stroke="var(--blue)" stroke-width="2"/>
          <text x="18" y="111" class="diagram-note">Historical pair {{pair}} → paired positions preserve the image–edit relationship</text>
        </g>
      </svg>
    </div>
    <div class="transformer-output">
      <span class="layer-input">17 tokens<br><span>↓</span></span><div class="chips transformer-layers"><span v-for="i in (source ? 4 : 2)" :key="i">Layer {{i}}<small>Self-attention + FFN</small></span></div>
      <span class="arrow">→</span><div class="condition-output" :class="{muted:sequence.step.value < 3}"><span class="condition-symbol">E′₀ = c</span><div><strong>Read query token</strong><p class="small">To the conditional flow</p></div></div>
    </div>
    <p class="readout" aria-live="polite">{{descriptions[sequence.step.value]}}</p>
    <SequenceControls :sequence="sequence"/>
    <p class="source-caption">Real FiveK pairs; connections show permitted interactions, not measured attention. Report/source layer difference is preserved.</p>
  </div>
</template>
<style scoped>
.transformer{gap:12px}.history-rail{display:grid;grid-template-columns:repeat(8,1fr) 105px;gap:10px}.history-rail .history-pair{padding:0 0 5px;background:none;color:var(--ink);border:0;border-bottom:2px solid transparent;font-size:14px}.history-rail .selected{border-color:var(--blue)}.pair-images{display:grid;grid-template-columns:1fr 1fr;gap:3px;margin-bottom:5px}.pair-images img{height:49px;width:100%;object-fit:cover}.query-image{display:grid;justify-items:center;gap:5px;font-size:14px}.query-image img{height:49px;width:85px;object-fit:cover}.token-scene{flex:1;min-height:116px}.token-scene svg{width:100%;height:100%;overflow:visible}.token-scene text{font-size:18px}.token-scene .diagram-note{font-size:15px}.moving-token{transition:transform .65s cubic-bezier(.22,1,.36,1)}.context-links,.query-output{transition:opacity .4s}.hidden{opacity:0}.transformer-output{display:flex;align-items:center;gap:26px;min-height:60px}.transformer-layers{flex:1;gap:10px}.transformer-layers span{background:var(--pale);flex:1;padding:11px 15px;font-size:16px}.transformer-layers small{display:block;font-size:12px;color:var(--muted);margin-top:3px}.condition-output{display:flex;gap:18px;align-items:center;min-width:265px}.condition-symbol{font-size:42px;font-style:italic;color:var(--blue)}.condition-output strong{font-size:18px;font-weight:500}.transformer .readout{min-height:48px;font-size:17px}
</style>
<style scoped>
.layer-input{font-size:16px;line-height:1.2;text-align:center;min-width:80px;color:var(--muted)}.layer-input>span{font-size:25px}.transformer-output{gap:18px}.condition-output{min-width:332px;gap:14px}.condition-symbol{font-size:29px;white-space:nowrap}.transformer-layers span{font-size:18px;padding:12px}.transformer-layers small{font-size:13px}.transformer .readout{font-size:19px;min-height:52px}.history-rail .history-pair,.query-image{font-size:16px}
</style>
