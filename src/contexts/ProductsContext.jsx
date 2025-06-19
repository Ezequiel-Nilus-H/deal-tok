import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProductsFromApi, addCompetitorPrices } from '@/data/products';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedProducts = await fetchProductsFromApi();

      // Process first 5 products with competitor prices
      const firstBatch = fetchedProducts;
      const firstBatchWithPrices = await addCompetitorPrices(firstBatch);
      setProducts(firstBatchWithPrices);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching products');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    products,
    isLoading,
    error,
    refreshProducts: fetchProducts
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}; 