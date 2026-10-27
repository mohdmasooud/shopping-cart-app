import React, { useState } from 'react';
import { useProducts, Product } from './api/products';
import { useProductsFilter, SortOption } from './hooks/useProductsFilter';
import { Layout } from './components/Layout';
import { ProductGrid } from './components/ProductGrid';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutWizard } from './components/Checkout/CheckoutWizard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { formatINR } from './utils/currency';

export const App: React.FC = () => {
  const { data: products = [], isLoading, isError, error, refetch } = useProducts();
  const filter = useProductsFilter(products);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <Layout>
      {/* Hero / Header banner */}
      <div className="p-4 p-md-5 mb-4 rounded-4 bg-primary text-white shadow-sm position-relative overflow-hidden">
        <div className="position-relative" style={{ zIndex: 1, maxWidth: '650px' }}>
          <span className="badge bg-warning text-dark fw-bold text-uppercase px-3 py-2 mb-3">
            Spring Deals & Fresh Stock
          </span>
          <h1 className="display-5 fw-bold mb-3">Discover Quality Products at Everyday Prices</h1>
          <p className="lead mb-0 text-white-50">
            Enjoy free shipping on orders over ₹100 and a 10% instant discount applied at checkout.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="card shadow-sm border-0 mb-4 rounded-3 p-3 bg-white">
        <div className="row g-3 align-items-center">
          {/* Search Input */}
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold text-muted mb-1">
              Search by Name
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="e.g. Phone, Perfume, Shoes..."
                value={filter.searchTerm}
                onChange={(e) => filter.setSearchTerm(e.target.value)}
              />
              {filter.searchTerm && (
                <button
                  className="btn btn-outline-secondary border-start-0"
                  type="button"
                  onClick={() => filter.setSearchTerm('')}
                  title="Clear search"
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="col-12 col-sm-6 col-md-3">
            <label className="form-label small fw-semibold text-muted mb-1">
              Category
            </label>
            <select
              className="form-select"
              value={filter.category}
              onChange={(e) => filter.setCategory(e.target.value)}
            >
              <option value="all">All Categories ({products.length})</option>
              {filter.categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="col-12 col-sm-6 col-md-2">
            <label className="form-label small fw-semibold text-muted mb-1">
              Sort By
            </label>
            <select
              className="form-select"
              value={filter.sortBy}
              onChange={(e) => filter.setSortBy(e.target.value as SortOption)}
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="title-asc">Name: A to Z</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="col-12 col-md-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label small fw-semibold text-muted mb-0">
                Max Price
              </label>
              <span className="badge bg-primary px-2 py-1">
                {formatINR(filter.maxPrice)}
              </span>
            </div>
            <input
              type="range"
              className="form-range"
              min="0"
              max={Math.max(filter.highestProductPrice, 200)}
              step="5"
              value={filter.maxPrice}
              onChange={(e) => filter.setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Clear Filters Toolbar */}
        {filter.isFiltered && (
          <div className="d-flex align-items-center justify-content-between pt-3 mt-3 border-top small">
            <span className="text-muted">
              Showing <strong>{filter.filteredProducts.length}</strong> matching products
            </span>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
              onClick={filter.clearFilters}
            >
              <i className="bi bi-arrow-counterclockwise"></i>
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area: Loading, Error, or Grid */}
      {isError ? (
        <div className="alert alert-danger shadow-sm border-0 py-4 text-center my-4 rounded-3">
          <i className="bi bi-exclamation-triangle-fill display-4 text-danger d-block mb-3"></i>
          <h4 className="alert-heading fw-bold">Failed to Load Products</h4>
          <p className="mb-3 text-muted">
            {error instanceof Error ? error.message : 'An unexpected error occurred while fetching catalog data.'}
          </p>
          <button
            type="button"
            className="btn btn-outline-danger fw-semibold px-4"
            onClick={() => refetch()}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>Try Again
          </button>
        </div>
      ) : (
        <ProductGrid
          products={filter.filteredProducts}
          isLoading={isLoading}
          onOpenDetails={(p) => setSelectedProduct(p)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Checkout 3-Step Wizard Modal */}
      <CheckoutWizard />

      {/* Product Quick View Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </Layout>
  );
};

export default App;
