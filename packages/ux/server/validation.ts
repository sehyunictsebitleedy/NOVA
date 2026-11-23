import { createError, getHeader, type H3Event } from 'h3'
import { z } from 'zod'

// Node deployment: bound the stream, rather than trusting Content-Length.
export async function readNovaJson(event: H3Event, limit = 20000): Promise<unknown> {
  if (getHeader(event, 'content-type')?.split(';')[0]?.trim() !== 'application/json') {
    throw createError({ statusCode: 415, statusMessage: 'JSON_REQUIRED' })
  }
  const chunks: Buffer[] = []
  let size = 0
  for await (const raw of event.node.req) {
    const chunk = Buffer.isBuffer(raw) ? raw : Buffer.from(raw)
    size += chunk.length
    if (size > limit) throw createError({ statusCode: 413, statusMessage: 'REQUEST_TOO_LARGE' })
    chunks.push(chunk)
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) }
  catch { throw createError({ statusCode: 400, statusMessage: 'INVALID_JSON' }) }
}
export function parseNovaNexusInput(raw: unknown) {
  const parsed = z.object({ input: z.string().trim().min(1).max(4000) }).strict().safeParse(raw)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'INVALID_NEXUS_INPUT' })
  return parsed.data
}
