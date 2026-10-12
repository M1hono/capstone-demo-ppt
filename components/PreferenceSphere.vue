<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  dataUrl: { type: String, default: 'assets/sphere/sphere-data.json' },
  initialSpin: { type: Boolean, default: true },
  // The source viewer exposes image and expert selectors. The optional user
  // prop only chooses the initial expert; the controls remain visible.
  user: { type: String, default: '' },
})

const container = ref(null)
const state = reactive({
  loading: true,
  error: '',
  data: null,
  image: '',
  expert: '',
  expert2: '',
  mode: 'samples', // samples | density | probability
  compare: false,
  spin: props.initialSpin,
  synthetic: false,
  sampleCount: 0,
  candidateCount: 0,
  vectorScale: 1,
  separationDeg: null,
})

const RANK_COLORS = [0xe53935, 0xfb8c00, 0xf4c542]
const entry = computed(() => state.data?.entries?.[state.image]?.[state.expert] ?? null)
const entry2 = computed(() => state.data?.entries?.[state.image]?.[state.expert2] ?? null)
const renders = computed(() => entry.value?.renders ?? null)

let renderer = null
let scene = null
let camera = null
let root = null
let raf = 0
let disposed = false
let resizeObserver = null
let dragging = false
let lastX = 0
let lastY = 0
let rotX = -0.25
let rotY = 0.55
let zoomTarget = 4.6
let zoomCurrent = 4.6
let lastFrame = 0
const SPHERE_OFFSET = 1.22

const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const RAMP = ['#35D6FF', '#4D7CFF', '#8B5CFF', '#D94CFF', '#FF4FA3', '#FF426E', '#FF6B35', '#FFB000', '#FFE23D', '#7BEA55', '#20D6A3'].map(h => new THREE.Color(h))
function rampColor(t) {
  t = Math.max(0, Math.min(0.9999, t))
  return RAMP[Math.floor(t * RAMP.length)]
}

function makeLabelSprite(text, options = {}) {
  const { bold = true, bg = 'rgba(255,255,255,0.94)', fg = '#111', scale = 1, box = true } = options
  const size = 160
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = 72
  const ctx = canvas.getContext('2d')
  if (box) {
    ctx.fillStyle = bg
    ctx.strokeStyle = '#222'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.roundRect(6, 8, size - 12, 56, 14)
    ctx.fill()
    ctx.stroke()
  }
  ctx.fillStyle = fg
  ctx.font = `${bold ? 'bold ' : ''}${30 * scale}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, size / 2, 37)
  const texture = new THREE.CanvasTexture(canvas)
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false }))
  sprite.scale.set(0.5 * scale, 0.225 * scale, 1)
  sprite.renderOrder = 10
  return sprite
}

function dirFromLatLon(lat, lon, r, out) {
  const v = out ?? new THREE.Vector3()
  return v.set(Math.cos(lat) * Math.cos(lon) * r, Math.sin(lat) * r, Math.cos(lat) * Math.sin(lon) * r)
}
function dataDir(v, r = 1) {
  return new THREE.Vector3(v[0], v[2], v[1]).normalize().multiplyScalar(r)
}

function vectorMagnitude(v) {
  return Math.hypot(v?.[0] ?? 0, v?.[1] ?? 0, v?.[2] ?? 0)
}

function vectorScale(ent) {
  const lengths = (ent.mags?.length ? ent.mags : ent.samples.map(vectorMagnitude))
    .map(Number)
    .filter(value => Number.isFinite(value) && value > 1e-8)
    .sort((a, b) => a - b)
  const q99 = lengths.length ? lengths[Math.min(lengths.length - 1, Math.floor(lengths.length * 0.99))] : 0
  return Math.max(q99, vectorMagnitude(ent.gt), 1e-6)
}

function disposeNode(node) {
  node.traverse((n) => {
    if (n.geometry)
      n.geometry.dispose()
    if (n.material) {
      if (n.material.map)
        n.material.map.dispose()
      n.material.dispose()
    }
  })
}

function clearGroup() {
  if (!root)
    return
  for (const child of [...root.children])
    disposeNode(child)
  root.clear()
}

function buildGlobe(g, showRings) {
  // visual3.py keeps the MC sample view open: it has axes and rays, while
  // density/probability views add the three orthogonal reference rings.
  if (showRings) {
    for (let k = 0; k < 3; k++) {
      const pts = []
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2
        const c = Math.cos(a)
        const s = Math.sin(a)
        pts.push(k === 0 ? new THREE.Vector3(c, s, 0) : k === 1 ? new THREE.Vector3(c, 0, s) : new THREE.Vector3(0, c, s))
      }
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x7c9aa5, transparent: true, opacity: 0.46 })))
    }
  }
  // axes
  const axisColors = [0xc33a3a, 0x2980bd, 0x299e53]
  const axisNames = [['+x', '-x'], ['+y', '-y'], ['+z', '-z']]
  for (let k = 0; k < 3; k++) {
    for (const sign of [1, -1]) {
      const dir = new THREE.Vector3()
      dir.setComponent(k, sign)
      const end = dir.clone().multiplyScalar(1.34)
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), end]), new THREE.LineBasicMaterial({ color: axisColors[k], transparent: true, opacity: 0.8 })))
      const label = makeLabelSprite(axisNames[k][sign === 1 ? 0 : 1], { scale: 0.95, fg: '#24414d', box: false })
      label.position.copy(dir.clone().multiplyScalar(1.48))
      g.add(label)
    }
  }
}

function buildSamples(g, ent) {
  const n = ent.samples.length
  const scale = vectorScale(ent)
  const positions = new Float32Array(n * 3)
  const colors = new Float32Array(n * 3)
  const lp = ent.lp ?? []
  let lpMin = Infinity
  let lpMax = -Infinity
  for (const v of lp) {
    lpMin = Math.min(lpMin, v)
    lpMax = Math.max(lpMax, v)
  }
  for (let i = 0; i < n; i++) {
    const s = ent.samples[i]
    const magnitude = Number(ent.mags?.[i] ?? vectorMagnitude(s))
    const radius = magnitude / scale
    positions.set([s[0] * radius * 1.035, s[2] * radius * 1.035, s[1] * radius * 1.035], i * 3)
    const t = lp.length ? (lp[i] - lpMin) / Math.max(1e-9, lpMax - lpMin) : i / n
    const c = rampColor(t)
    colors.set([c.r, c.g, c.b], i * 3)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  g.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.05, vertexColors: true, sizeAttenuation: true })))
}


function arcRing(lat0, lat1, lon0, lon1, r, n = 4) {
  const ring = []
  for (let k = 0; k <= n; k++)
    ring.push(dirFromLatLon(lat0, lon0 + (lon1 - lon0) * k / n, r))
  for (let k = 1; k <= n; k++)
    ring.push(dirFromLatLon(lat0 + (lat1 - lat0) * k / n, lon1, r))
  for (let k = 1; k <= n; k++)
    ring.push(dirFromLatLon(lat1, lon1 - (lon1 - lon0) * k / n, r))
  for (let k = 1; k < n; k++)
    ring.push(dirFromLatLon(lat1 - (lat1 - lat0) * k / n, lon0, r))
  return ring
}

function probabilityCell(v, nlat, nlon) {
  const length = vectorMagnitude(v)
  if (length < 1e-8)
    return -1
  const lat = Math.asin(Math.max(-1, Math.min(1, v[2] / length)))
  const lon = Math.atan2(v[1], v[0])
  const i = Math.max(0, Math.min(nlat - 1, Math.floor(((lat + Math.PI / 2) / Math.PI) * nlat)))
  const j = Math.max(0, Math.min(nlon - 1, Math.floor(((lon + Math.PI) / (Math.PI * 2)) * nlon)))
  return i * nlon + j
}

function probabilityCellColor(ent, i, j, nlat, nlon, f) {
  const index = i * nlon + j
  for (const candidate of ent.candidates ?? []) {
    if (probabilityCell(candidate.z, nlat, nlon) === index)
      return new THREE.Color(RANK_COLORS[(candidate.rank - 1) % RANK_COLORS.length])
  }
  if (probabilityCell(ent.gt, nlat, nlon) === index)
    return new THREE.Color(0xffd447)
  // visual3.py uses a deterministic grey mottle for ordinary probability cells.
  const seed = Math.sin((i + 1) * 12.9898 + (j + 1) * 78.233) * 43758.5453
  const noise = seed - Math.floor(seed)
  const shade = 0.80 + 0.14 * noise - 0.025 * Math.max(0, Math.min(1, f))
  return new THREE.Color(shade, shade, shade)
}

function buildDensity(g, ent, fromProb) {
  // continuous faceted surface (leader's density view): radius follows value, low-poly quads
  const grid = fromProb ? ent.prob : ent.density
  const values = grid.rel ?? grid.counts
  const nlat = grid.lat
  const nlon = grid.lon
  const max = Math.max(...values, 1e-9)
  const RMAX = fromProb ? 1.24 : 1.2
  const positions = []
  const colors = []
  for (let i = 0; i < nlat; i++) {
    for (let j = 0; j < nlon; j++) {
      const f = Math.max(0, Math.min(1, (values[i * nlon + j] ?? 0) / max))
      if (f <= 0)
        continue
      const r = RMAX * f
      const la0 = -Math.PI / 2 + (i / nlat) * Math.PI
      const la1 = -Math.PI / 2 + ((i + 1) / nlat) * Math.PI
      const lo0 = -Math.PI + (j / nlon) * Math.PI * 2
      const lo1 = -Math.PI + ((j + 1) / nlon) * Math.PI * 2
      const ring = fromProb ? arcRing(la0, la1, lo0, lo1, r, 2) : null
      const c = fromProb ? probabilityCellColor(ent, i, j, nlat, nlon, f) : rampColor(f)
      if (fromProb) {
        // discrete radial cell: wall O-a-b + spherical top face + cell outline (leader's prob view)
        const cen = dirFromLatLon((la0 + la1) / 2, (lo0 + lo1) / 2, r)
        for (let k = 0; k < ring.length; k++) {
          const a = ring[k]
          const b = ring[(k + 1) % ring.length]
          positions.push(0, 0, 0, a.x, a.y, a.z, b.x, b.y, b.z)
          positions.push(cen.x, cen.y, cen.z, a.x, a.y, a.z, b.x, b.y, b.z)
          for (let t = 0; t < 6; t++)
            colors.push(c.r, c.g, c.b)
        }
      }
      else {
        // continuous surface: quad between the four corner radii (leader's density view)
        const v = [dirFromLatLon(la0, lo0, RMAX * f), dirFromLatLon(la0, lo1, RMAX * (values[i * nlon + (j + 1) % nlon] ?? 0) / max), dirFromLatLon(la1, lo1, RMAX * (values[(i + 1) * nlon + (j + 1) % nlon] ?? 0) / max), dirFromLatLon(la1, lo0, RMAX * (values[(i + 1) * nlon + j] ?? 0) / max)]
        const tri = (a, b, c2) => {
          positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c2.x, c2.y, c2.z)
          colors.push(c.r, c.g, c.b, c.r, c.g, c.b, c.r, c.g, c.b)
        }
        if (Math.max(...v.map(p => p.length())) > 0.01) {
          tri(v[0], v[1], v[2])
          tri(v[0], v[2], v[3])
        }
      }
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  g.add(new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true, side: THREE.DoubleSide })))
  if (fromProb) {
    // dark grid lines over the discrete cells
    const segs = []
    for (let i = 0; i < nlat; i++) {
      for (let j = 0; j < nlon; j++) {
        const f = Math.max(0, Math.min(1, (values[i * nlon + j] ?? 0) / max))
        if (f <= 0)
          continue
        const r = RMAX * f
        const la0 = -Math.PI / 2 + (i / nlat) * Math.PI
        const la1 = -Math.PI / 2 + ((i + 1) / nlat) * Math.PI
        const lo0 = -Math.PI + (j / nlon) * Math.PI * 2
        const lo1 = -Math.PI + ((j + 1) / nlon) * Math.PI * 2
        const ring = arcRing(la0, la1, lo0, lo1, r, 2)
        for (let k = 0; k < ring.length; k++)
          segs.push(ring[k], ring[(k + 1) % ring.length])
      }
    }
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(segs), new THREE.LineBasicMaterial({ color: 0x111111 })))
  }
}

function buildRay(g, z, length, color, width) {
  const d = dataDir(z)
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(width, width, length, 6), new THREE.MeshBasicMaterial({ color }))
  cyl.position.copy(d.clone().multiplyScalar(length / 2))
  cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d)
  g.add(cyl)
  const tip = new THREE.Mesh(new THREE.BoxGeometry(width * 3.6, width * 3.6, width * 3.6), new THREE.MeshBasicMaterial({ color }))
  tip.position.copy(d.clone().multiplyScalar(length))
  g.add(tip)
}

function buildCandidates(g, ent) {
  const scale = vectorScale(ent)
  for (const cand of ent.candidates ?? []) {
    const color = RANK_COLORS[(cand.rank - 1) % RANK_COLORS.length]
    const length = vectorMagnitude(cand.z) / scale
    buildRay(g, cand.z, length, color, 0.016)
    const label = makeLabelSprite(`Top-${cand.rank}`, { scale: 0.72, bg: 'rgba(247,247,244,0.94)', fg: '#24313a' })
    label.position.copy(dataDir(cand.z, length + 0.12))
    g.add(label)
  }
  if (ent.gt) {
    const length = vectorMagnitude(ent.gt) / scale
    buildRay(g, ent.gt, length, 0x111111, 0.013)
    const label = makeLabelSprite('GT', { scale: 0.62, bg: 'rgba(247,247,244,0.94)', fg: '#24313a' })
    label.position.copy(dataDir(ent.gt, length + 0.14))
    g.add(label)
  }
}

function meanDir(ent) {
  if (!ent?.samples?.length)
    return null
  const m = new THREE.Vector3()
  for (const s of ent.samples)
    m.add(dataDir(s))
  return m.lengthSq() > 1e-12 ? m.normalize() : null
}

function buildEntryGroup(ent, label) {
  const g = new THREE.Group()
  buildGlobe(g, state.mode !== 'samples')
  if (state.mode === 'samples')
    buildSamples(g, ent)
  else
    buildDensity(g, ent, state.mode === 'probability')
  buildCandidates(g, ent)
  if (label) {
    const sprite = makeLabelSprite(label, { scale: 0.82, bg: 'rgba(247,247,244,0.94)', fg: '#24313a' })
    sprite.position.set(0, 1.72, 0)
    g.add(sprite)
  }
  return g
}

function rebuild() {
  if (!root || !state.data)
    return
  clearGroup()
  const ent = entry.value
  if (!ent) {
    state.error = `no entry for ${state.image}${state.expert}`
    return
  }
  state.error = ''
  if (state.compare && entry2.value) {
    const gA = buildEntryGroup(ent, `Expert ${state.expert}`)
    gA.position.x = -SPHERE_OFFSET
    const gB = buildEntryGroup(entry2.value, `Expert ${state.expert2}`)
    gB.position.x = SPHERE_OFFSET
    root.add(gA, gB)
    const a = meanDir(ent)
    const b = meanDir(entry2.value)
    state.separationDeg = a && b ? Math.round((Math.acos(Math.max(-1, Math.min(1, a.dot(b)))) * 180) / Math.PI) : null
    zoomTarget = 6.4
  }
  else {
    root.add(buildEntryGroup(ent, null))
    state.separationDeg = null
    zoomTarget = 4.6
  }
  state.sampleCount = ent.samples.length
  state.candidateCount = (ent.candidates ?? []).length
  state.vectorScale = vectorScale(ent)
  if (zoomCurrent < zoomTarget)
    zoomCurrent = zoomTarget + 0.6 // small intro dolly when switching
}

function tick(time) {
  if (disposed)
    return
  raf = requestAnimationFrame(tick)
  const dt = lastFrame ? Math.min(0.05, (time - lastFrame) / 1000) : 0.016
  lastFrame = time
  if (state.spin && !dragging)
    rotY += dt * 0.22
  root.rotation.set(rotX, rotY, 0)
  zoomCurrent += (zoomTarget - zoomCurrent) * Math.min(1, dt * 4)
  camera.position.setLength(zoomCurrent)
  renderer.render(scene, camera)
}

function onPointerDown(e) {
  dragging = true
  lastX = e.clientX
  lastY = e.clientY
  state.spin = false
  container.value.setPointerCapture(e.pointerId)
}
function onPointerMove(e) {
  if (!dragging)
    return
  rotY += (e.clientX - lastX) * 0.005
  rotX = Math.max(-1.35, Math.min(1.35, rotX + (e.clientY - lastY) * 0.005))
  lastX = e.clientX
  lastY = e.clientY
}
function onPointerUp() {
  dragging = false
}
function onWheel(e) {
  e.preventDefault()
  zoomTarget = Math.max(1.6, Math.min(7.5, zoomTarget * (1 + e.deltaY * 0.001)))
}

onMounted(async () => {
  const canvasHost = container.value
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  canvasHost.appendChild(renderer.domElement)
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
  camera.position.set(0, 0, zoomCurrent)
  scene.add(new THREE.AmbientLight(0xffffff, 0.85))
  const key = new THREE.DirectionalLight(0xffffff, 0.75)
  key.position.set(2.5, 3, 4)
  scene.add(key)
  root = new THREE.Group()
  scene.add(root)

  const resize = () => {
    const w = canvasHost.clientWidth
    const h = canvasHost.clientHeight
    if (!w || !h)
      return
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvasHost)
  resize()

  canvasHost.addEventListener('pointerdown', onPointerDown)
  canvasHost.addEventListener('pointermove', onPointerMove)
  canvasHost.addEventListener('pointerup', onPointerUp)
  canvasHost.addEventListener('pointercancel', onPointerUp)
  canvasHost.addEventListener('wheel', onWheel, { passive: false })

  try {
    const base = import.meta.env.BASE_URL ?? '/'
    const url = props.dataUrl.startsWith('http') || props.dataUrl.startsWith('/') ? props.dataUrl : `${base}${props.dataUrl}`
    const res = await fetch(url)
    if (!res.ok)
      throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    state.data = data
    state.image = data.images[0]
    const requestedExpert = String(props.user || '').replace(/^expert\s*/i, '').toUpperCase()
    state.expert = data.experts.includes(requestedExpert) ? requestedExpert : data.experts[0]
    state.expert2 = data.experts[1] ?? data.experts[0]
    state.synthetic = data.meta?.source === 'synthetic'
    state.spin = props.initialSpin && !reduced
    state.loading = false
    rebuild()
  }
  catch (err) {
    state.loading = false
    state.error = `failed to load sphere data: ${err.message}`
  }
  raf = requestAnimationFrame(tick)
})

watch(() => [state.image, state.expert, state.expert2, state.mode, state.compare], rebuild)

onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(raf)
  resizeObserver?.disconnect()
  clearGroup()
  renderer?.dispose()
  renderer?.domElement?.remove()
})

function nextExpert(current) {
  const list = state.data?.experts ?? []
  return list[(list.indexOf(current) + 1) % list.length]
}

function selectImage(id) {
  state.image = id
}
function selectExpert(id) {
  if (state.compare) {
    state.expert2 = nextExpert(id)
  }
  state.expert = id
}
function selectExpert2(id) {
  state.expert2 = id
}
function selectMode(m) {
  state.mode = m
}
function toggleCompare() {
  state.compare = !state.compare
  if (state.compare && state.expert2 === state.expert)
    state.expert2 = nextExpert(state.expert)
}

const assetUrl = p => `${import.meta.env.BASE_URL ?? '/'}assets/${p}`
</script>

<template>
  <div class="pref-sphere">
    <div class="sphere-controls">
      <div class="chip-row">
        <span class="chip-label">Image</span>
        <button v-for="id in state.data?.images ?? []" :key="id" class="chip" :class="{ active: id === state.image }" @click="selectImage(id)">{{ id }}</button>
      </div>
      <div class="chip-row">
        <span class="chip-label">Expert</span>
        <button v-for="id in state.data?.experts ?? []" :key="id" class="chip" :class="{ active: id === state.expert }" @click="selectExpert(id)">{{ id }}</button>
        <button class="chip" :class="{ active: state.compare }" @click="toggleCompare">Compare</button>
        <template v-if="state.compare">
          <span class="chip-label">vs</span>
          <button v-for="id in state.data?.experts ?? []" :key="id" class="chip chip-alt" :class="{ active: id === state.expert2 }" @click="selectExpert2(id)">{{ id }}</button>
        </template>
      </div>
      <div class="chip-row">
        <span class="chip-label">View</span>
        <button class="chip" :class="{ active: state.mode === 'samples' }" @click="selectMode('samples')">MC samples</button>
        <button class="chip" :class="{ active: state.mode === 'density' }" @click="selectMode('density')">Direction density</button>
        <button class="chip" :class="{ active: state.mode === 'probability' }" @click="selectMode('probability')">Flow probability</button>
        <button class="chip spin" :class="{ active: state.spin }" @click="state.spin = !state.spin">{{ state.spin ? 'Pause spin' : 'Spin' }}</button>
      </div>
    </div>

    <div class="sphere-stage">
      <div ref="container" class="sphere-canvas" role="img" :aria-label="`Phase 2 ${state.mode} view. Drag to rotate, scroll to zoom.`" />
      <aside class="sphere-guide">
        <p class="guide-title">How to read</p>
        <template v-if="state.mode === 'samples'">
          <p><i class="sw sample" />MC samples — colour = log P</p>
          <p><i class="sw c1" /><i class="sw c2" /><i class="sw c3" />Top-1/2/3 candidates</p>
          <p><i class="sw gt" />ground-truth edit</p>
          <p class="guide-note">ray length = |z| / scale<br>scale = {{ state.vectorScale.toFixed(4) }}</p>
        </template>
        <template v-else-if="state.mode === 'density'">
          <p><i class="sw sample" />surface radius = local MC count</p>
          <p><i class="sw c1" /><i class="sw c2" /><i class="sw c3" />Top-1/2/3 candidates</p>
          <p><i class="sw gt" />ground-truth direction</p>
          <p class="guide-note">neighbourhood = 14°<br>radius = count / max</p>
        </template>
        <template v-else>
          <p><i class="sw sample" />surface radius = relative flow P</p>
          <p><i class="sw c1" /><i class="sw c2" /><i class="sw c3" />Top-1/2/3 cells</p>
          <p><i class="sw gt" />ground-truth direction</p>
          <p class="guide-note">grid = 24 × 48<br>radius = exp(log P − max)</p>
        </template>
      </aside>
    </div>

    <div v-if="renders" class="sphere-renders">
      <figure>
        <img :src="assetUrl(renders.original)" alt="Original image">
        <figcaption>Original</figcaption>
      </figure>
      <figure v-for="(r, i) in renders.candidates" :key="i">
        <img :src="assetUrl(r)" :alt="`Top-${i + 1} render`">
        <figcaption>Top-{{ i + 1 }}</figcaption>
      </figure>
      <figure v-if="renders.gt">
        <img :src="assetUrl(renders.gt)" alt="Ground-truth retouched image">
        <figcaption>GT</figcaption>
      </figure>
    </div>

    <div class="sphere-caption">
      <template v-if="state.loading">Loading sphere data…</template>
      <template v-else-if="state.error">{{ state.error }}</template>
      <template v-else>
        <span class="sphere-key">{{ state.image }}<template v-if="state.compare"> · expert {{ state.expert }} vs {{ state.expert2 }}</template><template v-else> · expert {{ state.expert }}</template></span>
        <span v-if="state.compare && state.separationDeg !== null" class="sphere-sep">mean-direction separation <b>{{ state.separationDeg }}°</b></span>
        <span v-else-if="state.mode === 'samples'">{{ state.sampleCount }} flow samples · colour = log-probability · scale = {{ state.vectorScale.toFixed(4) }}</span>
        <span v-else-if="state.mode === 'density'">Monte-Carlo local sample mass ({{ state.data.meta.density_radius_deg }}° cells)</span>
        <span v-else>Discrete flow probability per direction cell ({{ state.data.meta.prob_grid[0] }}×{{ state.data.meta.prob_grid[1] }})</span>
        <span v-if="state.synthetic" class="badge-synthetic">SYNTHETIC PLACEHOLDER — replace via tools/export_sphere_json.py</span>
      </template>
    </div>
  </div>
</template>
