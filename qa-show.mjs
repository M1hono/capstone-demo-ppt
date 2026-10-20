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
    const buttons=[...slide.querySelectorAll('button')].filter(b=>!b.innerText.trim()&&!b.getAttribute('aria-label')).length
    return {overflow,images,english,unlabelledButtons:buttons}
  })
  const problems=[...result.overflow,...result.images.map(p=>`Missing image ${p}`),...errors.splice(0)]
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
    if(t.number===36){await section(36).getByRole('button',{name:'Direction / magnitude grid',exact:true}).click();assert((await section(36).innerText()).includes('unavailable'));await checkLayout(36,'direction-grid')}
  }
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
