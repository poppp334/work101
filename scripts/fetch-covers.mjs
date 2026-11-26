// Downloads the curated covers into public/covers so the demo works offline
// and does not depend on Open Library latency at view time.
// Run after scripts/build-catalog.mjs.

import { mkdir, readFile, writeFile } from 'node:fs/promises'

const books = JSON.parse(await readFile('src/data/books.json', 'utf8'))
await mkdir('public/covers', { recursive: true })

let ok = 0
for (const book of books) {
  const url = book.coverIsbn
    ? `https://covers.openlibrary.org/b/isbn/${book.coverIsbn}-L.jpg`
    : book.coverId
      ? `https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`
      : null

  if (!url) {
    console.log(`skip ${book.slug} (no cover source)`)
    continue
  }

  const response = await fetch(url, { headers: { 'User-Agent': 'paperfold-poc/0.1' } })
  if (!response.ok) {
    console.log(`fail ${book.slug} HTTP ${response.status}`)
    continue
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  if (buffer.length < 1500) {
    console.log(`tiny ${book.slug} ${buffer.length}b`)
    continue
  }

  await writeFile(`public/covers/${book.slug}.jpg`, buffer)
  ok += 1
  console.log(`ok   ${book.slug} ${(buffer.length / 1024).toFixed(0)}kb`)
}

console.log(`\nsaved ${ok} covers`)
