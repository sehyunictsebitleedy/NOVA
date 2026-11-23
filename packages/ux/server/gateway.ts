import { createError } from 'h3'

export interface NovaGatewaySettings { url: string; serviceKey: string; timeoutMs: number; allowLocalHttp: boolean }

export function novaGatewayUrl(settings: NovaGatewaySettings, path: string): URL {
  if (!settings.url || !settings.serviceKey || !path) throw createError({ statusCode: 503, statusMessage: 'GATEWAY_NOT_CONFIGURED' })
  // Paths come from server configuration, never arbitrary client input.
  if (!/^\/[a-zA-Z0-9/_-]+$/.test(path) || path.startsWith('//')) throw createError({ statusCode: 503, statusMessage: 'INVALID_GATEWAY_PATH' })
  try {
    const base = new URL(settings.url)
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)
    if (base.username || base.password || base.hash || base.search) throw new Error('Invalid base')
    if (base.protocol !== 'https:' && !(settings.allowLocalHttp && local && base.protocol === 'http:')) throw new Error('HTTPS required')
    return new URL(base.href.replace(/\/$/, '') + path)
  } catch { throw createError({ statusCode: 503, statusMessage: 'INVALID_GATEWAY_URL' }) }
}

export async function novaGatewayFetch<T = unknown>(settings: NovaGatewaySettings, path: string, options: {
  method?: 'GET' | 'POST'; token?: string; body?: unknown
} = {}): Promise<T> {
  const url = novaGatewayUrl(settings, path)
  const headers: Record<string, string> = { Accept: 'application/json', 'X-Service-Key': settings.serviceKey }
  if (options.token) headers.Authorization = `Bearer ${options.token}`
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  let response: Response
  try {
    response = await fetch(url, {
      method: options.method ?? 'GET', headers, redirect: 'error',
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: AbortSignal.timeout(Math.min(30000, Math.max(100, Number(settings.timeoutMs) || 10000))),
    })
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'GATEWAY_UNAVAILABLE' })
  }
  if (!response.ok) {
    throw createError({ statusCode: response.status === 401 || response.status === 403 ? response.status : 502, statusMessage: 'GATEWAY_REQUEST_FAILED' })
  }
  try { return await response.json() as T }
  catch { throw createError({ statusCode: 502, statusMessage: 'INVALID_GATEWAY_RESPONSE' }) }
}
