import { authApi } from '../axios'

export type DateRange = 'today' | 'week' | 'month'

export interface StatSummary {
  totalOrders: number
  revenue: number
  avgOrderValue: number
  ordersDelta: number
  revenueDelta: number
}

export interface TopSellingItem {
  name: string
  quantitySold: number
  revenue: number
}

export interface DashboardStats {
  range: DateRange
  summary: StatSummary
  topSelling: TopSellingItem[]
}

/** Aggregate order stats + top sellers for the current workspace. */
export function stats(range: DateRange = 'today'): Promise<DashboardStats> {
  return authApi.get<DashboardStats>('/dashboard', { params: { range } }).then((r) => r.data)
}
