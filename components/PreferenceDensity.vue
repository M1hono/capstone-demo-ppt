<script setup>
import { nextTick, onMounted, onScopeDispose, ref, watch } from 'vue'
import { onSlideEnter, useIsSlideActive } from '@slidev/client'
import * as THREE from 'three'

const canvas = ref(null)
const webglCanvas = ref(null)
const active = useIsSlideActive()
const fallback = ref(false)
let renderer
let scene
let camera
let material
let geometry
let resizeObserver
let resizeFrame = 0
let measuredWidth = 0
let measuredHeight = 0

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;

  float gaussian(vec2 point, vec2 centre, vec2 spread) {
    vec2 delta = (point - centre) / spread;
    return exp(-0.5 * dot(delta, delta));
  }

  vec3 colourRamp(float value) {
    vec3 low = vec3(0.43, 0.63, 0.84);
    vec3 cool = vec3(0.66, 0.82, 0.93);
    vec3 warm = vec3(0.96, 0.79, 0.35);
    vec3 high = vec3(0.84, 0.22, 0.16);
    vec3 colour = mix(vec3(0.985, 0.992, 0.985), low, smoothstep(0.04, 0.26, value));
    colour = mix(colour, cool, smoothstep(0.26, 0.44, value));
    colour = mix(colour, warm, smoothstep(0.44, 0.70, value));
    colour = mix(colour, high, smoothstep(0.70, 0.98, value));
    return colour;
  }

  void main() {
    float left = 54.0 / 640.0;
    float top = 99.0 / 430.0;
    float width = 444.0 / 640.0;
    float height = 247.0 / 430.0;
    float x = (vUv.x - left) / width;
    float y = (1.0 - vUv.y - top) / height;

    if (x < 0.0 || x > 1.0 || y < 0.0 || y > 1.0) discard;

    vec2 point = vec2(x, y);
    float firstPeak = gaussian(point, vec2(0.29, 0.42), vec2(0.14, 0.18));
    float secondPeak = gaussian(point, vec2(0.69, 0.65), vec2(0.15, 0.19));
    float density = clamp(firstPeak * 1.04 + secondPeak * 0.98, 0.0, 1.0);
    vec3 colour = colourRamp(density);

    float contourPhase = abs(fract(density * 10.0) - 0.5);
    float contour = smoothstep(0.045, 0.0, contourPhase) * smoothstep(0.055, 0.16, density);
    colour = mix(colour, vec3(0.22, 0.43, 0.60), contour * 0.46);

    gl_FragColor = vec4(colour, 1.0);
  }
`

function drawFallback() {
  const target = canvas.value
  const host = target?.parentElement
  if (!target || !host) return
  const bounds = { width: host.clientWidth, height: host.clientHeight }
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  target.width = Math.max(1, Math.round(bounds.width * dpr))
  target.height = Math.max(1, Math.round(bounds.height * dpr))
  const context = target.getContext('2d')
  if (!context) return
  context.setTransform(dpr, 0, 0, dpr, 0, 0)
  context.clearRect(0, 0, bounds.width, bounds.height)

  const sx = bounds.width / 640
  const sy = bounds.height / 430
  const plot = { x: 54 * sx, y: 99 * sy, width: 444 * sx, height: 247 * sy }
  const base = context.createLinearGradient(0, plot.y, 0, plot.y + plot.height)
  base.addColorStop(0, '#fbfcfb')
  base.addColorStop(1, '#f4f8f8')
  context.fillStyle = base
  context.fillRect(plot.x, plot.y, plot.width, plot.height)

  const glow = (x, y, radius, colours) => {
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius)
    colours.forEach(([stop, colour]) => gradient.addColorStop(stop, colour))
    context.fillStyle = gradient
    context.beginPath()
    context.ellipse(x, y, radius, radius * 0.72, 0, 0, Math.PI * 2)
    context.fill()
  }
  glow(plot.x + plot.width * .29, plot.y + plot.height * .42, plot.width * .23, [
    [0, 'rgba(219,65,48,.95)'], [.2, 'rgba(242,130,67,.9)'], [.45, 'rgba(246,202,88,.72)'],
    [.72, 'rgba(137,187,224,.38)'], [1, 'rgba(120,171,221,0)']
  ])
  glow(plot.x + plot.width * .69, plot.y + plot.height * .65, plot.width * .24, [
    [0, 'rgba(224,75,51,.92)'], [.2, 'rgba(242,139,74,.88)'], [.45, 'rgba(246,204,99,.7)'],
    [.74, 'rgba(132,184,223,.36)'], [1, 'rgba(111,165,220,0)']
  ])
  context.save()
  context.globalCompositeOperation = 'multiply'
  context.strokeStyle = 'rgba(73,128,167,.55)'
  context.lineWidth = Math.max(0.7, sx)
  for (const [cx, cy, rx, ry] of [[.29, .42, .22, .27], [.69, .65, .23, .28]]) {
    for (let i = 1; i <= 4; i++) {
      context.beginPath()
      context.ellipse(plot.x + plot.width * cx, plot.y + plot.height * cy, plot.width * rx * i / 4, plot.height * ry * i / 4, 0, 0, Math.PI * 2)
      context.stroke()
    }
  }
  context.restore()
}

function resize() {
  const host = canvas.value?.parentElement
  if (!canvas.value || !host) return
  if (fallback.value) {
    drawFallback()
    return
  }
  // Slidev scales the whole slide with a transform. Its visual bounding box
  // must never be fed back into the canvas's intrinsic layout dimensions.
  const bounds = { width: host.clientWidth, height: host.clientHeight }
  if (!bounds.width || !bounds.height || !renderer) return
  const width = Math.round(bounds.width)
  const height = Math.round(bounds.height)
  if (width === measuredWidth && height === measuredHeight) {
    renderer.render(scene, camera)
    return
  }
  measuredWidth = width
  measuredHeight = height
  renderer.setSize(width, height, false)
  renderer.render(scene, camera)
}

function scheduleResize() {
  cancelAnimationFrame(resizeFrame)
  resizeFrame = requestAnimationFrame(() => {
    resizeFrame = 0
    resize()
  })
}

async function init() {
  await nextTick()
  if (!active.value || !canvas.value) return
  if (renderer || fallback.value) {
    resize()
    return
  }
  fallback.value = true
  drawFallback()
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: webglCanvas.value,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    scene = new THREE.Scene()
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    geometry = new THREE.PlaneGeometry(2, 2)
    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false
    })
    scene.add(new THREE.Mesh(geometry, material))
    fallback.value = false
    resize()
    if (!renderer.info.programs?.length) throw new Error('Density shader did not compile')
  } catch {
    fallback.value = true
    renderer?.dispose()
    renderer = null
    drawFallback()
  }
}

onMounted(() => {
  resizeObserver = new ResizeObserver(scheduleResize)
  resizeObserver.observe(canvas.value.parentElement)
  init()
})
watch(active, value => {
  if (value) init()
})
onSlideEnter(init)
onScopeDispose(() => {
  cancelAnimationFrame(resizeFrame)
  resizeObserver?.disconnect()
  geometry?.dispose()
  material?.dispose()
  renderer?.dispose()
})
</script>

<template>
  <div class="stack preference-density">
    <div class="density-layout grow">
      <aside class="density-copy">
        <div class="retrieval"><strong>≈30%</strong><span>Early similarity-retrieval accuracy</span></div>
        <h2>Similarity alone<br>is not enough.</h2>
        <p class="formula">P(z | image, history)</p>
        <p class="density-note">A continuous retouching space allows more than one plausible edit to coexist.</p>
      </aside>
      <div class="density-visual">
        <figure class="density-figure">
          <div class="density-art">
            <canvas ref="webglCanvas" v-show="!fallback" class="density-webgl-canvas" aria-hidden="true"></canvas>
            <canvas ref="canvas" class="density-canvas" :class="{ visible: fallback }" aria-hidden="true"></canvas>
          <svg viewBox="0 0 640 430" role="img" aria-label="Two-dimensional preference density with two high-density regions, an answer image sample and multiple valid preference modes">
            <defs>
              <linearGradient id="density-legend" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stop-color="#2d68b0"/>
                <stop offset="32%" stop-color="#83bce8"/>
                <stop offset="58%" stop-color="#f4d263"/>
                <stop offset="79%" stop-color="#ef8746"/>
                <stop offset="100%" stop-color="#d84438"/>
              </linearGradient>
              <marker id="density-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0 0 L8 4 L0 8 Z" fill="#20272d"/>
              </marker>
            </defs>
            <rect x="8" y="8" width="624" height="414" rx="8" fill="transparent" stroke="var(--line)"/>
            <text x="320" y="31" text-anchor="middle" class="density-title">Proposed Hypothesis: Preference is a Continuous</text>
            <text x="320" y="49" text-anchor="middle" class="density-title">Probability Density</text>
            <text x="34" y="78" class="density-subtitle">User preference distribution in retouching space (2D example)</text>
            <rect x="54" y="99" width="444" height="247" class="density-plot-frame"/>
            <g class="density-axes">
              <path d="M54 346 H502" marker-end="url(#density-arrow)"/>
              <path d="M54 346 V99" marker-end="url(#density-arrow)"/>
              <text x="45" y="107">y</text>
              <text x="508" y="356">x</text>
            </g>
            <g class="density-samples">
              <circle cx="183" cy="202" r="6"/>
              <text x="198" y="196">z₂</text>
              <circle cx="361" cy="260" r="6"/>
              <text x="376" y="254">z₃</text>
            </g>
            <g class="density-annotations">
              <path d="M100 135 C112 158 126 171 153 181" marker-end="url(#density-arrow)"/>
              <text x="72" y="119">High-density region =</text>
              <text x="72" y="134">more preferred</text>
              <path d="M432 214 C414 228 398 240 378 252" marker-end="url(#density-arrow)"/>
              <text x="438" y="209">Answer image</text>
              <path d="M493 316 C457 300 430 286 401 274" marker-end="url(#density-arrow)"/>
              <text x="409" y="328">Multiple valid</text>
              <text x="409" y="343">preference modes</text>
            </g>
            <g class="density-legend">
              <rect x="550" y="129" width="15" height="144" fill="url(#density-legend)" stroke="#345a80"/>
              <text x="575" y="140">High</text>
              <text x="575" y="274">Low</text>
              <text x="574" y="112" class="legend-title">Preference</text>
              <text x="574" y="124" class="legend-title">probability</text>
            </g>
            <text x="34" y="378" class="density-note-line">The answer image is only one sample located in a high-density region;</text>
            <text x="34" y="394" class="density-note-line">other nearby or separate high-density regions may also represent valid user preferences.</text>
          </svg>
          </div>
        </figure>
        <aside class="density-callout">
          <span class="callout-label">READ THE MAP</span>
          <div><i class="swatch warm"></i><b>High density</b><p>More plausible retouching region.</p></div>
          <div><i class="swatch cool"></i><b>Low density</b><p>Less likely under the learned distribution.</p></div>
          <div class="callout-formula"><b>z = (x, y)</b><span>Each point is a possible retouching solution.</span></div>
        </aside>
      </div>
    </div>
    <p class="readout">One recorded edit is an observation; a conditional density can represent several possible edits.</p>
    <p class="source-caption">Conceptual density. A single recorded target cannot validate every candidate preference.</p>
  </div>
</template>
<style scoped>
.preference-density{gap:14px}
.density-layout{display:grid;grid-template-columns:300px 1fr;gap:24px;align-items:center}
.density-copy{display:grid;align-content:center;gap:20px;padding-right:8px}
.retrieval{display:grid;gap:5px}
.retrieval strong{font:650 76px/1 Saira;color:var(--blue);letter-spacing:-2px}
.retrieval span{font-size:16px;color:var(--muted)}
.density-copy h2{font-size:31px;line-height:1.15;margin:0;letter-spacing:-.5px}
.density-copy .formula{font-size:21px;color:var(--teal)}
.density-note{font-size:16px;line-height:1.45;color:var(--muted)}
.density-visual{display:grid;grid-template-columns:minmax(0,1fr) 166px;gap:14px;align-items:center;min-width:0}
.density-figure{margin:0;min-width:0;padding:8px 10px 6px;background:var(--panel);border:1px solid var(--line);border-radius:8px;box-shadow:0 6px 18px rgba(32,39,45,.06)}
.density-art{position:relative;width:100%;aspect-ratio:640 / 430}
.density-canvas,.density-webgl-canvas,.density-art svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.density-canvas{z-index:0;display:none}
.density-canvas.visible{display:block}
.density-webgl-canvas{z-index:0}
.density-art svg{z-index:1}
.density-art svg text{font-family:Arial,sans-serif}
.density-title{font-size:15px;font-weight:700;fill:var(--ink)!important}
.density-subtitle{font-size:13px;font-weight:600;fill:var(--ink)!important}
.density-plot-frame{fill:transparent;stroke:#b8cbd5;stroke-width:1}
.density-axes path{fill:none;stroke:var(--ink);stroke-width:1.5}
.density-axes text{font-size:14px;font-style:normal;fill:var(--ink)!important}
.density-samples circle{fill:var(--ink)}
.density-samples text{font-size:16px;font-weight:700;fill:var(--ink)!important}
.density-annotations path{fill:none;stroke:var(--ink);stroke-width:1.3}
.density-annotations text{font-size:13px;font-weight:600;fill:var(--ink)!important}
.density-legend text{font-size:11px;fill:var(--muted)!important}
.density-legend .legend-title{font-size:10px}
.density-note-line{font-size:11px;fill:var(--ink)!important}
.density-callout{display:grid;gap:17px;padding:4px 0}
.callout-label{font:650 11px/1.2 Saira;letter-spacing:1.2px;color:var(--teal)}
.density-callout>div{display:grid;grid-template-columns:12px 1fr;column-gap:8px;align-items:start}
.density-callout b{font-size:14px;line-height:1.2}
.density-callout p,.callout-formula span{grid-column:2;margin:3px 0 0;font-size:13px;line-height:1.35;color:var(--muted)}
.swatch{width:12px;height:12px;margin-top:2px;border-radius:50%;background:linear-gradient(135deg,#f39b68,#e44f3d)}
.swatch.cool{background:linear-gradient(135deg,#79b6ef,#2b69b0)}
.density-callout>.callout-formula{grid-template-columns:1fr;border-top:1px solid var(--line);padding-top:13px;margin-top:2px}
.callout-formula b{font:600 18px/1.1 Menlo,Consolas,monospace;color:var(--blue);white-space:nowrap}
.callout-formula span{grid-column:1}
.readout{font-size:17px;line-height:1.4}
.source-caption{font-size:13px;line-height:1.4;color:var(--muted)}
</style>
