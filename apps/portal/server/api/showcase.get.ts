import { NOVA_SESSION_COOKIE, requireNovaRole, novaGatewayFetch } from '@sebit-nova/ux/server'
import { novaAuthSettings, novaGatewaySettings } from '../utils/nova'

export default defineEventHandler(async event => {
  await requireNovaRole(event, 'viewer', novaAuthSettings(event))
  return novaGatewayFetch(novaGatewaySettings(event), useRuntimeConfig(event).nova.showcasePath, {
    token: getCookie(event, NOVA_SESSION_COOKIE),
  })
})
