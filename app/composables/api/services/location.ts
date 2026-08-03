import { publicApi } from '../axios'

// Public location lookups — no authentication required.

export interface StateOption {
  id: number
  name: string
}

export interface CityOption {
  id: number
  name: string
}

export interface PostcodeOption {
  id: number
  code: string
}

/** States for a country (defaults to Malaysia). */
export function states(iso2 = 'MY'): Promise<StateOption[]> {
  return publicApi.get<StateOption[]>(`/states/${iso2}`).then((r) => r.data)
}

/** Cities within a state. */
export function cities(stateId: number | string): Promise<CityOption[]> {
  return publicApi.get<CityOption[]>(`/states/${stateId}/cities`).then((r) => r.data)
}

/** Postcodes within a city. */
export function postcodes(cityId: number | string): Promise<PostcodeOption[]> {
  return publicApi.get<PostcodeOption[]>(`/cities/${cityId}/postcodes`).then((r) => r.data)
}
