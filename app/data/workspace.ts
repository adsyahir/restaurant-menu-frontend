import type { Invoice, Plan, PlanTier, Subscription, Workspace } from './types'

// The tenant the user is currently signed into (first in the list).
export const workspaces: Workspace[] = [
  { id: 'w-1', name: 'Warung Nusantara', slug: 'warung-nusantara', emoji: '🍜', plan: 'pro', location: 'Kuala Lumpur' },
  { id: 'w-2', name: 'Kopitiam Corner', slug: 'kopitiam-corner', emoji: '☕', plan: 'free', location: 'Penang' },
  { id: 'w-3', name: 'Seri Melayu Bistro', slug: 'seri-melayu', emoji: '🥘', plan: 'business', location: 'Johor Bahru' },
]

export const currentWorkspace = workspaces[0]

export const planLabels: Record<PlanTier, string> = {
  free: 'Free',
  pro: 'Pro',
  business: 'Business',
}

export const plans: Plan[] = [
  {
    tier: 'free',
    name: 'Free',
    priceMonthly: 0,
    tagline: 'For a single stall getting started.',
    limits: { orders: '100 orders / month', staff: '2 staff seats', tables: '5 tables' },
    features: [
      'Order taking & kitchen display',
      'Basic menu management',
      'Public QR menu',
      'Email support',
    ],
  },
  {
    tier: 'pro',
    name: 'Pro',
    priceMonthly: 89,
    tagline: 'For busy restaurants running a full floor.',
    featured: true,
    limits: { orders: 'Unlimited orders', staff: '15 staff seats', tables: '50 tables' },
    features: [
      'Everything in Free',
      'Real-time order tracking',
      'Sales analytics & top-sellers',
      'Variants, add-ons & dietary tags',
      'Role-based access (waiter / kitchen / admin)',
      'Priority support',
    ],
  },
  {
    tier: 'business',
    name: 'Business',
    priceMonthly: 249,
    tagline: 'For multi-outlet groups & franchises.',
    limits: { orders: 'Unlimited orders', staff: 'Unlimited seats', tables: 'Unlimited tables' },
    features: [
      'Everything in Pro',
      'Multiple outlets in one account',
      'Custom branding on QR menus',
      'Advanced reporting & exports',
      'API access & webhooks',
      'Dedicated account manager',
    ],
  },
]

// Billing state for the current workspace (Pro plan).
export const subscription: Subscription = {
  plan: 'pro',
  status: 'active',
  renewsOn: '2026-08-28T00:00:00+08:00',
  seats: { used: 6, total: 15 },
  usage: {
    ordersThisMonth: 842,
    ordersLimit: 0, // 0 = unlimited
    menuItems: 11,
    menuItemsLimit: 0,
  },
  paymentMethod: { brand: 'Visa', last4: '4242', expiry: '08 / 27' },
}

export const invoices: Invoice[] = [
  { id: 'in-7', number: 'INV-2026-007', date: '2026-07-28T00:00:00+08:00', amount: 89, status: 'paid' },
  { id: 'in-6', number: 'INV-2026-006', date: '2026-06-28T00:00:00+08:00', amount: 89, status: 'paid' },
  { id: 'in-5', number: 'INV-2026-005', date: '2026-05-28T00:00:00+08:00', amount: 89, status: 'paid' },
  { id: 'in-4', number: 'INV-2026-004', date: '2026-04-28T00:00:00+08:00', amount: 89, status: 'paid' },
  { id: 'in-3', number: 'INV-2026-003', date: '2026-03-28T00:00:00+08:00', amount: 89, status: 'paid' },
]
