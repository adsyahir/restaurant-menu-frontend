import { authApi } from '../axios'
import type { PlanTier } from './workspace'

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled'

export interface Subscription {
  plan: PlanTier
  status: SubscriptionStatus
  trialEndsAt: string | null // ISO 8601
  renewsOn: string | null // YYYY-MM-DD
  trialExpired: boolean
  limits: {
    restaurants: number | null // null = unlimited
  }
  usage: {
    restaurants: number
  }
  canAddRestaurant: boolean
}

/** The signed-in user's account subscription (plan, trial, restaurant limits). */
export function show(): Promise<Subscription> {
  return authApi.get<Subscription>('/subscription').then((r) => r.data)
}

/** Change the account plan; returns the refreshed subscription. */
export function update(plan: PlanTier): Promise<Subscription> {
  return authApi.put<Subscription>('/subscription', { plan }).then((r) => r.data)
}
