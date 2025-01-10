import { useState, useEffect } from 'react';
import client from './useTypesense';
import { Product } from '@/store/types';

interface UseTypesenseSellerProductsProps {
  accountId: string;
  searchTerm?: string;
}

export const useTypesenseSellerProducts = ({ accountId, searchTerm }: UseTypesenseSellerProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const currentTime = Math.floor(Date.now() / 1000);

  const fetchProducts = async (resetProducts = false) => {
    if (!accountId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const searchParameters = {
        q: searchTerm || '*',
        query_by: searchTerm ? 'title' : '',
        filter_by: `accountId:=${accountId} && statusCode:=1 && sold:=false && expiredTs:>=${currentTime}`,
        sort_by: `_eval([ (highlightExpireOn:>=${currentTime}):2, (urgentSaleExpireOn:>=${currentTime}):1 ]):desc,listingTs:desc`,
        per_page: 20,
        page: currentPage,
      };

      const result = await client.collections('kwibal_asset').documents().search(searchParameters);
      
      const hits = result.hits?.map((hit) => hit.document) || [];
      
      if (resetProducts) {
        setProducts(hits as Product[]);
      } else {
        setProducts(prev => [...prev, ...hits] as Product[]);
      }
      
      setTotalCount(result.found || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const updateSearch = (newSearchTerm: string) => {
    setCurrentPage(1);
    setProducts([]);
    // The actual search will be triggered by the searchTerm effect
  };

  // Initial load and account ID change
  useEffect(() => {
    setCurrentPage(1);
    setProducts([]);
    fetchProducts(true);
  }, [accountId]);

  // Handle search term changes
  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(true);
  }, [searchTerm]);

  // Handle pagination
  useEffect(() => {
    if (currentPage > 1) {
      fetchProducts();
    }
  }, [currentPage]);

  return {
    products,
    isLoading,
    error,
    totalCount,
    hasMore: products.length < totalCount,
    currentPage,
    loadMore,
    updateSearch,
  };
}; 