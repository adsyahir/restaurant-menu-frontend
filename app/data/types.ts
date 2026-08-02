// Lightweight presentational types for the hardcoded sample data.
// These mirror the shapes in `Restaurant project plan.md` loosely — swap them
// for your real API/DB types when you wire up the backend.

export type OrderStatus =
  | 'placed'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'paid'
  | 'cancelled'

export type StaffRole = 'admin' | 'waiter' | 'kitchen'

export type TableStatus = 'available' | 'occupied' | 'needs_cleaning'

export type DietaryTag =
  | 'halal'
  | 'vegetarian'
  | 'vegan'
  | 'spicy'
  | 'contains-nuts'
  | 'seafood'

export type PaymentMethod = 'cash' | 'card' | 'other'

export interface Variant {
  name: string
  priceModifier: number
}

export interface AddOn {
  name: string
  priceModifier: number
}

export interface MenuItem {
  id: string
  categoryId: string
  name: string
  description: string
  basePrice: number
  isAvailable: boolean
  dietaryTags: DietaryTag[]
  variants: Variant[]
  addOns: AddOn[]
  imageUrl?: string
}

export interface Category {
  id: string
  name: string
  displayOrder: number
  isActive: boolean
}

export interface OrderItem {
  id: string
  menuItemId: string
  name: string
  variantLabel?: string
  unitPrice: number
  quantity: number
  notes?: string
}

export interface Order {
  id: string
  orderNumber: string
  tableLabel: string
  createdByName: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  total: number
  notes?: string
  placedAt: string // ISO timestamp
  paymentMethod?: PaymentMethod
}

export interface RestaurantTable {
  id: string
  label: string
  seatingCapacity: number
  status: TableStatus
  activeOrderNumber?: string
}

export interface StaffMember {
  id: string
  name: string
  email: string
  role: StaffRole
  isActive: boolean
  createdAt: string
}

// --- SaaS layer (multi-tenant workspaces, plans, billing) ---

export type PlanTier = 'free' | 'pro' | 'business'

export interface Workspace {
  id: string
  name: string
  slug: string
  emoji: string
  plan: PlanTier
  location: string
}

export interface Plan {
  tier: PlanTier
  name: string
  priceMonthly: number // RM per month; 0 = free
  tagline: string
  featured?: boolean
  limits: {
    orders: string
    staff: string
    tables: string
  }
  features: string[]
}

export interface Invoice {
  id: string
  number: string
  date: string // ISO
  amount: number
  status: 'paid' | 'due' | 'failed'
}

export interface Subscription {
  plan: PlanTier
  status: 'active' | 'past_due' | 'trialing'
  renewsOn: string // ISO
  seats: { used: number; total: number }
  usage: {
    ordersThisMonth: number
    ordersLimit: number
    menuItems: number
    menuItemsLimit: number
  }
  paymentMethod: { brand: string; last4: string; expiry: string }
}
