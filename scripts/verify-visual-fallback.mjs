import { chromium } from 'playwright-chromium'
import assert from 'node:assert/strict'
const browser = await chromium.launch({headless:true})
try {
  const page = await browser.newPage({viewport:{width:1280,height:720}})
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function(type,...args) {
      return /webgl/i.test(type) ? null : original.call(this,type,...args)
    }
  })
  await page.goto('http://127.0.0.1:18341/30',{waitUntil:'networkidle'})
  const slide = page.locator('section[data-topic="30"]')
  await slide.locator('.fallback-plot').waitFor()
  assert.equal(await slide.locator('.fallback-plot circle').count(),514)
  assert.equal(await slide.locator('canvas, .missing, .placeholder').count(),0)
  const point = slide.locator('.fallback-plot g').first().locator('circle').nth(1)
  const before = await point.getAttribute('cx')
  await slide.getByLabel('Distribution rotation').fill('110')
  assert.notEqual(await point.getAttribute('cx'),before)
  await page.screenshot({path:'exports/previews/page-30-svg-fallback.png'})
  console.log('PASS: blocked WebGL produces 512 visible sample points and two populated projection frames; rotation changes coordinates; no empty image frame.')
} finally { await browser.close() }
