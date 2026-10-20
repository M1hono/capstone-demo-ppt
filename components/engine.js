import * as THREE from 'three'

// One shared product, with the same part coordinates in every view.
const palette = { paper: 0xe9eceb, steel: 0xb7c1c6, graphite: 0x303b42, white: 0xf9faf8, blue: 0x4675a5, coral: 0xb16b58, mint: 0x69968a }
let shared

function createEngine() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(palette.paper)
  const camera = new THREE.OrthographicCamera(-6.8, 6.8, 3, -3, .1, 60)
  camera.position.set(7, 9, 12)
  camera.lookAt(0, .3, 0)
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
  renderer.setPixelRatio(1.5)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setSize(1100, 400)
  renderer.domElement.className = 'engine-canvas'
  scene.add(new THREE.HemisphereLight(0xffffff, 0x76838d, 2.3))
  const light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(-3, 12, 6)
  scene.add(light)
  const product = new THREE.Group()
  scene.add(product)
  const parts = []
  const material = (color) => new THREE.MeshStandardMaterial({ color, roughness: .66, metalness: .13 })
  const box = (w, h, d, color, parent, x=0, y=0, z=0) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material(color))
    mesh.position.set(x, y, z)
    parent.add(mesh)
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color: 0x64727b, transparent: true, opacity: .22 }))
    mesh.add(edges)
    return mesh
  }
  box(11.7, .22, 3.45, palette.steel, product, 0, -.18)
  box(11.5, .08, 3.3, palette.white, product, 0, -.025)
  for (const x of [-5.3, 5.3]) for (const z of [-1.3, 1.3]) box(.38, .2, .36, palette.graphite, product, x, -.4, z)
  // Directional signal bus is functional geometry, not an animated particle field.
  box(10.6, .025, .07, palette.blue, product, 0, .035, 1.24)
  const labels = ['INPUT', 'EDIT PAIRS', 'CROSS-ATTN', 'CNN', 'OUTPUT']
  const positions = [-4.65, -2.35, 0, 2.35, 4.65]
  function label(text, group, y=.18) {
    const canvas = document.createElement('canvas'); canvas.width=512; canvas.height=80
    const ctx=canvas.getContext('2d'); ctx.fillStyle='#303b42'; ctx.font='500 33px sans-serif'; ctx.textAlign='center'; ctx.fillText(text,256,52)
    const texture=new THREE.CanvasTexture(canvas)
    const plane=new THREE.Mesh(new THREE.PlaneGeometry(1.86,.30),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}))
    plane.rotation.x=-Math.PI/2;plane.position.set(0,y,1.02);group.add(plane)
  }
  for (let i=0;i<5;i++) {
    const group=new THREE.Group();group.position.x=positions[i];product.add(group)
    box(2.02,.12,2.76,palette.white,group,0,.13)
    label(labels[i],group,.195)
    parts.push(group)
  }
  for (let i=0;i<3;i++) box(1.55,.10,.38,[palette.blue,palette.coral,palette.mint][i],parts[0],0,.35,-.72+i*.53)
  for (let i=0;i<4;i++) box(.29,.22,1.55,[palette.coral,palette.mint,palette.blue,palette.graphite][i],parts[1],-.57+i*.38,.35,-.18)
  for (let row=0;row<8;row++) for(let col=0;col<8;col++) {
    const color = (row<3 && col>2) ? palette.coral : (row+col>10 ? palette.blue : palette.steel)
    box(.18,.035,.18,color,parts[2],-.72+col*.205,.38,-.91+row*.205)
  }
  const layers=[]
  for (let i=0;i<7;i++) layers.push(box(1.62,.10,1.65,i<3?palette.steel:[palette.coral,palette.mint,palette.blue,palette.graphite][i-3],parts[3],0,.35+i*.15,-.12))
  box(1.66,.06,1.7,palette.graphite,parts[4],0,.34,-.15)
  const cartridge=new THREE.Group();product.add(cartridge);cartridge.position.set(.4,1.25,-2.6)
  box(4.1,.26,1.1,palette.graphite,cartridge)
  for(let i=0;i<3;i++)box(.65,.055,.60,palette.mint,cartridge,-1.15+i*1.15,.18)
  label('REFERENCE LEARNING',cartridge,.20)
  cartridge.visible=false
  const photoReady = new THREE.TextureLoader().loadAsync(`${import.meta.env.BASE_URL}assets/evidence/flowers-output.png`).then(texture=>{
    texture.colorSpace=THREE.SRGBColorSpace
    const photo=new THREE.Mesh(new THREE.PlaneGeometry(1.54,1.56),new THREE.MeshBasicMaterial({map:texture}))
    photo.rotation.x=-Math.PI/2;photo.position.set(0,.379,-.15);parts[4].add(photo)
  })
  const state={explode:0,focus:-1,research:false}
  let raf=0
  function terminal(explode,focus,research) {
    parts.forEach((part,i)=>{part.position.y=explode*(i===2?.7:i===3?.35:0);part.position.x=positions[i]*(1+explode*.02)})
    layers.forEach((part,i)=>part.position.y=.35+i*(.15+explode*.07))
    cartridge.visible=research
    product.rotation.y=research?-.08:0
    renderer.render(scene,camera)
  }
  function draw(act, host, still=false) {
    const next={explode:[0,2,4,5,6,8,11].includes(act)?.85:.2,focus:act,research:[5,6,7,8,12].includes(act)}
    if(host){host.appendChild(renderer.domElement);renderer.domElement.style.width='100%';renderer.domElement.style.height='100%'}
    cancelAnimationFrame(raf)
    if(still || matchMedia('(prefers-reduced-motion: reduce)').matches){Object.assign(state,next);terminal(state.explode,state.focus,state.research);return}
    const initial=state.explode,start=performance.now()
    const frame=(now)=>{const t=Math.min(1,(now-start)/260);const ease=1-(1-t)**4;terminal(initial+(next.explode-initial)*ease,next.focus,next.research);if(t<1)raf=requestAnimationFrame(frame);else Object.assign(state,next)}
    raf=requestAnimationFrame(frame)
  }
  return {
    ready:photoReady,
    follow(act,host){draw(act,host)},
    snap(act){
      const previous={...state}
      draw(act,null,true)
      const png=renderer.domElement.toDataURL('image/png')
      Object.assign(state,previous)
      terminal(state.explode,state.focus,state.research)
      return png
    },
  }
}

export function ensureEngine(){return shared??=(createEngine())}
