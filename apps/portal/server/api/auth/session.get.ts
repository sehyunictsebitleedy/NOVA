import { NOVA_SESSION_COOKIE, verifyNovaToken } from '@sebit-nova/ux/server'
import { novaAuthSettings } from '../../utils/nova'

export default defineEventHandler(async event => {
  const token = getCookie(event, NOVA_SESSION_COOKIE)
  if (!token) return { authenticated: false, user: null }
  return { authenticated: true, user: await verifyNovaToken(token, novaAuthSettings(event)) }
})
