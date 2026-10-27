import React from 'react';
import { useCart } from '../../store/cartStore';
import { calculateTotals } from '../../utils/cartCalculations';
import { formatINR } from '../../utils/currency';

interface CartReviewProps {
  onNext: () => void;
  onCancel: () => void;
}

export const CartReview: React.FC<CartReviewProps> = ({ onNext, onCancel }) => {
  const items = useCart((state) => state.items);
  const inc = useCart((state) => state.inc);
  const dec = useCart((state) => state.dec);
  const remove = useCart((state) => state.remove);

  const {
    subtotal,
    tax,
    discount,
    total,
    itemCount,
    isEligibleForCheckout,
    minimumCheckoutDifference,
  } = calculateTotals(items);

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-cart-x text-muted display-4 mb-3 d-block"></i>
        <h5>Your cart is currently empty</h5>
        <p className="text-muted small">Please add items to your cart before proceeding to checkout.</p>
        <button className="btn btn-secondary mt-3" onClick={onCancel}>
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div>
      <h6 className="fw-bold mb-3 text-secondary text-uppercase small">
        Step 1: Review Your Items ({itemCount})
      </h6>

      <div className="table-responsive mb-4">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light small">
            <tr>
              <th style={{ width: '45%' }}>Product</th>
              <th className="text-center">Price</th>
              <th className="text-center">Quantity</th>
              <th className="text-end">Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ product, quantity }) => (
              <tr key={product.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={product.thumbnail || (product.images && product.images[0])}
                      alt={product.title}
                      className="rounded border p-1"
                      style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                    />
                    <div>
                      <div className="fw-semibold small text-truncate" style={{ maxWidth: '180px' }}>
                        {product.title}
                      </div>
                      <span className="badge bg-light text-muted border small">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="text-center small">{formatINR(product.price)}</td>
                <td className="text-center">
                  <div className="btn-group btn-group-sm border rounded bg-white">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-2 border-0"
                      onClick={() => dec(product.id)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-2 py-1 small fw-bold">{quantity}</span>
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-2 border-0"
                      onClick={() => inc(product.id)}
                      disabled={quantity >= 5}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="text-end fw-semibold small">
                  {formatINR(product.price * quantity)}
                </td>
                <td className="text-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-danger p-0"
                    onClick={() => remove(product.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Price breakdown */}
      <div className="card bg-light border-0 p-3 mb-4 rounded-3">
        <div className="d-flex justify-content-between small mb-1">
          <span className="text-muted">Subtotal</span>
          <span className="fw-semibold">{formatINR(subtotal)}</span>
        </div>
        <div className="d-flex justify-content-between small mb-1">
          <span className="text-muted">Tax (5%)</span>
          <span>{formatINR(tax)}</span>
        </div>
        {discount > 0 && (
          <div className="d-flex justify-content-between small text-success mb-1">
            <span>Volume Discount (10%)</span>
            <span className="fw-bold">-{formatINR(discount)}</span>
          </div>
        )}
        <div className="d-flex justify-content-between fw-bold fs-5 text-dark border-top pt-2 mt-2">
          <span>Order Total</span>
          <span className="text-primary">{formatINR(total)}</span>
        </div>
      </div>

      {!isEligibleForCheckout && (
        <div className="alert alert-warning small py-2 mb-3">
          <strong>Cannot proceed:</strong> Minimum order value is ₹10.00. Add{' '}
          {formatINR(minimumCheckoutDifference)} more.
        </div>
      )}

      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Continue Shopping
        </button>
        <button
          type="button"
          className="btn btn-primary px-4 fw-semibold d-flex align-items-center gap-2"
          onClick={onNext}
          disabled={!isEligibleForCheckout}
        >
          <span>Continue to Shipping</span>
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};
