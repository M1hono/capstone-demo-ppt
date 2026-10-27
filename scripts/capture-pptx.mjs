import { chromium } from 'playwright-chromium'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
const root = new URL('../', import.meta.url)
const scratch = new URL('tmp/slides/final-25/', root)
await mkdir(scratch, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 })
const snapshots = []
await page.emulateMedia({ reducedMotion: 'reduce' })
try {
  for (let n = 1; n <= 25; n++) {
    await page.goto(`${process.env.SHOW_BASE || 'http://127.0.0.1:18356'}/${n}?print=true`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(500)
    const slide = page.locator(`section[data-topic="${n}"]`)
    if (await slide.locator('.controls,.dim,.unrevealed,.context-links.hidden').count())
      throw new Error(`Slide ${n} did not enter the complete static export state`)
    await slide.locator('img').evaluateAll(images => Promise.all(images.map(img => img.decode())))
    const chartSelector = { 18: '.comparison-chart', 19: '.ablation-chart' }[n]
    if (chartSelector) await slide.locator(chartSelector).evaluate(el => el.dataset.nativeChart = 'true')
    const svgs = slide.locator('svg:not([data-native-chart]):not([data-native-chart] svg)')
    const svgFiles = []
    for (let i = 0; i < await svgs.count(); i++) {
      const el = svgs.nth(i)
      if (await el.evaluate(e => !!e.closest('[data-native-chart]'))) continue
      const file = `diagram-${n}-${i}.png`
      await el.screenshot({ path: fileURLToPath(new URL(file, scratch)), omitBackground: true })
      await el.evaluate((e, file) => e.dataset.exportImage = file, file)
      svgFiles.push(file)
    }
    const record = await slide.evaluate((section, n) => {
      const bounds = section.getBoundingClientRect()
      const rect = b => ({ left: b.x - bounds.x, top: b.y - bounds.y, width: b.width, height: b.height })
      const objects = []
      const visible = el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden' && Number(getComputedStyle(el).opacity) !== 0
      function walk(el) {
        if (!visible(el) || el.closest('[data-native-chart]')) return
        const style = getComputedStyle(el)
        const b = el.getBoundingClientRect()
        if (b.width < 1 || b.height < 1) return
        if (el instanceof SVGElement) {
          if (el.dataset.exportImage) objects.push({ kind: 'diagram', ...rect(b), file: el.dataset.exportImage })
          return
        }
        if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent')
          objects.push({ kind: 'rect', ...rect(b), color: style.backgroundColor })
        for (const side of ['Top', 'Bottom', 'Left', 'Right']) {
          const width = parseFloat(style[`border${side}Width`])
          if (!width || style[`border${side}Style`] === 'none') continue
          const p = rect(b)
          if (side === 'Top' || side === 'Bottom') { p.top += side === 'Bottom' ? p.height - width : 0; p.height = width }
          else { p.left += side === 'Right' ? p.width - width : 0; p.width = width }
          objects.push({ kind: 'rect', ...p, color: style[`border${side}Color`] })
        }
        if (el instanceof HTMLImageElement) {
          objects.push({ kind: 'image', ...rect(b), src: new URL(el.src).pathname, fit: style.objectFit, alt: el.alt })
          return
        }
        if (el instanceof HTMLSelectElement) {
          objects.push({ kind: 'text', ...rect(b), text: el.selectedOptions[0].text, size: parseFloat(style.fontSize), bold: false, color: style.color })
          return
        }
        for (const node of el.childNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) { walk(node); continue }
          if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue
          // Browser-measured line boxes keep PowerPoint text editable without reflowing paragraphs.
          const range = document.createRange()
          let line = null
          for (let i = 0; i < node.length; i++) {
            range.setStart(node, i); range.setEnd(node, i + 1)
            const box = range.getBoundingClientRect()
            if (!box.width || !box.height) continue
            if (!line || Math.abs(line.y - box.y) > 2) {
              if (line) emit(line)
              line = { x: box.x, y: box.y, width: box.width, height: box.height, text: node.textContent[i] }
            } else {
              line.width = box.right - line.x
              line.text += node.textContent[i]
            }
          }
          if (line) emit(line)
          function emit(line) {
            if (!line.text.trim()) return
            const text = style.textTransform === 'uppercase' ? line.text.toUpperCase() : line.text
            objects.push({ kind: 'text', ...rect(line), text, size: parseFloat(style.fontSize), font: style.fontFamily, bold: Number(style.fontWeight) >= 550, color: style.color })
          }
        }
      }
      walk(section)
      const chart = section.querySelector('[data-native-chart]')
      return { number: n, title: section.querySelector('h1').innerText, objects, chart: chart ? rect(chart.getBoundingClientRect()) : null }
    }, n)
    snapshots.push(record)
    await slide.screenshot({ path: fileURLToPath(new URL(`slide-${String(n).padStart(2, '0')}.png`, scratch)) })
    console.log(`Captured ${n}: ${record.objects.filter(o => o.kind === 'text').length} editable text runs`)
  }
  await writeFile(new URL('snapshots.json', scratch), JSON.stringify(snapshots, null, 2))
} finally { await browser.close() }
