export interface NovaFilePolicy { maxBytes: number; maxFiles: number; accept?: string }
export function validateNovaFiles(files: Pick<File, 'name' | 'type' | 'size'>[], policy: NovaFilePolicy): string | null {
  if (files.length > policy.maxFiles) return `파일은 최대 ${policy.maxFiles}개까지 선택할 수 있습니다.`
  for (const file of files) {
    if (file.size > policy.maxBytes) return `${file.name}: 파일 크기 제한을 초과했습니다.`
    const rules = (policy.accept ?? '*').split(',').map(rule => rule.trim().toLowerCase()).filter(Boolean)
    const type = file.type.toLowerCase(), name = file.name.toLowerCase()
    const accepted = rules.some(rule => rule === '*' || rule === '*/*' || (rule.startsWith('.') ? name.endsWith(rule) : rule.endsWith('/*') ? type.startsWith(rule.slice(0, -1)) : type === rule))
    if (!accepted) return `${file.name}: 허용되지 않은 파일 형식입니다.`
  }
  return null
}
