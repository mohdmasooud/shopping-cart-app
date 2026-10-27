import { CartItem } from '../store/cartStore';

export interface CartCalculationResult {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
  isEligibleForCheckout: boolean;
  minimumCheckoutDifference: number;
}

export const MINIMUM_CHECKOUT_VALUE = 10;

export const calculateTotals = (items: CartItem[]): CartCalculationResult => {
  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Tax: 5% of subtotal
  const tax = subtotal * 0.05;

  // Discount: 10% applied when subtotal > $100
  const discount = subtotal > 100 ? subtotal * 0.1 : 0;

  // Final Total
  const total = subtotal + tax - discount;

  const isEligibleForCheckout = subtotal >= MINIMUM_CHECKOUT_VALUE;
  const minimumCheckoutDifference = Math.max(0, MINIMUM_CHECKOUT_VALUE - subtotal);

  return {
    subtotal,
    tax,
    discount,
    total,
    itemCount,
    isEligibleForCheckout,
    minimumCheckoutDifference,
  };
};
