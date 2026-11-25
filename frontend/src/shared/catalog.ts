export type Category = {
  _id?: string
  name?: string
  label?: string
  icon?: string
  desc?: string
  count?: number
  show?: boolean
}

export const fmt = (n: number) => `₫${(n || 0).toLocaleString("vi-VN")}`

export function unwrapApiList<T>(
  payload: unknown,
  nestedKey: "categories" | "products",
): T[] {
  if (!Array.isArray(payload)) return []

  return payload.flatMap((record) => {
    if (!record || typeof record !== "object") return []
    const nested = (record as Record<string, unknown>)[nestedKey]
    return Array.isArray(nested) ? nested : [record]
  }) as T[]
}

export function unwrapAdminList<T>(
  payload: unknown,
  nestedKey: "categories" | "products",
): T[] {
  if (!Array.isArray(payload)) return []

  return payload.flatMap((record) => {
    if (!record || typeof record !== "object") return []
    const source = record as Record<string, any>
    const nested = source[nestedKey]
    if (!Array.isArray(nested)) return [record as T]
    return nested.map((entry, index) => {
      if (!entry || typeof entry !== "object" || entry._id || !source._id)
        return entry
      return { ...entry, _id: `embedded:${source._id}:${nestedKey}:${index}` }
    })
  }) as T[]
}

export const toSlug = (str: string) => {
  if (!str) return ""
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}
