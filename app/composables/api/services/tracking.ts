import { publicApi } from '../axios'
import type { OrderStatus } from './orders'

/** Slim, customer-facing order view returned by the public tracker. */
export interface PublicOrder {
  orderNumber: string
  status: OrderStatus
  tableLabel: string | null
  placedAt: string | null
  total: number
  items: { name: string; variantLabel: string | null; quantity: number }[]
}

/** Public order lookup by unguessable tracking token — no authentication. */
export function track(token: string): Promise<PublicOrder> {
  return publicApi.get<{ data: PublicOrder }>(`/track/${token}`).then((r) => r.data.data)
}
