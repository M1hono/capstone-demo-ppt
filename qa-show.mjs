import { chromium } from 'playwright-chromium'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const base = process.env.SHOW_BASE ?? 'http://localhost:18335'
const pageUrl = slide => `${base}/${process.env.SHOW_ROUTER === 'hash' ? '#/' : ''}${slide}`
const manuscriptTitles=['ReferenceGuidedRetouching',...JSON.parse(await readFile(new URL('./evidence/manuscript-section-titles.json',import.meta.url),'utf8'))]
const total = manuscriptTitles.length
const output = new URL('./exports/previews/', import.meta.url)
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 })
const errors = []
page.on('pageerror', error => errors.push(`pageerror: ${error.message}`))
page.on('console', message => {
  if (message.type() === 'error' || /Failed to resolve component/.test(message.text()))
    errors.push(`console: ${message.text()}`)
})

let problems = 0
const report = []
for (let i = 1; i <= total; i++) {
  errors.length = 0
  await page.goto(pageUrl(i), { waitUntil: 'networkidle' })
  await page.waitForTimeout(450)
  await page.waitForFunction(pageNumber => {
    const slide = document.querySelector(`.slidev-page-${pageNumber} .show-slide`)
    return slide && [...slide.querySelectorAll('img')].every(image => image.complete)
  }, i)
  const result = await page.evaluate(async (pageNumber) => {
    const slide = document.querySelector(`.slidev-page-${pageNumber} .show-slide`)
    if (!slide)
      return { error: 'no visible .show-slide section found' }
    const rect = slide.getBoundingClientRect()
    const overflows = []
    for (const element of slide.querySelectorAll('*')) {
      const box = element.getBoundingClientRect()
      if (box.width === 0 && box.height === 0)
        continue
      if (box.right > 1280.5 || box.bottom > 720.5 || box.left < -0.5 || box.top < -0.5) {
        overflows.push({
          tag: element.tagName,
          cls: String(element.className ?? '').slice(0, 70),
          box: [Math.round(box.left), Math.round(box.top), Math.round(box.right), Math.round(box.bottom)],
        })
      }
    }
    const unknownElements=[...slide.querySelectorAll('*')].filter(el=>el instanceof HTMLUnknownElement).map(el=>el.tagName)
    const overlaps=[]
    const diagramTexts=[...slide.querySelectorAll('svg text')].filter(el=>getComputedStyle(el).visibility!=='hidden')
    for(let a=0;a<diagramTexts.length;a++) for(let b=a+1;b<diagramTexts.length;b++) {
      const x=diagramTexts[a].getBoundingClientRect(),y=diagramTexts[b].getBoundingClientRect()
      const w=Math.min(x.right,y.right)-Math.max(x.left,y.left),h=Math.min(x.bottom,y.bottom)-Math.max(x.top,y.top)
      if(w>3 && h>3) overlaps.push([diagramTexts[a].textContent,diagramTexts[b].textContent])
    }
    const footerTop=slide.querySelector('.deck-footer').getBoundingClientRect().top
    const footerCollisions=[...slide.children].filter(el=>!el.matches('.deck-footer') && el.getBoundingClientRect().bottom>footerTop-5).map(el=>el.className)
    const coverCollision=slide.classList.contains('cover-slide') && slide.querySelector('.identity').getBoundingClientRect().bottom>slide.querySelector('.cover-names').getBoundingClientRect().top-12
    const emptyMechanism = [2,4,5,6,7,8,9,11,12,13,14].includes(pageNumber) && !slide.querySelector('.motion-scene')
    const svgImageChecks=await Promise.all([...slide.querySelectorAll('svg image')].map(async element=>{
      const src=element.getAttribute('href')
      const response=await fetch(src,{cache:'force-cache'})
      return response.ok?null:src
    }))
    return {
      unknownElements, textOverlaps:overlaps, footerCollisions, coverCollision, emptyMechanism,
      slideRect: [Math.round(rect.width), Math.round(rect.height)],
      overflowCount: overflows.length,
      overflows: overflows.slice(0, 6),
      snapshot: Boolean(slide.querySelector('.scene-snapshot')),
      missingImages: [...slide.querySelectorAll('img')].filter(img => !img.complete || !img.naturalWidth).map(img => img.getAttribute('src')).concat(svgImageChecks.filter(Boolean)),
      background: getComputedStyle(slide).backgroundColor,
      titleSize: getComputedStyle(slide.querySelector('h1,h2')).fontSize,
      title: slide.querySelector('h1,h2')?.textContent?.trim() ?? '',
      words: slide.innerText.match(/\b[\w’'-]+\b/g)?.length ?? 0,
    }
  }, i)
  result.manuscriptTitleMatches=result.title===manuscriptTitles[i-1]
  const failed = !result.manuscriptTitleMatches || result.error || result.overflowCount > 0 || result.unknownElements.length || result.textOverlaps.length || result.footerCollisions.length || result.coverCollision || result.emptyMechanism || result.missingImages.length > 0 || errors.length > 0
  await page.screenshot({ path: new URL(`slide-${String(i).padStart(2,'0')}.png`, output).pathname })
  report.push({ page: i, ...result, errors: [...errors] })
  console.log(`slide ${String(i).padStart(2, '0')}:`, JSON.stringify({ ...result, errors: errors.slice(0, 4) }), failed ? '  <-- CHECK' : '')
  if (failed)
    problems++
}

// Evidence controls must change the specimen, not just the button colour.
await page.goto(pageUrl(3), { waitUntil: 'networkidle' })
await page.locator('.slidev-page-3').getByRole('button', { name: 'Expert D', exact: false }).click()
if (!await page.locator('.slidev-page-3 .expert-measures img').first().getAttribute('src').then(src=>src.includes('expert-D'))) throw new Error('Expert switch failed')
// The manuscript's achievements must survive visual restructuring.
await page.goto(pageUrl(11), { waitUntil: 'networkidle' })
const achievements=await page.locator('.slidev-page-11 .show-slide').innerText()
for(const phrase of ['clearer definition of personalization','dynamically reconstruct FiveK','strong quantitative performance','27.2','22.1','24.5','23.1']) {
  if(!achievements.toLowerCase().includes(phrase.toLowerCase())) throw new Error(`Missing manuscript achievement or ablation: ${phrase}`)
}
await page.goto(pageUrl(1), { waitUntil: 'networkidle' })
if(await page.locator('.slidev-page-1 .cover-kicker,.slidev-page-1 .preference-definition,.footer-scope').count()) throw new Error('Decorative label or rejected cover banner returned')
await writeFile(new URL('./exports/qa.json', import.meta.url), JSON.stringify(report, null, 2))

await browser.close()
console.log(problems === 0 ? '\nALL CLEAR' : `\n${problems} slide(s) need attention`)
process.exit(problems === 0 ? 0 : 1)
