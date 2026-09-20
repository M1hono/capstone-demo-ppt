import { chromium } from 'playwright-chromium'
import pptxgen from 'pptxgenjs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'

const base=process.env.SHOW_BASE ?? 'http://127.0.0.1:18335'
const path=name=>new URL(`../exports/${name}`,import.meta.url).pathname
await mkdir(path('motion-v21'),{recursive:true})
await mkdir(path('slides-v21'),{recursive:true})
const browser=await chromium.launch()
const clips=[2,4,6,8,9,13,14].map(slide=>({slide,choices:[]}))
const reuse=process.argv.includes('--reuse-clips')
const manifest=reuse?JSON.parse(await readFile(path('motion-v21/manifest.json'),'utf8')):[]
for (const clip of reuse?[]:clips) {
  const context=await browser.newContext({viewport:{width:1920,height:1080},recordVideo:{dir:path('motion-v21/raw'),size:{width:1920,height:1080}}})
  const page=await context.newPage()
  await page.goto(`${base}/${clip.slide}?motion=1`,{waitUntil:'networkidle'})
  const root=page.locator(`.slidev-page-${clip.slide}`)
  await root.locator('.finish-playback').evaluateAll(buttons=>buttons.forEach(b=>b.click()))
  await page.waitForTimeout(450)
  // Hide web-only replay/drag UI inside the recorded film; toolbar selections remain visible.
  await page.addStyleTag({content:'.playback-controls,.comparison-slider {visibility:hidden!important} * {cursor:none!important}'})
  await page.mouse.move(0,0)
  // A temporary solid frame provides a reliable video boundary; wall-clock trimming can skip the opening cue.
  await page.evaluate(()=>{const marker=document.createElement('div');marker.id='capture-boundary';marker.style.cssText='position:fixed;inset:0;background:#ff00ff;z-index:2147483647';document.body.append(marker)})
  await root.locator('[aria-label="Replay mechanism"]').evaluate(b=>b.click())
  await root.locator('[aria-label="Pause mechanism"]').evaluate(b=>b.click())
  await page.waitForTimeout(350)
  await page.evaluate(()=>document.getElementById('capture-boundary').remove())
  await page.waitForTimeout(400)
  await root.locator('[aria-label="Continue mechanism"]').evaluate(b=>b.click())
  async function settle() {
    await page.waitForFunction(slide=>document.querySelector(`.slidev-page-${slide} .motion-scene`).dataset.playing==='false',clip.slide)
    await page.waitForTimeout(800)
  }
  await settle()
  for (const name of clip.choices) {
    await root.getByRole('button',{name,exact:typeof name==='string'}).evaluate(b=>b.click())
    await settle()
  }
  const video=page.video()
  await context.close()
  const raw=await video.path()
  const meta=JSON.parse(execFileSync('/opt/homebrew/bin/ffprobe',['-v','quiet','-show_format','-show_streams','-of','json',raw],{encoding:'utf8'}))
  const stream=meta.streams.find(s=>s.codec_type==='video')
  const [numerator,denominator]=stream.r_frame_rate.split('/').map(Number)
  const pixels=execFileSync('/opt/homebrew/bin/ffmpeg',['-hide_banner','-loglevel','error','-i',raw,'-vf','crop=2:2:0:0,scale=1:1,format=rgb24','-f','rawvideo','pipe:1'])
  let boundary=-1
  for(let i=0;i<pixels.length;i+=3) if(pixels[i]>200 && pixels[i+1]<40 && pixels[i+2]>200) boundary=i/3
  if(boundary<0) throw new Error(`Missing capture boundary for slide ${clip.slide}`)
  const trim=(boundary+1)*denominator/numerator
  const keep=Number(meta.format.duration)-trim
  const destination=path(`motion-v21/slide-${clip.slide}.mp4`)
  execFileSync('/opt/homebrew/bin/ffmpeg',['-hide_banner','-loglevel','error','-y','-ss',trim.toFixed(3),'-i',raw,'-t',keep.toFixed(3),'-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-r','30','-movflags','+faststart',destination])
  manifest.push({slide:clip.slide,path:destination,duration:keep,states:clip.choices.length+1})
  console.log(`Recorded slide ${clip.slide}: ${keep.toFixed(1)}s, ${clip.choices.length+1} evidence states`)
}

await browser.close()
// Isolate cover renders: reusing a scaled page can misplace Chromium SVG text.
for(let slide=1;slide<=15;slide++) {
  const coverBrowser=await chromium.launch()
  const page=await coverBrowser.newPage({viewport:{width:2560,height:1440},deviceScaleFactor:1})
  await page.goto(`${base}/${slide}?motion=0`,{waitUntil:'networkidle'})
  await page.waitForTimeout(300)
  await page.screenshot({path:path(`slides-v21/slide-${slide}.png`)})
  await coverBrowser.close()
}

const source=await readFile(new URL('../slides.md',import.meta.url),'utf8')
const notes=[...source.matchAll(/<!--\s*([\s\S]*?)\s*-->/g)].map(m=>m[1])
if(notes.length!==15) throw new Error(`Expected 15 note blocks, got ${notes.length}`)
const pptx=new pptxgen()
pptx.layout='LAYOUT_WIDE'
pptx.author='SOFT3888 project team'
pptx.subject='Technical walkthrough · tensor flow, mechanisms and recorded evidence'
pptx.title='Reference-Guided Retouching'
pptx.company='SOFT3888'
pptx.lang='en-AU'
for(let i=1;i<=15;i++) {
  const slide=pptx.addSlide()
  const cover=path(`slides-v21/slide-${i}.png`)
  const clip=manifest.find(c=>c.slide===i)
  if(clip) {
    slide.addMedia({type:'video',path:clip.path,cover:`data:image/png;base64,${(await readFile(cover)).toString('base64')}`,x:0,y:0,w:13.333333,h:7.5,objectName:`Recorded mechanism playback · slide ${i}`})
    slide.addNotes(`${notes[i-1]}\n\nPlayback: click the slide video in PowerPoint to start. This embedded film combines saved evidence with labelled explanatory schematics; it is not live inference. Slides 4–9 explain the current manuscript formulation with labelled schematic features; slides 13–14 describe future memory construction and querying. No animation is a new model inference. The interactive web version provides individual controls and direct image comparison.`)
  } else {
    slide.addImage({path:cover,x:0,y:0,w:13.333333,h:7.5,altText:`Slide ${i}: Reference-Guided Retouching`})
    slide.addNotes(notes[i-1])
  }
}
await pptx.writeFile({fileName:path('Reference-Guided-Retouching-v21.pptx')})
const concat=manifest.map(c=>`file 'slide-${c.slide}.mp4'`).join('\n')+'\n'
await writeFile(path('motion-v21/sequence.txt'),concat)
execFileSync('/opt/homebrew/bin/ffmpeg',['-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',path('motion-v21/sequence.txt'),'-c','copy','-movflags','+faststart',path('Reference-Guided-Retouching-v21-motion.mp4')])
await writeFile(path('motion-v21/manifest.json'),JSON.stringify(manifest,null,2))
console.log('Exported 15-slide PPTX with seven embedded films and all speaker notes; walkthrough MP4 ready.')
