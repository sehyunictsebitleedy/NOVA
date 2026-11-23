import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { createServer, type Server } from 'node:http'
import { createApp, defineEventHandler, toNodeListener } from 'h3'
import { SignJWT } from 'jose'
import { createSsoFinalizeHandler, requireNovaRole, verifyNovaToken, type NovaAuthSettings } from '../packages/ux/server/auth'
import { novaGatewayFetch, novaGatewayUrl, type NovaGatewaySettings } from '../packages/ux/server/gateway'
import { parseNovaNexusInput } from '../packages/ux/server/validation'
import { hasNovaRole } from '../packages/ux/shared/roles'

const secret = 'test-only-local-fixture-key-not-a-real-secret-0123456789'
const auth: NovaAuthSettings = { secret, issuer: 'test-hub', audience: 'test-nova', publicUrl: '', allowLocalHttp: true }
async function token(role = 'viewer', overrides: { secret?: string; issuer?: string; audience?: string; expiration?: number } = {}) {
  return new SignJWT({ role }).setProtectedHeader({ alg: 'HS256' }).setSubject('test-user')
    .setIssuedAt().setIssuer(overrides.issuer ?? auth.issuer).setAudience(overrides.audience ?? auth.audience)
    .setExpirationTime(overrides.expiration ?? Math.floor(Date.now() / 1000) + 300)
    .sign(new TextEncoder().encode(overrides.secret ?? secret))
}
afterEach(() => vi.unstubAllGlobals())

describe('Hub token verification and role boundaries', () => {
  it('accepts only a signed, scoped token and returns safe session fields', async () => {
    const result = await verifyNovaToken(await token('manager'), auth)
    expect(result).toMatchObject({ subject: 'test-user', role: 'manager' })
    expect(result).not.toHaveProperty('token')
    expect(result).not.toHaveProperty('secret')
  })
  it.each([
    { secret: secret + '-wrong' }, { issuer: 'another-hub' }, { audience: 'another-app' },
    { expiration: Math.floor(Date.now() / 1000) - 60 },
  ])('rejects tampered, mis-scoped or expired tokens: %j', async overrides => {
    await expect(verifyNovaToken(await token('viewer', overrides), auth)).rejects.toMatchObject({ statusCode: 401 })
  })
  it('rejects an unsigned payload and unsupported role aliases', async () => {
    await expect(verifyNovaToken('eyJhbGciOiJub25lIn0.eyJyb2xlIjoiYWRtaW4ifQ.', auth)).rejects.toMatchObject({ statusCode: 401 })
    await expect(verifyNovaToken(await token('builder'), auth)).rejects.toMatchObject({ statusCode: 401 })
  })
  it('fails closed without the verifier configuration', async () => {
    await expect(verifyNovaToken(await token(), { ...auth, secret: '' })).rejects.toMatchObject({ statusCode: 503 })
  })
  it('orders the canonical roles without promoting a viewer to manager', () => {
    expect(hasNovaRole('viewer', 'manager')).toBe(false)
    expect(hasNovaRole('admin', 'manager')).toBe(true)
    expect(hasNovaRole('manager', 'viewer')).toBe(true)
    expect(hasNovaRole('guest', 'viewer')).toBe(false)
  })
})

describe('HTTP authentication boundary', () => {
  let server: Server
  let base: string
  beforeAll(async () => {
    const app = createApp()
    app.use('/finalize', createSsoFinalizeHandler(() => auth))
    app.use('/manager', defineEventHandler(event => requireNovaRole(event, 'manager', auth)))
    server = createServer(toNodeListener(app))
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('No test address')
    base = `http://127.0.0.1:${address.port}`
    auth.publicUrl = base
  })
  afterAll(async () => {
    server.closeAllConnections()
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  })
  it('creates a host-only HttpOnly cookie after verification', async () => {
    const response = await fetch(base + '/finalize', { method: 'POST', headers: { Origin: base, 'Content-Type': 'application/json' }, body: JSON.stringify({ token: await token() }) })
    expect(response.status).toBe(200)
    const cookie = response.headers.get('set-cookie')!
    expect(cookie).toContain('sebit-token=')
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('SameSite=Lax')
    expect(cookie.toLowerCase()).not.toContain('domain=')
    expect(await response.json()).not.toHaveProperty('token')
  })
  it('rejects cross-origin and missing-origin POSTs before writing a session', async () => {
    for (const origin of [undefined, 'https://untrusted.test']) {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (origin) headers.Origin = origin
      const response = await fetch(base + '/finalize', { method: 'POST', headers, body: JSON.stringify({ token: await token() }) })
      expect(response.status).toBe(403)
      expect(response.headers.has('set-cookie')).toBe(false)
    }
  })
  it('does not accept bad signatures, oversized bodies or alternate methods', async () => {
    const invalid = await fetch(base + '/finalize', { method: 'POST', headers: { Origin: base, 'Content-Type': 'application/json' }, body: JSON.stringify({ token: await token('admin', { secret: secret + 'wrong' }) }) })
    expect(invalid.status).toBe(401)
    expect(invalid.headers.has('set-cookie')).toBe(false)
    const large = await fetch(base + '/finalize', { method: 'POST', headers: { Origin: base, 'Content-Type': 'application/json' }, body: JSON.stringify({ token: 'x'.repeat(30000) }) })
    expect(large.status).toBe(413)
    expect((await fetch(base + '/finalize')).status).toBe(405)
  })
  it('enforces role authorization independently of the UI', async () => {
    expect((await fetch(base + '/manager')).status).toBe(401)
    expect((await fetch(base + '/manager', { headers: { Cookie: `sebit-token=${await token('viewer')}` } })).status).toBe(403)
    expect((await fetch(base + '/manager', { headers: { Cookie: `sebit-token=${await token('manager')}` } })).status).toBe(200)
  })
})

describe('API-On gateway isolation', () => {
  const settings: NovaGatewaySettings = { url: 'https://gateway.test/gateway', serviceKey: 'test-only-service-key', timeoutMs: 1000, allowLocalHttp: false }
  it('injects server credentials only into a fixed upstream endpoint and disallows redirects', async () => {
    const request = vi.fn(async () => new Response(JSON.stringify({ rows: [] }), { headers: { 'Content-Type': 'application/json' } }))
    vi.stubGlobal('fetch', request)
    expect(await novaGatewayFetch(settings, '/showcase', { token: 'test-jwt' })).toEqual({ rows: [] })
    expect(request.mock.calls[0]?.[0].toString()).toBe('https://gateway.test/gateway/showcase')
    expect(request.mock.calls[0]?.[1]).toMatchObject({ redirect: 'error', headers: { 'X-Service-Key': settings.serviceKey, Authorization: 'Bearer test-jwt' } })
  })
  it.each(['//other.test/path', 'https://other.test', '/../private', '/%2e%2e/private', '/valid?redirect=other'])('rejects path escapes: %s', path => {
    expect(() => novaGatewayUrl(settings, path)).toThrow()
  })
  it('requires configuration and HTTPS, allowing HTTP only for explicit local fixtures', () => {
    expect(() => novaGatewayUrl({ ...settings, serviceKey: '' }, '/showcase')).toThrow('GATEWAY_NOT_CONFIGURED')
    expect(() => novaGatewayUrl({ ...settings, url: 'http://remote.test', allowLocalHttp: true }, '/showcase')).toThrow('INVALID_GATEWAY_URL')
    expect(() => novaGatewayUrl({ ...settings, url: 'https://user:password@gateway.test' }, '/showcase')).toThrow('INVALID_GATEWAY_URL')
    expect(novaGatewayUrl({ ...settings, url: 'http://127.0.0.1:1234', allowLocalHttp: true }, '/showcase').origin).toBe('http://127.0.0.1:1234')
  })
  it('never substitutes sample data on upstream failure or leaks sensitive upstream text', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('private upstream diagnostic', { status: 500 })))
    await expect(novaGatewayFetch(settings, '/showcase')).rejects.toMatchObject({ statusCode: 502, statusMessage: 'GATEWAY_REQUEST_FAILED' })
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('network diagnostic') }))
    await expect(novaGatewayFetch(settings, '/showcase')).rejects.toMatchObject({ statusCode: 502, statusMessage: 'GATEWAY_UNAVAILABLE' })
    vi.stubGlobal('fetch', vi.fn(async () => new Response('not-json')))
    await expect(novaGatewayFetch(settings, '/showcase')).rejects.toMatchObject({ statusCode: 502, statusMessage: 'INVALID_GATEWAY_RESPONSE' })
  })
  it('rejects client-chosen URLs and oversized Nexus input', () => {
    expect(() => parseNovaNexusInput({ input: 'test', url: 'https://other.test' })).toThrow()
    expect(() => parseNovaNexusInput({ input: 'x'.repeat(4001) })).toThrow()
    expect(parseNovaNexusInput({ input: '  실행 내용  ' })).toEqual({ input: '실행 내용' })
  })
})
