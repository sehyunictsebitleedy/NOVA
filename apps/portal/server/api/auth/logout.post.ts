import { NOVA_SESSION_COOKIE, requireNovaOrigin } from '@sebit-nova/ux/server'
import { novaAuthSettings } from '../../utils/nova'
export default defineEventHandler(event => {
  requireNovaOrigin(event, novaAuthSettings(event))
  deleteCookie(event, NOVA_SESSION_COOKIE, { path: '/' })
  return { authenticated: false }
})
