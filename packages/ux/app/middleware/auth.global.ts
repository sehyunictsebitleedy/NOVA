import { hasNovaRole, isNovaRole } from '../../shared/roles'

export default defineNuxtRouteMiddleware(async to => {
  const minimum = to.meta.minRole
  if (minimum === undefined || minimum === 'guest') return
  if (!isNovaRole(minimum)) return abortNavigation(createError({ statusCode: 500, statusMessage: 'Invalid page role configuration' }))
  let result: { authenticated: boolean; user?: { role: unknown } }
  try {
    result = await useRequestFetch()('/api/auth/session') as typeof result
  } catch {
    return abortNavigation(createError({ statusCode: 401, statusMessage: 'Session verification failed' }))
  }
  if (!result.authenticated) return abortNavigation(createError({ statusCode: 401, statusMessage: 'Authentication required' }))
  if (!isNovaRole(result.user?.role) || !hasNovaRole(result.user.role, minimum)) {
    return abortNavigation(createError({ statusCode: 403, statusMessage: 'Insufficient role' }))
  }
})
