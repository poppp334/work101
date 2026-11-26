// GitHub Pages needs a 404.html fallback so deep links reach the SPA,
// and a .nojekyll marker so the assets folder is served as-is.
import { copyFile, writeFile } from 'node:fs/promises'

await copyFile('dist/index.html', 'dist/404.html')
await writeFile('dist/.nojekyll', '')
console.log('pages: wrote dist/404.html and dist/.nojekyll')
