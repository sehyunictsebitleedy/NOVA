import { useRuntimeConfig } from '#imports'
import type { H3Event } from 'h3'
import type { NovaAuthSettings, NovaGatewaySettings } from '@sebit-nova/ux/server'

export function novaAuthSettings(event: H3Event): NovaAuthSettings {
  const config = useRuntimeConfig(event).nova
  return { secret: config.hubTokenSecret, issuer: config.hubIssuer, audience: config.hubAudience,
    publicUrl: config.publicUrl, allowLocalHttp: config.allowLocalHttp }
}
export function novaGatewaySettings(event: H3Event): NovaGatewaySettings {
  const config = useRuntimeConfig(event).nova
  return { url: config.gatewayUrl, serviceKey: config.gatewayServiceKey, timeoutMs: config.gatewayTimeoutMs, allowLocalHttp: config.allowLocalHttp }
}
