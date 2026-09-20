import { chromium } from 'playwright-chromium'
import { mkdir, writeFile } from 'node:fs/promises'

const base = process.env.SHOW_BASE ?? 'http://localhost:18335'
const pageUrl = slide => `${base}/${process.env.SHOW_ROUTER === 'hash' ? '#/' : ''}${slide}`
const total = 9
const output = new URL('./exports/previews/', import.meta.url)
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 })
const errors = []
page.on('pageerror', error => errors.push(`pageerror: ${error.message}`))
page.on('console', message => {
  if (message.type() === 'error')
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
    const svgImageChecks=await Promise.all([...slide.querySelectorAll('svg image')].map(async element=>{
      const src=element.getAttribute('href')
      const response=await fetch(src,{cache:'force-cache'})
      return response.ok?null:src
    }))
    return {
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
  const failed = result.error || result.overflowCount > 0 || result.missingImages.length > 0 || errors.length > 0
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
await page.goto(pageUrl(5), { waitUntil: 'networkidle' })
await page.locator('.slidev-page-5').getByRole('button', { name: 'Flowers', exact: true }).click()
await page.locator('.slidev-page-5').getByRole('button', { name: /0490/ }).click()
if (!await page.locator('.slidev-page-5 .attention-images img').first().getAttribute('src').then(src=>src.includes('ref3'))) throw new Error('Attention reference switch failed')
await page.goto(pageUrl(7), { waitUntil: 'networkidle' })
await page.locator('.slidev-page-7').getByRole('button', { name: /Dog/ }).click()
if (!await page.locator('.slidev-page-7 .evidence-plate figcaption').textContent().then(text=>text.includes('32.761'))) throw new Error('Sample metric switch failed')
await writeFile(new URL('./exports/qa.json', import.meta.url), JSON.stringify(report, null, 2))

await browser.close()
console.log(problems === 0 ? '\nALL CLEAR' : `\n${problems} slide(s) need attention`)
process.exit(problems === 0 ? 0 : 1)
