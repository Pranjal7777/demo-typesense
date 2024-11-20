import { useState, useEffect } from 'react';
import client from './useTypesense';
import { RootState } from '@/store/store';
import { useAppSelector } from '@/store/utils/hooks';
import { Product } from '@/store/types';

interface CategoryFilters {
  sort?: string;
  price?: { min: number; max: number };
  condition?: string;
  type?: string;
  distance?: string;
  location?: {
    latitude: string;
    longitude: string;
    country: string;
  };
  address?: string;
  zipcode?: string;
  category?: { title: string; _id: string };
}

interface UseTypesenseCategoryProps {
  categoryId?: string;
  initialFilters?: CategoryFilters;
  country: string;
}

export const useTypesenseCategory = ({ categoryId, initialFilters, country }: UseTypesenseCategoryProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<CategoryFilters>(initialFilters || {});
  const { myLocation } = useAppSelector((state: RootState) => state.auth);
  const currentTime = Math.floor(Date.now() / 1000);

  const buildSearchParams = () => {
    let filterBy = `categories.id:=${categoryId} && statusCode:=1 && sold:=false && expiredTs:>=${currentTime}`;

    if (country) {
      filterBy += ` && country:=${country}`;
    }

    if (filters.price) {
      filterBy += ` && price:>=${filters.price.min} && price:<=${filters.price.max}`;
    }
    if (filters.condition) {
      const condition = filters.condition.toLowerCase();
      if (condition !== 'all') {
        const conditionValue = condition === 'new' ? 'New' : 'Used';
        filterBy += ` && assetCondition:=${conditionValue}`;
      }
    }
    if (filters.type && filters.type !== 'All') {
      const type =
        filters.type === 'Buy Now'
          ? 'isNegotiable:=false'
          : filters.type === 'Make Offer'
          ? 'isNegotiable:=true'
          : filters.type === 'Trades'
          ? 'availableForExchange:=true'
          : '';
      if (type) {
        filterBy += ` && ${type}`;
      }
    }
    if (filters.category?._id) {
      filterBy += ` && categories.id:=${filters.category._id}`;
    }
    if (filters.address) {
      if (!filters.distance || (!['World', 'Country'].includes(filters.distance))) {
        let radius = 400; // default radius from config

        if (filters.distance) {
          radius = parseInt(filters.distance);
        }

        filterBy += ` && geo_location:(${myLocation?.latitude}, ${myLocation?.longitude}, ${radius} km)`;
      }
    }
    return filterBy;
  };

  const getSortByParameter = () => {
    const baseSort = `_eval([ (highlightExpireOn:>=${currentTime}):2, (urgentSaleExpireOn:>=${currentTime}):1 ]):desc`;

    switch (filters.sort) {
      case 'price_asc':
        return `${baseSort},price:asc`;
      case 'price_desc':
        return `${baseSort},price:desc`;
      case 'newest':
        return `${baseSort},listingTs:desc`;
      case 'oldest':
        return `${baseSort},listingTs:asc`;
      default:
        return `${baseSort},listingTs:desc`; // Default sorting
    }
  };

  const fetchProducts = async (resetProducts = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParameters = {
        q: '*',
        filter_by: buildSearchParams(),
        sort_by: getSortByParameter(),
        per_page: 20,
      };

      const result = await client.collections('kwibal_asset').documents().search(searchParameters);
      const hits = result.hits?.map((hit) => hit.document) || [];
      setProducts(hits as Product[]);
      setTotalCount(hits.length || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Search error:', err);
      setProducts([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const updateFilters = (newFilters: Partial<CategoryFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters(initialFilters || {});
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
    setProducts([]);
    fetchProducts(true);
  }, [categoryId, country]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchProducts();
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 1) {
      fetchProducts(true);
    }
  }, [filters]);

  return {
    products,
    isLoading,
    error,
    totalCount,
    hasMore: products.length < totalCount,
    currentPage,
    filters,
    loadMore,
    updateFilters,
    resetFilters,
  };
};
