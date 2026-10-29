import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-chromium'

const base = process.env.SHOW_BASE || 'http://127.0.0.1:18356'
const directory = process.env.DENSITY_REPORT || 'tmp/slides/density-fix'
await mkdir(directory, { recursive: true })
const browser = await chromium.launch()
const results = []
const errors = []

async function inspect(page, state) {
  const slide = page.locator('section[data-topic="7"]')
  await slide.waitFor({ state: 'visible' })
  await page.waitForTimeout(300)
  const result = await slide.evaluate(section => {
    const frame = section.getBoundingClientRect()
    const scale = frame.width / 1280
    const art = section.querySelector('.density-art')
    const area = art.getBoundingClientRect()
    const canvas = [...art.querySelectorAll('canvas')].find(el => getComputedStyle(el).display !== 'none')
    const bounds = canvas?.getBoundingClientRect()
    const formula = section.querySelector('.callout-formula b')
    const formulaBounds = formula.getBoundingClientRect()
    const footer = section.querySelector('footer').getBoundingClientRect()
    const readable = document.createElement('canvas')
    readable.width = 640; readable.height = 430
    const context = readable.getContext('2d')
    if (canvas?.width && canvas?.height) context.drawImage(canvas, 0, 0, 640, 430)
    const pixel = (x, y) => [...context.getImageData(x, y, 1, 1).data]
    return {
      artWidth: area.width / scale, artHeight: area.height / scale,
      canvasPosition: canvas && getComputedStyle(canvas).position,
      canvasWidth: bounds?.width / scale, canvasHeight: bounds?.height / scale,
      drawingWidth: canvas?.width, drawingHeight: canvas?.height,
      formulaWidth: formulaBounds.width / scale, formulaHeight: formulaBounds.height / scale,
      footerClearance: (footer.top - area.bottom) / scale,
      controls: section.querySelectorAll('button,input,select,.controls').length,
      animations: section.getAnimations({ subtree: true }).length,
      axisLabels: [...art.querySelectorAll('.density-axes text')].map(label => {
        const range = document.createRange()
        range.selectNodeContents(label)
        const glyph = range.getBoundingClientRect()
        const element = label.getBoundingClientRect()
        return { text: label.textContent, xDelta: glyph.x - element.x, widthDelta: glyph.width - element.width }
      }),
      leftPeak: pixel(183, 202), rightPeak: pixel(361, 260), lowDensity: pixel(285, 112),
    }
  })
  results.push({ state, ...result })
  console.log(JSON.stringify(results.at(-1)))
  assert.equal(result.canvasPosition, 'absolute', `${state}: canvas entered normal layout`)
  assert(Math.abs(result.artWidth / result.artHeight - 640 / 430) < .01, `${state}: plot aspect ratio drifted`)
  assert(Math.abs(result.canvasWidth - result.artWidth) < 1, `${state}: canvas width differs from overlay`)
  assert(Math.abs(result.canvasHeight - result.artHeight) < 1, `${state}: canvas height differs from overlay`)
  assert(result.drawingWidth < 2000 && result.drawingHeight < 2000, `${state}: canvas resolution grew without bound`)
  assert(result.formulaWidth > 100 && result.formulaHeight < 30, `${state}: formula wrapped into a narrow column`)
  assert(result.footerClearance > 25, `${state}: plot overlaps footer`)
  for (const pixel of [result.leftPeak, result.rightPeak]) {
    assert(pixel[0] > pixel[2] + 50 && pixel[3] > 200, `${state}: density peak is absent`)
  }
  assert.equal(result.controls, 0)
  assert.equal(result.animations, 0)
  for (const label of result.axisLabels)
    assert(Math.abs(label.xDelta) <= 2 && Math.abs(label.widthDelta) <= 2, `${state}: axis glyph layout differs for ${label.text}`)
  await slide.screenshot({ path: `${directory}/${state}.png` })
}

try {
  for (const fallback of [false, true]) {
    const mode = fallback ? 'fallback' : 'shader'
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
    page.on('pageerror', error => errors.push(`${mode}: ${error.message}`))
    if (fallback) await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        return /webgl/i.test(type) ? null : original.call(this, type, ...args)
      }
    })
    await page.goto(`${base}/7`, { waitUntil: 'networkidle' })
    await inspect(page, `${mode}-1440`)
    for (const [width, height] of [[1920, 1080], [900, 650], [667, 375], [1280, 720]]) {
      await page.setViewportSize({ width, height })
      await inspect(page, `${mode}-${width}`)
    }
    await page.keyboard.press('ArrowRight')
    await page.locator('section[data-topic="8"]').waitFor({ state: 'visible' })
    await page.keyboard.press('ArrowLeft')
    await inspect(page, `${mode}-return`)
    await page.goto(`${base}/7?print=true`, { waitUntil: 'networkidle' })
    await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' })
    await inspect(page, `${mode}-print`)
    await page.close()
  }
  assert.deepEqual(errors, [], 'Browser runtime errors')
  console.log(`PASS: page 7, ${results.length} states; stable canvas/overlay, readable formula, two rendered peaks, no controls or animation.`)
} finally {
  await writeFile(`${directory}/report.json`, JSON.stringify({ base, results, errors }, null, 2) + '\n')
  await browser.close()
}
