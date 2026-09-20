import assert from 'node:assert/strict'
import { chromium } from 'playwright-chromium'
import { mkdir, writeFile } from 'node:fs/promises'

const base=process.env.SHOW_BASE ?? 'http://localhost:18335'
const pageUrl=(slide,motion=false)=>process.env.SHOW_ROUTER==='hash'?`${base}/${motion?'?motion=1':''}#/${slide}`:`${base}/${slide}${motion?'?motion=1':''}`
const out=new URL('../exports/motion-qa/',import.meta.url)
await mkdir(out,{recursive:true})
const browser=await chromium.launch()
const page=await browser.newPage({viewport:{width:1280,height:720}})
const errors=[]
page.on('pageerror',e=>errors.push(e.message))
const report=[]
const scenes=[[2,5],[4,5],[5,4],[6,5],[7,4],[9,5]]

for (const [slide,final] of scenes) {
  await page.goto(pageUrl(slide,true),{waitUntil:'networkidle'})
  const root=page.locator(`.slidev-page-${slide}`)
  const scene=root.locator('.motion-scene')
  const previous=root.getByRole('button',{name:'Previous explanation',exact:true})
  const next=root.getByRole('button',{name:'Next explanation',exact:true})
  assert.equal(await previous.count(),1,'Every sequence needs backward navigation')
  assert.equal(await next.count(),1,'Every sequence needs forward navigation')
  await root.getByRole('button',{name:'Replay mechanism',exact:true}).click()
  assert.equal(await scene.getAttribute('data-stage'),'0')
  await page.mouse.move(0,0)
  const run=Number(await scene.getAttribute('data-run'))
  await page.waitForFunction(slide=>document.querySelector(`.slidev-page-${slide} .motion-scene`)?.dataset.stage==='2',slide)
  await page.waitForTimeout(300)
  await page.screenshot({path:new URL(`slide-${slide}-during.png`,out).pathname})
  if (slide===4) {
    assert.equal(await scene.locator('.reference-decision').evaluate(el=>el.classList.contains('is-on')),true)
    assert.equal(await scene.locator('.spatial-decision').evaluate(el=>el.classList.contains('is-on')),false)
  }
  const middle=await scene.evaluate(el=>({stage:el.dataset.stage,playing:el.dataset.playing,comparison:el.querySelector('.image-comparison')?.dataset.reveal}))
  assert.equal(middle.playing,'true')
  await page.waitForFunction(({slide,final})=>{
    const el=document.querySelector(`.slidev-page-${slide} .motion-scene`)
    return el?.dataset.stage===String(final) && el.dataset.playing==='false'
  },{slide,final})
  await page.waitForTimeout(350)
  await page.screenshot({path:new URL(`slide-${slide}-final.png`,out).pathname})
  await page.waitForFunction(slide=>document.querySelector(`.slidev-page-${slide} .motion-scene`).getAnimations({subtree:true}).every(a=>a.playState!=='running'),slide,{timeout:3000})
  assert.equal(await scene.evaluate(el=>el.getAnimations({subtree:true}).filter(a=>a.playState==='running').length),0,'Animation should settle')
  // Taking over during playback must cancel scheduled advances, then resume in place.
  await root.getByRole('button',{name:'Replay mechanism',exact:true}).click()
  await page.waitForFunction(slide=>document.querySelector(`.slidev-page-${slide} .motion-scene`).dataset.stage==='2',slide)
  await previous.click()
  assert.equal(await scene.getAttribute('data-stage'),'1')
  await page.waitForTimeout(1600)
  assert.equal(await scene.getAttribute('data-stage'),'1','Manual navigation holds despite the previous automatic timeline')
  assert.equal(await scene.getAttribute('data-playing'),'false')
  await next.click()
  await root.getByRole('button',{name:'Continue mechanism',exact:true}).click()
  assert.equal(await scene.getAttribute('data-stage'),'2','Continue must not restart the sequence')
  await page.waitForFunction(slide=>document.querySelector(`.slidev-page-${slide} .motion-scene`).dataset.stage==='3',slide)
  await root.getByRole('button',{name:'Pause mechanism',exact:true}).click()
  assert.equal(await scene.getAttribute('data-playing'),'false')
  const captions=[]
  for (let step=2;step>=0;step--) {
    await previous.click()
    assert.equal(await scene.getAttribute('data-stage'),String(step))
  }
  assert.equal(await previous.isDisabled(),true)
  for (let step=0;step<=final;step++) {
    if (step) await next.click()
    assert.equal(await scene.getAttribute('data-stage'),String(step))
    assert.equal(await root.locator('.playback-position').getAttribute('aria-label'),`Step ${step+1} of ${final+1}`)
    const caption=scene.locator('.mechanism-reading>p')
    if (await caption.count()) captions.push(await caption.textContent())
    const overflow=await root.locator('.show-slide').evaluate(el=>[...el.querySelectorAll('*')].filter(node=>{
      const box=node.getBoundingClientRect()
      return box.width>0 && box.height>0 && (box.left<-.5 || box.top<-.5 || box.right>1280.5 || box.bottom>720.5)
    }).map(node=>node.tagName))
    assert.deepEqual(overflow,[],`Slide ${slide}, step ${step}: controls and content must fit`)
    if (step===2) await page.screenshot({path:new URL(`slide-${slide}-manual.png`,out).pathname})
  }
  assert.equal(await next.isDisabled(),true)
  if (captions.length) assert.equal(new Set(captions).size,final+1,'Each caption can be reached manually')
  await previous.focus()
  await previous.press('ArrowLeft')
  assert.equal(await scene.getAttribute('data-stage'),String(final-1))
  await previous.press('ArrowRight')
  assert.equal(await scene.getAttribute('data-stage'),String(final))
  assert.equal(page.url(),pageUrl(slide,true),'Control arrows must not navigate the deck')
  const compare=scene.locator('.image-comparison')
  if (await compare.count()) {
    const slider=compare.locator('input')
    await slider.focus()
    await slider.press('Home')
    assert.equal(await compare.getAttribute('data-reveal'),'0')
    await slider.press('End')
    assert.equal(await compare.getAttribute('data-reveal'),'100')
    const box=await compare.boundingBox()
    await page.mouse.move(box.x+box.width*.2,box.y+box.height*.5)
    await page.mouse.down()
    await page.mouse.move(box.x+box.width*.7,box.y+box.height*.5,{steps:8})
    await page.mouse.up()
    assert.ok(Math.abs(Number(await compare.getAttribute('data-reveal'))-70)<2,'Pointer comparison tracks the image')
  }
  if (slide===4) {
    await scene.getByRole('button',{name:'Explain reference choice',exact:true}).click()
    assert.equal(await scene.getAttribute('data-stage'),'3')
    assert.equal(await scene.getAttribute('data-playing'),'false')
    await page.waitForTimeout(400)
    assert.equal(await scene.getAttribute('data-stage'),'3','A selected decision stays available for explanation')
    await scene.getByRole('button',{name:'Explain spatial transfer',exact:true}).press('Enter')
    assert.equal(await scene.getAttribute('data-stage'),'4')
  }
  if (slide===5 || slide===7) {
    const name=slide===5?/Lily/:/Dog/
    await root.getByRole('button',{name,exact:typeof name==='string'}).click()
    assert.equal(await scene.getAttribute('data-stage'),'0')
    assert.ok(Number(await scene.getAttribute('data-run'))>run,'Changing evidence should restart the sequence')
  } else await root.getByRole('button',{name:'Replay mechanism',exact:true}).click()
  await root.getByRole('button',{name:'Show final evidence',exact:true}).click()
  assert.equal(await scene.getAttribute('data-stage'),String(final))
  assert.equal(await scene.getAttribute('data-playing'),'false')
  report.push({slide,middle,settles:true,replay:true,finish:true,manualPreviousNext:true,manualHold:true,resumeFromCurrent:true,keyboardSteps:true,comparison:await compare.count()>0})
  console.log(`Motion ${slide}: passed`)
}

// Keep the deck within the team-confirmed old/new descriptions.
await page.goto(pageUrl(2),{waitUntil:'networkidle'})
assert.match(await page.locator('.slidev-page-2 .show-slide').textContent(),/One group → one simulated user/)
assert.match(await page.locator('.slidev-page-2 h2').textContent(),/Group editing examples/)
await page.goto(pageUrl(9),{waitUntil:'networkidle'})
assert.equal(await page.locator('.slidev-page-9 .history-experiment').count(),0)
assert.equal(await page.locator('.slidev-page-9').getByRole('button',{name:'History test',exact:true}).count(),0)
assert.match(await page.locator('.slidev-page-9 .next-workflow').textContent(),/Fill in what the user left unspecified/)
assert.match(await page.locator('.slidev-page-9 .next-toolbar').textContent(),/Text request → partial edit/)

// The instances survive slide navigation; leaving must cancel pending cues.
await page.goto(pageUrl(4,true),{waitUntil:'networkidle'})
await page.locator('.slidev-page-4').getByRole('button',{name:'Replay mechanism',exact:true}).click()
await page.evaluate(()=>{window.__departedScene=document.querySelector('.slidev-page-4 .motion-scene');document.activeElement?.blur()})
await page.keyboard.press('ArrowRight')
await page.waitForTimeout(350)
assert.match(await page.locator('.slidev-page-5 .show-slide h2').textContent(),/Find useful edits/)
assert.equal(await page.evaluate(()=>window.__departedScene.dataset.playing),'false')
assert.equal(await page.evaluate(()=>window.__departedScene.dataset.stage),'5')
await page.keyboard.press('ArrowLeft')
await page.waitForTimeout(400)
assert.equal(await page.locator('.slidev-page-4 .motion-scene').getAttribute('data-playing'),'true','Entering the slide replays it')

await page.emulateMedia({reducedMotion:'reduce'})
await page.waitForFunction(()=>document.querySelector('.slidev-page-4 .motion-scene').dataset.playing==='false')
assert.equal(await page.locator('.slidev-page-4 .motion-scene').getAttribute('data-playing'),'false')
for (const [slide,final] of scenes) {
  await page.goto(pageUrl(slide,true),{waitUntil:'networkidle'})
  assert.equal(await page.locator(`.slidev-page-${slide} .motion-scene`).getAttribute('data-stage'),String(final))
  assert.equal(await page.locator(`.slidev-page-${slide} .motion-scene`).getAttribute('data-playing'),'false')
  assert.equal(await page.locator(`.slidev-page-${slide}`).getByRole('button',{name:'Replay mechanism',exact:true}).count(),0)
  await page.locator(`.slidev-page-${slide}`).getByRole('button',{name:'Previous explanation',exact:true}).click()
  assert.equal(await page.locator(`.slidev-page-${slide} .motion-scene`).getAttribute('data-stage'),String(final-1),'Reduced motion retains manual explanation access')
  assert.equal(await page.locator(`.slidev-page-${slide} .motion-scene`).getAttribute('data-playing'),'false')
}
await page.emulateMedia({reducedMotion:'no-preference'})
await page.goto(pageUrl(4),{waitUntil:'networkidle'})
assert.equal(await page.locator('.slidev-page-4 .motion-scene').getAttribute('data-stage'),'5','Headless export shows final evidence')
assert.deepEqual(errors,[])
await writeFile(new URL('../exports/motion-qa-v14.json',import.meta.url),JSON.stringify({scenes:report,leaveCancels:true,reentry:true,reducedMotion:true,headlessFinal:true,errors},null,2))
await browser.close()
console.log('MOTION ALL CLEAR')
