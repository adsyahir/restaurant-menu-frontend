import type { Order, OrderStatus } from './types'

// Fixed "now" reference used only for presentational wait-time display.
// Replace with real timestamps from your API.
export const NOW = new Date('2026-07-06T13:05:00+08:00')

export const statusLabels: Record<OrderStatus, string> = {
  placed: 'Placed',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
  paid: 'Paid',
  cancelled: 'Cancelled',
}

// The forward-only lifecycle from the plan: placed → preparing → ready → served → paid
export const statusFlow: OrderStatus[] = [
  'placed',
  'preparing',
  'ready',
  'served',
  'paid',
]

export const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-20260706-001',
    tableLabel: 'T4',
    createdByName: 'Aisyah (Waiter)',
    status: 'preparing',
    placedAt: '2026-07-06T12:58:00+08:00',
    subtotal: 27.3,
    total: 27.3,
    notes: 'Customer in a hurry — lunch break.',
    items: [
      {
        id: 'oi-1',
        menuItemId: 'mi-nasi-lemak',
        name: 'Nasi Lemak Special',
        variantLabel: 'Large, Extra Egg',
        unitPrice: 17.4,
        quantity: 1,
        notes: 'No peanuts please',
      },
      {
        id: 'oi-2',
        menuItemId: 'mi-teh-tarik',
        name: 'Teh Tarik',
        variantLabel: 'Ais (Iced)',
        unitPrice: 3.5,
        quantity: 1,
      },
      {
        id: 'oi-3',
        menuItemId: 'mi-roti-canai',
        name: 'Roti Canai',
        variantLabel: 'Telur (Egg)',
        unitPrice: 5.0,
        quantity: 1,
      },
    ],
  },
  {
    id: '2',
    orderNumber: 'ORD-20260706-002',
    tableLabel: 'T1',
    createdByName: 'Aisyah (Waiter)',
    status: 'placed',
    placedAt: '2026-07-06T13:02:00+08:00',
    subtotal: 24.0,
    total: 24.0,
    items: [
      {
        id: 'oi-4',
        menuItemId: 'mi-satay',
        name: 'Chicken Satay (10 sticks)',
        variantLabel: '10 sticks, Extra Peanut Sauce',
        unitPrice: 15.0,
        quantity: 1,
      },
      {
        id: 'oi-5',
        menuItemId: 'mi-milo-dinosaur',
        name: 'Milo Dinosaur',
        variantLabel: 'Iced',
        unitPrice: 5.5,
        quantity: 1,
      },
      {
        id: 'oi-6',
        menuItemId: 'mi-limau-ais',
        name: 'Limau Ais',
        variantLabel: 'Iced',
        unitPrice: 3.5,
        quantity: 1,
      },
    ],
  },
  {
    id: '3',
    orderNumber: 'ORD-20260706-003',
    tableLabel: 'Patio 3',
    createdByName: 'Farid (Waiter)',
    status: 'placed',
    placedAt: '2026-07-06T13:04:00+08:00',
    subtotal: 41.0,
    total: 41.0,
    notes: 'Birthday — bring cendol last.',
    items: [
      {
        id: 'oi-7',
        menuItemId: 'mi-rendang',
        name: 'Beef Rendang',
        variantLabel: 'With Rice, Extra Beef',
        unitPrice: 24.0,
        quantity: 1,
        notes: 'Extra spicy',
      },
      {
        id: 'oi-8',
        menuItemId: 'mi-char-kuey-teow',
        name: 'Char Kuey Teow',
        variantLabel: 'Regular',
        unitPrice: 11.5,
        quantity: 1,
      },
      {
        id: 'oi-9',
        menuItemId: 'mi-cendol',
        name: 'Cendol',
        variantLabel: 'Regular',
        unitPrice: 6.5,
        quantity: 1,
      },
    ],
  },
  {
    id: '4',
    orderNumber: 'ORD-20260706-004',
    tableLabel: 'T7',
    createdByName: 'Farid (Waiter)',
    status: 'ready',
    placedAt: '2026-07-06T12:49:00+08:00',
    subtotal: 19.9,
    total: 19.9,
    items: [
      {
        id: 'oi-10',
        menuItemId: 'mi-mee-goreng',
        name: 'Mee Goreng Mamak',
        variantLabel: 'Regular, Add Chicken',
        unitPrice: 13.9,
        quantity: 1,
      },
      {
        id: 'oi-11',
        menuItemId: 'mi-teh-tarik',
        name: 'Teh Tarik',
        variantLabel: 'Hot',
        unitPrice: 3.0,
        quantity: 2,
      },
    ],
  },
  {
    id: '5',
    orderNumber: 'ORD-20260706-005',
    tableLabel: 'T2',
    createdByName: 'Aisyah (Waiter)',
    status: 'served',
    placedAt: '2026-07-06T12:35:00+08:00',
    subtotal: 33.4,
    total: 33.4,
    items: [
      {
        id: 'oi-12',
        menuItemId: 'mi-nasi-lemak',
        name: 'Nasi Lemak Special',
        variantLabel: 'Regular',
        unitPrice: 12.9,
        quantity: 2,
      },
      {
        id: 'oi-13',
        menuItemId: 'mi-cendol',
        name: 'Cendol',
        variantLabel: 'With Durian',
        unitPrice: 11.5,
        quantity: 1,
      },
    ],
  },
  {
    id: '6',
    orderNumber: 'ORD-20260706-006',
    tableLabel: 'T5',
    createdByName: 'Aisyah (Waiter)',
    status: 'paid',
    placedAt: '2026-07-06T11:58:00+08:00',
    subtotal: 22.4,
    total: 22.4,
    paymentMethod: 'cash',
    items: [
      {
        id: 'oi-14',
        menuItemId: 'mi-char-kuey-teow',
        name: 'Char Kuey Teow',
        variantLabel: 'Regular',
        unitPrice: 11.5,
        quantity: 1,
      },
      {
        id: 'oi-15',
        menuItemId: 'mi-roti-canai',
        name: 'Roti Canai',
        variantLabel: 'Plain',
        unitPrice: 3.5,
        quantity: 2,
      },
      {
        id: 'oi-16',
        menuItemId: 'mi-limau-ais',
        name: 'Limau Ais',
        variantLabel: 'Iced',
        unitPrice: 3.5,
        quantity: 1,
      },
    ],
  },
]

export function findOrder(orderNumber: string): Order | undefined {
  return orders.find(
    (o) => o.orderNumber === orderNumber || o.id === orderNumber,
  )
}

/** Minutes an order has been waiting, relative to the fixed demo NOW. */
export function waitMinutes(placedAt: string): number {
  const placed = new Date(placedAt).getTime()
  return Math.max(0, Math.round((NOW.getTime() - placed) / 60000))
}
