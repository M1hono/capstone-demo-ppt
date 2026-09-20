<script setup>
import { ref, watch } from 'vue'
import { usePresentationPlayback } from '../composables/usePresentationPlayback'
const mode=ref('completion')
const {stage,total,playing,runId,reduced,staticMode,play,finish,previous,next,pause,resume}=usePresentationPlayback([350,1450,2600,3750,5100])
const base=import.meta.env.BASE_URL
const asset=name=>`${base}assets/${name}`
const captions={
  completion:['Begin with the original; the full desired result remains unknown.','Lift out a specified edit, simulated here with selected Expert D pixels.','Merge the clue, then retrieve examples of similar edits.','Use cross-attention to borrow relevant editing information.','Copy the specified pixels exactly; predict the remaining region.','Evaluate only the unknown region, then test the contribution of history.'],
  history:['Fix the same original, partial edit and mask for every comparison.','Retrieve only from the intended user’s editing history.','Replace it with another user’s history; keep the clue fixed.','Add a separately implemented no-history baseline.','Score the unknown region and check that specified edits are preserved.','Use these controls and client judgements to test whether history helps.'],
}
const trials=[
  {name:'Same-user history',detail:'Relevant personal examples',kind:'same',source:'flowers-ref1'},
  {name:'Other-user history',detail:'Different edit history',kind:'other',source:'dog-ref1'},
  {name:'No-history baseline',detail:'Separate ablation to implement',kind:'none'},
]
watch(mode,play)
</script>
<template>
  <div class="next-mechanism motion-scene" :data-stage="stage" :data-playing="playing" :data-run="runId" :data-mode="mode">
    <div class="next-toolbar"><div role="group" aria-label="Choose a next-phase explanation" @keydown.stop><button :aria-pressed="mode==='completion'" @click.stop="mode='completion'">Completion path</button><button :aria-pressed="mode==='history'" @click.stop="mode='history'">History test</button></div><span>Next-phase schematic · simulated edit clue</span></div>
    <svg v-if="mode==='completion'" class="completion-diagram" viewBox="0 0 1168 338" role="img" aria-label="An illustrative partial edit is composed with the original, used to retrieve reference pairs and passed to cross-attention. Specified pixels are copied; unknown pixels require prediction and separate evaluation.">
      <defs>
        <marker id="completion-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="currentColor"/></marker>
        <pattern id="completion-unknown" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="10" height="10" fill="#e2e8e7"/><line x1="0" y1="0" x2="0" y2="10" stroke="#becbc9" stroke-width="2"/></pattern>
      </defs>
      <text x="127" y="33" text-anchor="middle" class="section-label">{{stage<2?'Build a partial edit':'Partial edit clue P'}}</text>
      <image :href="asset('fivek/cnn-input.png')" x="20" y="65" width="214" height="214"/>
      <g class="edit-plane" :class="{'is-visible':stage>=1,'is-lifted':stage===1}"><image :href="asset('next-step/specified-edit.png')" x="20" y="65" width="214" height="214"/><rect x="113.625" y="105.125" width="100.3125" height="113.6875" class="specified-outline"/></g>
      <text x="127" y="301" text-anchor="middle" class="small">Original + specified edit + mask</text>
      <g class="next-wire" :class="{'is-on':stage>=2}"><path pathLength="1" d="M244 161 H289"/><path pathLength="1" d="M477 161 H505"/></g>
      <g class="next-node" :class="{'is-on':stage>=2,'is-focus':stage===2}"><rect x="298" y="116" width="174" height="89" rx="3"/><text x="385" y="143" text-anchor="middle" class="strong">Retrieve by the clue</text><text x="385" y="177" text-anchor="middle" class="formula">[ I, P, P − I ]</text></g>
      <text x="584" y="33" text-anchor="middle" class="section-label">Reference edit pairs</text>
      <g class="next-reference-pool" :class="{'is-on':stage>=2}"><g v-for="(n,i) in [1,2,3]" :key="n" :style="{'--row':i}"><text x="516" :y="91+i*54" class="small">R{{n}}</text><image :href="asset(`evidence/flowers-ref${n}-original.png`)" x="544" :y="61+i*54" width="45" height="45"/><text x="599" :y="91+i*54" class="small">→</text><image :href="asset(`evidence/flowers-ref${n}-expert.png`)" x="622" :y="61+i*54" width="45" height="45"/></g></g>
      <g class="next-wire" :class="{'is-on':stage>=3}"><path pathLength="1" d="M584 223 V253"/><path pathLength="1" d="M127 309 V328 H452 V286 H478"/><path pathLength="1" d="M658 286 H701"/><path pathLength="1" d="M828 286 H850 V179 H889"/></g>
      <g class="next-node" :class="{'is-on':stage>=3,'is-focus':stage===3}"><rect x="486" y="261" width="166" height="55" rx="3"/><text x="569" y="285" text-anchor="middle" class="strong">Cross-attention</text><text x="569" y="305" text-anchor="middle" class="small">Borrow useful edits</text></g>
      <g class="next-node" :class="{'is-on':stage>=3}"><rect x="711" y="261" width="111" height="55" rx="3"/><text x="766" y="285" text-anchor="middle" class="strong">CNN</text><text x="766" y="305" text-anchor="middle" class="small">Predict edits</text></g>
      <g class="next-wire copy-wire" :class="{'is-on':stage>=4}"><path pathLength="1" d="M220 88 H256 V8 H1102 V60"/><text x="805" y="28" text-anchor="middle" class="small">Copy specified pixels</text></g>
      <text x="1006" y="50" text-anchor="middle" class="section-label">Output composition</text>
      <rect x="900" y="69" width="212" height="212" fill="url(#completion-unknown)"/>
      <path class="unknown-score-outline" :class="{'is-on':stage>=5}" d="M900 69H1112V281H900Z M992.75 108.75V221.375H1092.125V108.75Z"/>
      <g class="output-specified" :class="{'is-on':stage>=4}"><image :href="asset('next-step/specified-edit.png')" x="900" y="69" width="212" height="212"/><rect x="992.75" y="108.75" width="99.375" height="112.625" class="specified-outline"/></g>
      <rect x="916" y="239" width="180" height="27" fill="var(--paper)"/><text x="1006" y="258" text-anchor="middle" class="small">{{stage>=5?'Score unknown pixels only':'Unknown region: to predict'}}</text>
      <text x="1006" y="303" text-anchor="middle" class="small">Rule shown · no new output</text>
    </svg>
    <div v-else class="history-experiment">
      <div class="fixed-clue"><h3>Keep the clue fixed</h3><img :src="asset('next-step/partial-clue.png')" alt="Identical simulated partial edit used for every proposed history control"/><div class="fixed-mask"><img :src="asset('next-step/illustrative-mask.png')" alt="Illustrative specified-region mask, held fixed"/><p>Same original<br>Same edit + mask</p></div></div>
      <div class="history-trials">
        <div class="trial-header"><span>Change only the source of history</span><span>Unknown-region PSNR</span></div>
        <div v-for="(trial,i) in trials" :key="trial.kind" class="history-trial" :class="{'is-on':stage>=i+1,'is-scored':stage>=4}" :data-trial="trial.kind">
          <span class="trial-branch" aria-hidden="true">↳</span><div class="trial-copy"><b>{{trial.name}}</b><small>{{trial.detail}}</small></div>
          <div v-if="trial.source" class="trial-pair"><img :src="asset(`evidence/${trial.source}-original.png`)" alt="Example original, illustrative history pool"/><span aria-hidden="true">→</span><img :src="asset(`evidence/${trial.source}-expert.png`)" alt="Example expert edit, illustrative history pool"/></div><div v-else class="trial-pair empty-history"><span>∅</span><small>History removed</small></div>
          <span class="trial-arrow" aria-hidden="true">→</span><div class="trial-output"><img :src="asset('next-step/specified-edit.png')" alt="Specified pixels retained; hatched unknown region has no predicted result"/></div>
          <div class="trial-score"><b>—</b><small>To measure</small></div>
        </div>
      </div>
    </div>
    <div class="next-evaluation" :class="{'is-on':stage>=5}">
      <div><span class="region-swatch specified"/><p><b>Preserve M</b><span>Copy the specified edit</span></p></div>
      <div><span class="region-swatch unknown"/><p><b>Score 1 − M</b><span>Evaluate completion only</span></p></div>
      <div><span class="evaluation-arrow" aria-hidden="true">→</span><p><b>{{mode==='completion'?'Test the history':'Establish preference value'}}</b><span>{{mode==='completion'?'Same user · other user · no history':'Controlled results + client choices'}}</span></p></div>
    </div>
    <div class="mechanism-reading"><p :key="`${mode}-${stage}`">{{captions[mode][stage]}}</p><PlaybackControls v-if="!staticMode" :stage="stage" :total="total" :playing="playing" :reduced="reduced" @previous="previous" @next="next" @pause="pause" @resume="resume" @replay="play" @finish="finish"/></div>
    <p class="mechanism-provenance">{{mode==='completion'?'FiveK expert pixels simulate the edit; mask and reference selection are illustrative.':'Example photos stand in for future user pools. User identities and comparison scores are not available.'}}</p>
  </div>
</template>
<style scoped>
.next-mechanism { margin-top:18px; }
.next-toolbar { height:37px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--line); }
.next-toolbar button { padding:8px 14px; font-size:14px; border-bottom:2px solid transparent; }.next-toolbar button[aria-pressed=true] { border-bottom-color:var(--blue); }.next-toolbar>span { color:var(--muted); font-size:12px; }
.completion-diagram { display:block; width:100%; height:320px; margin-top:10px; overflow:visible; }
.completion-diagram text { font:16px Arial,sans-serif; fill:var(--ink); }.completion-diagram .small { font-size:13px; fill:var(--muted); }.completion-diagram .strong { font-size:15px; font-weight:600; }.completion-diagram .formula { font:16px var(--mono); }
.edit-plane { opacity:0; transition:transform 260ms var(--ease),opacity 220ms var(--ease); transform-origin:128px 162px; }.edit-plane.is-visible { opacity:1; }.edit-plane.is-lifted { transform:translate(27px,-22px) rotate(-5deg); }
.specified-outline { fill:none; stroke:var(--mint); stroke-width:2; }.unknown-score-outline { fill:none; stroke:var(--blue); stroke-width:2; opacity:0; transition:opacity 220ms var(--ease); }.unknown-score-outline.is-on { opacity:1; }.output-specified { opacity:.12; transition:opacity 220ms var(--ease),transform 260ms var(--ease); transform:translateY(-8px); }.output-specified.is-on { opacity:1; transform:translateY(0); }
.next-wire { color:var(--blue); opacity:.1; transition:opacity 220ms var(--ease); }.next-wire.is-on { opacity:1; }.next-wire path { fill:none; stroke:currentColor; stroke-width:1.6; marker-end:url(#completion-arrow); stroke-dasharray:1; stroke-dashoffset:1; transition:stroke-dashoffset 260ms var(--ease); }.next-wire.is-on path { stroke-dashoffset:0; }.copy-wire { color:var(--mint); }.completion-diagram .copy-wire text { fill:var(--mint); }
.next-node { opacity:.2; transition:opacity 220ms var(--ease); }.next-node.is-on { opacity:1; }.next-node rect { fill:var(--surface); stroke:var(--line); transition:fill 220ms var(--ease),stroke 220ms var(--ease); }.next-node.is-focus rect { fill:#dfe9ed; stroke:var(--blue); }
.next-reference-pool { opacity:.2; transition:opacity 220ms var(--ease); }.next-reference-pool.is-on { opacity:1; }.next-reference-pool>g { transform:translateX(7px); transition:transform 240ms var(--ease); transition-delay:calc(var(--row)*25ms); }.next-reference-pool.is-on>g { transform:translateX(0); }
.next-evaluation { display:grid; grid-template-columns:1fr 1fr 1.2fr; gap:30px; border-top:1px solid var(--line); border-bottom:1px solid var(--line); min-height:61px; margin-top:5px; }
.next-evaluation>div { display:flex; align-items:center; gap:14px; }.next-evaluation>div+div { border-left:1px solid var(--line); padding-left:30px; }.next-evaluation p { display:flex; flex-direction:column; gap:3px; }.next-evaluation b { font-size:16px; font-weight:500; }.next-evaluation p span { font-size:13px; color:var(--muted); }.region-swatch { width:25px; height:25px; display:block; flex-shrink:0; }.specified { background:#d7e5df; border:1px solid var(--mint); }.unknown { background:repeating-linear-gradient(35deg,#e2e8e7 0px,#e2e8e7 6px,#becbc9 6px,#becbc9 7px); }.evaluation-arrow { font-size:28px; color:var(--line); transition:color 220ms var(--ease); }.next-evaluation.is-on .evaluation-arrow { color:var(--blue); }
.next-mechanism .mechanism-reading { border-top:0; margin-top:5px; }
.history-experiment { height:320px; margin-top:10px; display:grid; grid-template-columns:236px 1fr; gap:42px; }
.fixed-clue h3 { font-size:16px; font-weight:500; height:32px; padding-top:4px; }.fixed-clue>img { width:208px; height:208px; }.fixed-mask { display:flex; align-items:center; gap:16px; margin-top:14px; }.fixed-mask>img { width:46px; height:46px; }.fixed-mask>p { font-size:14px; line-height:1.5; color:var(--muted); }
.trial-header { display:flex; justify-content:space-between; font-size:13px; color:var(--muted); height:32px; align-items:center; }
.history-trial { display:grid; grid-template-columns:25px 220px 143px 25px 77px 1fr; gap:17px; align-items:center; height:93px; border-top:1px solid var(--line); opacity:.2; transform:translateX(8px); transition:opacity 220ms var(--ease),transform 240ms var(--ease); }.history-trial.is-on { opacity:1; transform:translateX(0); }.trial-branch,.trial-arrow { color:var(--blue); font-size:22px; }
.trial-copy b { display:block; font-size:17px; font-weight:500; }.trial-copy small { display:block; color:var(--muted); font-size:12px; margin-top:7px; }
.trial-pair { display:flex; align-items:center; gap:8px; }.trial-pair img { width:58px; height:58px; }.trial-pair>span { font-size:13px; color:var(--blue); }.empty-history { background:var(--surface); height:58px; padding:9px; gap:10px; }.empty-history>span { font-size:30px; color:var(--muted); }.empty-history small { color:var(--muted); font-size:12px; }
.trial-output { width:77px; height:77px; background:repeating-linear-gradient(35deg,#e2e8e7 0px,#e2e8e7 6px,#becbc9 6px,#becbc9 7px); }.trial-output img { width:77px; height:77px; }
.trial-score { text-align:right; opacity:.25; transition:opacity 220ms var(--ease); }.is-scored .trial-score { opacity:1; }.trial-score b { display:block; font:25px var(--mono); }.trial-score small { display:block; color:var(--muted); font-size:12px; }
@media (prefers-reduced-motion:reduce) { * { transition:none!important; } }
</style>
