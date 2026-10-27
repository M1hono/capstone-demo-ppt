import { chromium } from 'playwright-chromium'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const base=(process.env.SHOW_BASE??'http://127.0.0.1:18341').replace(/\/$/,'')
const timing=JSON.parse(await readFile(new URL('./data/playback-timing.json',import.meta.url),'utf8'))
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
      if(el.closest('.meeting-list'))continue
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
    for(const panel of slide.querySelectorAll('.training-map,.inference-lane,.inference-path,.conditioning-branches,.condition-processing,.expert-grid,.ppsd-grid,.evolution-stages')){
      const area=panel.getBoundingClientRect()
      for(const el of panel.querySelectorAll('p,h2,h3,article,li'))
        if(el.getBoundingClientRect().bottom>area.bottom+2)overflow.push(`Panel overflow: ${el.className || el.tagName}`)
    }
    const contentBottom=Math.max(...[...body.querySelectorAll('p, h2, h3, table, button, figure, svg')].filter(x=>x.getClientRects().length && !x.closest('.meeting-list')).map(x=>x.getBoundingClientRect().bottom))
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
    const current=section(t.number)
    assert(t.title.length>5,'Nonempty reference title')
    assert.equal(await current.locator('h1').innerText(),t.title,'Reference title/order')
    assert.equal(await current.locator('footer a').count(),0,'No footer evidence link')
    assert.equal(await current.locator('input,select,[role="tab"],.tabs,a,button,.controls').count(),0,'No operation or playback controls')
    assert(!/next steps|future work|endfield/i.test(await current.innerText()),'Final-demo wording')
    if(t.number===2){assert.equal(await current.locator('[data-user-output]').count(),3);assert.equal(await current.locator('[data-user-history] img').count(),12)}
    if(t.number===9){
      const overlap=await current.locator('.encoder-layout').evaluate(el=>{
        const r=[...el.children].map(x=>({name:x.className,b:x.getBoundingClientRect()}));const pairs=[]
        for(let i=0;i<r.length;i++)for(let j=i+1;j<r.length;j++)if(Math.min(r[i].b.right,r[j].b.right)-Math.max(r[i].b.left,r[j].b.left)>1&&Math.min(r[i].b.bottom,r[j].b.bottom)-Math.max(r[i].b.top,r[j].b.top)>1)pairs.push([r[i].name,r[j].name])
        return pairs
      });assert.deepEqual(overlap,[],'Stage 1 columns must not overlap')
    }
    if(t.number===10){
      const images=await current.locator('.latent-reference img').evaluateAll(nodes=>nodes.map(n=>n.src.split('/').pop()))
      assert.deepEqual(images,['direction-grid-transparent.png','magnitude-grid-transparent.png'],'Direction and magnitude both visible')
    }
    if(t.number===11){assert.equal(await current.locator('[data-token]').count(),17);assert.equal(await current.locator('.transformer-layers>span').count(),2)}
    if(t.number===12){
      assert.equal(await current.locator('[data-flow-sample]').count(),60)
      assert.equal(await current.locator('[data-flow-training],[data-flow-inference]').count(),2)
      for(const text of ['log |det J|','Backpropagation','Mean log p(z | c)','K-means'])assert((await current.innerText()).includes(text))
    }
    if(t.number!==12){
      assert.equal(await current.locator('.controls').count(),0)
      const animated=await current.locator('*').evaluateAll(nodes=>nodes.filter(n=>getComputedStyle(n).animationName!=='none'||getComputedStyle(n).transitionDuration.split(',').some(t=>parseFloat(t)>0)).map(n=>n.tagName+'.'+n.getAttribute('class')))
      assert.deepEqual(animated,[],`Slide ${t.number} is static`)
    }
    if(t.number===15)assert.equal(await current.locator('.coverage-columns li').count(),9)
    if(t.number===17){assert.equal(await current.locator('[data-expert-result]').count(),30);assert((await current.innerText()).includes('23.263'));assert((await current.innerText()).includes('0.8852'))}
    if(t.number===18)assert.equal(await current.locator('[data-ppsd-result]').count(),30)
    if([18,19].includes(t.number)){const heights=await current.locator('.chart-bar').evaluateAll(nodes=>nodes.map(n=>n.getBBox().height));assert(heights.every(h=>h>=30&&h<=40),'Chart bars retain their designed heights')}
    if(t.number===19)for(const value of ['18.3','22.1','20.2','22.3','23.5'])assert((await current.innerText()).includes(value))
    if(t.number===22){assert.equal(await current.locator('[data-evolution-stage]').count(),5);assert.equal(await current.locator('.stage-finding:visible').count(),5)}
    if(t.number===23)assert.equal(await current.locator('.stage-detail:visible').count(),4)
    if(t.number===24)assert.equal(await current.locator('.member-card').count(),9)
    if(t.number===25)assert((await current.innerText()).includes('Current limitations'))
  }
  await page.goto(`${base}/12`,{waitUntil:'domcontentloaded'});await section(12).waitFor()
  const text=await section(12).locator('main').innerText()
  const emphasis=()=>section(12).locator('.active h3').allTextContents()
  const first=await emphasis()
  assert(first.includes('Conditional Flow'))
  await page.waitForTimeout(2500)
  const next=await emphasis()
  assert(next.includes('Conditional log-likelihood'))
  assert.equal(await section(12).locator('main').innerText(),text,'Flow animation preserves all text')
  await page.waitForTimeout(4900)
  assert((await emphasis()).includes('Rank clusters'))
  assert.equal(await section(12).locator('main').innerText(),text)
  await checkLayout(12,'autoplay-complete')
  report.push({page:12,state:'automatic-emphasis-no-content-loss',problems:[]})
  await page.emulateMedia({reducedMotion:'reduce'})
  await visit(12)
  assert.equal(await section(12).locator('.active').count(),0)
  report.push({page:12,state:'reduced-motion-static',problems:[]})
  await page.emulateMedia({reducedMotion:'no-preference'})
  for(const n of index.map(t=>t.number)){
    await page.goto(`${base}/${n}?print=true`,{waitUntil:'networkidle'});await section(n).waitFor()
    assert.equal(await section(n).locator('.controls,button').count(),0,'No controls in export')
    assert.equal(await section(n).locator('.dim,.unrevealed,.context-links.hidden').count(),0,'All diagram stages displayed in export')
    assert.equal(await section(n).evaluate(el=>el.getAnimations({subtree:true}).length),0,'No animation in export')
    if(n===10)assert.equal(await section(n).locator('.latent-reference img:visible').count(),2)
    if(n===22)assert.equal(await section(n).locator('.stage-finding:visible').count(),5)
    await checkLayout(n,'print-complete')
  }
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto(`${base}/evidence/index.html`,{waitUntil:'networkidle'})
  for(const href of await page.locator('a').evaluateAll(links=>links.map(a=>a.href).filter(url=>url.startsWith(location.origin)&&!/[0-9]+$/.test(url)))){
    const response=await page.request.get(href);assert.equal(response.status(),200,href)
  }
  report.push({page:'evidence',state:'local-links',problems:[]})
  for(const viewport of [{width:375,height:667},{width:667,height:375},{width:1920,height:1080}]){
    await page.setViewportSize(viewport)
    for(const number of [2,9,11,12,17,20,25]){
      await visit(number);await checkLayout(number,`resized-${viewport.width}`)
      const staleLabels=await section(number).locator('svg text').evaluateAll(labels=>labels.flatMap(label=>{
        if(!label.getClientRects().length||!label.textContent.trim())return []
        const range=document.createRange();range.selectNodeContents(label)
        const glyph=range.getBoundingClientRect(),element=label.getBoundingClientRect()
        return Math.abs(glyph.x-element.x)>2||Math.abs(glyph.width-element.width)>2?[label.textContent.trim()]:[]
      }))
      assert.deepEqual(staleLabels,[],`SVG glyph layout at ${viewport.width}px on slide ${number}`)
    }
  }
}catch(error){report.push({page:'interaction',state:'error',problems:[error.stack]});console.error(error)}
finally{await browser.close();const problems=report.reduce((n,r)=>n+r.problems.length,0);await writeFile(new URL('./exports/qa-show.json',import.meta.url),JSON.stringify({base,pages:index.length,checks:report.length,report,problems},null,2));console.log(`RESULT: ${index.length} pages, ${report.length} states, ${problems} problems`);process.exitCode=problems?1:0}
