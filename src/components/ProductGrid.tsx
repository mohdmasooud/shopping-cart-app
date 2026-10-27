import React from 'react';
import { Product } from '../api/products';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onOpenDetails?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  onOpenDetails,
}) => {
  if (isLoading) {
    return (
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="col">
            <div className="card h-100 shadow-sm border-0 p-3" aria-hidden="true">
              <div
                className="bg-light rounded mb-3 placeholder-glow d-flex align-items-center justify-content-center"
                style={{ height: '200px' }}
              >
                <div className="spinner-border spinner-border-sm text-secondary" role="status"></div>
              </div>
              <div className="card-body p-0">
                <h5 className="card-title placeholder-glow">
                  <span className="placeholder col-8"></span>
                </h5>
                <p className="card-text placeholder-glow">
                  <span className="placeholder col-4"></span>
                  <span className="placeholder col-6"></span>
                </p>
                <button
                  tabIndex={-1}
                  className="btn btn-primary disabled placeholder col-12 py-2"
                ></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="card shadow-sm border-0 text-center py-5 my-4">
        <div className="card-body">
          <i className="bi bi-search display-3 text-muted mb-3 d-block"></i>
          <h4 className="fw-bold">No Products Found</h4>
          <p className="text-muted mb-0">
            Try adjusting your search query, selecting another category, or resetting price filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      {products.map((product) => (
        <div key={product.id} className="col">
          <ProductCard product={product} onOpenDetails={onOpenDetails} />
        </div>
      ))}
    </div>
  );
};
