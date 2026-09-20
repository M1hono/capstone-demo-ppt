<script setup>
import { usePresentationPlayback } from '../composables/usePresentationPlayback'
const {stage,total,playing,runId,reduced,staticMode,play,finish,previous,next,pause,resume,seek}=usePresentationPlayback([400,1600,3000,4400])
const cells=Array.from({length:48},(_,i)=>({x:i%8,y:Math.floor(i/8),specified:[10,11,12,18,19,20,26,27,28].includes(i)}))
const captions=[
  'We first defined what “user preference” means in our task.',
  'When the user explicitly specifies an editing requirement, such as brightening a particular region, reducing saturation, or changing its color.',
  'The system should prioritize and directly follow that explicit instruction.',
  'For regions where the user provides no instruction, or where the instruction is incomplete, the system should use the user’s historical editing behavior.',
  'The system should use the user’s historical editing behavior to infer how those unspecified regions should be processed.',
]
</script>
<template>
  <div class="preference-definition-scene manuscript-scene motion-scene" :data-stage="stage" :data-playing="playing" :data-run="runId">
    <p class="definition-intro">Our recent work focuses on introducing meaningful user modeling into the image enhancement system while maintaining strong quantitative performance.</p>
    <svg viewBox="0 0 1168 352" role="img" aria-label="User preference definition: explicit instructions control specified regions. Historical editing behavior completes unspecified regions. Colored regions are schematic.">
      <defs><marker id="definition-blue-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#437a95"/></marker><marker id="definition-green-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#52796b"/></marker></defs>
      <g class="preference-route" role="button" tabindex="0" aria-label="Explain explicit user edits" @click.stop="seek(2)" @keydown.enter.stop.prevent="seek(2)" @keydown.space.stop.prevent="seek(2)">
        <text x="135" y="30" text-anchor="middle" class="definition-title">Explicit User Edit</text>
        <rect x="0" y="62" width="270" height="151" class="definition-panel"/>
        <text x="20" y="94">Brightening a particular region</text><path d="M20 109 H249" class="definition-rule"/>
        <text x="20" y="141">Reducing saturation</text><path d="M20 156 H249" class="definition-rule"/>
        <text x="20" y="188">Changing its color</text>
        <text x="135" y="255" text-anchor="middle" class="definition-rule-text">Prioritize and directly follow</text><text x="135" y="279" text-anchor="middle" class="definition-rule-text">that explicit instruction</text>
      </g>
      <g class="definition-connection" :class="{'reached':stage>=1}"><path d="M283 135 H417" marker-end="url(#definition-blue-arrow)"/><text x="350" y="114" text-anchor="middle">Specified</text></g>
      <g>
        <text x="588" y="30" text-anchor="middle" class="definition-title">{{stage>=4?'Final Desired Edit':'Current image'}}</text>
        <path d="M439 78 L746 66 L746 279 L439 291z" fill="#d6e0e422" stroke="#c4cfd4"/>
        <rect x="427" y="58" width="308" height="215" class="definition-panel"/>
        <rect v-for="(cell,i) in cells" :key="i" :x="438+cell.x*36" :y="69+cell.y*32" width="33" height="29" class="preference-cell" :class="{'specified':cell.specified && stage>=1,'applied':cell.specified && stage>=2,'completed':!cell.specified && stage>=4}"/>
        <g class="definition-region-legend"><rect x="438" y="315" width="13" height="13" class="legend-specified"/><text x="459" y="327">Specified regions</text><rect x="611" y="315" width="13" height="13" class="legend-completed"/><text x="632" y="327">Unspecified regions</text></g>
      </g>
      <g class="definition-connection history-connection" :class="{'reached':stage>=3}"><path d="M882 188 H756" marker-end="url(#definition-green-arrow)"/><text x="819" y="164" text-anchor="middle">Infer</text></g>
      <g class="preference-route" role="button" tabindex="0" aria-label="Explain preference-based completion" @click.stop="seek(4)" @keydown.enter.stop.prevent="seek(4)" @keydown.space.stop.prevent="seek(4)">
        <text x="1022" y="30" text-anchor="middle" class="definition-title">Historical Editing Behavior</text>
        <g v-for="n in 3" :key="n" :transform="`translate(${904+(n-1)*86},75)`" class="definition-history-pair" :class="{'reached':stage>=3}">
          <rect x="-4" y="-4" width="72" height="83" class="definition-history-back"/><rect width="72" height="83" class="definition-panel"/>
          <rect x="9" y="14" width="23" height="29" class="definition-pair-original"/><rect x="39" y="14" width="23" height="29" class="definition-pair-edit"/>
          <path d="M10 58 H60 M10 67 H45" class="definition-rule"/>
        </g>
        <text x="1022" y="214" text-anchor="middle" class="definition-rule-text">No instruction / incomplete instruction</text>
        <text x="1022" y="255" text-anchor="middle" class="definition-rule-text">Infer how unspecified regions</text><text x="1022" y="279" text-anchor="middle" class="definition-rule-text">should be processed</text>
      </g>
    </svg>
    <div class="mechanism-reading"><p :key="stage">{{captions[stage]}}</p><PlaybackControls v-if="!staticMode" :stage="stage" :total="total" :playing="playing" :reduced="reduced" @previous="previous" @next="next" @pause="pause" @resume="resume" @replay="play" @finish="finish"/></div>
    <p class="mechanism-provenance">Region diagram illustrates the preference definition; it is not a model prediction.</p>
  </div>
</template>
