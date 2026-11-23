import { readNovaJson } from './validation'
import { jwtVerify } from 'jose'
import { z } from 'zod'
import { createError, defineEventHandler, getCookie, getHeader, getMethod, setCookie, type H3Event } from 'h3'
import { NOVA_ROLES, hasNovaRole, type NovaRole, type NovaSession } from '../shared/roles'

export const NOVA_SESSION_COOKIE = 'sebit-token'
export interface NovaAuthSettings {
  secret: string; issuer: string; audience: string; publicUrl: string; allowLocalHttp: boolean
}
const claimsSchema = z.object({ sub: z.string().min(1), role: z.enum(NOVA_ROLES), exp: z.number().int().positive() })

export async function verifyNovaToken(token: string, settings: NovaAuthSettings): Promise<NovaSession> {
  if (!settings.secret || new TextEncoder().encode(settings.secret).length < 32 || !settings.issuer || !settings.audience) {
    throw createError({ statusCode: 503, statusMessage: 'AUTH_NOT_CONFIGURED' })
  }
  try {
    // Verification only. NOVA never issues Hub tokens and never trusts decoded claims.
    const { payload } = await jwtVerify(token, new TextEncoder().encode(settings.secret), {
      algorithms: ['HS256'], issuer: settings.issuer, audience: settings.audience,
      requiredClaims: ['sub', 'exp', 'iat'], clockTolerance: 5,
    })
    const claims = claimsSchema.parse(payload)
    return { subject: claims.sub, role: claims.role, expiresAt: claims.exp }
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'INVALID_SESSION' })
  }
}

export function trustedOrigin(settings: Pick<NovaAuthSettings, 'publicUrl' | 'allowLocalHttp'>): string {
  try {
    const url = new URL(settings.publicUrl)
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    if (url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Invalid site origin')
    if (url.protocol !== 'https:' && !(settings.allowLocalHttp && local && url.protocol === 'http:')) throw new Error('HTTPS required')
    return url.origin
  } catch { throw createError({ statusCode: 503, statusMessage: 'PUBLIC_URL_NOT_CONFIGURED' }) }
}

export function requireNovaOrigin(event: H3Event, settings: Pick<NovaAuthSettings, 'publicUrl' | 'allowLocalHttp'>) {
  const expected = trustedOrigin(settings)
  // Strict same-origin POSTs; no cross-origin form callbacks or wildcard CORS.
  if (getHeader(event, 'origin') !== expected) throw createError({ statusCode: 403, statusMessage: 'INVALID_ORIGIN' })
}

export async function requireNovaRole(event: H3Event, minimum: NovaRole, settings: NovaAuthSettings): Promise<NovaSession> {
  const token = getCookie(event, NOVA_SESSION_COOKIE)
  if (!token) throw createError({ statusCode: 401, statusMessage: 'AUTHENTICATION_REQUIRED' })
  const user = await verifyNovaToken(token, settings)
  if (!hasNovaRole(user.role, minimum)) throw createError({ statusCode: 403, statusMessage: 'INSUFFICIENT_ROLE' })
  return user
}

export function createSsoFinalizeHandler(getSettings: (event: H3Event) => NovaAuthSettings) {
  return defineEventHandler(async event => {
    if (getMethod(event) !== 'POST') throw createError({ statusCode: 405, statusMessage: 'METHOD_NOT_ALLOWED' })
    const settings = getSettings(event)
    requireNovaOrigin(event, settings)
    const body = z.object({ token: z.string().min(1).max(16384) }).strict().safeParse(await readNovaJson(event))
    if (!body.success) throw createError({ statusCode: 400, statusMessage: 'INVALID_TOKEN_REQUEST' })
    const user = await verifyNovaToken(body.data.token, settings)
    const secure = new URL(trustedOrigin(settings)).protocol === 'https:'
    setCookie(event, NOVA_SESSION_COOKIE, body.data.token, {
      httpOnly: true, secure, sameSite: 'lax', path: '/',
      maxAge: Math.max(0, user.expiresAt - Math.floor(Date.now() / 1000)),
      // Deliberately omit domain: host-only cookie.
    })
    return { authenticated: true, user }
  })
}
