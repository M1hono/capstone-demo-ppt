<script setup>
import { ref, watch } from 'vue'
import { usePresentationPlayback } from '../composables/usePresentationPlayback'
const mode=ref('target')
const {stage,total,playing,runId,reduced,staticMode,play,finish,previous,next,pause,resume}=usePresentationPlayback([350,1350,2400,3450,4700])
const base=import.meta.env.BASE_URL
const asset=name=>`${base}assets/${name}`
const captions={
  target:['The baseline starts with an original and its complete expert edit.','The expert target enters the retrieval descriptor upstream.','Selected reference pairs then guide the RGB-only generator.','At deployment, the desired full target is unavailable.','Removing that information changes the retrieval problem.','Rerun with an available query signal and archive the resulting reference choices.'],
  zero:['Keep the real FiveK input fixed for a controlled check.','Set all four editing controls to zero.','Replay the saved checkpoint output; drag to compare.','Amplify the saved image difference to expose changed pixels.','The measured edit is nonzero: zero controls do not guarantee identity.','Add identity and protected-region tests before claiming preservation.'],
}
watch(mode,play)
</script>
<template>
  <div class="boundary-workbench motion-scene" :data-stage="stage" :data-playing="playing" :data-run="runId" :data-mode="mode">
    <div class="boundary-toolbar"><div role="group" aria-label="Choose a boundary test" @keydown.stop><button :aria-pressed="mode==='target'" @click.stop="mode='target'">Target access</button><button :aria-pressed="mode==='zero'" @click.stop="mode='zero'">Zero control</button></div><span>{{mode==='target'?'Research baseline · dependency test':'Current editor · actual checkpoint replay'}}</span></div>
    <svg v-if="mode==='target'" class="boundary-diagram" viewBox="0 0 1168 300" role="img" aria-label="The full expert target supplies retrieval information. Removing it leaves deployment-time reference selection unvalidated, even though generation itself receives original RGB.">
      <defs><marker id="boundary-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="currentColor"/></marker></defs>
      <text x="74" y="27" text-anchor="middle">Original I</text><image :href="asset('evidence/flowers-original.png')" x="0" y="48" width="148" height="148"/>
      <text x="256" y="27" text-anchor="middle">Full expert target T</text>
      <rect class="target-socket" x="182" y="48" width="148" height="148"/>
      <g class="target-cartridge" :class="{'is-removed':stage>=3}"><image :href="asset('evidence/flowers-target.png')" x="182" y="48" width="148" height="148"/></g>
      <g class="boundary-reveal removed-label" :class="{'is-on':stage>=3}"><rect x="181" y="105" width="150" height="35"/><text x="256" y="128" text-anchor="middle">Unavailable</text></g>
      <g class="boundary-wire" :class="{'is-on':stage>=1,'is-missing':stage>=4}"><path pathLength="1" d="M337 122 H379"/><path pathLength="1" d="M74 204 V224 H424 V177"/><path pathLength="1" d="M608 122 H665"/></g>
      <g class="boundary-node" :class="{'is-on':stage>=1,'is-missing':stage>=4}"><rect x="388" y="79" width="214" height="91" rx="3"/><text x="495" y="108" text-anchor="middle" class="strong">Retrieval descriptor</text><text x="495" y="143" text-anchor="middle" class="formula">{{stage>=4?'[ I, ?, ? − I ]':'[ I, T, T − I ]'}}</text></g>
      <text x="495" y="203" text-anchor="middle" class="small" :class="{'missing-text':stage>=4}">{{stage>=4?'Query signal must change':'Target information enters here'}}</text>
      <text x="772" y="27" text-anchor="middle">Selected reference pairs</text>
      <g class="reference-cartridges" :class="{'is-on':stage>=2,'is-untested':stage>=4}">
        <g v-for="(n,i) in [1,2,3]" :key="n" :style="{'--row':i}"><rect x="679" :y="40+i*56" width="190" height="51" rx="2"/><text x="699" :y="71+i*56" class="small">R{{n}}</text><image :href="asset(`evidence/flowers-ref${n}-original.png`)" x="723" :y="44+i*56" width="43" height="43"/><text x="777" :y="71+i*56" class="small">→</text><image :href="asset(`evidence/flowers-ref${n}-expert.png`)" x="801" :y="44+i*56" width="43" height="43"/></g>
      </g>
      <g class="boundary-reveal untested-label" :class="{'is-on':stage>=4}"><rect x="691" y="103" width="166" height="37"/><text x="774" y="127" text-anchor="middle">Selection unvalidated</text></g>
      <g class="boundary-wire" :class="{'is-on':stage>=2,'is-missing':stage>=4}"><path pathLength="1" d="M877 122 H969"/></g>
      <g class="boundary-node" :class="{'is-on':stage>=2}"><rect x="980" y="85" width="183" height="74" rx="3"/><text x="1071" y="114" text-anchor="middle" class="strong">Generate</text><text x="1071" y="139" text-anchor="middle" class="small">Original RGB + pairs</text></g>
      <g class="boundary-wire original-route" :class="{'is-on':stage>=2}"><path pathLength="1" d="M74 231 V269 H1071 V167"/><text x="570" y="259" text-anchor="middle" class="small">RGB bypasses the target — reference selection still depends on it.</text></g>
    </svg>
    <div v-else class="zero-experiment">
      <figure><figcaption>Original</figcaption><img :src="asset('fivek/cnn-input.png')" alt="Actual FiveK checkpoint input"/></figure>
      <div class="zero-operator" :class="{'is-on':stage>=1}"><span class="operator-arrow">→</span><div><b>Zero controls</b><span class="formula">[ 0, 0, 0, 0 ]</span><small>Residual CNN</small></div><span class="operator-arrow">→</span></div>
      <figure><figcaption>Saved output</figcaption><ImageComparison :before="asset('fivek/cnn-input.png')" :after="asset('fivek/cnn-zero.png')" label="zero-control output" :reveal="stage>=2?100:0"/></figure>
      <figure class="zero-difference" :class="{'is-on':stage>=3}"><figcaption>Absolute difference <span>×4</span></figcaption><img :src="asset('next-step/zero-difference-x4.png')" alt="Absolute RGB difference between saved input and zero output, amplified four times"/></figure>
    </div>
    <div class="boundary-verdict" :class="{'is-final':stage>=5}">
      <div v-if="mode==='target'"><b>Target-free retrieval</b><span>{{stage>=4?'Needs its own evaluation':'A deployment condition to test'}}</span></div>
      <div v-else><b class="zero-metric">{{stage>=4?'0.0275':'—'}}</b><span>Mean absolute edit · [0, 1]</span></div>
      <p v-if="mode==='target'"><b>Next experiment</b><span>Available query → new references → evaluate again</span></p>
      <p v-else><b>Next experiment</b><span>Zero edit → identity test · protected region → preservation test</span></p>
    </div>
    <div class="mechanism-reading"><p :key="`${mode}-${stage}`">{{captions[mode][stage]}}</p><PlaybackControls v-if="!staticMode" :stage="stage" :total="total" :playing="playing" :reduced="reduced" @previous="previous" @next="next" @pause="pause" @resume="resume" @replay="play" @finish="finish"/></div>
    <p class="mechanism-provenance">{{mode==='target'?'Recorded pairs illustrate the dependency; removing the target is a schematic intervention.':'Difference: saved 8-bit images, amplified ×4. Metric: original float-tensor checkpoint run.'}}</p>
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
.target-socket { fill:var(--surface); stroke:var(--line); stroke-dasharray:4 4; }
.target-cartridge { transition:transform 240ms var(--ease),opacity 180ms ease-in; }
.target-cartridge.is-removed { transform:translateY(-10px) rotate(-3deg); transform-origin:256px 122px; opacity:.16; }
.boundary-wire { color:var(--blue); opacity:.13; transition:opacity 220ms var(--ease); }
.boundary-wire path { fill:none; stroke:currentColor; stroke-width:1.6; marker-end:url(#boundary-arrow); stroke-dasharray:1; stroke-dashoffset:1; transition:stroke-dashoffset 240ms var(--ease); }
.boundary-wire.is-on { opacity:1; }.boundary-wire.is-on path { stroke-dashoffset:0; }
.boundary-wire.is-missing { color:var(--coral); }.boundary-wire.is-missing path { stroke-dasharray:.035 .03; }
.boundary-node { opacity:.25; transition:opacity 220ms var(--ease); }.boundary-node.is-on { opacity:1; }
.boundary-node rect { fill:var(--surface); stroke:var(--line); transition:fill 220ms var(--ease); }
.boundary-node.is-missing rect { fill:#eee2da; stroke:var(--coral); }
.boundary-diagram .missing-text { fill:var(--coral); }
.reference-cartridges { opacity:.22; transition:opacity 220ms var(--ease); }.reference-cartridges.is-on { opacity:1; }.reference-cartridges.is-untested { opacity:.22; }
.reference-cartridges rect { fill:#e9edeb; stroke:var(--line); }
.reference-cartridges>g { transform:translateX(8px); transition:transform 240ms var(--ease); transition-delay:calc(var(--row)*25ms); }.reference-cartridges.is-on>g { transform:translateX(0); }
.boundary-reveal { opacity:0; transition:opacity 220ms var(--ease); }.boundary-reveal.is-on { opacity:1; }
.removed-label rect,.untested-label rect { fill:var(--paper); }.removed-label text,.untested-label text { fill:var(--coral); font-size:14px; }
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
