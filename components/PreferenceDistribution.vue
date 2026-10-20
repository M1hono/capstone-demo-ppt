<script setup>
import { computed, nextTick, onScopeDispose, ref, watch } from 'vue'
import { onSlideEnter, onSlideLeave, useIsSlideActive } from '@slidev/client'
import * as THREE from 'three'
import artifacts from '../data/model-artifacts.json'

const host = ref(null)
const active = useIsSlideActive()
const condition = ref('A')
const view = ref('directions')
const yaw = ref(26)
const spinning = ref(false)
const error = ref('')
const media = typeof window === 'undefined' ? null : window.matchMedia('(prefers-reduced-motion: reduce)')
const reduced = ref(media?.matches ?? false)
const recorded = computed(() => artifacts.distribution?.samples?.length > 0)
const points = computed(() => {
  if (recorded.value) return artifacts.distribution.samples
  let seed = condition.value === 'A' ? 7421 : 9728
  const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return (seed + 1) / 4294967297 }
  const normal = () => Math.sqrt(-2 * Math.log(random())) * Math.cos(2 * Math.PI * random())
  const centres = condition.value === 'A' ? [[.8,.45,.3],[-.6,.5,-.35],[.1,-.65,.6]] : [[-.6,-.6,.25],[.6,.2,-.7],[.1,.8,.4]]
  return Array.from({ length: 256 }, (_, i) => centres[i % 3].map(v => v + normal() * .18))
})
let renderer, scene, camera, root, observer, frame = 0, last = 0

function disposeGroup(group) {
  group?.traverse(o => { o.geometry?.dispose(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()) })
}
function line(group, vertices, color = '#8794a5', opacity = .75) {
  const geometry = new THREE.BufferGeometry().setFromPoints(vertices)
  group.add(new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity })))
}
function rings(group) {
  for (let k = 0; k < 3; k++) {
    const vertices = Array.from({ length: 97 }, (_, i) => {
      const a = i / 96 * Math.PI * 2, c = Math.cos(a), s = Math.sin(a)
      return new THREE.Vector3(...(k === 0 ? [c,s,0] : k === 1 ? [c,0,s] : [0,c,s]))
    })
    line(group, vertices)
    const axis = new THREE.Vector3(); axis.setComponent(k, 1.22)
    line(group, [axis.clone().negate(), axis], ['#0f62fe','#007d79','#6929c4'][k], .7)
  }
}
function dots(group, vectors, directions) {
  const max = Math.max(...vectors.map(v => v.length())) || 1
  const positions = [], colors = []
  vectors.forEach((v, i) => {
    const point = directions ? v.clone().normalize() : v.clone().divideScalar(max)
    positions.push(...point.toArray())
    const color = new THREE.Color(['#0f62fe','#007d79','#6929c4'][i % 3])
    // These colours identify illustrative sample groups, not model cluster assignments.
    if (recorded.value) color.set('#0f62fe')
    colors.push(color.r, color.g, color.b)
  })
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  group.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 4, vertexColors: true, sizeAttenuation: false })))
}
function density(group, vectors) {
  const dirs = vectors.filter(v => v.lengthSq() > 0).map(v => v.clone().normalize())
  const dir = (lat,lon) => new THREE.Vector3(Math.cos(lat)*Math.cos(lon),Math.sin(lat),Math.cos(lat)*Math.sin(lon))
  const cells = [], threshold = Math.cos(14*Math.PI/180)
  for (let a=0; a<18; a++) for (let b=0; b<36; b++) {
    const lat0=-Math.PI/2+a*Math.PI/18,lon0=-Math.PI+b*Math.PI/18
    const centre=dir(lat0+Math.PI/36,lon0+Math.PI/36)
    cells.push({lat0,lon0,count:dirs.filter(v=>v.dot(centre)>threshold).length})
  }
  const max=Math.max(1,...cells.map(c=>c.count))
  for (const c of cells) {
    if (!c.count) continue
    const ratio=c.count/max, radius=1+.2*ratio
    const corners=[dir(c.lat0,c.lon0),dir(c.lat0,c.lon0+Math.PI/18),dir(c.lat0+Math.PI/18,c.lon0+Math.PI/18),dir(c.lat0+Math.PI/18,c.lon0)].map(v=>v.multiplyScalar(radius))
    const vertices=[0,1,2,0,2,3].flatMap(i=>corners[i].toArray())
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3))
    const color=new THREE.Color('#b5ceff').lerp(new THREE.Color('#0043ce'),ratio)
    group.add(new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide,transparent:true,opacity:.82})))
  }
}
function rebuild() {
  if (!root) return
  disposeGroup(root);root.clear()
  const vectors=points.value.map(v=>new THREE.Vector3(v[0],v[2],v[1]))
  const left=new THREE.Group(),right=new THREE.Group()
  left.scale.setScalar(1.15);right.scale.setScalar(1.15)
  rings(left);rings(right);dots(left,vectors,false)
  if(view.value==='density')density(right,vectors)
  else dots(right,vectors,true)
  root.add(left,right);resize()
}
function draw() {
  if (!renderer || !root) return
  for(const group of root.children) { group.rotation.y=yaw.value*Math.PI/180;group.rotation.x=-.18 }
  renderer.render(scene,camera)
}
function resize() {
  if (!host.value || !renderer) return
  const {width,height}=host.value.getBoundingClientRect()
  if(!width||!height)return
  renderer.setSize(width,height,false)
  const aspect=width/height;camera.left=-1.62*aspect;camera.right=1.62*aspect;camera.top=1.62;camera.bottom=-1.62;camera.updateProjectionMatrix()
  root.children.forEach((group,i)=>{group.position.x=(i===0?-1:1)*1.62*aspect/2})
  draw()
}
function animate(time) {
  if (!spinning.value || !active.value || reduced.value) return
  if(last)yaw.value=(yaw.value+Math.min(time-last,50)*.012)%360
  last=time;draw();frame=requestAnimationFrame(animate)
}
function stop() { cancelAnimationFrame(frame);last=0;spinning.value=false }
async function init() {
  await nextTick()
  if(!active.value || !host.value)return
  if(renderer){resize();return}
  try {
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setClearColor('#ffffff',1)
    host.value.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','Retouching vectors and directional projection');renderer.domElement.setAttribute('role','img')
    scene=new THREE.Scene();camera=new THREE.OrthographicCamera(-4,4,1.62,-1.62,.1,20);camera.position.set(0,0,8);root=new THREE.Group();scene.add(root)
    observer=new ResizeObserver(resize);observer.observe(host.value);rebuild();resize()
  } catch(err) { error.value='3D rendering is unavailable in this browser. The data and interpretation remain available below.';renderer?.dispose();renderer=null }
}
function preferenceChanged(event){reduced.value=event.matches;if(event.matches)stop()}
media?.addEventListener('change',preferenceChanged)
watch([condition,view],rebuild);watch(yaw,draw)
watch(spinning,v=>{cancelAnimationFrame(frame);last=0;if(v&&!reduced.value&&active.value)frame=requestAnimationFrame(animate)})
watch(active,v=>{if(v)init();else stop()},{immediate:true})
onSlideEnter(init);onSlideLeave(stop)
onScopeDispose(()=>{stop();observer?.disconnect();disposeGroup(root);renderer?.dispose();media?.removeEventListener('change',preferenceChanged)})
</script>
<template><div class="stack distribution"><div class="row spread"><div class="tabs" v-if="!recorded"><button v-for="c in ['A','B']" :key="c" :aria-pressed="condition===c" @click.stop="condition=c">Illustrative condition {{c}}</button></div><div class="tabs"><button :aria-pressed="view==='directions'" @click.stop="view='directions'">Direction samples</button><button :aria-pressed="view==='density'" @click.stop="view='density'">Angular counts</button></div></div><div class="distribution-plot grow"><div ref="host" class="webgl-host"/><div class="plot-labels"><span>Full vectors z · radius preserves relative magnitude</span><span>{{view==='density'?'Sample counts within 14° neighbourhoods':'Unit directions z / ‖z‖'}}</span></div><p v-if="error" class="missing">{{error}}</p></div><div class="row spread"><label class="small row">Rotation <input v-model.number="yaw" type="range" min="0" max="360" aria-label="Distribution rotation" @keydown.stop/></label><button v-if="!reduced" :aria-pressed="spinning" @click.stop="spinning=!spinning">{{spinning?'Pause rotation':'Rotate'}}</button><span class="small muted">{{points.length}} samples · {{recorded?'exported record':'illustrative geometry, not model inference'}}</span></div><p class="note">Angular sample counts are not the flow probability density p(z | c). This view separates vector magnitude from directional concentration. {{recorded?'See the export metadata for run identity.':'Colours mark synthetic sample groups; they are not expert labels or measured clusters.'}}</p></div></template>
<style scoped>.distribution-plot{position:relative;min-height:280px}.webgl-host{position:absolute;inset:0 0 28px}.webgl-host :deep(canvas){width:100%;height:100%;display:block}.plot-labels{position:absolute;bottom:0;left:0;right:0;display:grid;grid-template-columns:1fr 1fr;text-align:center;font-size:13px;color:var(--muted)}.distribution-plot .missing{position:absolute;inset:50px}.distribution input{width:190px}</style>
