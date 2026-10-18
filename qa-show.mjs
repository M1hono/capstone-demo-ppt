import { chromium } from 'playwright-chromium'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const base=(process.env.SHOW_BASE??'http://127.0.0.1:18341').replace(/\/$/,'')
const index=JSON.parse(await readFile(new URL('./data/component-index.json',import.meta.url),'utf8'))
const output=new URL('./exports/previews/',import.meta.url)
await mkdir(output,{recursive:true})
const browser=await chromium.launch({headless:true})
const page=await browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1})
const errors=[];const report=[]
page.on('pageerror',e=>errors.push(e.message))
page.on('console',m=>{if(m.type()==='error'||/Failed to resolve component/.test(m.text()))errors.push(m.text())})
page.on('response',r=>{if(r.status()>=400)errors.push(`HTTP ${r.status()} ${r.url()}`)})
const section=n=>page.locator(`section[data-topic="${n}"]`)
async function checkLayout(n,label='default'){
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1200)
  await section(n).locator('img').evaluateAll(images => Promise.all(images.map(img => img.decode().catch(() => {}))))
  const result=await section(n).evaluate(slide=>{
    const bounds=slide.getBoundingClientRect(),overflow=[]
    for(const el of slide.querySelectorAll('*')){
      if(el instanceof SVGElement && !(el instanceof SVGSVGElement))continue
      if(!el.getClientRects().length)continue
      const b=el.getBoundingClientRect()
      if(b.width<1||b.height<1)continue
      if(b.left<bounds.left-.7||b.top<bounds.top-.7||b.right>bounds.right+.7||b.bottom>bounds.bottom+.7)
        overflow.push(`${el.tagName}.${String(el.className).slice(0,50)}: ${[b.left,b.top,b.right,b.bottom].map(Math.round)}`)
    }
    const body=slide.querySelector('main'), footer=slide.querySelector('footer')
    for(const el of slide.querySelectorAll('.node, .stack, .col')){
      if(el.scrollHeight>el.clientHeight+3)overflow.push(`Internal overflow: ${el.className} (${el.scrollHeight}/${el.clientHeight})`)
    }
    const contentBottom=Math.max(...[...body.querySelectorAll('p, h2, h3, table, button, figure, svg')].filter(x=>x.getClientRects().length).map(x=>x.getBoundingClientRect().bottom))
    if(contentBottom>footer.getBoundingClientRect().top-4)overflow.push('Body content overlaps footer')
    const images=[...slide.querySelectorAll('img')].filter(img=>!img.complete||img.naturalWidth===0).map(img=>img.src)
    const english=!/[\u3400-\u9fff]/u.test(slide.innerText)
    const oversizedText=[...slide.querySelectorAll('svg text')].filter(t => parseFloat(getComputedStyle(t).fontSize) > 48).map(t => 'Oversized diagram text: ' + t.textContent)
    const invalidGeometry=[...slide.querySelectorAll('svg [d], svg [points], svg [cx], svg [cy]')].filter(t => [...t.attributes].some(a => /NaN|Infinity|undefined/.test(a.value))).map(t => 'Invalid SVG geometry: ' + t.tagName)
    overflow.push(...oversizedText,...invalidGeometry)
    const buttons=[...slide.querySelectorAll('button')].filter(b=>!b.innerText.trim()&&!b.getAttribute('aria-label')).length
    return {overflow,images,english,unlabelledButtons:buttons}
  })
  const svgImages = await section(n).locator('svg image').evaluateAll(nodes => Promise.all(nodes.map(node => new Promise(resolve => { const url = node.href.baseVal; const img = new Image(); img.onload = () => resolve(null); img.onerror = () => resolve(url); img.src = url; }))));
  const emptyFrames = await section(n).locator('.missing, .placeholder, [data-placeholder]').count()
  const problems=[...svgImages.filter(Boolean).map(url => 'Missing SVG image ' + url),...(emptyFrames ? ['Empty visual frames: ' + emptyFrames] : []),...result.overflow,...result.images.map(p=>`Missing image ${p}`),...errors.splice(0)]
  if(!result.english)problems.push('Non-English visible content')
  if(result.unlabelledButtons)problems.push('Unlabelled controls')
  report.push({page:n,state:label,problems})
  await page.screenshot({path:new URL(`page-${String(n).padStart(2,'0')}-${label}.png`,output).pathname})
  console.log(`Page ${n} (${label}): ${problems.length?problems.join(' | '):'PASS'}`)
}
async function visit(n){await page.goto(`${base}/${n}`,{waitUntil:'networkidle'});await section(n).waitFor();await page.waitForTimeout(180)}
try{
  for(const t of index){
    await visit(t.number)
    await checkLayout(t.number)
    if(t.number===2){await section(2).getByRole('button',{name:'Expert E',exact:true}).click();assert((await section(2).locator('img').last().getAttribute('src')).endsWith('expert-E.png'));await checkLayout(2,'expert-e')}
    if(t.number===13){
      const points=await section(13).locator('svg circle').evaluateAll(nodes=>nodes.map(n=>Number(n.getAttribute('cy'))))
      assert.equal(points.length,18);assert(points.every(v=>v>30&&v<270),'Every plotted result must be inside the chart axes')
      assert(Math.abs(points[0]-161.2475)<.001,'Expert A Top-1 must map to 23.591 dB')
      await section(13).getByRole('button',{name:'SSIM',exact:true}).click();assert((await section(13).innerText()).includes('0.9048'))
      const ssimPoints=await section(13).locator('svg circle').evaluateAll(nodes=>nodes.map(n=>Number(n.getAttribute('cy'))))
      assert(ssimPoints.every(v=>v>30&&v<270),'SSIM points must be visible on their own scale')
      await checkLayout(13,'ssim')
    }
    if(t.number===14){await section(14).getByRole('button',{name:'PPSD',exact:true}).click();await section(14).getByRole('button',{name:'SSIM',exact:true}).click();assert((await section(14).innerText()).includes('0.8410'));await checkLayout(14,'ppsd-ssim')}
    if(t.number===15){await section(15).getByLabel('Coverage expert').selectOption('4');assert((await section(15).innerText()).includes('23.263'));await checkLayout(15,'expert-e')}
    if([16,17].includes(t.number)){await section(t.number).getByRole('button',{name:'Correct conditions',exact:true}).click();assert.equal((await section(t.number).locator('[data-ablation-value]').innerText()).replace(/\s/g,''),'23.5dB');await checkLayout(t.number,'correct')}
    if(t.number===18){await section(18).getByRole('button',{name:'Peak allocated MiB',exact:true}).click();assert((await section(18).innerText()).includes('314.9'));await checkLayout(18,'memory')}
    if(t.number===21){await section(21).getByRole('button',{name:'All nine members',exact:true}).click();assert.equal(await section(21).locator('tbody tr').count(),9);await checkLayout(21,'team')}
    if(t.number===28){await section(28).getByRole('button',{name:'Saved default · 4 layers',exact:true}).click();assert.equal(await section(28).locator('.chips span').count(),4);await section(28).getByRole('button',{name:'E8',exact:true}).click();assert((await section(28).innerText()).includes('Historical pair 8'));await checkLayout(28,'source')}
    if(t.number===29){await section(29).getByRole('button',{name:'Training · z → u',exact:true}).click();assert((await section(29).innerText()).includes('log |det Jf|'));await checkLayout(29,'training')}
    if(t.number===30){assert.equal(await section(30).locator('canvas').count(),1);assert(await section(30).locator('canvas').evaluate(c=>c.width>0&&c.height>0));await section(30).getByRole('button',{name:'Angular counts',exact:true}).click();await page.waitForTimeout(200);await checkLayout(30,'angular-counts');await section(30).getByRole('button',{name:'Illustrative condition B',exact:true}).click();await checkLayout(30,'condition-b')}
    if(t.number===31){await section(31).getByRole('button',{name:'Report description',exact:true}).click();assert((await section(31).innerText()).includes('Mean sample log p'));await checkLayout(31,'report')}
    if(t.number===35){await section(35).getByRole('button',{name:/D06/}).click();assert((await section(35).innerText()).includes('MODE_CAND=True'));await checkLayout(35,'ranking')}
    if(t.number===33){await section(33).getByLabel('Noise scale',{exact:true}).selectOption('4');assert((await section(33).innerText()).includes('27.208'));await checkLayout(33,'high-noise')}
    if(t.number===36){for(const name of ['GPU benchmark','Decoder robustness']){await section(36).getByRole('button',{name,exact:true}).click();await checkLayout(36,name.split(' ')[0].toLowerCase())}}
    if(t.number===37){await section(37).getByRole('button',{name:/Expert E/}).click();assert((await section(37).locator('.expert-gallery img').last().getAttribute('src')).endsWith('expert-E.png'));await checkLayout(37,'expert-e')}
    if(t.number===38){await section(38).getByRole('button',{name:'History pair 20',exact:true}).click();assert((await section(38).locator('.pair-view img').first().getAttribute('src')).endsWith('0020-original.jpg'));await checkLayout(38,'pair-20')}
    if(t.number===39){await section(39).getByRole('button',{name:'R',exact:true}).click();await section(39).getByLabel('Histogram expert').selectOption('E');await checkLayout(39,'red-expert-e')}
    if(t.number===40){await section(40).getByLabel('Tone-map expert').selectOption('D');await checkLayout(40,'expert-d')}
    if(t.number===41){await section(41).getByRole('button',{name:'Expert D',exact:true}).click();await checkLayout(41,'expert-d')}
    if(t.number===42){const before = await section(42).locator('[data-threshold-fraction]').innerText();await section(42).getByLabel('Difference threshold').selectOption('50');assert.notEqual(await section(42).locator('[data-threshold-fraction]').innerText(),before);assert((await section(42).locator('.difference-images img').last().getAttribute('src')).endsWith('threshold-50.png'));await checkLayout(42,'threshold-50')}
    if(t.number===43){await section(43).getByLabel('Crop zoom').selectOption('5');await section(43).getByLabel('Crop horizontal position').fill('100');await section(43).getByLabel('Crop vertical position').fill('100');assert.equal(await section(43).locator('figure svg').first().getAttribute('viewBox'),'400 265.6 100 66.4');await checkLayout(43,'corner-crop')}
    if(t.number===44){await section(44).getByRole('button',{name:'Expert A versus Expert A: 0.00',exact:true}).click();assert((await section(44).locator('[data-pair-difference]').innerText()).startsWith('0.00'));await checkLayout(44,'diagonal-zero')}
    if(t.number===45){const ids = () => section(45).locator('[data-selected-history]').evaluateAll(nodes => nodes.map(n => n.dataset.selectedHistory));const before = await ids();await section(45).getByRole('button',{name:'Resample history',exact:true}).click();const after = await ids();assert.equal(new Set(after).size,8);assert.notDeepEqual(after,before);assert(!after.includes('0412'));await checkLayout(45,'resampled')}
    if(t.number===46){await section(46).getByRole('button',{name:'Shift historical edits',exact:true}).click();assert.equal((await section(46).locator('[data-pairing-psnr]').innerText()).trim(),'23.543 dB');await checkLayout(46,'shifted-pairs')}
    if(t.number===47){for(const name of ['Shared training','Offline scoring']){await section(47).getByRole('button',{name,exact:true}).click();await checkLayout(47,name.split(' ')[0].toLowerCase())}}
    if(t.number===48){await section(48).getByLabel('Left-mode probability').fill('5');assert((await section(48).innerText()).includes('Mass: 5% / 95%'));await checkLayout(48,'right-mode')}
    if(t.number===49){await section(49).getByLabel('Transport deformation').fill('0');assert((await section(49).innerText()).includes('1.000'));await checkLayout(49,'identity')}
    if(t.number===50){await section(50).getByRole('button',{name:'4096 samples',exact:true}).click();assert.equal(await section(50).locator('[data-mc-point]').count(),4096);await checkLayout(50,'4096-samples')}
    if(t.number===51){for(const c of ['red','green','blue'])await section(51).getByLabel('LUT ' + c).fill('1');assert.equal(await section(51).locator('[data-lut-output]').innerText(),'1.000 · 1.000 · 1.000');await section(51).getByRole('button',{name:'Toy warm LUT',exact:true}).click();assert.equal(await section(51).locator('[data-lut-output]').innerText(),'1.000 · 0.900 · 0.700');await checkLayout(51,'toy-white-corner')}
    if(t.number===52){await section(52).getByRole('button',{name:/6 Monte Carlo/}).click();assert((await section(52).innerText()).includes('48.507'));await checkLayout(52,'batch-eight-fresh')}
  }
  // Revised mechanisms must change data geometry, not only selected control colours.
  await visit(2)
  await section(2).getByLabel('Original versus expert comparison').focus()
  await page.keyboard.press('Home')
  assert.equal(await section(2).getByLabel('Original versus expert comparison').inputValue(),'0')
  assert(page.url().endsWith('/2'))
  await checkLayout(2,'comparison-endpoint')
  await visit(5)
  await section(5).getByRole('button',{name:'FR-03',exact:true}).click()
  assert((await section(5).innerText()).includes('Sample a conditional density'))
  await checkLayout(5,'multimodal-requirement')
  await visit(8)
  await section(8).getByRole('button',{name:/Transformer conditioning/}).click()
  assert((await section(8).innerText()).includes('paired historical examples'))
  await checkLayout(8,'transformer-tradeoff')
  await visit(21)
  for (const name of ['Real FiveK asset preparation','Mechanism communication','Browser delivery checks']) {
    await section(21).getByRole('button',{name:new RegExp(name)}).click()
    await checkLayout(21,name.split(' ')[0].toLowerCase())
  }
  await visit(28)
  for(let i=0;i<3;i++) await section(28).getByRole('button',{name:'Previous step',exact:true}).click()
  const token = section(28).locator('[data-token="1"]')
  assert.equal(await token.getAttribute('transform'),'translate(18, 55)')
  await checkLayout(28,'separate-token-rows')
  await section(28).getByRole('button',{name:'Next step',exact:true}).click()
  assert.equal(await token.getAttribute('transform'),'translate(86, 3)')
  await checkLayout(28,'interleaved-tokens')
  await visit(29)
  const sample = section(29).locator('[data-flow-sample="0"]')
  const inferenceX = Number(await sample.getAttribute('cx'))
  assert(inferenceX > 500 && inferenceX < 850)
  assert.equal(await sample.evaluate(n=>getComputedStyle(n).opacity),'0.8','Flow samples must be visible, not reinterpreted as CSS percentages')
  await section(29).getByRole('button',{name:'Training · z → u',exact:true}).click()
  assert(Number(await sample.getAttribute('cx')) < 320)
  await section(29).getByRole('button',{name:'Previous step',exact:true}).click()
  assert(Number(await sample.getAttribute('cx')) > 300)
  await checkLayout(29,'transport-in-progress')
  await visit(31)
  for(let i=0;i<2;i++) await section(31).getByRole('button',{name:'Previous step',exact:true}).click()
  const retained = await section(31).locator('[data-sample-retained]').evaluateAll(nodes=>nodes.filter(n=>Number(getComputedStyle(n).opacity)>0.1).length)
  assert.equal(retained,128,'Source selection retains exactly half of 256 samples')
  await checkLayout(31,'retained-half')
  await section(31).getByRole('button',{name:'Show all',exact:true}).click()
  await section(31).getByRole('button',{name:'Report description',exact:true}).click()
  assert.equal(await section(31).locator('ellipse').count(),5)
  assert.equal(await section(31).locator('.returned-vector').count(),5)
  await checkLayout(31,'five-report-groups')
  await visit(35)
  await section(35).getByRole('button',{name:/D10/}).click()
  await checkLayout(35,'diagnostic-lineage')

  // Manual controls must work without advancing Slidev itself.
  await visit(9)
  await section(9).getByRole('button',{name:'Previous step',exact:true}).click()
  assert.equal((await section(9).locator('.position').innerText()).trim(),'3 / 4')
  await section(9).getByRole('button',{name:'Next step',exact:true}).focus()
  await page.keyboard.press('Enter')
  assert.equal((await section(9).locator('.position').innerText()).trim(),'4 / 4')
  assert(page.url().endsWith('/9'))
  await section(9).getByRole('button',{name:'Play explanation',exact:true}).click()
  await page.waitForTimeout(1750)
  assert.equal((await section(9).locator('.position').innerText()).trim(),'2 / 4')
  await section(9).getByRole('button',{name:'Pause explanation',exact:true}).click()
  await page.waitForTimeout(1700)
  assert.equal((await section(9).locator('.position').innerText()).trim(),'2 / 4')
  report.push({page:9,state:'manual-keyboard-play-pause',problems:[]})
  await page.emulateMedia({reducedMotion:'reduce'})
  await visit(9)
  assert.equal(await section(9).getByRole('button',{name:'Play explanation',exact:true}).count(),0)
  await section(9).getByRole('button',{name:'Previous step',exact:true}).click()
  assert.equal((await section(9).locator('.position').innerText()).trim(),'3 / 4')
  await visit(30)
  assert.equal(await section(30).getByRole('button',{name:'Rotate',exact:true}).count(),0)
  report.push({page:30,state:'reduced-motion',problems:[]})
  await page.goto(`${base}/evidence/index.html`,{waitUntil:'networkidle'})
  assert.equal(await page.locator('html').getAttribute('lang'),'en')
  for(const href of await page.locator('a').evaluateAll(links=>links.map(a=>a.href).filter(url=>url.startsWith(location.origin)&&!/[0-9]+$/.test(url)))){
    const response=await page.request.get(href);assert.equal(response.status(),200,href)
  }
  report.push({page:'evidence',state:'local-links',problems:[]})
  await page.setViewportSize({width:1440,height:900});await visit(13);await checkLayout(13,'scaled-viewport')
}catch(error){report.push({page:'interaction',state:'error',problems:[error.stack]});console.error(error)}
finally{await browser.close();const problems=report.reduce((n,r)=>n+r.problems.length,0);await writeFile(new URL('./exports/qa-show.json',import.meta.url),JSON.stringify({base,pages:index.length,checks:report.length,report,problems},null,2));console.log(`RESULT: ${index.length} pages, ${report.length} states, ${problems} problems`);process.exitCode=problems?1:0}
