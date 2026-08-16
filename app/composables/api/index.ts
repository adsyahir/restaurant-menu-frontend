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
import * as billing from './services/billing'
import * as categories from './services/categories'
import * as dashboard from './services/dashboard'
import * as location from './services/location'
import * as menuItems from './services/menuItems'
import * as orders from './services/orders'
import * as publicMenu from './services/publicMenu'
import * as staff from './services/staff'
import * as subscription from './services/subscription'
import * as tables from './services/tables'
import * as tracking from './services/tracking'
import * as workspace from './services/workspace'

export const api = {
  auth,
  billing,
  location,
  categories,
  menuItems,
  tables,
  orders,
  staff,
  subscription,
  workspace,
  dashboard,
  tracking,
  publicMenu,
}

export type Api = typeof api

// Re-export the instances for direct use / auth wiring.
export { authApi, publicApi } from './axios'

export default api
