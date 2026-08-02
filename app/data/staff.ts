import type { StaffMember, StaffRole } from './types'

export const roleLabels: Record<StaffRole, string> = {
  admin: 'Admin / Owner',
  waiter: 'Waiter',
  kitchen: 'Kitchen',
}

export const staff: StaffMember[] = [
  { id: 's-1', name: 'Zainab Rahman', email: 'zainab@warungnusantara.my', role: 'admin', isActive: true, createdAt: '2026-01-04T09:00:00+08:00' },
  { id: 's-2', name: 'Aisyah Karim', email: 'aisyah@warungnusantara.my', role: 'waiter', isActive: true, createdAt: '2026-01-12T09:00:00+08:00' },
  { id: 's-3', name: 'Farid Hassan', email: 'farid@warungnusantara.my', role: 'waiter', isActive: true, createdAt: '2026-02-01T09:00:00+08:00' },
  { id: 's-4', name: 'Chef Ramesh', email: 'ramesh@warungnusantara.my', role: 'kitchen', isActive: true, createdAt: '2026-01-06T09:00:00+08:00' },
  { id: 's-5', name: 'Siti Nurhaliza', email: 'siti@warungnusantara.my', role: 'kitchen', isActive: true, createdAt: '2026-03-15T09:00:00+08:00' },
  { id: 's-6', name: 'Daniel Lim', email: 'daniel@warungnusantara.my', role: 'waiter', isActive: false, createdAt: '2026-01-20T09:00:00+08:00' },
]
