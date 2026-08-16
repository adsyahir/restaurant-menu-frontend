import { authApi } from '../axios'

export interface Variant {
  name: string
  priceModifier: number
}

export interface AddOn {
  name: string
  priceModifier: number
}

export interface MenuItem {
  id: number
  categoryId: number
  name: string
  description: string | null
  basePrice: number
  isAvailable: boolean
  dietaryTags: string[]
  variants: Variant[]
  addOns: AddOn[]
  imageUrl: string | null
  createdAt?: string
  updatedAt?: string
}

export interface MenuItemPayload {
  categoryId: number
  name: string
  description?: string | null
  basePrice: number
  isAvailable?: boolean
  dietaryTags?: string[]
  variants?: Variant[]
  addOns?: AddOn[]
  imageUrl?: string | null
}

/** Menu items in the current workspace, optionally filtered by category. */
export function list(params?: { categoryId?: number; available?: boolean }): Promise<MenuItem[]> {
  return authApi
    .get<{ data: MenuItem[] }>('/menu-items', {
      params: {
        category_id: params?.categoryId,
        available: params?.available,
      },
    })
    .then((r) => r.data.data)
}

export function get(id: number): Promise<MenuItem> {
  return authApi.get<{ data: MenuItem }>(`/menu-items/${id}`).then((r) => r.data.data)
}

export function create(payload: MenuItemPayload): Promise<MenuItem> {
  return authApi.post<{ data: MenuItem }>('/menu-items', payload).then((r) => r.data.data)
}

export function update(id: number, payload: Partial<MenuItemPayload>): Promise<MenuItem> {
  return authApi.put<{ data: MenuItem }>(`/menu-items/${id}`, payload).then((r) => r.data.data)
}

export function remove(id: number): Promise<void> {
  return authApi.delete(`/menu-items/${id}`).then(() => undefined)
}
