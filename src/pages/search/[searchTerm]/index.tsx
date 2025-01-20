import { useTranslation } from 'next-i18next';
import Layout from '@/components/layout';
import ProductCard from '@/components/ui/product-card';
import { productsApi } from '@/store/api-slices/products-api';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SectionTitle from '@/components/ui/section-title';
import { filterTypes } from '@/components/filter-drawer';
const FilterDrawer = dynamic(() => import('@/components/filter-drawer'), {
  ssr: false,
});
import { useEffect, useState } from 'react';
import SelectedFilterCard from '@/components/selected-filter-card';
import Skeleton from '@/components/ui/product-card-skeleton';
import { useRouter } from 'next/router';
import Slider from '@/components/ui/slider';
import BrandSlider from '@/components/sections/brand-slider';
import { GetServerSidePropsContext, NextPage } from 'next';
import { CategoriesDataFromServer, GetAllSubCategoriesByCategoryId } from '@/helper/categories-data-from-server';
import {
  Category,
  Product,
  ResponseGetAllCategoriesPayload,
  ResponseGetAllGrandParentCategoriesPayload,
  ResponseGetSubCategoriesByParentIdPayload,
} from '@/store/types';
import dynamic from 'next/dynamic';
import cookie from 'cookie';
import { API, AUTH_URL_V2, BASE_API_URL, HIDE_SELLER_FLOW, STATIC_IMAGE_URL, STRAPI_BASE_API_URL } from '@/config';
import { GET_SUB_CATEGORIES_BY_ID_URL, STRAPI_CATEGORIES_PLP } from '@/api/endpoints';
import CategorySlider from '@/components/sections/category-slider';
import { RootState } from '@/store/store';
import { useAppSelector } from '@/store/utils/hooks';
import AboutUs from '@/components/about-us';
import Accordion from '@/components/sections/accordion-card';
import InfoSection from '@/components/sections/info-section';
import { convertRTKQueryErrorToString } from '@/helper/convert-rtk-query-error-to-string';
import { useTypesenseSearch } from '@/hooks/useTypesenseSearchPage';
import { useSearchParams } from 'next/navigation';
import Select from 'react-select';
import { useTheme } from '@/hooks/theme';
import { StylesConfig } from 'react-select';
import PageHeaderWithBreadcrumb from '@/components/ui/page-header-with-breadcrumb';
import Breadcrumb from '@/components/ui/breadcrumb';
import { getGuestTokenFromServer } from '@/helper/get-guest-token-from-server';
import { categoriesApi } from '@/store/api-slices/categories-api';
import { useNewWindowScroll } from '@/hooks/new-use-window-scroll';
import { IMAGES } from '@/lib/images';
import CustomHeader from '@/components/ui/custom-header';
import Placeholder from '@/containers/placeholder/placeholder';

export type filteredProducts = {
  userName: string;
  timeStamp: string;
  productName: string;
  productPrice: string;
  location: string;
};

export type sectionTitle = {
  title: string;
  description: string;
};

export type aboutUs = {
  title: string;
  desc: string[];
}[];

export type accordion = {
  title: string;
  items: {
    title: string;
    desc: string;
  }[];
};

export type CategoriesLogo = {
  brnadlogo: {
    alt: string;
    image: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    title: string;
  };
};
export type CategoriesPageProps = {
  categoriesLogos: CategoriesLogo[];
  subCategories: Category[];
  tokenFromServer: any;
  myLocationFromServer?: any;
  categories: ResponseGetAllGrandParentCategoriesPayload;
};

// Define the option type
type SortOption = {
  value: string;
  label: string;
};

// eslint-disable-next-line react/prop-types
const Categories: NextPage<CategoriesPageProps> = function ({
  categoriesLogos,
  subCategories,
  tokenFromServer,
  myLocationFromServer,
  categories,
}) {
  const { t } = useTranslation('categories');
  const aboutUs = t('page.aboutUs', { returnObjects: true }) as aboutUs;
  const accordion = t('page.accordion', { returnObjects: true }) as accordion;
  const { myLocation } = useAppSelector((state: RootState) => state.auth);
  const { data: filterParameters, error: filterParametersError } = productsApi.useGetFilterParametersQuery();
  const theme = useTheme();

  const router = useRouter();

  const { searchTerm: categoryNameId, selectedCategory } = router.query;
  const categoryNameIdArray = Array.isArray(categoryNameId) ? categoryNameId : categoryNameId?.split('-');
  const id = categoryNameIdArray?.[categoryNameIdArray.length - 1];
  const categoryName = categoryNameIdArray?.slice(0, -1).join('-');

  const searchParams = useSearchParams();

  const initialFilters = {
    type: searchParams.get('type') || '',
    condition: searchParams.get('condition') || '',
    postedWithin: searchParams.get('postedWithin') || '',
    zipcode: searchParams.get('zipcode') || '',
    pendingOffer: searchParams.get('pendingOffer') || '',
    price: searchParams.get('price') || '',
    distance: searchParams.get('distance') || '',
    address: searchParams.get('address') || '',
    latitude: searchParams.get('latitude') || '',
    longitude: searchParams.get('longitude') || '',
    country: searchParams.get('country') || 'India',
    category: { title: searchParams.get('categoryTitle') || '', _id: searchParams.get('categoryId') || '' },
  };

  const [filtersDrawer, setFilterDrawer] = useState(false);
  const [selectedItemsFromFilterSection, setSelectedItemsFromFilterSection] = useState<filterTypes>(initialFilters);
  const [threshold, setThreshold] = useState(700);

  const minThreshold = useNewWindowScroll(threshold);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setThreshold(window.innerWidth < 643 ? 540 : 700);
    });
    return () => {
      window.removeEventListener('resize', () => {
        setThreshold(window.innerWidth < 643 ? 540 : 700);
      });
    };
  }, []);

  const closeFilter = () => {
    setFilterDrawer(false);
  };
  const changeSelectedItem = (obj: {}) => {
    setSelectedItemsFromFilterSection({ ...selectedItemsFromFilterSection, ...obj });
  };

  const addFiltersToQuery = (selectedFilters: filterTypes) => {
    const { pathname, query } = router;
    const updatedQuery = { ...query };

    (Object.keys(selectedFilters) as (keyof filterTypes)[]).forEach((filterName) => {
      const filterValue = selectedFilters[filterName];

      if (filterName === 'category' && typeof filterValue === 'object') {
        if ('_id' in filterValue) {
          if (!filterValue._id || !filterValue.title) {
            delete updatedQuery.categoryId;
            delete updatedQuery.categoryTitle;
          } else {
            updatedQuery.categoryId = filterValue._id;
            updatedQuery.categoryTitle = filterValue.title;
          }
        }
      } else if (filterName === 'address' && filterValue) {
        updatedQuery.address = String(filterValue);
        if (myLocation?.latitude && myLocation?.longitude) {
          updatedQuery.latitude = String(myLocation.latitude);
          updatedQuery.longitude = String(myLocation.longitude);
        }
      } else {
        if (filterValue) {
          updatedQuery[filterName] = String(filterValue);
        } else {
          delete updatedQuery[filterName];
        }
      }
    });

    router.replace(
      {
        pathname,
        query: updatedQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  console.log(router.pathname, 'router pathname');
  
  const removeFilter = (key: string) => {
    console.log(key, 'key remove');
    const updatedFeaturedFilters = { ...selectedItemsFromFilterSection };
    if (key === 'category') {
      updatedFeaturedFilters.category = { title: '', _id: '' };
    } else if (key === 'address') {
      updatedFeaturedFilters.address = '';
      const { query } = router;
      delete query.latitude;
      delete query.longitude;
      delete query.address;
    } else {
      (updatedFeaturedFilters as any)[key] = '';
    }

    setSelectedItemsFromFilterSection(updatedFeaturedFilters);
    addFiltersToQuery(updatedFeaturedFilters);

    let typesenseFilters = transformFilters(updatedFeaturedFilters);
    if (!typesenseFilters?.address) {
      typesenseFilters.address = '';
    }
    if (!typesenseFilters?.type) {
      typesenseFilters.type = '';
    }
    updateFilters(typesenseFilters);
  };

  const selectedItemsFromFiltersSectionList = () => {
    return Object.entries(selectedItemsFromFilterSection)
      .map(([key, value]) => {
        // Skip rendering if it's the distance filter
        if (key === 'distance' || key === 'country' || key === 'latitude' || key === 'longitude') return null;
        if (!value) return null;
        if (typeof value === 'object') {
          if ('title' in value && (!value.title || value.title === '')) return null;
          if ('min' in value && !value.min) return null;
        }
        if (typeof value === 'string' && value === '') return null;

        return (
          <div key={key} className="mb-2">
            <SelectedFilterCard
              label={
                typeof value === 'string' ? value : 'title' in value ? value.title : `$${value.min} - $${value.max}`
              }
              onDelete={() => removeFilter(key)}
            />
          </div>
        );
      })
      .filter(Boolean);
  };
  const handleFilterDrawer = () => {
    setFilterDrawer(true);
  };

  const [highlightedProductsPageCount, sethighlightedProductsPageCount] = useState(1);
  const handleHighlightedProductsPageCountPageCount = () => {
    sethighlightedProductsPageCount(highlightedProductsPageCount + 1);
  };
  const [allHighlightedProducts, setAllHighlightedProducts] = useState<Product[]>([]);
  const [trigger, { data: highlightedProducts, isError, error, isFetching }] =
    productsApi.useLazyGetAllHighlightedProductsForFilterQuery();

  useEffect(() => {
    if (highlightedProductsPageCount) {
      trigger({
        page: highlightedProductsPageCount,
        latitude: myLocation?.latitude,
        longitude: myLocation?.longitude,
        country: myLocation?.country,
        catId: id as string,
      });
    }
  }, [highlightedProductsPageCount]);
  useEffect(() => {
    if (id) {
      setAllHighlightedProducts([]);
      sethighlightedProductsPageCount(1);
      trigger({
        page: highlightedProductsPageCount,
        latitude: myLocation?.latitude,
        longitude: myLocation?.longitude,
        country: myLocation?.country,
        catId: id as string,
      });
    }
  }, [id]);
  useEffect(() => {
    if (highlightedProducts) {
      setAllHighlightedProducts([...allHighlightedProducts, ...highlightedProducts.result]);
    }
  }, [highlightedProducts]);

  const getQueryParam = (param: string | string[] | undefined): string => {
    return Array.isArray(param) ? param[0] : param || '';
  };

  const [bannersAndRecommendedProductsPageCount, setBannersAndRecommendedProductsPageCount] = useState(1);
  const handleBannersAndRecommendedProductsPageCount = () => {
    setBannersAndRecommendedProductsPageCount(bannersAndRecommendedProductsPageCount + 1);
  };
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [triggerBannersAndRecommendedProducts, { data: bannersAndRecommendedProducts }] =
    productsApi.useLazyGetAllBannersAndProductsForFilterQuery();

  useEffect(() => {
    if (bannersAndRecommendedProductsPageCount) {
      triggerBannersAndRecommendedProducts({
        page: bannersAndRecommendedProductsPageCount,
        latitude: myLocation?.latitude,
        longitude: myLocation?.longitude,
        country: myLocation?.country,
        catId: id as string,
      });
    }
  }, [bannersAndRecommendedProductsPageCount]);
  useEffect(() => {
    if (id) {
      setRecommendedProducts([]);
      setBannersAndRecommendedProductsPageCount(1);
      triggerBannersAndRecommendedProducts({
        page: bannersAndRecommendedProductsPageCount,
        latitude: myLocation?.latitude,
        longitude: myLocation?.longitude,
        country: myLocation?.country,
        catId: id as string,
      });
    }
  }, [id]);
  useEffect(() => {
    if (bannersAndRecommendedProducts) {
      setRecommendedProducts([...recommendedProducts, ...bannersAndRecommendedProducts.result]);
    }
  }, [bannersAndRecommendedProducts]);

  useEffect(() => {
    const updatedFilters = {
      type: getQueryParam(router.query.type),
      condition: getQueryParam(router.query.condition),
      postedWithin: getQueryParam(router.query.postedWithin),
      zipcode: getQueryParam(router.query.zipcode),
      pendingOffer: getQueryParam(router.query.pendingOffer),
      price: getQueryParam(router.query.price),
      distance: getQueryParam(router.query.distance),
      address: getQueryParam(router.query.address),
      category: { title: searchParams.get('categoryTitle') || '', _id: searchParams.get('categoryId') || '' },
      latitude: getQueryParam(router.query.latitude),
      longitude: getQueryParam(router.query.longitude),
      country: getQueryParam(router.query.couuntry),
    };
    setSelectedItemsFromFilterSection(updatedFilters);
  }, [router.query]);

  const { searchTerm: routeSearchTerm } = router.query;
  // Get the actual search term from the URL
  const searchText = Array.isArray(routeSearchTerm) 
    ? routeSearchTerm[0].split('-').slice(0, -1).join(' ') // Remove the ID part and join with spaces
    : routeSearchTerm?.split('-').slice(0, -1).join(' ') || '';

  const {
    products,
    isLoading,
    error: errorTypesense,
    totalCount,
    hasMore,
    filters,
    loadMore,
    updateFilters,
    resetFilters,
  } = useTypesenseSearch({
    searchTerm: searchText,
    country: selectedItemsFromFilterSection.country,
  });

  console.log(products, 'products-search');

  useEffect(() => {
    resetFilters();
  }, [id]);

  const hasActiveFilters = () => {
    return Object.entries(selectedItemsFromFilterSection).some(([key, value]) => {
      if (key === 'distance') return false;
      if (key === 'category') {
        const categoryValue = value as { title: string; _id: string };
        return categoryValue?.title && categoryValue?._id;
      }
      return value !== '';
    });
  };

  interface TypesenseFilters {
    address?: string;
    price?: {
      min: number;
      max: number;
    };
    [key: string]: any;
  }

  const transformFilters = (filters: filterTypes): TypesenseFilters => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '' && value !== undefined)
    );

    return {
      ...cleanedFilters,
      price: filters.price
        ? typeof filters.price === 'string'
          ? (() => {
              const [min, max] = filters.price.replace(/\$/g, '').split(' - ');
              return {
                min: parseInt(min),
                max: parseInt(max),
              };
            })()
          : filters.price
        : undefined,
    };
  };

  useEffect(() => {
    const initialFilters = { ...selectedItemsFromFilterSection };
    const typesenseFilters = transformFilters(initialFilters);
    updateFilters(typesenseFilters);
  }, []);
  
  return (
    <>
      <FilterDrawer
        filtersDrawer={filtersDrawer}
        selectedItemsFromFilterSection={selectedItemsFromFilterSection}
        setSelectedItemsFromFilterSection={setSelectedItemsFromFilterSection}
        closeFilter={closeFilter}
        changeItems={changeSelectedItem}
        // addFiltersToQuery={(selectedFilters) => handleFilterChange(selectedFilters)}
        addFiltersToQuery={addFiltersToQuery}
        updateFilters={updateFilters}
        filterParameters={filterParameters!}
      />

      <Layout
        stickyHeader={true}
        stickyHeroSection={true}
        tokenFromServer={tokenFromServer}
        myLocationFromServer={myLocationFromServer}
        categories={categories}
      >
        {/* header with image and search box */}
        {/* Section:- What are you looking for? */}
        <div className={`relative  custom-container mx-auto sm:px-16 mobile:px-4 `}>
          {/* start */}
          {/* subcategories card section start */}
          {!HIDE_SELLER_FLOW && subCategories.length > 0 && (
            <Slider className="pt-5 sm:py-8 lg:py-12  border-error">
              <SectionTitle className="mb-4 sm:mb-3">Shop by category</SectionTitle>
              <CategorySlider className="border-error" data={subCategories} />
            </Slider>
          )}
          {/* categories section starts */}
          <div className={`mobile:pb-9 w-full ${hasActiveFilters() ? 'mt-[80px]' : 'mt-[40px]'}`}>
            <div className="w-full ">
              <div className=" w-full flex flex-col justify-center">
                <div
                  style={{ zIndex: 1 }}
                  className={`w-full ${`fixed top-[130px] z-auto sm:top-[145px] left-0 right-0 bg-bg-secondary-light dark:bg-bg-primary-dark px-[4%] sm:px-[64px] pt-2 pb-2 mx-auto max-w-[1440px]`}`}
                >
                  <div
                    className={`flex  w-full justify-end filterselectContainer ${
                      hasActiveFilters() ? 'justify-between' : 'justify-end'
                    }`}
                  >
                    {/* <SectionTitle>All Products</SectionTitle> */}
                    {hasActiveFilters() && (
                      <div className="border-2 boreder-error flex gap-10 items-center w-full flex-wrap  mobile:overflow-x-scroll border-none">
                        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
                          {selectedItemsFromFiltersSectionList()}
                        </div>
                      </div>
                    )}
          
                    <button
                      className=" md:w-[148px] mobile:min-w-[36px] md:min-w-[148px] h-11 text-text-primary-light dark:text-text-primary-dark md:border-2 items-center flex  cursor-pointer justify-end md:justify-center gap-1 rounded-[100px]"
                      onClick={handleFilterDrawer}
                    >
                      <span className="hidden md:block">More filters</span>
                      <div>
                        <img
                          className=" inline-block mobile:hidden h-[18px] w-[18px]"
                          width={28}
                          height={24}
                          src={'/images/filters_icon_white.svg'}
                          alt="dollar_coin_icon"
                        />
                        <img
                          className=" mobile:block hidden h-[18px] w-[18px]"
                          width={20}
                          height={18}
                          src={'/images/filters_icon_white.svg'}
                          alt="dollar_coin_icon"
                        />
                      </div>
                    </button>
                  </div>
                   </div>
                <div className={`mt-10 w-full mobile:mt-6`}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-3 gap-y-4 md:gap-x-2 md:gap-y-7">
                    {errorTypesense ? (
                      <div className="col-span-full">
                        <h2 className="text-center text-red-500">{errorTypesense}</h2>
                      </div>
                    ) : products.length > 0 ? (
                      products.map((product, index) => (
                        <ProductCard key={`${product?.id}-${index}`} product={product} isTypeSenseData={true} />
                      ))
                    ) : !isLoading ? (
                      <Placeholder containerClassName='col-span-full mb-8' title='No products found' description='Please search for something else'/>
                    ) : null}

                    {isLoading && (
                      <>
                        {Array.from({ length: 10 }).map((_, index) => (
                          <Skeleton key={`skeleton-${index}`} />
                        ))}
                      </>
                    )}
                  </div>

                  {hasMore && (
                    <div className="mt-7 w-full flex items-center justify-center">
                      <button
                        className="border-2 text-sm font-medium px-4 py-2 rounded dark:text-text-primary-dark
                          hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                          disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={loadMore}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Loading...' : 'View more'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {!HIDE_SELLER_FLOW && (
            <>
              <div className="border-b border-border-tertiary-light dark:border-border-tertiary-dark mt-12"></div>
              <div className=" relative custom-container mx-auto sm:px-16 mobile:px-4 ">
                <div className=" flex flex-col items-center justify-center ">
                  <div className=" mobile:mb-[42px] pb-8 flex flex-col w-full border-error">
                    <AboutUs data={aboutUs} />
                    <Accordion data={accordion} />
                  </div>
                </div>
                <InfoSection />
              </div>
            </>
          )}
        </div>
      </Layout>
      <style jsx>{`
        :global(.filterselectContainer) {
          color: ${theme.theme ? '#fff' : 'var(--text-primary-light)'} !important;
        }
      `}</style>
    </>
  );
};

export default Categories;

export async function getServerSideProps({
  locale,
  params,
  req,
}: {
  locale: string;
  params: any;
  req: GetServerSidePropsContext['req'];
}) {
  const paramsArray = params['searchTerm']?.split('-');
  const categoryId = paramsArray[paramsArray.length - 1];
  let accessToken, tokenFromServer;

  try {
    // Handle authentication
    if (req.headers.cookie) {
      const cookies = cookie.parse(req.headers.cookie);
      accessToken = cookies.accessToken?.replace(/"/g, '');
    }

    if (!accessToken) {
      const guestTokenResponse = await getGuestTokenFromServer();
      if (!guestTokenResponse?.data?.token) {
        throw new Error('Failed to get guest token');
      }
      tokenFromServer = guestTokenResponse.data.token;
      accessToken = tokenFromServer.accessToken;
    }

    // Fetch data using the token
    const promises = [
      fetch(`${STRAPI_BASE_API_URL}${STRAPI_CATEGORIES_PLP}?populate=deep`),
      GetAllSubCategoriesByCategoryId(accessToken, categoryId),
      CategoriesDataFromServer(accessToken),
    ];
    const listingApiReponses = await Promise.allSettled(promises);

    const response1 = listingApiReponses[0].status === 'fulfilled' && listingApiReponses[0].value;
    const response2 = listingApiReponses[1].status === 'fulfilled' && listingApiReponses[1].value;
    const categories = listingApiReponses[2].status === 'fulfilled' && listingApiReponses[2].value;

    const data = await response1.json();
    return {
      props: {
        ...(await serverSideTranslations(locale, ['categories', 'common'])),
        categoriesLogos: data.data.attributes.brandLogos || [],
        subCategories: response2.data || [],
        tokenFromServer: tokenFromServer || null,
        categories,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['categories', 'common'])),
        destination: '/500',
        permanent: false,
      },
    };
  }
}
