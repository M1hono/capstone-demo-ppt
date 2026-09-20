<script setup>
import { ref, watch } from 'vue'
import { usePresentationPlayback } from '../composables/usePresentationPlayback'
const mode=ref('target')
const {stage,total,playing,runId,reduced,staticMode,play,finish,previous,next,pause,resume}=usePresentationPlayback([350,1350,2400,3450,4700])
const base=import.meta.env.BASE_URL
const asset=name=>`${base}assets/${name}`
const captions={
  target:['The old approach starts with original–expert pairs.','The shared encoder describes each complete edit.','Similar edits form a group that simulates one user.','The input RGB enters the regional enhancement step.','Cross-attention uses the group to decide how each region should change.','The same network learns editing features and refreshes the groups.'],
  zero:['Keep the real FiveK input fixed for a controlled check.','Set all four editing controls to zero.','Replay the saved checkpoint output; drag to compare.','Amplify the saved image difference to expose changed pixels.','The measured edit is nonzero: zero controls do not guarantee identity.','This checkpoint changes pixels even when every control is zero.'],
}
watch(mode,play)
</script>
<template>
  <div class="boundary-workbench motion-scene" :data-stage="stage" :data-playing="playing" :data-run="runId" :data-mode="mode">
    <div class="boundary-toolbar"><div role="group" aria-label="Choose a boundary test" @keydown.stop><button :aria-pressed="mode==='target'" @click.stop="mode='target'">Grouping input</button><button :aria-pressed="mode==='zero'" @click.stop="mode='zero'">Zero control</button></div><span>{{mode==='target'?'Old approach · grouping and enhancement':'Current editor · actual checkpoint replay'}}</span></div>
    <svg v-if="mode==='target'" class="boundary-diagram" viewBox="0 0 1168 300" role="img" aria-label="The same network groups complete editing pairs to simulate users. Original RGB then enters cross-attention with references from its group.">
      <defs><marker id="boundary-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="currentColor"/></marker></defs>
      <text x="74" y="27" text-anchor="middle">Original I</text><image :href="asset('evidence/flowers-original.png')" x="0" y="48" width="148" height="148"/>
      <text x="256" y="27" text-anchor="middle">Full expert target T</text>
      <image :href="asset('evidence/flowers-target.png')" x="182" y="48" width="148" height="148"/>
      <g class="boundary-wire" :class="{'is-on':stage>=1}"><path pathLength="1" d="M337 122 H379"/><path pathLength="1" d="M74 204 V224 H424 V177"/><path pathLength="1" d="M608 122 H665"/></g>
      <g class="boundary-node" :class="{'is-on':stage>=1}"><rect x="388" y="79" width="214" height="91" rx="3"/><text x="495" y="108" text-anchor="middle" class="strong">Grouping descriptor</text><text x="495" y="143" text-anchor="middle" class="formula">[ I, T, T − I ]</text></g>
      <text x="495" y="203" text-anchor="middle" class="small">Group by similar complete edits</text>
      <text x="772" y="27" text-anchor="middle">References from the same group</text>
      <g class="reference-cartridges" :class="{'is-on':stage>=2}">
        <g v-for="(n,i) in [1,2,3]" :key="n" :style="{'--row':i}"><rect x="679" :y="40+i*56" width="190" height="51" rx="2"/><text x="699" :y="71+i*56" class="small">R{{n}}</text><image :href="asset(`evidence/flowers-ref${n}-original.png`)" x="723" :y="44+i*56" width="43" height="43"/><text x="777" :y="71+i*56" class="small">→</text><image :href="asset(`evidence/flowers-ref${n}-expert.png`)" x="801" :y="44+i*56" width="43" height="43"/></g>
      </g>
      <g class="boundary-wire" :class="{'is-on':stage>=4}"><path pathLength="1" d="M877 122 H969"/></g>
      <g class="boundary-node" :class="{'is-on':stage>=4}"><rect x="980" y="85" width="183" height="74" rx="3"/><text x="1071" y="114" text-anchor="middle" class="strong">Cross-attention + CNN</text><text x="1071" y="139" text-anchor="middle" class="small">Regional edits</text></g>
      <g class="boundary-wire original-route" :class="{'is-on':stage>=3}"><path pathLength="1" d="M74 231 V269 H1071 V167"/><text x="570" y="259" text-anchor="middle" class="small">Input RGB → cross-attention with references from the same group.</text></g>
    </svg>
    <div v-else class="zero-experiment">
      <figure><figcaption>Original</figcaption><img :src="asset('fivek/cnn-input.png')" alt="Actual FiveK checkpoint input"/></figure>
      <div class="zero-operator" :class="{'is-on':stage>=1}"><span class="operator-arrow">→</span><div><b>Zero controls</b><span class="formula">[ 0, 0, 0, 0 ]</span><small>Residual CNN</small></div><span class="operator-arrow">→</span></div>
      <figure><figcaption>Saved output</figcaption><ImageComparison :before="asset('fivek/cnn-input.png')" :after="asset('fivek/cnn-zero.png')" label="zero-control output" :reveal="stage>=2?100:0"/></figure>
      <figure class="zero-difference" :class="{'is-on':stage>=3}"><figcaption>Absolute difference <span>×4</span></figcaption><img :src="asset('next-step/zero-difference-x4.png')" alt="Absolute RGB difference between saved input and zero output, amplified four times"/></figure>
    </div>
    <div class="boundary-verdict" :class="{'is-final':stage>=5}">
      <div v-if="mode==='target'"><b>One group → one user</b><span>Simulated user in the old approach</span></div>
      <div v-else><b class="zero-metric">{{stage>=4?'0.0275':'—'}}</b><span>Mean absolute edit · [0, 1]</span></div>
      <p v-if="mode==='target'"><b>Shared network</b><span>Form groups → learn regional edits → refresh groups</span></p>
      <p v-else><b>Recorded observation</b><span>Zero controls still produce an edit in this checkpoint.</span></p>
    </div>
    <div class="mechanism-reading"><p :key="`${mode}-${stage}`">{{captions[mode][stage]}}</p><PlaybackControls v-if="!staticMode" :stage="stage" :total="total" :playing="playing" :reduced="reduced" @previous="previous" @next="next" @pause="pause" @resume="resume" @replay="play" @finish="finish"/></div>
    <p class="mechanism-provenance">{{mode==='target'?'Recorded pairs illustrate the old grouping mechanism.':'Difference: saved 8-bit images, amplified ×4. Metric: original float-tensor checkpoint run.'}}</p>
  </div>
</template>
<style scoped>
.boundary-workbench { margin-top:20px; }
.boundary-toolbar { height:37px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--line); }
.boundary-toolbar button { padding:8px 14px; font-size:14px; border-bottom:2px solid transparent; }
.boundary-toolbar button[aria-pressed=true] { border-bottom-color:var(--blue); }
.boundary-toolbar>span { color:var(--muted); font-size:12px; }
.boundary-diagram { width:100%; height:300px; margin-top:18px; overflow:visible; }
.boundary-diagram text { font:16px Arial,sans-serif; fill:var(--ink); }
.boundary-diagram .small { font-size:13px; fill:var(--muted); }.boundary-diagram .strong { font-weight:600; }
.boundary-diagram .formula { font:18px var(--mono); }



.boundary-wire { color:var(--blue); opacity:.13; transition:opacity 220ms var(--ease); }
.boundary-wire path { fill:none; stroke:currentColor; stroke-width:1.6; marker-end:url(#boundary-arrow); stroke-dasharray:1; stroke-dashoffset:1; transition:stroke-dashoffset 240ms var(--ease); }
.boundary-wire.is-on { opacity:1; }.boundary-wire.is-on path { stroke-dashoffset:0; }

.boundary-node { opacity:.25; transition:opacity 220ms var(--ease); }.boundary-node.is-on { opacity:1; }
.boundary-node rect { fill:var(--surface); stroke:var(--line); transition:fill 220ms var(--ease); }


.reference-cartridges { opacity:.22; transition:opacity 220ms var(--ease); }.reference-cartridges.is-on { opacity:1; }
.reference-cartridges rect { fill:#e9edeb; stroke:var(--line); }
.reference-cartridges>g { transform:translateX(8px); transition:transform 240ms var(--ease); transition-delay:calc(var(--row)*25ms); }.reference-cartridges.is-on>g { transform:translateX(0); }


.zero-experiment { height:300px; margin-top:18px; display:grid; grid-template-columns:242px 1fr 242px 242px; gap:28px; }
.zero-experiment figure { margin:0; }.zero-experiment figcaption { height:32px; font-size:16px; }.zero-experiment img,.zero-experiment .image-comparison { width:242px; height:242px; }
.zero-difference { opacity:.14; transition:opacity 220ms var(--ease); }.zero-difference.is-on { opacity:1; }.zero-difference figcaption span { float:right; font:14px var(--mono); color:var(--coral); }
.zero-operator { display:flex; align-items:center; gap:14px; opacity:.3; transition:opacity 220ms var(--ease); }.zero-operator.is-on { opacity:1; }
.zero-operator>div { padding:18px 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line); text-align:center; flex:1; }
.zero-operator b { display:block; font-size:16px; }.zero-operator .formula { display:block; margin:16px 0; white-space:nowrap; font:15px var(--mono); }.zero-operator small { color:var(--muted); font-size:14px; }.operator-arrow { color:var(--blue); font-size:23px; }
.boundary-verdict { display:grid; grid-template-columns:330px 1fr; align-items:center; gap:32px; min-height:72px; border-top:1px solid var(--line); border-bottom:1px solid var(--line); }
.boundary-verdict>div { display:flex; flex-direction:column; gap:4px; }.boundary-verdict b { font-size:20px; font-weight:500; }.boundary-verdict span { font-size:14px; color:var(--muted); }
.boundary-verdict>p { display:flex; flex-direction:column; gap:7px; padding-left:30px; border-left:1px solid var(--line); }.boundary-verdict>p b { font-size:14px; color:var(--blue); }.boundary-verdict>p span { font-size:17px; color:var(--ink); }
.boundary-verdict.is-final>p b { color:var(--coral); }.boundary-verdict .zero-metric { font:27px var(--mono); }
.boundary-workbench .mechanism-reading { border-top:0; margin-top:5px; }
@media (prefers-reduced-motion:reduce) { * { transition:none!important; } }
</style>
