import { chromium } from 'playwright-chromium'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const base = process.env.SHOW_BASE ?? 'http://localhost:18340'
const total = Number(process.env.SHOW_TOTAL ?? 42)
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
  await page.goto(`${base}/${i}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const result = await page.evaluate((pageNumber) => {
    const slide = document.querySelector(`.slidev-page-${pageNumber} section`)
    if (!slide)
      return { error: 'no visible slide section found' }
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
    const canvas = slide.querySelector('canvas')
    const canvasDrawn = canvas ? canvas.width > 0 : null
    return { title: document.title, overflows, canvas: !!canvas, canvasDrawn }
  }, i)
  const pageProblems = []
  if (result.error)
    pageProblems.push(result.error)
  if (i === 2 && !result.canvas)
    pageProblems.push('page 2 missing WebGL canvas')
  if (i === 2 && result.canvasDrawn === false)
    pageProblems.push('page 2 canvas has zero width')
  if (result.overflows?.length)
    pageProblems.push(`overflow: ${JSON.stringify(result.overflows.slice(0, 4))}`)
  if (errors.length)
    pageProblems.push(errors.join(' | '))
  await page.screenshot({ path: fileURLToPath(new URL(`page-${String(i).padStart(2, '0')}.png`, output)) })
  report.push({ page: i, problems: pageProblems })
  if (pageProblems.length)
    problems += pageProblems.length
  console.log(`page ${i}: ${pageProblems.length ? pageProblems.join(' ; ') : 'OK'}`)
}
await browser.close()
await writeFile(new URL('./exports/qa-show.json', import.meta.url), JSON.stringify({ report, problems }, null, 2))
console.log(problems ? `PROBLEMS: ${problems}` : 'ALL CLEAR')
process.exit(problems ? 1 : 0)
