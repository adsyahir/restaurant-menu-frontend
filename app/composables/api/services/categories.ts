import { authApi } from '../axios'

export interface Category {
  id: number
  name: string
  displayOrder: number
  isActive: boolean
  menuItemsCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface CategoryPayload {
  name: string
  displayOrder?: number
  isActive?: boolean
}

/** All categories in the current workspace. */
export function list(): Promise<Category[]> {
  return authApi.get<{ data: Category[] }>('/categories').then((r) => r.data.data)
}

export function get(id: number): Promise<Category> {
  return authApi.get<{ data: Category }>(`/categories/${id}`).then((r) => r.data.data)
}

export function create(payload: CategoryPayload): Promise<Category> {
  return authApi.post<{ data: Category }>('/categories', payload).then((r) => r.data.data)
}

export function update(id: number, payload: Partial<CategoryPayload>): Promise<Category> {
  return authApi.put<{ data: Category }>(`/categories/${id}`, payload).then((r) => r.data.data)
}

export function remove(id: number): Promise<void> {
  return authApi.delete(`/categories/${id}`).then(() => undefined)
}
