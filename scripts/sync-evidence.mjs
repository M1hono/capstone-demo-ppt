import { copyFile } from 'node:fs/promises'
for (const name of ['report-evidence.json', 'model-artifacts.json'])
  await copyFile(new URL(`../data/${name}`, import.meta.url), new URL(`../public/evidence/${name}`, import.meta.url))
await copyFile(new URL('../docs/ACHIEVEMENTS.md', import.meta.url), new URL('../public/evidence/ACHIEVEMENTS.md', import.meta.url))
console.log('Downloadable evidence synchronised with component data.')
