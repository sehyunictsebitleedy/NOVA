export const NOVA_ROLES = ['guest', 'viewer', 'editor', 'manager', 'admin'] as const
export type NovaRole = typeof NOVA_ROLES[number]
export interface NovaSession { subject: string; role: NovaRole; expiresAt: number }
export function isNovaRole(value: unknown): value is NovaRole {
  return typeof value === 'string' && (NOVA_ROLES as readonly string[]).includes(value)
}
export function hasNovaRole(role: NovaRole, minimum: NovaRole): boolean {
  return NOVA_ROLES.indexOf(role) >= NOVA_ROLES.indexOf(minimum)
}
