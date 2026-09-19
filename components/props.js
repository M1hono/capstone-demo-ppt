// Stage props for the show deck — procedural, no external assets.
import * as THREE from 'three'

export const C = {
  bg: 0x0b0e14, blue: 0x5f8ddf, coral: 0xdf7d65, mint: 0x79c2ab,
  amber: 0xe0b36a, ink: 0xdfe6f0, dim: 0x5a6674,
}

const canvas2d = (w, h, draw) => {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h
  draw(cv.getContext('2d'), w, h); return cv
}

// A fake "photograph": gradient sky, sun, mountains, water — warm or cool grade.
export function photoTexture(warm = 0) {
  const cv = canvas2d(512, 340, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h * 0.6)
    if (warm > 0.5) { sky.addColorStop(0, '#2c2137'); sky.addColorStop(0.55, '#b0653f'); sky.addColorStop(1, '#e8a45e') }
    else if (warm > 0.15) { sky.addColorStop(0, '#243043'); sky.addColorStop(0.55, '#7a8894'); sky.addColorStop(1, '#c8b79a') }
    else { sky.addColorStop(0, '#16202e'); sky.addColorStop(0.55, '#41576b'); sky.addColorStop(1, '#93a7ae') }
    g.fillStyle = sky; g.fillRect(0, 0, w, h * 0.62)
    g.fillStyle = warm > 0.5 ? '#ffd9a0' : '#cfd8de'
    g.beginPath(); g.arc(w * 0.68, h * 0.3, 26, 0, Math.PI * 2); g.fill()
    g.fillStyle = warm > 0.5 ? '#3a2c33' : '#22303c'
    g.beginPath(); g.moveTo(0, h * 0.62)
    g.lineTo(w * 0.22, h * 0.4); g.lineTo(w * 0.4, h * 0.58); g.lineTo(w * 0.58, h * 0.44)
    g.lineTo(w * 0.78, h * 0.6); g.lineTo(w, h * 0.48); g.lineTo(w, h * 0.62); g.closePath(); g.fill()
    const water = g.createLinearGradient(0, h * 0.62, 0, h)
    water.addColorStop(0, warm > 0.5 ? '#8a5a48' : '#2c3d4c'); water.addColorStop(1, warm > 0.5 ? '#241a20' : '#101a22')
    g.fillStyle = water; g.fillRect(0, h * 0.62, w, h * 0.38)
    g.fillStyle = warm > 0.5 ? '#ffd9a0' : '#cfd8de'
    for (let i = 0; i < 14; i++) g.fillRect(w * 0.68 - 14 + Math.sin(i * 1.7) * 18, h * 0.63 + i * 6, 28 - i, 2)
  })
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t
}

export function buildParticles() {
  const n = 1300, pos = new Float32Array(n * 3), col = new Float32Array(n * 3)
  const tint = [new THREE.Color(C.blue), new THREE.Color(C.coral), new THREE.Color(C.mint), new THREE.Color(C.amber)]
  for (let i = 0; i < n; i++) {
    const r = 6 + Math.random() * 16, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1)
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th); pos[i * 3 + 1] = r * Math.cos(ph) * 0.6; pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th)
    const c = tint[(Math.random() * 4) | 0]
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const mat = new THREE.PointsMaterial({ size: 0.055, vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending })
  const pts = new THREE.Points(geo, mat); pts.userData.spin = 0.012; return pts
}

export function buildCards() {
  const g = new THREE.Group(); const grades = [0, 0.3, 1, 0, 0.55, 1, 0.15, 0.7, 0, 0.45]
  for (let i = 0; i < 10; i++) {
    const m = new THREE.MeshBasicMaterial({ map: photoTexture(grades[i]), transparent: true, opacity: 0.92 })
    const card = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.27), m)
    const a = (i / 10) * Math.PI * 2
    card.position.set(Math.cos(a) * 4.6, Math.sin(i * 1.3) * 1.6, Math.sin(a) * 4.6)
    card.lookAt(0, card.position.y * 0.4, 0)
    card.userData = { bob: Math.random() * Math.PI * 2, baseY: card.position.y }
    g.add(card)
  }
  g.userData.spin = 0.05; return g
}

export function glow(color, size = 0.5) {
  const cv = canvas2d(128, 128, (g) => {
    const rg = g.createRadialGradient(64, 64, 4, 64, 64, 64)
    rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.25, 'rgba(255,255,255,0.65)'); rg.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = rg; g.fillRect(0, 0, 128, 128)
  })
  const t = new THREE.CanvasTexture(cv)
  return new THREE.Sprite(new THREE.SpriteMaterial({ map: t, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, scale: { value: size } }))
}

export function buildOrbs() {
  const g = new THREE.Group()
  const cols = [C.blue, C.coral, C.mint]
  for (let i = 0; i < 3; i++) {
    const orb = new THREE.Group()
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 1), new THREE.MeshStandardMaterial({ color: cols[i], emissive: cols[i], emissiveIntensity: 0.9, roughness: 0.3 }))
    const halo = glow(cols[i], 1); halo.scale.setScalar(2.2); orb.add(core, halo)
    orb.position.set((i - 1) * 2.2, 0.2, 0)
    orb.userData = { phase: i * 2.1 }
    g.add(orb)
  }
  return g
}
