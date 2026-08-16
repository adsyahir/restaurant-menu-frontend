import { authApi } from '../axios'

export type TableStatus = 'available' | 'occupied' | 'needs_cleaning'

export interface RestaurantTable {
  id: number
  label: string
  seatingCapacity: number
  status: TableStatus
  createdAt?: string
  updatedAt?: string
}

export interface TablePayload {
  label: string
  seatingCapacity?: number
  status?: TableStatus
}

/** All tables in the current workspace. */
export function list(): Promise<RestaurantTable[]> {
  return authApi.get<{ data: RestaurantTable[] }>('/tables').then((r) => r.data.data)
}

export function get(id: number): Promise<RestaurantTable> {
  return authApi.get<{ data: RestaurantTable }>(`/tables/${id}`).then((r) => r.data.data)
}

export function create(payload: TablePayload): Promise<RestaurantTable> {
  return authApi.post<{ data: RestaurantTable }>('/tables', payload).then((r) => r.data.data)
}

export function update(id: number, payload: Partial<TablePayload>): Promise<RestaurantTable> {
  return authApi.put<{ data: RestaurantTable }>(`/tables/${id}`, payload).then((r) => r.data.data)
}

export function remove(id: number): Promise<void> {
  return authApi.delete(`/tables/${id}`).then(() => undefined)
}
