import { copyFile, readFile, writeFile } from 'node:fs/promises'
const script = await readFile(new URL('../slides.md', import.meta.url), 'utf8')
const words = [...script.matchAll(/<!--\n([\s\S]*?)\n-->/g)].map(match =>
  match[1].split('\n').filter(line => !/^(Presenter |Source:)/.test(line)).join(' ').match(/\b[\w’'-]+\b/g)?.length || 0)
await writeFile(new URL('../data/playback-timing.json', import.meta.url), JSON.stringify({ scriptWords: words }, null, 2) + '\n')
for (const name of ['report-evidence.json', 'model-artifacts.json', 'image-diagnostics.json', 'component-index.json'])
  await copyFile(new URL(`../data/${name}`, import.meta.url), new URL(`../public/evidence/${name}`, import.meta.url))
await copyFile(new URL('../docs/ACHIEVEMENTS.md', import.meta.url), new URL('../public/evidence/ACHIEVEMENTS.md', import.meta.url))
console.log('Downloadable evidence synchronised with component data.')
