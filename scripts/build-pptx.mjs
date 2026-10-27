import { Presentation, PresentationFile } from '@oai/artifact-tool'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const scratch = new URL('tmp/slides/final-25/', root)
const previews = new URL('native-preview/', scratch)
await mkdir(previews, { recursive: true })
const snapshots = JSON.parse(await readFile(new URL('snapshots.json', scratch), 'utf8'))
const evidence = JSON.parse(await readFile(new URL('data/report-evidence.json', root), 'utf8'))
const notes = (await readFile(new URL('slides.md', root), 'utf8')).match(/<!--[\s\S]*?-->/g)
const presentation = Presentation.create({ slideSize: { width: 1280, height: 720 } })
const inspect = []
const palette = ['#161616', '#62625B', '#A5A59A']

function color(css) {
  if (css.startsWith('#')) return css
  const values = css.match(/[\d.]+/g)?.map(Number)
  if (!values) return '#161616'
  return '#' + values.slice(0, 3).map(x => Math.round(x).toString(16).padStart(2, '0')).join('')
}
function position(obj) {
  return { left: obj.left, top: obj.top, width: obj.width, height: obj.height }
}
async function blob(url) {
  const buffer = await readFile(url)
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
}
function text(slide, item, number) {
  const fontSize = item.size * .91
  const box = {
    left: item.left, top: item.top,
    width: Math.max(item.width + 10, fontSize),
    height: Math.max(item.height + 3, fontSize * 1.25),
  }
  const shape = slide.shapes.add({ geometry: 'rect', position: box, fill: '#00000000', line: { fill: '#00000000', width: 0 } })
  shape.text = item.text
  shape.text.fontSize = fontSize
  shape.text.typeface = item.font?.includes('Menlo') ? 'Menlo' : 'Arial'
  shape.text.color = color(item.color)
  shape.text.bold = item.bold
  shape.text.insets = { left: 0, right: 0, top: 0, bottom: 0 }
  shape.text.verticalAlignment = 'middle'
  inspect.push({ kind: 'text', slide: number, role: 'content', text: item.text, textChars: item.text.length, textLines: 1, bbox: box })
}
function nativeChart(slide, snapshot) {
  const chart = slide.charts.add('bar')
  chart.position = position(snapshot.chart)
  chart.plotAreaFill = '#F4F4F2'
  chart.barOptions.direction = snapshot.number === 18 ? 'bar' : 'column'
  chart.barOptions.grouping = 'clustered'
  const sets = snapshot.number === 13
    ? ['top1', 'best3', 'best5'].map((key, i) => ({ name: ['Top-1', 'Best-of-3*', 'Best-of-5*'][i], values: evidence.fivek.psnr[key] }))
    : snapshot.number === 15
      ? [{ name: 'PSNR (dB)', values: ['top1', 'best3', 'best5'].map(key => evidence.fivek.psnr[key][5]) }]
      : [{ name: 'Mean ms / batch', values: evidence.benchmark.rows.map(row => row.mean) }]
  chart.categories = snapshot.number === 13
    ? evidence.fivek.experts
    : snapshot.number === 15 ? ['Top-1', 'Best-of-3*', 'Best-of-5*']
      : evidence.benchmark.rows.map(row => `${row.batch} / ${row.mode} / ${row.history}`)
  sets.forEach((data, i) => {
    const series = chart.series.add(data.name)
    series.values = data.values
    series.categories = chart.categories
    series.fill = palette[i]
    series.stroke = { fill: palette[i], width: 0, style: 'solid' }
  })
  chart.hasLegend = snapshot.number === 13
  chart.xAxis.visible = true
  chart.yAxis.visible = true
  chart.yAxis.majorGridlines.visible = true
  chart.yAxis.majorGridlines.fill = '#D9D9D6'
  chart.yAxis.majorGridlines.width = .5
  chart.xAxis.line.fill = '#D9D9D6'
  chart.yAxis.line.fill = '#D9D9D6'
  chart.xAxis.tickLabelPosition = 'nextTo'
  chart.yAxis.tickLabelPosition = 'nextTo'
  chart.yAxis.min = 0
  chart.yAxis.max = snapshot.number === 18 ? 60 : 30
  chart.yAxis.majorUnit = snapshot.number === 18 ? 10 : 5
  chart.legend.position = 'bottom'
  chart.title = snapshot.number === 18 ? 'Mean latency (ms per batch)' : 'PSNR (dB)'
  for (const style of [chart.titleTextStyle, chart.legend.textStyle, chart.xAxis.textStyle, chart.yAxis.textStyle, chart.dataLabels.textStyle]) {
    style.typeface = 'Arial'; style.fontSize = 15; style.fill = '#161616'
  }
  chart.titleTextStyle.fontSize = 18
  chart.dataLabels.showValue = snapshot.number !== 13
  chart.dataLabels.position = 'outEnd'
  inspect.push({ kind: 'native-chart', slide: snapshot.number, series: sets, categories: chart.categories, bbox: position(snapshot.chart) })
}

for (const snapshot of snapshots) {
  const slide = presentation.slides.add()
  slide.background.fill = '#F4F4F2'
  for (const item of snapshot.objects) {
    if (item.kind === 'rect') {
      slide.shapes.add({ geometry: 'rect', position: position(item), fill: color(item.color), line: { fill: '#00000000', width: 0 } })
    } else if (item.kind === 'text') {
      text(slide, item, snapshot.number)
    } else if (item.kind === 'image' || item.kind === 'diagram') {
      const path = item.kind === 'diagram' ? new URL(item.file, scratch) : new URL('public' + item.src, root)
      const image = slide.images.add({ blob: await blob(path), fit: item.fit === 'contain' ? 'contain' : 'cover', alt: item.alt || `Diagram for ${snapshot.title}` })
      image.position = position(item)
    }
  }
  text(slide, { left: 46, top: 38, width: 19, height: 26, text: '//', size: 18, color: '#5C5C5C', bold: false }, snapshot.number)
  if (snapshot.chart) nativeChart(slide, snapshot)
  slide.speakerNotes.setText((notes[snapshot.number - 1] || '').replace(/<!--|-->/g, '').trim()
    + (snapshot.number === 2 ? '\nThe supplied preference illustration is conceptual and is not a model prediction.' : '')
    + '\nThe interactive source remains available in the course project folder.')
}
const file = await PresentationFile.exportPptx(presentation)
await file.save(fileURLToPath(new URL('exports/output.pptx', root)))
await writeFile(new URL('editable-inspect.json', scratch), JSON.stringify(inspect, null, 2))
console.log(`Exported ${presentation.slides.count} slides, ${inspect.filter(x => x.kind === 'text').length} editable text runs, 3 native charts.`)
for (let i = 0; i < presentation.slides.count; i++) {
  const output = await presentation.export({ slide: presentation.slides.getItem(i), format: 'png', scale: 1 })
  await writeFile(new URL(`slide-${String(i + 1).padStart(2, '0')}.png`, previews), new Uint8Array(await output.arrayBuffer()))
  console.log(`Rendered ${i + 1}`)
}
