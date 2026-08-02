// Hardcoded dashboard figures. Wire these to real aggregate queries later.

export type DateRange = 'today' | 'week' | 'month'

export interface StatSummary {
  totalOrders: number
  revenue: number
  avgOrderValue: number
  ordersDelta: number // % change vs previous period
  revenueDelta: number
}

export const summaryByRange: Record<DateRange, StatSummary> = {
  today: { totalOrders: 42, revenue: 1284.5, avgOrderValue: 30.58, ordersDelta: 12, revenueDelta: 8 },
  week: { totalOrders: 318, revenue: 9640.2, avgOrderValue: 30.31, ordersDelta: 5, revenueDelta: 6 },
  month: { totalOrders: 1287, revenue: 39820.75, avgOrderValue: 30.94, ordersDelta: -3, revenueDelta: 2 },
}

export interface TopSellingItem {
  menuItemId: string
  name: string
  category: string
  quantitySold: number
  revenue: number
}

export const topSellingByRange: Record<DateRange, TopSellingItem[]> = {
  today: [
    { menuItemId: 'mi-nasi-lemak', name: 'Nasi Lemak Special', category: 'Rice & Noodles', quantitySold: 24, revenue: 341.6 },
    { menuItemId: 'mi-char-kuey-teow', name: 'Char Kuey Teow', category: 'Rice & Noodles', quantitySold: 18, revenue: 224.0 },
    { menuItemId: 'mi-teh-tarik', name: 'Teh Tarik', category: 'Beverages', quantitySold: 31, revenue: 96.5 },
    { menuItemId: 'mi-rendang', name: 'Beef Rendang', category: 'Main Course', quantitySold: 9, revenue: 172.0 },
    { menuItemId: 'mi-satay', name: 'Chicken Satay (10 sticks)', category: 'Snacks & Sides', quantitySold: 7, revenue: 98.0 },
  ],
  week: [
    { menuItemId: 'mi-nasi-lemak', name: 'Nasi Lemak Special', category: 'Rice & Noodles', quantitySold: 186, revenue: 2645.4 },
    { menuItemId: 'mi-teh-tarik', name: 'Teh Tarik', category: 'Beverages', quantitySold: 240, revenue: 744.0 },
    { menuItemId: 'mi-char-kuey-teow', name: 'Char Kuey Teow', category: 'Rice & Noodles', quantitySold: 132, revenue: 1584.0 },
    { menuItemId: 'mi-rendang', name: 'Beef Rendang', category: 'Main Course', quantitySold: 74, revenue: 1406.0 },
    { menuItemId: 'mi-cendol', name: 'Cendol', category: 'Desserts', quantitySold: 98, revenue: 686.0 },
  ],
  month: [
    { menuItemId: 'mi-nasi-lemak', name: 'Nasi Lemak Special', category: 'Rice & Noodles', quantitySold: 742, revenue: 10556.0 },
    { menuItemId: 'mi-teh-tarik', name: 'Teh Tarik', category: 'Beverages', quantitySold: 980, revenue: 3038.0 },
    { menuItemId: 'mi-char-kuey-teow', name: 'Char Kuey Teow', category: 'Rice & Noodles', quantitySold: 512, revenue: 6144.0 },
    { menuItemId: 'mi-rendang', name: 'Beef Rendang', category: 'Main Course', quantitySold: 298, revenue: 5662.0 },
    { menuItemId: 'mi-milo-dinosaur', name: 'Milo Dinosaur', category: 'Beverages', quantitySold: 356, revenue: 1958.0 },
  ],
}

export const rangeLabels: Record<DateRange, string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
}
