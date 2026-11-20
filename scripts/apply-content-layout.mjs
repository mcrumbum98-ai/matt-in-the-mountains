import {readFile, writeFile} from 'node:fs/promises'
import {join} from 'node:path'

const targets = [
  ['gear', 'reviews'],
  ['journal', 'posts'],
]

const stylesheet = '<link rel="stylesheet" href="../../../assets/css/content-layout.css">'

async function patchGeneratedPages(rootParts) {
  const {readdir} = await import('node:fs/promises')
  const root = join(process.cwd(), ...rootParts)
  let entries = []
  try {
    entries = await readdir(root, {withFileTypes: true})
  } catch {
    return 0
  }

  let count = 0
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const file = join(root, entry.name, 'index.html')
    try {
      let html = await readFile(file, 'utf8')
      if (!html.includes('content-layout.css')) {
        html = html.replace('</head>', `${stylesheet}</head>`)
        await writeFile(file, html)
      }
      count++
    } catch {
      // Ignore folders that are not generated content pages.
    }
  }
  return count
}

let total = 0
for (const target of targets) total += await patchGeneratedPages(target)
console.log(`Applied shared editorial layout fixes to ${total} generated page(s).`)
