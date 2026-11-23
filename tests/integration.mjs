import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import { SignJWT } from 'jose'

const calls = []
const key = randomBytes(32).toString('hex')
const serviceKey = randomBytes(24).toString('hex')
const issuer = 'local-test-hub'
const audience = 'local-test-nova'
const upstream = createServer(async (req, res) => {
  let body = ''
  for await (const chunk of req) body += chunk
  calls.push({ path: req.url, authorization: req.headers.authorization, serviceKey: req.headers['x-service-key'], body })
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(req.url === '/gateway/showcase' ? { source: 'local-integration-fixture', rows: [{ id: 'fixture-row' }] } : { source: 'local-integration-fixture', accepted: true }))
})
await new Promise(resolve => upstream.listen(0, '127.0.0.1', resolve))
const upstreamPort = upstream.address().port
const portProbe = createServer()
await new Promise(resolve => portProbe.listen(0, '127.0.0.1', resolve))
const port = portProbe.address().port
await new Promise(resolve => portProbe.close(resolve))
const base = `http://127.0.0.1:${port}`
const child = spawn(process.execPath, [fileURLToPath(new URL('../apps/portal/.output/server/index.mjs', import.meta.url))], {
  env: {
    ...process.env, HOST: '127.0.0.1', PORT: String(port),
    NUXT_NOVA_PUBLIC_URL: base, NUXT_NOVA_ALLOW_LOCAL_HTTP: 'true',
    NUXT_NOVA_GATEWAY_URL: `http://127.0.0.1:${upstreamPort}/gateway`,
    NUXT_NOVA_GATEWAY_SERVICE_KEY: serviceKey,
    NUXT_NOVA_SHOWCASE_PATH: '/showcase', NUXT_NOVA_NEXUS_PATH: '/nexus',
    NUXT_NOVA_HUB_TOKEN_SECRET: key, NUXT_NOVA_HUB_ISSUER: issuer, NUXT_NOVA_HUB_AUDIENCE: audience,
  }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
})
// Do not print tokens, service keys, full process environment or upstream diagnostics.
child.stdout.resume()
child.stderr.resume()
try {
  let ready = false
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) throw new Error('Test Nitro server exited before readiness')
    try { ready = (await fetch(base + '/api/health')).ok } catch {}
    if (ready) break
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  assert.ok(ready, 'Test Nitro server readiness')
  async function signed(role) {
    return new SignJWT({ role }).setProtectedHeader({ alg: 'HS256' }).setSubject('integration-user').setIssuedAt()
      .setIssuer(issuer).setAudience(audience).setExpirationTime('5m').sign(new TextEncoder().encode(key))
  }
  async function finalize(role) {
    const response = await fetch(base + '/api/auth/sso-finalize', {
      method: 'POST', headers: { Origin: base, 'Content-Type': 'application/json' }, body: JSON.stringify({ token: await signed(role) }),
    })
    assert.equal(response.status, 200)
    const cookie = response.headers.get('set-cookie')
    assert.ok(cookie.includes('HttpOnly'))
    assert.ok(!cookie.toLowerCase().includes('domain='))
    return cookie.split(';')[0]
  }
  const viewerCookie = await finalize('viewer')
  const session = await fetch(base + '/api/auth/session', { headers: { Cookie: viewerCookie } })
  assert.equal((await session.json()).user.role, 'viewer')
  const data = await fetch(base + '/api/showcase', { headers: { Cookie: viewerCookie } })
  assert.equal(data.status, 200)
  assert.equal((await data.json()).source, 'local-integration-fixture')
  assert.equal(calls[0].path, '/gateway/showcase')
  assert.equal(calls[0].serviceKey, serviceKey)
  assert.ok(calls[0].authorization.startsWith('Bearer '))
  const denied = await fetch(base + '/api/nexus/run', { method: 'POST', headers: { Origin: base, Cookie: viewerCookie, 'Content-Type': 'application/json' }, body: JSON.stringify({ input: 'fixture' }) })
  assert.equal(denied.status, 403)
  assert.equal(calls.length, 1)
  const managerCookie = await finalize('manager')
  const run = await fetch(base + '/api/nexus/run', { method: 'POST', headers: { Origin: base, Cookie: managerCookie, 'Content-Type': 'application/json' }, body: JSON.stringify({ input: 'fixture' }) })
  assert.equal(run.status, 200)
  assert.equal(calls[1].path, '/gateway/nexus')
  assert.deepEqual(JSON.parse(calls[1].body), { input: 'fixture' })
  const forbidden = await fetch(base + '/api/auth/sso-finalize', { method: 'POST', headers: { Origin: 'https://untrusted.test', 'Content-Type': 'application/json' }, body: JSON.stringify({ token: await signed('admin') }) })
  assert.equal(forbidden.status, 403)
  const html = await (await fetch(base)).text()
  assert.ok(!html.includes(key) && !html.includes(serviceKey), 'Secrets must not enter SSR payload')
  const logout = await fetch(base + '/api/auth/logout', { method: 'POST', headers: { Origin: base, Cookie: managerCookie } })
  assert.equal(logout.status, 200)
  assert.ok(logout.headers.get('set-cookie').includes('Max-Age=0'))
  console.log('PASS: built Nitro + local upstream fixture: signed SSO cookie, session, viewer showcase, manager-only Nexus gateway call, CSRF rejection, private config isolation, logout. No real API-On or Nexus was called.')
} finally {
  child.kill()
  await new Promise(resolve => { if (child.exitCode !== null) resolve(); else child.once('exit', resolve) })
  upstream.closeAllConnections()
  await new Promise(resolve => upstream.close(resolve))
}
