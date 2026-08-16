import { authApi } from '../axios'

export type PlanTier = 'free' | 'pro' | 'business'

export interface Workspace {
  id: number
  uuid: string
  name: string
  slug: string
  emoji: string
  cuisine: string | null
  address: string | null
  state: string | null
  city: string | null
  postcode: string | null
  countryCode: string
  currency: string
  timezone: string
  plan: PlanTier
  ownerId: number
  createdAt?: string
  updatedAt?: string
}

export interface WorkspacePayload {
  name?: string
  emoji?: string | null
  cuisine?: string | null
  address?: string | null
  state?: string | null
  city?: string | null
  postcode?: string | null
  timezone?: string
  currency?: string
  plan?: PlanTier
}

/** The authenticated user's current workspace. */
export function current(): Promise<Workspace> {
  return authApi.get<{ data: Workspace }>('/workspace').then((r) => r.data.data)
}

/** Every workspace the user belongs to (for the switcher). */
export function list(): Promise<Workspace[]> {
  return authApi.get<{ data: Workspace[] }>('/workspaces').then((r) => r.data.data)
}

/** Switch the active workspace by its uuid; returns the now-current workspace. */
export function switchTo(uuid: string): Promise<Workspace> {
  return authApi.put<{ data: Workspace }>(`/workspaces/${uuid}/current`).then((r) => r.data.data)
}

export interface CreateWorkspacePayload {
  name: string
  country_code: string
  cuisine?: string | null
  address?: string | null
  state?: string | null
  city?: string | null
  postcode?: string | null
}

/**
 * Create an additional restaurant. Rejects with 403 when the account's plan
 * restaurant limit is reached. On success it becomes the current workspace.
 */
export function create(payload: CreateWorkspacePayload): Promise<Workspace> {
  return authApi.post<{ data: Workspace }>('/workspaces', payload).then((r) => r.data.data)
}

/** Update the current workspace profile / plan. */
export function update(payload: WorkspacePayload): Promise<Workspace> {
  return authApi.put<{ data: Workspace }>('/workspace', payload).then((r) => r.data.data)
}
