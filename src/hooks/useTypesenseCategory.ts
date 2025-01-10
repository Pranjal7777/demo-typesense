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
}

interface UseTypesenseCategoryProps {
  categoryId?: string;
  initialFilters?: CategoryFilters;
  country: string;
}

// Define SEO-friendly filter names
const FILTER_MAPPINGS = {
  condition: {
    new: 'New',
    used: 'Used',
    all: 'All'
  },
  type: {
    'buy-now': 'Buy Now',
    'make-offer': 'Make Offer',
    trades: 'Trades',
    all: 'All'
  },
  sort: {
    'price-low': 'price_asc',
    'price-high': 'price_desc',
    newest: 'newest',
    oldest: 'oldest'
  }
} as const;

export const useTypesenseCategory = ({ categoryId, initialFilters, country }: UseTypesenseCategoryProps) => {
  const router = useRouter();
  const { myLocation } = useAppSelector((state: RootState) => state.auth);
  
  // Convert SEO-friendly URL parameters to filter values
  const initializeFiltersFromURL = () => {
    const { query } = router;
    return {
      type: query.type ? convertUrlParamToFilter('type', query.type as string) : '',
      condition: query.condition ? convertUrlParamToFilter('condition', query.condition as string) : '',
      price: query.price ? parsePriceRange(query.price as string) : undefined,
      distance: query.distance !== 'country' && query.distance !== 'world' 
        ? query.distance as string 
        : capitalizeFirstLetter(query.distance as string),
      address: query.address as string || '',
      latitude: query.latitude as string || myLocation?.latitude || '',
      longitude: query.longitude as string || myLocation?.longitude || '',
      country: query.country || 'India',
      category: query.category ? {
        _id: query.categoryId as string,
        title: decodeURIComponent(query.category as string)
      } : undefined,
      sort: query.sort ? convertUrlParamToFilter('sort', query.sort as string) : 'newest'
    };
  };

  // Helper functions for URL parameter conversion
  const convertUrlParamToFilter = (filterType: keyof typeof FILTER_MAPPINGS, urlParam: string): string => {
    const mapping = FILTER_MAPPINGS[filterType];
    return mapping[urlParam as keyof typeof mapping] || '';
  };

  const convertFilterToUrlParam = (filterType: keyof typeof FILTER_MAPPINGS, filterValue: string): string => {
    const mapping = FILTER_MAPPINGS[filterType];
    return Object.entries(mapping).find(([_, value]) => value === filterValue)?.[0] || '';
  };

  const parsePriceRange = (priceString: string): { min: number; max: number } | undefined => {
    const [min, max] = priceString.split('-').map(num => parseInt(num.trim()));
    return min && max ? { min, max } : undefined;
  };

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Update URL with SEO-friendly parameters
  const updateUrlWithFilters = (newFilters: CategoryFilters) => {
    const seoFriendlyParams = {
      ...router.query,
      type: newFilters.type ? convertFilterToUrlParam('type', newFilters.type) : undefined,
      condition: newFilters.condition ? convertFilterToUrlParam('condition', newFilters.condition) : undefined,
      price: newFilters.price ? `${newFilters.price.min}-${newFilters.price.max}` : undefined,
      distance: newFilters.distance?.toLowerCase(),
      address: newFilters.address || undefined,
      category: newFilters.category?.title ? encodeURIComponent(newFilters.category.title) : undefined,
      sort: newFilters.sort ? convertFilterToUrlParam('sort', newFilters.sort) : undefined
    };

    // Remove undefined values
    Object.keys(seoFriendlyParams).forEach(key => 
      seoFriendlyParams[key] === undefined && delete seoFriendlyParams[key]
    );

    router.push({
      pathname: router.pathname,
      query: seoFriendlyParams
    }, undefined, { shallow: true });
  };

  // Initialize state with URL parameters
  const [filters, setFilters] = useState<CategoryFilters>(() => initializeFiltersFromURL());
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const currentTime = Math.floor(Date.now() / 1000);

  // Updating filters when URL changes
  useEffect(() => {
    const urlFilters = initializeFiltersFromURL();
    setFilters(prev => ({
      ...prev,
      ...urlFilters
    }));
  }, [router.query]);

  const buildSearchParams = () => {
    let filterBy = `categories.id:=${categoryId} && statusCode:=1 && sold:=false && expiredTs:>=${currentTime} && country:=${filters.country || 'India'}`;

    if (filters.price) {
      filterBy += ` && price:>=${filters.price.min} && price:<=${filters.price.max}`;
    }

    if (filters.condition && filters.condition !== 'All') {
      filterBy += ` && assetCondition:=${filters.condition}`;
    }

    if (filters.type && filters.type !== 'All') {
      switch (filters.type) {
        case 'Buy Now':
          filterBy += ' && isNegotiable:=false';
          break;
        case 'Make Offer':
          filterBy += ' && isNegotiable:=true';
          break;
        case 'Trades':
          filterBy += ' && availableForExchange:=true';
          break;
      }
    }

    if (filters.category?._id) {
      filterBy += ` && categories.id:=${filters.category._id}`;
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
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    updateUrlWithFilters(updatedFilters);
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
