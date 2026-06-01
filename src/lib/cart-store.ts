import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, type Product } from "./products";

export type CartItem = { productId: string; qty: number };

type State = {
  items: CartItem[];
  wishlist: string[];
  savedLists: { id: string; name: string; productIds: string[] }[];
  orders: { id: string; createdAt: number; items: CartItem[]; total: number; status: string }[];
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  addMany: (productIds: string[]) => void;
  toggleWishlist: (id: string) => void;
  saveList: (name: string, productIds: string[]) => void;
  checkout: () => string;
};

export const useCart = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      savedLists: [],
      orders: [],
      add: (productId, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === productId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === productId ? { ...i, qty: i.qty + qty } : i,
              ),
            };
          }
          return { items: [...s.items, { productId, qty }] };
        }),
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      setQty: (productId, qty) =>
        set((s) => ({
          items: qty <= 0
            ? s.items.filter((i) => i.productId !== productId)
            : s.items.map((i) => (i.productId === productId ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
      addMany: (ids) =>
        set((s) => {
          const map = new Map(s.items.map((i) => [i.productId, i.qty]));
          ids.forEach((id) => map.set(id, (map.get(id) ?? 0) + 1));
          return { items: Array.from(map, ([productId, qty]) => ({ productId, qty })) };
        }),
      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((x) => x !== id)
            : [...s.wishlist, id],
        })),
      saveList: (name, productIds) =>
        set((s) => ({
          savedLists: [
            ...s.savedLists,
            { id: `l${Date.now()}`, name, productIds },
          ],
        })),
      checkout: () => {
        const state = get();
        const total = cartTotal(state.items);
        const id = `ORD-${Date.now().toString().slice(-6)}`;
        set({
          items: [],
          orders: [
            { id, createdAt: Date.now(), items: state.items, total, status: "Preparing" },
            ...state.orders,
          ],
        });
        return id;
      },
    }),
    { name: "freshcart-store" },
  ),
);

export function cartTotal(items: CartItem[]): number {
  return items.reduce((acc, i) => {
    const p = PRODUCTS.find((x) => x.id === i.productId);
    return acc + (p ? p.price * i.qty : 0);
  }, 0);
}

export function itemsWithProduct(items: CartItem[]): { item: CartItem; product: Product }[] {
  return items
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      return product ? { item, product } : null;
    })
    .filter((x): x is { item: CartItem; product: Product } => x !== null);
}
