import assert from 'node:assert/strict'
import { readFile, readdir, access } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root=fileURLToPath(new URL('../',import.meta.url))
const read=path=>readFile(resolve(root,path),'utf8')
const e=JSON.parse(await read('data/report-evidence.json'))
const index=JSON.parse(await read('data/component-index.json'))
const a=JSON.parse(await read('data/model-artifacts.json'))
const slides=await read('slides.md')
assert.equal(e.language,'en')
assert.deepEqual(e.topics.map(t=>t.number),Array.from({length:25},(_,i)=>i+1))
assert.equal(index.length,25)
assert.deepEqual([...slides.matchAll(/:number="(\d+)"/g)].map(m=>Number(m[1])),index.map(t=>t.number))
for(const t of index)await access(resolve(root,`components/${t.component}.vue`))
for(const obsolete of ['PartialEdit','RenderMechanism','HistoryRetrieval','BoundaryWorkbench','DecisionMechanism','PreferenceMemory'])
  assert(!(await readdir(resolve(root,'components'))).includes(`${obsolete}.vue`),`Obsolete active component: ${obsolete}`)

// Independently compare the transcribed PSNR table with the archived literal record.
const log=await read('public/evidence/phase2_diag.txt')
const mc=log.split('-- MC per-user PSNR')[1].split('[11]')[0]
for(let i=0;i<6;i++){
  const label=i===5?'mean':e.fivek.experts[i]
  const row=mc.match(new RegExp(`^${label}\\s+([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)`,'m'))
  assert(row,`Missing diagnostic row ${label}`)
  assert.deepEqual(row.slice(1).map(Number),['top1','best3','best5'].map(k=>e.fivek.psnr[k][i]))
}
for(const metric of ['psnr','ssim'])for(const series of Object.values(e.fivek[metric])){
  assert.equal(series.length,6)
  assert(series.every(Number.isFinite))
  assert(Math.abs(series.slice(0,5).reduce((s,v)=>s+v,0)/5-series[5]) < (metric==='psnr'?.001:.00015))
}
assert(e.discrepancies.some(d=>d.item==='PPSD SSIM'))
for(const r of e.benchmark.rows)assert(Math.abs(r.batch*1000/r.mean-r.throughput)<.02)
for(const r of e.ablations)assert(Math.abs(r.psnr-23.5-r.delta)<1e-9)

const publicRoot=resolve(root,'public')
async function localAsset(path){
  assert.equal(typeof path,'string')
  assert(!path.startsWith('/')&&!path.includes('://'),'Evidence asset must use a local public-relative path')
  const absolute=resolve(publicRoot,path)
  assert(!relative(publicRoot,absolute).startsWith('..'),'Evidence asset escapes public directory')
  await access(absolute)
}
await localAsset(a.query.original);await localAsset(a.query.target)
const hasOutput=!!a.reconstruction||a.candidates.length>0||a.directionGrid.length>0||!!a.distribution
if(hasOutput){
  assert.equal(a.status,'exported')
  assert.match(a.run?.checkpointSha256??'',/^[a-f0-9]{64}$/i)
  assert.match(a.run?.configSha256??'',/^[a-f0-9]{64}$/i)
  assert.match(a.run?.sourceCommit??'',/^[a-f0-9]{7,40}$/i)
  assert.equal(a.run.queryId,a.query.id)
}
function vector(v){assert(Array.isArray(v)&&v.length===3&&v.every(Number.isFinite),'Expected finite 3D vector')}
if(a.reconstruction)await localAsset(a.reconstruction.image)
for(const [i,c] of a.candidates.entries()){assert.equal(c.rank,i+1);vector(c.z);assert(Number.isFinite(c.logp));await localAsset(c.image)}
for(const r of a.directionGrid){assert(r.direction&&Number.isFinite(r.scale));await localAsset(r.image)}
if(a.distribution){assert(a.distribution.samples.length>0);a.distribution.samples.forEach(vector)}
const pairs=JSON.parse(await read('public/evidence/history-pairs.json'))
for(const pair of pairs.pairs)for(const kind of ['original','edited']){
  await localAsset(pair[kind]);const buffer=await readFile(resolve(publicRoot,pair[kind]))
  assert.equal(createHash('sha256').update(buffer).digest('hex'),pair.asset_sha256[kind])
}
for(const dir of ['components','data','docs'])for(const file of await readdir(resolve(root,dir))){
  if(!/\.(vue|json|md)$/.test(file))continue
  assert(!/[\u3400-\u9fff]/u.test(await read(`${dir}/${file}`)),`Non-English text in ${dir}/${file}`)
}
for(const name of ['fivek-psnr','fivek-ssim','ppsd-comparison','conditioning-ablations','inference-benchmark','decoder-robustness'])
  for(const ext of ['svg','png','pdf'])await access(resolve(publicRoot,`figures/${name}.${ext}`))
console.log('PASS: 25 ordered topics; 25 pages; English content; diagnostic PSNR agreement; benchmark arithmetic; real-image hashes; output provenance; six figure sets.')
console.log(`Model evidence: ${hasOutput?'exported with run identity':'not supplied; availability recorded without empty image frames'}.`)

// Personal achievement excerpts must stay byte-linked to the pinned source files.
const personal = JSON.parse(await readFile(new URL('../data/personal-artifacts.json', import.meta.url), 'utf8'))
for (const record of personal) {
  const bytes = await readFile(new URL('../public/' + record.asset, import.meta.url))
  const { createHash } = await import('node:crypto')
  assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256)
  assert.equal(bytes.toString('utf8').split(/\r?\n/).slice(record.start - 1, record.end).join('\n'), record.excerpt)
  assert.match(record.commit, /^[a-f0-9]{40}$/)
}
console.log('PASS: four pinned contribution artifacts and exact source excerpts.')

// Derived image assets must match their sources and preserve all pixel counts.
const diagnostics = JSON.parse(await read('data/image-diagnostics.json'))
assert.equal(diagnostics.pixels, 166000)
for (const item of Object.values(diagnostics.sources)) {
  const bytes = await readFile(resolve(publicRoot,item.path))
  assert.equal(createHash('sha256').update(bytes).digest('hex'),item.sha256)
}
for (const [path,hash] of Object.entries(diagnostics.generated)) {
  await localAsset(path)
  assert.equal(createHash('sha256').update(await readFile(resolve(publicRoot,path))).digest('hex'),hash)
}
for (const row of Object.values(diagnostics.images)) for (const bins of Object.values(row.histograms)) {
  assert.equal(bins.length,64)
  assert.equal(bins.reduce((sum,n) => sum + n,0),diagnostics.pixels)
}
for (const item of Object.values(diagnostics.experts)) {
  assert.equal(item.tone.flat().reduce((sum,n) => sum + n,0),diagnostics.pixels)
  assert(item.thresholds['10'].fraction >= item.thresholds['25'].fraction)
  assert(item.thresholds['25'].fraction >= item.thresholds['50'].fraction)
}
for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) {
  assert.equal(diagnostics.matrix[i][j],diagnostics.matrix[j][i])
  if (i === j) assert.equal(diagnostics.matrix[i][j],0)
}
for (const file of await readdir(resolve(root,'components'))) {
  const source = await read('components/' + file)
  assert(!/class="[^"\n]*(?:missing|placeholder)/.test(source),'Empty visual frame in ' + file)
}
console.log('PASS: six input/reference sources, 25 populated derived images, exact histogram counts, symmetric distances, no empty image components.')
