<script setup>
import { ref, watch } from 'vue'
import { usePresentationPlayback } from '../composables/usePresentationPlayback'
const selected=ref('flowers')
const samples={flowers:['Flowers','26.496','0.7949','Muted warm foreground.'],dog:['Dog','32.761','0.9531','Less warm colour cast.'],books:['Books','27.242','0.8946','Brighter interior.']}
const {stage,total,playing,runId,reduced,staticMode,play,finish,previous,next,pause,resume}=usePresentationPlayback([250,1100,1900,2600])
watch(selected,play)
</script>
<template>
  <div class="results-gallery motion-scene" :data-stage="stage" :data-playing="playing" :data-run="runId"><EvidencePlate :sample="selected" :reveal="stage<1?0:stage===1?48:100" :evidence-ready="stage>=3"/><aside><div class="metric-table-head"><span>Example</span><span>PSNR / dB</span><span>SSIM</span></div><button v-for="(row,key) in samples" :key="key" :aria-pressed="key===selected" @click.stop="selected=key"><b>{{row[0]}}</b><span>{{row[1]}}</span><span>{{row[2]}}</span></button><p class="result-reading">{{samples[selected][3]}}</p><PlaybackControls v-if="!staticMode" :stage="stage" :total="total" :playing="playing" :reduced="reduced" @previous="previous" @next="next" @pause="pause" @resume="resume" @replay="play" @finish="finish" /></aside></div>
</template>
