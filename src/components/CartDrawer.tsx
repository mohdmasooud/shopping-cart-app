import React from 'react';
import { useCart } from '../store/cartStore';
import { calculateTotals } from '../utils/cartCalculations';
import { formatINR } from '../utils/currency';

export const CartDrawer: React.FC = () => {
  const { items, isCartOpen, setIsCartOpen, setIsCheckoutOpen, inc, dec, remove, clear } =
    useCart();

  const {
    subtotal,
    tax,
    discount,
    total,
    itemCount,
    isEligibleForCheckout,
    minimumCheckoutDifference,
  } = calculateTotals(items);

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="offcanvas-backdrop fade show"
        style={{ zIndex: 1045 }}
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Offcanvas Drawer */}
      <div
        className="offcanvas offcanvas-end show shadow"
        tabIndex={-1}
        style={{
          visibility: 'visible',
          zIndex: 1050,
          width: '100%',
          maxWidth: '450px',
        }}
        aria-labelledby="cartDrawerLabel"
      >
        <div className="offcanvas-header bg-dark text-white p-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cart3 fs-5 text-warning"></i>
            <h5 className="offcanvas-title fw-bold" id="cartDrawerLabel">
              Shopping Cart ({itemCount})
            </h5>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close"
            onClick={() => setIsCartOpen(false)}
          ></button>
        </div>

        <div className="offcanvas-body d-flex flex-column p-3">
          {items.length === 0 ? (
            <div className="text-center my-auto py-5">
              <i className="bi bi-cart-x display-1 text-muted mb-3 d-block"></i>
              <h5 className="fw-bold">Your cart is empty</h5>
              <p className="text-muted small mb-4">
                Looks like you haven't added any products to your cart yet.
              </p>
              <button
                className="btn btn-primary px-4 py-2"
                onClick={() => setIsCartOpen(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="flex-grow-1 overflow-auto pe-1 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small fw-semibold">ITEMS IN CART</span>
                  <button
                    type="button"
                    className="btn btn-link text-danger text-decoration-none p-0 small"
                    onClick={clear}
                  >
                    <i className="bi bi-trash3 me-1"></i>Clear All
                  </button>
                </div>

                <ul className="list-group list-group-flush gap-2">
                  {items.map(({ product, quantity }) => {
                    const itemTotal = product.price * quantity;
                    const isMin = quantity <= 1;
                    const isMax = quantity >= 5;

                    return (
                      <li
                        key={product.id}
                        className="list-group-item bg-light rounded-3 p-3 border-0 d-flex gap-3 align-items-center"
                      >
                        <img
                          src={product.thumbnail || (product.images && product.images[0])}
                          alt={product.title}
                          className="rounded object-fit-cover bg-white p-1 border"
                          style={{ width: '60px', height: '60px' }}
                        />

                        <div className="flex-grow-1 min-w-0">
                          <h6 className="mb-1 text-truncate fw-semibold text-dark" title={product.title}>
                            {product.title}
                          </h6>
                          <div className="small text-muted mb-2">
                            {formatINR(product.price)} each
                          </div>

                          <div className="d-flex align-items-center justify-content-between">
                            {/* Quantity Controls */}
                            <div className="btn-group btn-group-sm border rounded bg-white" role="group">
                              <button
                                type="button"
                                className="btn btn-outline-secondary px-2 border-0"
                                onClick={() => dec(product.id)}
                                disabled={isMin}
                                title={isMin ? 'Minimum 1 item' : 'Decrease quantity'}
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <span className="px-2 py-1 fw-bold text-dark">{quantity}</span>
                              <button
                                type="button"
                                className="btn btn-outline-secondary px-2 border-0"
                                onClick={() => inc(product.id)}
                                disabled={isMax}
                                title={isMax ? 'Maximum limit reached (5)' : 'Increase quantity'}
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>

                            {/* Item Total */}
                            <span className="fw-bold text-primary">
                              {formatINR(itemTotal)}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm rounded-circle p-1 border-0"
                          onClick={() => remove(product.id)}
                          title="Remove item"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Price Calculation Summary */}
              <div className="border-top pt-3 bg-white mt-auto">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Subtotal</span>
                  <span className="fw-semibold text-dark">{formatINR(subtotal)}</span>
                </div>

                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Estimated Tax (5%)</span>
                  <span>{formatINR(tax)}</span>
                </div>

                {discount > 0 ? (
                  <div className="d-flex justify-content-between small text-success mb-2">
                    <span>Special Discount (10% over ₹100)</span>
                    <span className="fw-bold">-{formatINR(discount)}</span>
                  </div>
                ) : (
                  <div className="small text-muted mb-2 fst-italic">
                    Tip: Spend over ₹100 to get 10% discount!
                  </div>
                )}

                <div className="d-flex justify-content-between fs-5 fw-bold text-dark border-top pt-2 mb-3">
                  <span>Total Amount</span>
                  <span className="text-primary">{formatINR(total)}</span>
                </div>

                {/* Minimum Checkout Guard */}
                {!isEligibleForCheckout && (
                  <div className="alert alert-warning small py-2 px-3 mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-exclamation-triangle-fill text-warning fs-5"></i>
                    <div>
                      <strong>Minimum order is ₹10.00.</strong>
                      <div>Add {formatINR(minimumCheckoutDifference)} more to proceed.</div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-success w-100 py-2 fs-6 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  disabled={!isEligibleForCheckout}
                  onClick={handleProceedToCheckout}
                >
                  <span>Proceed to Checkout</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
