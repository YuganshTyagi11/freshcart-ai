export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  emoji: string;
  tag?: string;
};

export const CATEGORIES = [
  { id: "dairy", name: "Dairy", emoji: "🥛", color: "oklch(0.95 0.04 230)" },
  { id: "fruits", name: "Fruits", emoji: "🍎", color: "oklch(0.93 0.08 25)" },
  { id: "vegetables", name: "Vegetables", emoji: "🥬", color: "oklch(0.93 0.1 145)" },
  { id: "bakery", name: "Bakery", emoji: "🍞", color: "oklch(0.93 0.08 75)" },
  { id: "beverages", name: "Beverages", emoji: "🥤", color: "oklch(0.93 0.06 200)" },
  { id: "snacks", name: "Snacks", emoji: "🍫", color: "oklch(0.92 0.08 50)" },
] as const;

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Fresh Milk",
    category: "dairy",
    price: 60,
    unit: "1L",
    emoji: "🥛",
    tag: "Bestseller",
  },
  { id: "p2", name: "Greek Yogurt", category: "dairy", price: 120, unit: "400g", emoji: "🍶" },
  { id: "p3", name: "Cheddar Cheese", category: "dairy", price: 280, unit: "200g", emoji: "🧀" },
  { id: "p4", name: "Farm Butter", category: "dairy", price: 95, unit: "100g", emoji: "🧈" },
  {
    id: "p5",
    name: "Red Apples",
    category: "fruits",
    price: 180,
    unit: "1kg",
    emoji: "🍎",
    tag: "Fresh",
  },
  { id: "p6", name: "Bananas", category: "fruits", price: 60, unit: "1 dozen", emoji: "🍌" },
  { id: "p7", name: "Strawberries", category: "fruits", price: 220, unit: "250g", emoji: "🍓" },
  { id: "p8", name: "Oranges", category: "fruits", price: 140, unit: "1kg", emoji: "🍊" },
  { id: "p9", name: "Tomatoes", category: "vegetables", price: 40, unit: "500g", emoji: "🍅" },
  { id: "p10", name: "Spinach", category: "vegetables", price: 30, unit: "1 bunch", emoji: "🥬" },
  { id: "p11", name: "Garlic", category: "vegetables", price: 25, unit: "100g", emoji: "🧄" },
  { id: "p12", name: "Carrots", category: "vegetables", price: 50, unit: "500g", emoji: "🥕" },
  {
    id: "p13",
    name: "Sourdough Bread",
    category: "bakery",
    price: 90,
    unit: "400g",
    emoji: "🍞",
    tag: "Fresh today",
  },
  { id: "p14", name: "Croissant", category: "bakery", price: 45, unit: "1 pc", emoji: "🥐" },
  { id: "p15", name: "Bagels", category: "bakery", price: 80, unit: "4 pc", emoji: "🥯" },
  { id: "p16", name: "Orange Juice", category: "beverages", price: 130, unit: "1L", emoji: "🧃" },
  { id: "p17", name: "Cold Brew", category: "beverages", price: 180, unit: "500ml", emoji: "☕" },
  {
    id: "p18",
    name: "Sparkling Water",
    category: "beverages",
    price: 70,
    unit: "750ml",
    emoji: "🥤",
  },
  {
    id: "p19",
    name: "Dark Chocolate",
    category: "snacks",
    price: 150,
    unit: "100g",
    emoji: "🍫",
    tag: "Vegan",
  },
  { id: "p20", name: "Potato Chips", category: "snacks", price: 60, unit: "150g", emoji: "🥔" },
  { id: "p21", name: "Mixed Nuts", category: "snacks", price: 320, unit: "250g", emoji: "🥜" },
  { id: "p22", name: "Pasta", category: "bakery", price: 110, unit: "500g", emoji: "🍝" },
  { id: "p23", name: "Tomato Sauce", category: "bakery", price: 85, unit: "400g", emoji: "🥫" },
  { id: "p24", name: "Fresh Basil", category: "vegetables", price: 35, unit: "20g", emoji: "🌿" },
];

export type Recipe = {
  id: string;
  name: string;
  emoji: string;
  time: string;
  ingredients: string[]; // product ids
};

export const RECIPES: Recipe[] = [
  {
    id: "r1",
    name: "Classic Pasta",
    emoji: "🍝",
    time: "20 min",
    ingredients: ["p22", "p23", "p11", "p3", "p24"],
  },
  {
    id: "r2",
    name: "Fresh Breakfast",
    emoji: "🥐",
    time: "10 min",
    ingredients: ["p14", "p4", "p16", "p2"],
  },
  {
    id: "r3",
    name: "Garden Salad",
    emoji: "🥗",
    time: "15 min",
    ingredients: ["p10", "p9", "p12", "p24"],
  },
  {
    id: "r4",
    name: "Fruit Smoothie",
    emoji: "🥤",
    time: "5 min",
    ingredients: ["p6", "p7", "p2", "p1"],
  },
];

export function findProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}
