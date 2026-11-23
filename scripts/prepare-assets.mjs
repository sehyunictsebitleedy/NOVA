import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
const root = new URL('../', import.meta.url)
const output = new URL('apps/portal/public/', root)
await mkdir(output, { recursive: true })
// Explicit source allowlist; never serve the repository or docs directory.
await cp(new URL('site/concept/', root), new URL('concept/', output), { recursive: true })
await cp(new URL('site/design/assets/', root), new URL('design/assets/', output), { recursive: true })
await mkdir(new URL('classic/', output), { recursive: true })
await cp(new URL('site/index.html', root), new URL('classic/index.html', output))
for (const file of ['styles.css', 'app.js']) await cp(new URL(`site/${file}`, root), new URL(file, output))
await mkdir(new URL('prototype/', output), { recursive: true })
const prototype = await readFile(new URL('docs/02-design/nova-integrated-workspace.html', root), 'utf8')
await writeFile(new URL('prototype/index.html', output), prototype.replace(/boot\(\);\r?\n\}\)\(\);/, 'boot();\nif(new URLSearchParams(location.search).get("view")==="overview")openTab("T1");\n})();'))
console.log('Prepared allowlisted public assets; no documents, Git files or environment files copied.')
