import { NOVA_SESSION_COOKIE, novaGatewayFetch, readNovaJson, parseNovaNexusInput, requireNovaOrigin, requireNovaRole } from '@sebit-nova/ux/server'
import { novaAuthSettings, novaGatewaySettings } from '../../utils/nova'

export default defineEventHandler(async event => {
  const auth = novaAuthSettings(event)
  requireNovaOrigin(event, auth)
  await requireNovaRole(event, 'manager', auth)
  const body = parseNovaNexusInput(await readNovaJson(event))
  // Fixed, operator-configured API-On endpoint. No direct LLM calls or client-chosen URLs.
  return novaGatewayFetch(novaGatewaySettings(event), useRuntimeConfig(event).nova.nexusPath, {
    method: 'POST', token: getCookie(event, NOVA_SESSION_COOKIE), body,
  })
})
