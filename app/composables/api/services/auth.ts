import { authApi, publicApi } from '../axios'
import { useAuthStore, type AuthUser } from '@/stores/auth'

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
  restaurant_name: string
  slug: string
  cuisine?: string | null
  address?: string | null
  country_code: string
  // Malaysia (structured)
  state_id?: number | string | null
  city_id?: number | string | null
  postcode_id?: number | string | null
  // Other countries (free text)
  state?: string | null
  city?: string | null
  postcode?: string | null
  plan: string
  terms: boolean
}

export interface AuthResponse {
  token: string
  user: AuthUser & { current_workspace?: Record<string, unknown> | null }
}

/** Create the account + workspace, then store the issued token. */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await publicApi.post<AuthResponse>('/register', payload)
  const auth = useAuthStore()
  auth.setToken(data.token)
  auth.setUser(data.user)
  return data
}

/** The current authenticated user (requires a token). */
export async function me(): Promise<AuthUser> {
  const { data } = await authApi.get<AuthUser>('/user')
  useAuthStore().setUser(data)
  return data
}

/** Clear the session locally. */
export function logout(): void {
  useAuthStore().clear()
}
