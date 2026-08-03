/**
 * Single entry point for every backend service.
 *
 *   import { api } from "@/composables/api";
 *
 *   const states = await api.location.states();       // public, no auth
 *   const cities = await api.location.cities(stateId);
 *   // await api.auth.login(email, password);          // add auth services here
 *
 * Each domain is its own module in `services/`. Add a new one by creating
 * `composables/api/services/<domain>.ts` and registering it below.
 *
 * Auth: services use either the `publicApi` (no token) or the `authApi`
 * (Bearer token + auto-refresh on 401) instance from `./axios`. The token
 * itself lives in the Pinia auth store (`useAuthStore`).
 */
import * as auth from './services/auth'
import * as location from './services/location'

export const api = {
  auth,
  location,
}

export type Api = typeof api

// Re-export the instances for direct use / auth wiring.
export { authApi, publicApi } from './axios'

export default api
