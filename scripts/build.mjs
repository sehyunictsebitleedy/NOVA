import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
await mkdir(new URL('dist/prototype/', root), { recursive: true });
await cp(new URL('site/', root), new URL('dist/', root), { recursive: true });
await mkdir(new URL('dist/classic/', root), { recursive: true });
await cp(new URL('site/index.html', root), new URL('dist/classic/index.html', root));
await cp(new URL('site/design/index.html', root), new URL('dist/index.html', root));
const prototype = await readFile(new URL('docs/02-design/nova-integrated-workspace.html', root), 'utf8');
// The only prototype source remains in docs; dist contains a generated view.
await writeFile(new URL('dist/prototype/index.html', root), prototype.replace(/boot\(\);\r?\n\}\)\(\);/, 'boot();\nif(new URLSearchParams(location.search).get("view")==="overview")openTab("T1");\n})();'));
console.log('Built dist/: introduction + prototype. Documents and Git metadata excluded.');
