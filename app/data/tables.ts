import type { RestaurantTable, TableStatus } from './types'

export const tableStatusLabels: Record<TableStatus, string> = {
  available: 'Available',
  occupied: 'Occupied',
  needs_cleaning: 'Needs Cleaning',
}

export const tables: RestaurantTable[] = [
  { id: 't-1', label: 'T1', seatingCapacity: 2, status: 'occupied', activeOrderNumber: 'ORD-20260706-002' },
  { id: 't-2', label: 'T2', seatingCapacity: 4, status: 'occupied', activeOrderNumber: 'ORD-20260706-005' },
  { id: 't-3', label: 'T3', seatingCapacity: 4, status: 'available' },
  { id: 't-4', label: 'T4', seatingCapacity: 4, status: 'occupied', activeOrderNumber: 'ORD-20260706-001' },
  { id: 't-5', label: 'T5', seatingCapacity: 6, status: 'needs_cleaning' },
  { id: 't-6', label: 'T6', seatingCapacity: 2, status: 'available' },
  { id: 't-7', label: 'T7', seatingCapacity: 4, status: 'occupied', activeOrderNumber: 'ORD-20260706-004' },
  { id: 't-8', label: 'T8', seatingCapacity: 8, status: 'available' },
  { id: 't-9', label: 'Patio 1', seatingCapacity: 4, status: 'available' },
  { id: 't-10', label: 'Patio 2', seatingCapacity: 4, status: 'needs_cleaning' },
  { id: 't-11', label: 'Patio 3', seatingCapacity: 6, status: 'occupied', activeOrderNumber: 'ORD-20260706-003' },
  { id: 't-12', label: 'Bar 1', seatingCapacity: 2, status: 'available' },
]
