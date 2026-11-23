import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const routes = new Map([
  ['/design/assets/fonts.css', ['site/design/assets/fonts.css', 'text/css; charset=utf-8']],
  ['/design/assets/Pretendard-LICENSE.txt', ['site/design/assets/Pretendard-LICENSE.txt', 'text/plain; charset=utf-8']],
  ['/design/assets/PretendardVariable.subset.70.woff2', ['site/design/assets/PretendardVariable.subset.70.woff2', 'font/woff2']],
  ['/design/assets/PretendardVariable.subset.78.woff2', ['site/design/assets/PretendardVariable.subset.78.woff2', 'font/woff2']],
  ['/design/assets/PretendardVariable.subset.79.woff2', ['site/design/assets/PretendardVariable.subset.79.woff2', 'font/woff2']],
  ['/design/assets/PretendardVariable.subset.80.woff2', ['site/design/assets/PretendardVariable.subset.80.woff2', 'font/woff2']],
  ['/design/assets/PretendardVariable.subset.81.woff2', ['site/design/assets/PretendardVariable.subset.81.woff2', 'font/woff2']],
  ['/design/assets/PretendardVariable.subset.82.woff2', ['site/design/assets/PretendardVariable.subset.82.woff2', 'font/woff2']],
  ['/design/assets/PretendardVariable.subset.83.woff2', ['site/design/assets/PretendardVariable.subset.83.woff2', 'font/woff2']],
  ['/design/assets/PretendardVariable.subset.84.woff2', ['site/design/assets/PretendardVariable.subset.84.woff2', 'font/woff2']],
  ['/design/assets/PretendardVariable.subset.85.woff2', ['site/design/assets/PretendardVariable.subset.85.woff2', 'font/woff2']],
  ['/design/assets/PretendardVariable.subset.86.woff2', ['site/design/assets/PretendardVariable.subset.86.woff2', 'font/woff2']],
  ['/design/assets/PretendardVariable.subset.87.woff2', ['site/design/assets/PretendardVariable.subset.87.woff2', 'font/woff2']],
  ['/design/assets/PretendardVariable.subset.88.woff2', ['site/design/assets/PretendardVariable.subset.88.woff2', 'font/woff2']],
  ['/design/assets/PretendardVariable.subset.89.woff2', ['site/design/assets/PretendardVariable.subset.89.woff2', 'font/woff2']],
  ['/design/assets/PretendardVariable.subset.90.woff2', ['site/design/assets/PretendardVariable.subset.90.woff2', 'font/woff2']],
  ['/design/assets/PretendardVariable.subset.91.woff2', ['site/design/assets/PretendardVariable.subset.91.woff2', 'font/woff2']],
  ['/classic/', ['site/index.html', 'text/html; charset=utf-8']],
  ['/design/', ['site/design/index.html', 'text/html; charset=utf-8']],
  ['/design/style.css', ['site/design/style.css', 'text/css; charset=utf-8']],
  ['/design/main.js', ['site/design/main.js', 'text/javascript; charset=utf-8']],
  ['/concept/', ['site/concept/index.html', 'text/html; charset=utf-8']],
  ['/concept/style.css', ['site/concept/style.css', 'text/css; charset=utf-8']],
  ['/concept/script.js', ['site/concept/script.js', 'text/javascript; charset=utf-8']],
  ['/concept/assets/keycaps.webp', ['site/concept/assets/keycaps.webp', 'image/webp']],
  ['/concept/assets/ux.webp', ['site/concept/assets/ux.webp', 'image/webp']],
  ['/concept/assets/chart.webp', ['site/concept/assets/chart.webp', 'image/webp']],
  ['/concept/assets/grid.webp', ['site/concept/assets/grid.webp', 'image/webp']],
  ['/', ['site/design/index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['site/styles.css', 'text/css; charset=utf-8']],
  ['/app.js', ['site/app.js', 'text/javascript; charset=utf-8']],
  ['/prototype/', ['docs/02-design/nova-integrated-workspace.html', 'text/html; charset=utf-8']],
]);
const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
  let pathname;
  try { pathname = new URL(req.url, 'http://localhost').pathname; } catch { res.writeHead(400).end(); return; }
  const route = routes.get(pathname);
  if (!route) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('페이지를 찾을 수 없습니다.'); return; }
  try {
    let body = await readFile(new URL(route[0], root));
    // Overview is an ephemeral view of the original prototype, not a second source.
    if (pathname === '/prototype/' && new URL(req.url, 'http://localhost').searchParams.get('view') === 'overview') {
      body = Buffer.from(body.toString('utf8').replace(/boot\(\);\r?\n\}\)\(\);/, 'boot();\nopenTab("T1");\n})();'));
    }
    res.writeHead(200, { 'Content-Type': route[1], 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (error) { console.error(error); res.writeHead(500).end('페이지를 불러오지 못했습니다.'); }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(Number(process.env.PORT || 4000), '127.0.0.1', () => console.log(`NOVA: http://127.0.0.1:${server.address().port}`));
