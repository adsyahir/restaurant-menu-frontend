import type { Category, MenuItem, DietaryTag } from './types'

export const categories: Category[] = [
  { id: 'cat-rice', name: 'Rice & Noodles', displayOrder: 1, isActive: true },
  { id: 'cat-main', name: 'Main Course', displayOrder: 2, isActive: true },
  { id: 'cat-snack', name: 'Snacks & Sides', displayOrder: 3, isActive: true },
  { id: 'cat-sweet', name: 'Desserts', displayOrder: 4, isActive: true },
  { id: 'cat-drink', name: 'Beverages', displayOrder: 5, isActive: true },
]

export const dietaryTagLabels: Record<DietaryTag, string> = {
  halal: 'Halal',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  spicy: 'Spicy',
  'contains-nuts': 'Contains Nuts',
  seafood: 'Seafood',
}

export const menuItems: MenuItem[] = [
  {
    id: 'mi-nasi-lemak',
    categoryId: 'cat-rice',
    name: 'Nasi Lemak Special',
    description:
      'Fragrant coconut rice with sambal, fried anchovies, peanuts, egg, and crispy fried chicken.',
    basePrice: 12.9,
    isAvailable: true,
    dietaryTags: ['halal', 'spicy', 'contains-nuts'],
    variants: [
      { name: 'Regular', priceModifier: 0 },
      { name: 'Large', priceModifier: 3.0 },
    ],
    addOns: [
      { name: 'Extra Egg', priceModifier: 1.5 },
      { name: 'Extra Sambal Sotong', priceModifier: 4.0 },
      { name: 'Extra Chicken', priceModifier: 5.0 },
    ],
    imageUrl: '/images/menu/nasi-lemak.jpg',
  },
  {
    id: 'mi-char-kuey-teow',
    categoryId: 'cat-rice',
    name: 'Char Kuey Teow',
    description:
      'Wok-fried flat rice noodles with prawns, cockles, bean sprouts, and chives in a smoky dark sauce.',
    basePrice: 11.5,
    isAvailable: true,
    dietaryTags: ['halal', 'spicy', 'seafood'],
    variants: [
      { name: 'Regular', priceModifier: 0 },
      { name: 'Extra Prawns', priceModifier: 4.0 },
    ],
    addOns: [{ name: 'Extra Egg', priceModifier: 1.5 }],
    imageUrl: '/images/menu/char-kuey-teow.jpg',
  },
  {
    id: 'mi-mee-goreng',
    categoryId: 'cat-rice',
    name: 'Mee Goreng Mamak',
    description:
      'Spicy fried yellow noodles with tofu, potato, egg, and a squeeze of lime.',
    basePrice: 9.9,
    isAvailable: true,
    dietaryTags: ['halal', 'vegetarian', 'spicy'],
    variants: [{ name: 'Regular', priceModifier: 0 }],
    addOns: [
      { name: 'Add Chicken', priceModifier: 4.0 },
      { name: 'Extra Egg', priceModifier: 1.5 },
    ],
    imageUrl: '/images/menu/mee-goreng.jpg',
  },
  {
    id: 'mi-rendang',
    categoryId: 'cat-main',
    name: 'Beef Rendang',
    description:
      'Slow-cooked beef simmered in coconut milk and a rich blend of lemongrass, galangal, and chilli.',
    basePrice: 18.0,
    isAvailable: true,
    dietaryTags: ['halal', 'spicy'],
    variants: [
      { name: 'With Rice', priceModifier: 0 },
      { name: 'With Nasi Impit', priceModifier: 2.0 },
    ],
    addOns: [{ name: 'Extra Beef', priceModifier: 6.0 }],
    imageUrl: '/images/menu/rendang.jpg',
  },
  {
    id: 'mi-ayam-percik',
    categoryId: 'cat-main',
    name: 'Ayam Percik',
    description:
      'Grilled chicken glazed with a creamy, spicy coconut percik sauce. A Kelantanese favourite.',
    basePrice: 15.5,
    isAvailable: false,
    dietaryTags: ['halal', 'spicy'],
    variants: [
      { name: 'Quarter', priceModifier: 0 },
      { name: 'Half', priceModifier: 7.0 },
    ],
    addOns: [],
    imageUrl: '/images/menu/ayam-percik.jpg',
  },
  {
    id: 'mi-roti-canai',
    categoryId: 'cat-snack',
    name: 'Roti Canai',
    description:
      'Flaky, crispy flatbread served with dhal curry and spicy sambal for dipping.',
    basePrice: 3.5,
    isAvailable: true,
    dietaryTags: ['halal', 'vegetarian'],
    variants: [
      { name: 'Plain', priceModifier: 0 },
      { name: 'Telur (Egg)', priceModifier: 1.5 },
      { name: 'Bawang (Onion)', priceModifier: 1.5 },
    ],
    addOns: [{ name: 'Extra Curry', priceModifier: 1.0 }],
    imageUrl: '/images/menu/roti-canai.jpg',
  },
  {
    id: 'mi-satay',
    categoryId: 'cat-snack',
    name: 'Chicken Satay (10 sticks)',
    description:
      'Char-grilled marinated chicken skewers served with peanut sauce, cucumber, and ketupat.',
    basePrice: 13.0,
    isAvailable: true,
    dietaryTags: ['halal', 'contains-nuts'],
    variants: [
      { name: '10 sticks', priceModifier: 0 },
      { name: '20 sticks', priceModifier: 12.0 },
    ],
    addOns: [{ name: 'Extra Peanut Sauce', priceModifier: 2.0 }],
    imageUrl: '/images/menu/satay.jpg',
  },
  {
    id: 'mi-cendol',
    categoryId: 'cat-sweet',
    name: 'Cendol',
    description:
      'Shaved ice with pandan jelly, coconut milk, and gula melaka palm sugar syrup.',
    basePrice: 6.5,
    isAvailable: true,
    dietaryTags: ['vegetarian', 'vegan'],
    variants: [
      { name: 'Regular', priceModifier: 0 },
      { name: 'With Durian', priceModifier: 5.0 },
    ],
    addOns: [{ name: 'Extra Gula Melaka', priceModifier: 1.0 }],
    imageUrl: '/images/menu/cendol.jpg',
  },
  {
    id: 'mi-teh-tarik',
    categoryId: 'cat-drink',
    name: 'Teh Tarik',
    description: 'Frothy pulled milk tea — the national drink of Malaysia.',
    basePrice: 3.0,
    isAvailable: true,
    dietaryTags: ['halal', 'vegetarian'],
    variants: [
      { name: 'Hot', priceModifier: 0 },
      { name: 'Ais (Iced)', priceModifier: 0.5 },
    ],
    addOns: [],
    imageUrl: '/images/menu/teh-tarik.jpg',
  },
  {
    id: 'mi-milo-dinosaur',
    categoryId: 'cat-drink',
    name: 'Milo Dinosaur',
    description:
      'Iced Milo drink topped with an extra heap of undissolved Milo powder.',
    basePrice: 5.5,
    isAvailable: true,
    dietaryTags: ['halal', 'vegetarian'],
    variants: [{ name: 'Iced', priceModifier: 0 }],
    addOns: [],
    imageUrl: '/images/menu/milo-dinosaur.jpg',
  },
  {
    id: 'mi-limau-ais',
    categoryId: 'cat-drink',
    name: 'Limau Ais',
    description: 'Refreshing iced calamansi lime juice, lightly sweetened.',
    basePrice: 3.5,
    isAvailable: true,
    dietaryTags: ['halal', 'vegan', 'vegetarian'],
    variants: [{ name: 'Iced', priceModifier: 0 }],
    addOns: [],
    imageUrl: '/images/menu/limau-ais.jpg',
  },
]

export function categoryName(categoryId: string): string {
  return categories.find((c) => c.id === categoryId)?.name ?? 'Uncategorised'
}
