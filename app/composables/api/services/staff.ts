import { authApi } from '../axios'

export type StaffRole = 'admin' | 'waiter' | 'kitchen'

export interface StaffMember {
  id: number
  name: string
  email: string
  role: StaffRole
  isActive: boolean
  createdAt?: string
}

export interface AddStaffPayload {
  email: string
  role: StaffRole
}

/** Members of the current workspace with their roles. */
export function list(): Promise<StaffMember[]> {
  return authApi.get<{ data: StaffMember[] }>('/staff').then((r) => r.data.data)
}

/** Attach an existing user (by email) to the workspace with a role. */
export function add(payload: AddStaffPayload): Promise<StaffMember> {
  return authApi.post<{ data: StaffMember }>('/staff', payload).then((r) => r.data.data)
}

/** Change a member's role. */
export function updateRole(userId: number, role: StaffRole): Promise<StaffMember> {
  return authApi.put<{ data: StaffMember }>(`/staff/${userId}`, { role }).then((r) => r.data.data)
}

/** Activate or deactivate a member. */
export function setActive(userId: number, isActive: boolean): Promise<StaffMember> {
  return authApi.put<{ data: StaffMember }>(`/staff/${userId}`, { isActive }).then((r) => r.data.data)
}

/** Remove a member from the workspace. */
export function remove(userId: number): Promise<void> {
  return authApi.delete(`/staff/${userId}`).then(() => undefined)
}
