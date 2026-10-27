import React from 'react';
import { useCart } from '../../store/cartStore';
import { ShippingFormData } from '../../schemas/shippingSchema';
import { calculateTotals } from '../../utils/cartCalculations';
import { formatINR } from '../../utils/currency';

interface PaymentSummaryProps {
  shippingData: ShippingFormData;
  onPlaceOrder: () => void;
  onBack: () => void;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  shippingData,
  onPlaceOrder,
  onBack,
}) => {
  const items = useCart((state) => state.items);
  const { subtotal, tax, discount, total } = calculateTotals(items);

  return (
    <div>
      <h6 className="fw-bold mb-3 text-secondary text-uppercase small">
        Step 3: Final Order Confirmation
      </h6>

      <div className="alert alert-info py-2 px-3 small d-flex align-items-center gap-2 mb-4">
        <i className="bi bi-info-circle-fill fs-5"></i>
        <span>
          This is a simulated checkout demonstration. No real payment charge will be processed.
        </span>
      </div>

      <div className="row g-4 mb-4">
        {/* Shipping summary card */}
        <div className="col-12 col-md-6">
          <div className="card h-100 border-0 bg-light p-3 rounded-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-truck text-primary"></i>
                <span>Shipping Address</span>
              </h6>
              <button
                type="button"
                className="btn btn-sm btn-link p-0 text-decoration-none"
                onClick={onBack}
              >
                Edit
              </button>
            </div>
            <div className="small text-muted">
              <p className="fw-semibold text-dark mb-1">{shippingData.fullName}</p>
              <p className="mb-1">{shippingData.address}</p>
              <p className="mb-1">
                {shippingData.city}, {shippingData.postalCode}
              </p>
              <p className="mb-1">
                <i className="bi bi-envelope me-1"></i>
                {shippingData.email}
              </p>
              <p className="mb-0">
                <i className="bi bi-telephone me-1"></i>
                {shippingData.phoneNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="col-12 col-md-6">
          <div className="card h-100 border-0 bg-light p-3 rounded-3">
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-receipt text-primary"></i>
              <span>Payment Breakdown</span>
            </h6>
            <div className="small">
              <div className="d-flex justify-content-between mb-1 text-muted">
                <span>Items Subtotal</span>
                <span className="text-dark fw-semibold">{formatINR(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-1 text-muted">
                <span>Estimated Sales Tax (5%)</span>
                <span>{formatINR(tax)}</span>
              </div>
              {discount > 0 && (
                <div className="d-flex justify-content-between mb-1 text-success">
                  <span>Special Discount (10%)</span>
                  <span className="fw-bold">-{formatINR(discount)}</span>
                </div>
              )}
              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Shipping Fee</span>
                <span className="text-success fw-bold">FREE</span>
              </div>
              <div className="border-top pt-2 mt-2 d-flex justify-content-between fs-5 fw-bold text-dark">
                <span>Total Due</span>
                <span className="text-primary">{formatINR(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items list preview */}
      <div className="mb-4">
        <h6 className="fw-semibold small text-muted text-uppercase mb-2">Order Items</h6>
        <div className="list-group list-group-flush border rounded-3 bg-white">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="list-group-item d-flex justify-content-between align-items-center py-2 px-3"
            >
              <div className="d-flex align-items-center gap-2">
                <img
                  src={product.thumbnail || (product.images && product.images[0])}
                  alt={product.title}
                  className="rounded border p-1"
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
                <div>
                  <div className="small fw-semibold">{product.title}</div>
                  <div className="text-muted smaller" style={{ fontSize: '0.8rem' }}>
                    Qty: {quantity} × {formatINR(product.price)}
                  </div>
                </div>
              </div>
              <span className="fw-semibold small">{formatINR(product.price * quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-between pt-2 border-top">
        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={onBack}
        >
          <i className="bi bi-arrow-left"></i>
          <span>Back to Shipping</span>
        </button>
        <button
          type="button"
          className="btn btn-success btn-lg px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
          onClick={onPlaceOrder}
        >
          <i className="bi bi-check-circle-fill"></i>
          <span>Place Order</span>
        </button>
      </div>
    </div>
  );
};
