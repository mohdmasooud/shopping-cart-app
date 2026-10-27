import React from 'react';
import { useCart } from '../store/cartStore';
import { calculateTotals } from '../utils/cartCalculations';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const items = useCart((state) => state.items);
  const setIsCartOpen = useCart((state) => state.setIsCartOpen);
  const { itemCount } = calculateTotals(items);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-3">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4" href="#">
            <i className="bi bi-cart3 text-warning"></i>
            <span>ShopHub</span>
          </a>

          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-outline-light position-relative d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm"
              onClick={() => setIsCartOpen(true)}
              aria-label="View Shopping Cart"
            >
              <i className="bi bi-cart-fill text-warning"></i>
              <span className="d-none d-sm-inline fw-semibold">Cart</span>
              {itemCount > 0 ? (
                <span className="badge rounded-pill bg-warning text-dark fw-bold ms-1">
                  {itemCount}
                </span>
              ) : (
                <span className="badge rounded-pill bg-secondary ms-1">0</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="container py-4 flex-grow-1">{children}</main>

      <footer className="bg-dark text-white-50 py-4 mt-auto border-top border-secondary">
        <div className="container text-center small">
          <p className="mb-1 text-white">© 2026 ShopHub Inc. Built with React 19, TypeScript, Vite & Bootstrap</p>
          <p className="mb-0">TanStack Query • Zustand with Persist • Zod Validation</p>
        </div>
      </footer>
    </div>
  );
};
