import { useState, useMemo } from 'react';
import { Product } from '../api/products';

export type SortOption =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'title-asc';

export const useProductsFilter = (products: Product[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Extract distinct sorted categories
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return Array.from(set).sort();
  }, [products]);

  // Dynamic maximum price from fetched products
  const highestProductPrice = useMemo(() => {
    if (products.length === 0) return 2000;
    const max = Math.max(...products.map((p) => p.price));
    return Math.ceil(max);
  }, [products]);

  // Filtering + Sorting pipeline
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      // 1. Search filter by title
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      // 2. Category filter
      const matchesCategory =
        category === 'all' || product.category.toLowerCase() === category.toLowerCase();

      // 3. Price filter
      const matchesPrice = product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // 4. Sorting logic
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'title-asc') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [products, searchTerm, category, maxPrice, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setMaxPrice(highestProductPrice || 2000);
    setSortBy('default');
  };

  const isFiltered =
    searchTerm.trim() !== '' ||
    category !== 'all' ||
    maxPrice < highestProductPrice ||
    sortBy !== 'default';

  return {
    filteredProducts,
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    maxPrice,
    setMaxPrice,
    sortBy,
    setSortBy,
    clearFilters,
    categories,
    highestProductPrice,
    isFiltered,
  };
};
