import React from 'react';
import { Product } from '../api/products';
import { useCart } from '../store/cartStore';
import { formatINR } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  onOpenDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const add = useCart((state) => state.add);
  const items = useCart((state) => state.items);
  const cartItem = items.find((i) => i.product.id === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;
  const isMaxReached = quantityInCart >= 5;

  return (
    <div className="card h-100 shadow-sm border-0 transition-hover rounded-3 overflow-hidden">
      {/* Product Image */}
      <div
        className="position-relative bg-white text-center p-3 d-flex align-items-center justify-content-center"
        style={{ height: '220px', cursor: onOpenDetails ? 'pointer' : 'default' }}
        onClick={() => onOpenDetails && onOpenDetails(product)}
      >
        <img
          src={product.thumbnail || (product.images && product.images[0])}
          alt={product.title}
          className="img-fluid"
          style={{ maxHeight: '190px', objectFit: 'contain' }}
          loading="lazy"
        />
        <span className="position-absolute top-0 start-0 m-2 badge bg-secondary text-uppercase font-monospace small">
          {product.category}
        </span>
        {quantityInCart > 0 && (
          <span className="position-absolute top-0 end-0 m-2 badge bg-success">
            {quantityInCart} in cart
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="card-body d-flex flex-column p-3">
        <h6
          className="card-title text-truncate-2 mb-1 fw-bold text-dark"
          title={product.title}
          style={{ minHeight: '2.5rem', lineHeight: '1.25' }}
        >
          {product.title}
        </h6>

        {/* Rating and Reviews */}
        <div className="d-flex align-items-center gap-1 mb-2 small text-warning">
          <i className="bi bi-star-fill"></i>
          <span className="text-dark fw-bold">{product.rating.toFixed(1)}</span>
          <span className="text-muted ms-1">({product.stock} in stock)</span>
        </div>

        {/* Price and Discount */}
        <div className="d-flex align-items-baseline gap-2 mb-3 mt-auto">
          <span className="fs-5 fw-bold text-primary">{formatINR(product.price)}</span>
          {product.discountPercentage > 0 && (
            <span className="badge bg-danger-subtle text-danger small">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          className={`btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold ${
            isMaxReached ? 'btn-secondary disabled' : 'btn-primary'
          }`}
          onClick={() => add(product)}
          disabled={isMaxReached}
        >
          <i className="bi bi-cart-plus"></i>
          <span>{isMaxReached ? 'Max Limit (5)' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};
