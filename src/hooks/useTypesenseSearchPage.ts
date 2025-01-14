import { useState, useEffect } from 'react';
import client from './useTypesense';
import { RootState } from '@/store/store';
import { useAppSelector } from '@/store/utils/hooks';
import { Product } from '@/store/types';
import { useRouter } from 'next/router';

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
  latitude?: string;
  longitude?: string;
  searchTerm?: string;
}

interface UseTypesenseCategoryProps {
  searchTerm: string;
  initialFilters?: CategoryFilters;
  country: string;
}

export const useTypesenseSearch = ({ searchTerm, initialFilters, country }: UseTypesenseCategoryProps) => {
  const router = useRouter();
  const { myLocation } = useAppSelector((state: RootState) => state.auth);
  
  const initializeFiltersFromURL = () => {
    const { query } = router;
    return {
      type: query.type as string || '',
      condition: query.condition as string || '',
      price: query.price ? (() => {
        const [min, max] = (query.price as string).replace(/\$/g, '').split(' - ');
        return { min: parseInt(min), max: parseInt(max) };
      })() : undefined,
      distance: query.distance !== 'Country' && query.distance !== 'World' ? query.distance as string : query.distance,
      address: query.address as string || '',
      latitude: query.latitude as string || myLocation?.latitude || '',
      longitude: query.longitude as string || myLocation?.longitude || '',
      country: query.country || 'India',
      category: query.categoryId ? {
        _id: query.categoryId as string,
        title: query.categoryTitle as string
      } : undefined,
      searchTerm: searchTerm || '',
    };
  };

  const [filters, setFilters] = useState<CategoryFilters>(() => initializeFiltersFromURL());
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const currentTime = Math.floor(Date.now() / 1000);

  useEffect(() => {
    const urlFilters = initializeFiltersFromURL();
    setFilters(prev => ({
      ...prev,
      ...urlFilters
    }));
  }, [router.query]);

  const buildSearchParams = () => {
    const { query } = router;
    let filterBy = `statusCode:=1 && sold:=false && expiredTs:>=${currentTime}`;

    if (filters.category?._id) {
      filterBy += ` && categories.id:=${filters.category._id}`;
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
    if (filters.address) {
      if ((!['World', 'Country'].includes(filters.distance as string))) {
        let radius = 400;
        if (filters.distance) {
          radius = parseInt(filters.distance);
        }

        const latitude = filters.location?.latitude || filters.latitude || myLocation?.latitude;
        const longitude = filters.location?.longitude || filters.longitude || myLocation?.longitude;

        if (latitude && longitude) {
          filterBy += ` && geo_location:(${latitude}, ${longitude}, ${radius} km)`;
        }
      }
    }

    if(query.country){
      filterBy += ` && country:=${query.country}`;
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
        return `${baseSort},listingTs:desc`;
    }
  };

  const fetchProducts = async (resetProducts = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchParameters = {
        q: searchTerm || '*',
        query_by: 'title.en',
        filter_by: buildSearchParams(),
        sort_by: getSortByParameter(),
        per_page: 20,
        page: currentPage,
        prefix: true,
        typo_tolerance: true,
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
      if (resetProducts) {
        setProducts([]);
      }
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const updateFilters = (newFilters: Partial<CategoryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
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
  }, [searchTerm, country]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchProducts();
    }
  }, [currentPage]);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
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
