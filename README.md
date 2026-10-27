# Responsive Shopping Cart Application

A modern, responsive e-commerce shopping cart web application built with **React 19**, **TypeScript**, **Vite**, **Bootstrap 5**, **Zustand** (with persistent storage), **TanStack Query v5**, and **Zod** validation.

---

## 🚀 Features

### 1. Product Listing & API Integration
- Fetches real product data from [DummyJSON Products API](https://dummyjson.com/products).
- Robust schema validation using **Zod** on incoming network responses.
- Graceful UI states:
  - **Loading state**: Skeleton placeholder cards while fetching.
  - **Error state**: Helpful error banner with a "Try Again" retry mechanism.
  - **Empty state**: Clean prompt when no items match filters.
  - **Success state**: Responsive 4-column product grid with images, prices, discounts, and ratings.

### 2. Search, Filtering & Sorting (Custom Hook)
- Managed via `useProductsFilter`:
  - **Title search**: Instant search filtering by product title.
  - **Category filter**: Dynamically derived categories dropdown.
  - **Price range slider**: Filter items by maximum price threshold.
  - **Product sorting**: Price (Low to High / High to Low), Rating, and Name (A to Z).
  - **Reset filters**: One-click button to clear all filters.

### 3. Cart Management & Persistence (Zustand)
- Global state managed with **Zustand** and stored in `localStorage` via the `persist` middleware.
- Quantity constraints:
  - **Minimum limit**: 1 item.
  - **Maximum limit**: 5 items per product.
  - Decrement/increment buttons automatically disable when limits are reached.
- Real-time badge counter on navbar showing total items in cart.
- Add, update, remove, and clear cart actions.

### 4. Cart Calculations & Guard Rules
- **Subtotal**: Sum of all items (`price * quantity`).
- **Estimated Tax**: 5% of subtotal.
- **Discount**: 10% discount automatically applied whenever the subtotal exceeds $100.
- **Minimum Order Checkout Guard**: Orders must be at least **$10.00**. Checkout is disabled with a friendly prompt if subtotal is under $10.

### 5. Multi-Step Checkout Flow (Vanilla React State + Zod)
- **Step 1: Cart Review**: Item summary, quantities, and price breakdown.
- **Step 2: Shipping Form**:
  - Fields: Full Name, Email, Phone Number, Street Address, City, Postal Code.
  - Managed with vanilla React `useState` (no heavy form libraries).
  - Validated on-the-fly using **Zod** with inline error messages.
- **Step 3: Payment Summary**:
  - Read-only review showing delivery address, items, and total charges.
  - "Place Order" button that generates a simulated order ID, clears the cart, and displays a success screen.

### 6. Bonus Features Included
- ✅ **Skeleton loaders** for products.
- ✅ **Product sorting** (by price, rating, title).
- ✅ **Product details modal** for inspecting high-res images, stock, and descriptions.

---

## 🛠️ Tech Stack & Architecture

| Technology | Purpose |
|---|---|
| **React 19** | Modern UI library with component architecture |
| **TypeScript** | Type safety across products, cart state, and form models |
| **Vite** | Fast development server and optimized build tool |
| **Bootstrap 5 & Icons** | Clean, responsive design system and SVG icons |
| **Zustand** | Lightweight global state management for the cart |
| **TanStack Query v5** | Server-state management, caching, and loading/error states |
| **Zod** | Runtime schema validation for API responses and forms |

---

## 📦 Setup & Running Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and `pnpm` (or `npm`) installed.

### 1. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 2. Start the Development Server
```bash
pnpm dev
# or
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
pnpm build
# or
npm run build
```

---

## 🧠 Architecture & Evaluation Defense Notes

### Why TanStack Query for API & Zustand for Cart?
- **Separation of Concerns**: TanStack Query is designed for *server state* (cached, async, remote). Storing products in Zustand would introduce duplicate stale state and manual synchronization logic.
- Zustand is used strictly for *client state* (the user's cart and checkout modal flow), which benefits from localStorage persistence and immediate synchronous updates.

### How Cart Persistence Works
- Configured using Zustand's `persist` middleware with `localStorage`.
- Only the `items` array is persisted via `partialize`, ensuring transient modal states (like drawer visibility) reset properly on page refresh.

### How Zod Validation Works
- **API**: Incoming JSON from DummyJSON is parsed through `productsResponseSchema.safeParse()`. If DummyJSON alters their contract, the application catches the anomaly early rather than throwing uncaught runtime rendering errors.
- **Shipping Form**: Form state is parsed with `shippingSchema.safeParse()`. Errors are transformed into field-specific error messages displayed inline beneath each input.
