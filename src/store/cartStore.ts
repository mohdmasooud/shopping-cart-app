import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../api/products';

export interface CartItem {
  product: Product;
  quantity: number; // 1 to 5
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  add: (product: Product) => void;
  remove: (id: number) => void;
  inc: (id: number) => void;
  dec: (id: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      isCheckoutOpen: false,
      setIsCartOpen: (open: boolean) => set({ isCartOpen: open }),
      setIsCheckoutOpen: (open: boolean) => set({ isCheckoutOpen: open }),
      add: (product: Product) => {
        const currentItems = get().items;
        const existing = currentItems.find((i) => i.product.id === product.id);

        if (existing) {
          if (existing.quantity < 5) {
            set({
              items: currentItems.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            });
          }
        } else {
          set({ items: [...currentItems, { product, quantity: 1 }] });
        }
      },
      remove: (id: number) => {
        set({ items: get().items.filter((i) => i.product.id !== id) });
      },
      inc: (id: number) => {
        set({
          items: get().items.map((i) =>
            i.product.id === id && i.quantity < 5
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        });
      },
      dec: (id: number) => {
        set({
          items: get().items.map((i) =>
            i.product.id === id && i.quantity > 1
              ? { ...i, quantity: i.quantity - 1 }
              : i
          ),
        });
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: 'shopping-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // Only persist cart items
    }
  )
);
