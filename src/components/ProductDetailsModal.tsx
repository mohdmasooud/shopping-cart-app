import React from 'react';
import { Product } from '../api/products';
import { useCart } from '../store/cartStore';
import { formatINR } from '../utils/currency';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
}) => {
  const add = useCart((state) => state.add);
  const items = useCart((state) => state.items);

  if (!product) return null;

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;
  const isMaxReached = quantityInCart >= 5;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
        onClick={onClose}
      ></div>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ zIndex: 1055 }}
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
            <div className="modal-header border-0 pb-0">
              <span className="badge bg-secondary text-uppercase">{product.category}</span>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body p-4 pt-2">
              <div className="row g-4 align-items-center">
                <div className="col-12 col-md-6 text-center bg-light rounded-3 p-3">
                  <img
                    src={product.thumbnail || (product.images && product.images[0])}
                    alt={product.title}
                    className="img-fluid rounded"
                    style={{ maxHeight: '280px', objectFit: 'contain' }}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <h4 className="fw-bold mb-2">{product.title}</h4>
                  <p className="text-muted small mb-2">
                    Brand: <strong className="text-dark">{product.brand}</strong>
                  </p>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge bg-warning text-dark px-2 py-1">
                      <i className="bi bi-star-fill me-1"></i>
                      {product.rating.toFixed(1)} / 5.0
                    </span>
                    <span className="small text-muted">
                      ({product.stock} items remaining in stock)
                    </span>
                  </div>

                  <p className="text-secondary small mb-4">{product.description}</p>

                  <div className="d-flex align-items-baseline gap-2 mb-4">
                    <span className="fs-3 fw-bold text-primary">
                      {formatINR(product.price)}
                    </span>
                    {product.discountPercentage > 0 && (
                      <span className="badge bg-danger-subtle text-danger">
                        {Math.round(product.discountPercentage)}% OFF
                      </span>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`btn btn-primary flex-grow-1 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${
                        isMaxReached ? 'disabled' : ''
                      }`}
                      onClick={() => {
                        add(product);
                      }}
                      disabled={isMaxReached}
                    >
                      <i className="bi bi-cart-plus"></i>
                      <span>
                        {isMaxReached
                          ? 'Max In Cart (5)'
                          : quantityInCart > 0
                          ? `Add Another (${quantityInCart} in cart)`
                          : 'Add to Cart'}
                      </span>
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
