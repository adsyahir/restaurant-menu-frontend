import { authApi } from '../axios'

export type OrderStatus =
  | 'placed'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'paid'
  | 'cancelled'

export type PaymentMethod = 'cash' | 'card' | 'other'

export interface OrderItem {
  id: number
  menuItemId: number | null
  name: string
  variantLabel: string | null
  unitPrice: number
  quantity: number
  notes: string | null
}

export interface Order {
  id: number
  orderNumber: string
  trackToken?: string
  tableId: number | null
  tableLabel?: string | null
  createdByName?: string | null
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  total: number
  notes: string | null
  paymentMethod: PaymentMethod | null
  placedAt: string | null
  createdAt?: string
  updatedAt?: string
}

export interface OrderItemPayload {
  menuItemId?: number | null
  name: string
  variantLabel?: string | null
  unitPrice: number
  quantity: number
  notes?: string | null
}

export interface OrderPayload {
  tableId?: number | null
  status?: OrderStatus
  notes?: string | null
  paymentMethod?: PaymentMethod | null
  items: OrderItemPayload[]
}

/** Orders in the current workspace, newest first, optionally by status. */
export function list(params?: { status?: OrderStatus }): Promise<Order[]> {
  return authApi
    .get<{ data: Order[] }>('/orders', { params: { status: params?.status } })
    .then((r) => r.data.data)
}

export function get(id: number): Promise<Order> {
  return authApi.get<{ data: Order }>(`/orders/${id}`).then((r) => r.data.data)
}

export function create(payload: OrderPayload): Promise<Order> {
  return authApi.post<{ data: Order }>('/orders', payload).then((r) => r.data.data)
}

/** Update an order — status, table, notes, payment, or replace the item set. */
export function update(id: number, payload: Partial<OrderPayload>): Promise<Order> {
  return authApi.put<{ data: Order }>(`/orders/${id}`, payload).then((r) => r.data.data)
}

export function remove(id: number): Promise<void> {
  return authApi.delete(`/orders/${id}`).then(() => undefined)
}
