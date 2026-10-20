<script setup>
import { computed } from 'vue'
import { memoryPairs } from '../data/history-examples'
import { usePresentationPlayback } from '../composables/usePresentationPlayback'
const base=import.meta.env.BASE_URL
const props=defineProps({mode:{type:String,default:'compress'}})
const query=computed(()=>props.mode==='query')
const arrowId=computed(()=>`memory-${props.mode}-arrow`)
const {stage,total,playing,runId,reduced,staticMode,play,finish,previous,next,pause,resume}=usePresentationPlayback([400,1600,2900,4300])
const captions=computed(()=>query.value?["For regions that the user has not explicitly specified, the model will extract query features describing the current visual situation.", "The User Preference Memory will provide latent key and value representations.", "Current Unspecified Region → Query. Latent User Preference Memory → Key and Value.", "Query × Preference Memory → Relevant Historical Preference.", "The retrieved preference representation can then be combined with the user’s explicit current edit to generate the final personalized result."]:["Our next step is to compress the user’s historical editing behavior into a set of latent memory slots.", "A large collection of historical image-edit pairs → a compact latent user preference memory.", "These memory slots do not need manually assigned semantic labels.", "A user’s historical editing behavior could be encoded into K latent memory slots, where each slot contains a D-dimensional dense representation.", "When the image is in a particular visual situation, this user tends to apply a particular type of editing behavior."])
</script>
<template>
  <div class="memory-scene technical-scene motion-scene" :data-stage="stage" :data-playing="playing" :data-run="runId" :style="{'--memory-arrow':`url(#${arrowId})`}">
    <svg v-if="!query" viewBox="0 0 1168 382" role="img" aria-label="Proposed memory construction: encode historical edit pairs and compress them into K latent slots of D dimensions each.">
      <defs><marker :id="arrowId" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="#437a95"/></marker></defs>
      <g class="compress-history memory-group reached">
        <text x="145" y="25" text-anchor="middle" class="memory-label">User editing history</text>
        <g v-for="(pair,i) in memoryPairs" :key="pair.id" :transform="`translate(${10+i%2*149},${60+Math.floor(i/2)*108})`">
          <rect class="memory-unit" width="137" height="88"/>
          <image :href="`${base}${pair.original}`" x="5" y="9" width="61" height="49" preserveAspectRatio="xMidYMid meet"/>
          <image :href="`${base}${pair.edited}`" x="72" y="9" width="61" height="49" preserveAspectRatio="xMidYMid meet"/>
          <text x="35" y="77" text-anchor="middle" class="memory-small">I{{i+1}}</text><text x="102" y="77" text-anchor="middle" class="memory-small">G{{i+1}}</text>
        </g>
        <text x="145" y="291" text-anchor="middle" class="memory-shape">⋯ (Iₙ, Gₙ)</text>
        <text x="145" y="333" text-anchor="middle" class="memory-small">Complete historical collection</text>
      </g>
      <g class="memory-group" :class="{'reached':stage>=1}">
        <path class="memory-edge" d="M307 162 H372"/>
        <rect x="384" y="110" width="184" height="104" class="memory-unit"/>
        <text x="476" y="153" text-anchor="middle" class="memory-label">Edit encoder</text>
        <text x="476" y="186" text-anchor="middle" class="memory-shape">e(Iⱼ,Gⱼ)</text>
      </g>
      <g class="memory-group" :class="{'reached':stage>=2}">
        <path class="memory-edge" d="M579 162 H636"/>
        <g v-for="n in 3" :key="n" :transform="`translate(${644+n*7},${115-n*7})`"><path class="memory-slot" d="M0 0 L137 0 L137 108 L0 108z"/></g>
        <text x="730" y="147" text-anchor="middle" class="memory-label">Learned</text><text x="730" y="177" text-anchor="middle" class="memory-label">compression</text>
        <text x="730" y="257" text-anchor="middle" class="memory-small">No hand-labelled styles</text>
        <path class="memory-edge" d="M817 162 H876"/>
      </g>
      <g class="memory-group" :class="{'reached':stage>=3}">
        <text x="1020" y="25" text-anchor="middle" class="memory-label">Preference memory U</text>
        <text x="1031" y="64" text-anchor="middle" class="memory-shape">D dimensions</text>
        <g v-for="n in 5" :key="n" :transform="`translate(908,${82+(n-1)*41})`">
          <rect class="memory-slot" width="239" height="33"/>
          <text x="25" y="23" text-anchor="middle" class="memory-shape">{{n===5?'K':n}}</text>
          <path d="M47 0 V33" stroke="#8aa2af"/><text x="144" y="23" text-anchor="middle" class="memory-shape">u₁ · u₂ · ⋯ · uᴅ</text>
        </g>
        <text x="1027" y="313" text-anchor="middle" class="memory-symbol">U: [K,D]</text>
      </g>
      <g class="memory-group" :class="{'reached':stage>=4}">
        <path d="M897 333 H1158" stroke="#8aa2af"/>
        <text x="1027" y="361" text-anchor="middle" class="memory-small">Store per user · reuse at inference</text>
      </g>
    </svg>
    <svg v-else viewBox="0 0 1168 382" role="img" aria-label="Proposed inference: unspecified regions provide queries and the stored preference memory supplies keys and values. Attention yields preference features that combine with explicit edits.">
      <defs><marker :id="arrowId" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="#437a95"/></marker></defs>
      <g>
        <text x="127" y="24" text-anchor="middle" class="memory-label">Unspecified regions</text>
        <rect x="13" y="54" width="228" height="151" class="memory-unit"/>
        <image :href="`${base}assets/history-pairs/unspecified-query.png`" x="51" y="54" width="151" height="151" preserveAspectRatio="xMidYMid meet"/>
        <text x="127" y="236" text-anchor="middle" class="memory-shape">M = 0 → Q</text>
        <text x="127" y="265" text-anchor="middle" class="memory-small">Shaded: specified region</text>
        <path class="memory-edge" d="M253 125 H420"/><text x="335" y="105" text-anchor="middle" class="memory-shape">Query features</text>
      </g>
      <g class="memory-group" :class="{'reached':stage>=1}">
        <text x="560" y="24" text-anchor="middle" class="memory-label">User memory U</text>
        <g v-for="n in 6" :key="n"><rect :x="431+(n-1)*43" y="51" width="35" height="47" class="query-slot" :class="{'selected':stage>=2 && (n===2 || n===4)}"/></g>
        <text x="766" y="80" class="memory-shape">K × D</text>
        <path class="memory-edge" d="M560 105 V140"/><text x="581" y="128" class="memory-shape">Kᵤ, Vᵤ</text>
      </g>
      <g class="memory-group" :class="{'reached':stage>=2}">
        <path class="memory-edge" d="M422 125 V195 H431"/>
        <rect x="442" y="151" width="236" height="90" class="memory-unit"/>
        <text x="560" y="189" text-anchor="middle" class="memory-label">Cross-attention</text>
        <text x="560" y="220" text-anchor="middle" class="memory-shape">softmax(QKᵤᵀ / √d)</text>
      </g>
      <g class="memory-group" :class="{'reached':stage>=3}">
        <path class="memory-edge" d="M689 196 H846"/><text x="770" y="174" text-anchor="middle" class="memory-shape">A · Vᵤ</text>
        <rect x="858" y="151" width="289" height="90" class="memory-slot"/>
        <text x="1002" y="189" text-anchor="middle" class="memory-label">Preference feature</text>
        <text x="1002" y="220" text-anchor="middle" class="memory-small">Conditioned on each query region</text>
      </g>
      <g class="memory-group" :class="{'reached':stage>=4}">
        <path class="memory-edge" d="M1002 253 V300"/>
        <text x="126" y="340" text-anchor="middle" class="memory-label">Explicit edit P + mask M</text>
        <path class="memory-edge" d="M275 333 H845"/>
        <text x="551" y="316" text-anchor="middle" class="memory-small">Preserve specified edits</text>
        <rect x="858" y="311" width="289" height="55" class="memory-unit"/>
        <text x="1002" y="346" text-anchor="middle" class="memory-label">Completed image</text>
      </g>
    </svg>
    <div class="mechanism-reading"><p :key="stage">{{captions[stage]}}</p><PlaybackControls v-if="!staticMode" :stage="stage" :total="total" :playing="playing" :reduced="reduced" @previous="previous" @next="next" @pause="pause" @resume="resume" @replay="play" @finish="finish"/></div>
    <p class="mechanism-provenance">{{query?'Illustrative query mask · proposed memory query, no experimental memory results yet.':'Original I → Expert C G · real FiveK examples; memory construction is proposed.'}}</p>
  </div>
</template>
