import { useTranslation } from 'next-i18next';
import Layout from '@/components/layout';
import ProductCard from '@/components/ui/product-card';
import { IMAGES } from '@/lib/images';
import { productsApi } from '@/store/api-slices/products-api';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SectionTitle from '@/components/ui/section-title';
import { filterTypes } from '@/components/filter-drawer';
const FilterDrawer = dynamic(() => import('@/components/filter-drawer'), {
  ssr: false,
});
import { useEffect, useState } from 'react';
import SelectedFilterCard from '@/components/selected-filter-card';
import Image from 'next/image';
import { gumletLoader } from '@/lib/gumlet';
import Skeleton from '@/components/ui/product-card-skeleton';
import { useRouter } from 'next/router';
import Slider from '@/components/ui/slider';
import BrandSlider from '@/components/sections/brand-slider';
import { GetServerSidePropsContext, NextPage } from 'next';
import { GetAllSubCategoriesByCategoryId } from '@/helper/categories-data-from-server';
import { Category, Product } from '@/store/types';
import dynamic from 'next/dynamic';
import cookie from 'cookie';
import { API, HIDE_SELLER_FLOW, STRAPI_BASE_API_URL } from '@/config';
import { STRAPI_CATEGORIES_PLP } from '@/api/endpoints';
import CategorySlider from '@/components/sections/category-slider';
import { RootState } from '@/store/store';
import { useAppSelector } from '@/store/utils/hooks';
import AboutUs from '@/components/about-us';
import Accordion from '@/components/sections/accordion-card';
import InfoSection from '@/components/sections/info-section';
import { convertRTKQueryErrorToString } from '@/helper/convert-rtk-query-error-to-string';
import { useTypesenseCategory } from '@/hooks/useTypesenseCategory';
import { useSearchParams } from 'next/navigation';
import Select from 'react-select';
import { useTheme } from '@/hooks/theme';
import { StylesConfig } from 'react-select';
import PageHeaderWithBreadcrumb from '@/components/ui/page-header-with-breadcrumb';
import Breadcrumb from '@/components/ui/breadcrumb';

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
};

// Define the option type
type SortOption = {
  value: string;
  label: string;
};

// eslint-disable-next-line react/prop-types
const Categories: NextPage<CategoriesPageProps> = function ({ categoriesLogos, subCategories }) {
  const { t } = useTranslation('categories');
  // const sectionTitle: sectionTitle = t('page.sectionTitle', { returnObjects: true });
  const aboutUs = t('page.aboutUs', { returnObjects: true }) as aboutUs;
  const accordion = t('page.accordion', { returnObjects: true }) as accordion;
  const { myLocation } = useAppSelector((state: RootState) => state.auth);

  const router = useRouter();

  const { id, selectedCategory } = router.query;
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
    category: { title: searchParams.get('categoryTitle') || '', _id: searchParams.get('categoryId') || '' },
  };

  const [filtersDrawer, setFilterDrawer] = useState(false);
  const [selectedItemsFromFilterSection, setSelectedItemsFromFilterSection] = useState<filterTypes>(initialFilters);

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
  const removeFilter = (key: string) => {
    const updatedFeaturedFilters = { ...selectedItemsFromFilterSection };
    if (key === 'category') {
      updatedFeaturedFilters.category = { title: '', _id: '' };
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
        if (key === 'distance') return null;
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
  const [
    triggerBannersAndRecommendedProducts,
    {
      data: bannersAndRecommendedProducts,
      isError: isErrorBannersAndRecommendedProducts,
      error: errorBannersAndRecommendedProducts,
      isFetching: isFetchingBannersAndRecommendedProducts,
      // refetch,
    },
  ] = productsApi.useLazyGetAllBannersAndProductsForFilterQuery();

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
    };
    setSelectedItemsFromFilterSection(updatedFilters);
  }, [router.query]);

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
  } = useTypesenseCategory({
    categoryId: id as string,
    country: 'India',
  });

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
    console.log(typesenseFilters, selectedItemsFromFilterSection, 'typesenseFilters');
    updateFilters(typesenseFilters);
  }, []);

  const theme = useTheme();

  const customStyles: StylesConfig<SortOption, false> = {
    control: (provided) => ({
      ...provided,
      width: '100%',
      outline: 'none',
      border: theme.theme ? '1px solid #433934' : `1px solid var(--border-tertiary-light)`,
      borderRadius: '0.775rem',
      backgroundColor: theme.theme ? 'var(--bg-primary-dark)' : '#FFF',
      fontSize: '14px',
      color: theme.theme ? 'var(--bg-secondary-dark)' : 'var(--bg-primary-light)',
      fontWeight: '400',
      cursor: 'pointer',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? theme.theme
          ? '#2D3748'
          : '#EDF2F7'
        : theme.theme
        ? 'var(--bg-primary-dark)'
        : '#FFF',
      color: theme.theme ? '#fff' : 'var(--bg-primary-light)',
      fontSize: '14px',
      fontWeight: '400',
      cursor: 'pointer',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme.theme ? 'var(--bg-primary-dark)' : '#fff',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme.theme ? '#fff' : 'var(--bg-primary-light)',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '2px 0px 2px 8px',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      padding: '0px 0px 0px 0px',
    }),
  };

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
      />

      <Layout>
        {/* header with image and search box */}
        {/* Section:- What are you looking for? */}
        <div className=" relative custom-container mx-auto sm:px-16 mobile:px-4 ">
          {/* start */}
          {/* subcategories card section start */}
          {!HIDE_SELLER_FLOW && subCategories.length > 0 && (
            <Slider className="pt-5 sm:py-8 lg:py-12  border-error">
              <SectionTitle className="mb-4 sm:mb-3">Shop by category</SectionTitle>
              <CategorySlider className="border-error" data={subCategories} />
            </Slider>
          )}

          {categoriesLogos.length > 0 && (
            <Slider className=" border-error pt-9 sm:py-8 lg:py-12 ">
              <SectionTitle className="mb-4 sm:mb-3">Popular brands</SectionTitle>
              <BrandSlider data={categoriesLogos} />
            </Slider>
          )}

          {/* subcategories brand section end  */}
          <Breadcrumb isLinkDisable={true} className='!pl-0 md:!pl-0 my-5' steps={[{name:'Categories'}, {name:getQueryParam(selectedCategory)}]}></Breadcrumb>
          {/* categories section starts */}
          <div className="mobile:pb-9">
            {allHighlightedProducts.length > 0 && (
              <div className=" w-full pt-9 sm:py-8 lg:py-12 flex flex-col items-center justify-center">
                <div className=" flex  w-full justify-between">
                  <SectionTitle>Featured Products</SectionTitle>
                  {/* <button className="flex cursor-pointer justify-between " 
                  onClick={handleFilterDrawer}>
                    <div>
                      {' '}
                      <Image
                        className="dark:inline-block hidden"
                        width={28}
                        height={24}
                        src={'/images/filters_icon_white.svg'}
                        alt="dollar_coin_icon"
                        // loader={gumletLoader}
                      />
                      <Image
                        className="dark:hidden inline-block"
                        width={20}
                        height={18}
                        src={'/images/filters_icon_black.svg'}
                        alt="dollar_coin_icon"
                        // loader={gumletLoader}
                      />
                    </div>
                  </button> */}
                </div>

                {hasActiveFilters() && (
                  <div className="border-2 boreder-error flex gap-10 items-center w-full flex-wrap mt-5 mobile:overflow-x-scroll h-8 md:h-4 border-none">
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                      {selectedItemsFromFiltersSectionList()}
                    </div>
                  </div>
                )}
                {/* Selected Filters categories section - 01 end */}
                {/* Product card categories section - 01 start */}
                <div className="mt-10 w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-3 gap-y-4 md:gap-x-2 md:gap-y-7">
                    {isError ? (
                      <h2>{convertRTKQueryErrorToString(error)}</h2>
                    ) : highlightedProducts?.result !== undefined ? (
                      allHighlightedProducts.map((product, index) => <ProductCard key={index} product={product} />)
                    ) : null}
                    {isFetching && (
                      <>
                        {Array.from({ length: 10 }).map((_, index) => (
                          <Skeleton key={index} />
                        ))}
                      </>
                    )}
                  </div>

                  <div className=" mt-7 w-full flex items-center justify-center">
                    {highlightedProducts ? (
                      <button
                        className={`border-2 text-sm font-medium px-4 py-2 rounded dark:text-text-primary-dark
                    ${allHighlightedProducts.length >= highlightedProducts?.Totalcount ? 'hidden' : ''}
                    
                    `}
                        onClick={() => handleHighlightedProductsPageCountPageCount()}
                      >
                        View more
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
            {recommendedProducts.length > 0 && (
              <div className=" w-full pt-9 sm:py-8 lg:py-12 flex flex-col items-center justify-center">
                <div className=" w-full">
                  <div className=" flex  w-full justify-between">
                    <SectionTitle>All Products</SectionTitle>
                    <div className="ml-auto mr-[24px] relative inline-flex items-center gap-2">
                      <Select
                        className="w-fit mobile:text-sm text-[14px]"
                        onChange={(option) => {
                          updateFilters({ sort: option?.value });
                        }}
                        options={[
                          { value: 'newest', label: 'Newest First' },
                          { value: 'oldest', label: 'Oldest First' },
                          { value: 'price_asc', label: 'Low to High' },
                          { value: 'price_desc', label: 'High to Low' },
                        ]}
                        defaultValue={{ value: 'newest', label: 'Newest First' }}
                        formatOptionLabel={({ label }, { context }) => <span className="pl-2">{label}</span>}
                        styles={customStyles}
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 0,
                          colors: {
                            ...theme.colors,
                            primary25: theme ? '#f1ecf9' : '#EDF2F7',
                            primary: theme ? 'var(--brand-color)' : 'var(--brand-color-hover)',
                          },
                        })}
                      />
                    </div>
                    <button className="flex cursor-pointer justify-between items-center" onClick={handleFilterDrawer}>
                      <div>
                        <img
                          className=" inline-block mobile:hidden"
                          width={28}
                          height={24}
                          // src={IMAGES.FILTERS_ICON_BLACK}
                          src={'/images/filters_icon_white.svg'}
                          alt="dollar_coin_icon"
                          // loader={gumletLoader}
                        />
                        <img
                          className=" mobile:block hidden"
                          width={20}
                          height={18}
                          // src={IMAGES.FILTERS_ICON_BLACK}
                          src={'/images/filters_icon_white.svg'}
                          alt="dollar_coin_icon"
                          // loader={gumletLoader}
                        />
                      </div>
                    </button>
                  </div>
                  {hasActiveFilters() && (
                    <div className="border-2 boreder-error flex gap-10 items-center w-full flex-wrap mt-5 mobile:overflow-x-scroll h-8 md:h-4 border-none mb-2">
                      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                        {selectedItemsFromFiltersSectionList()}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-10 w-full mobile:mt-6">
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
                      <div className="col-span-full text-center py-8 dark:text-white">
                        <h2>No products found</h2>
                      </div>
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
            )}
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
      </Layout>
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
  params: { id: string };
  req: GetServerSidePropsContext['req'];
}) {
  const { id: categoryId } = params;
  let accessToken;
  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie || '');
    accessToken = cookies.accessToken?.replace(/"/g, '');
  }

  try {
    const promises = [
      fetch(`${STRAPI_BASE_API_URL}${STRAPI_CATEGORIES_PLP}?populate=deep`),
      GetAllSubCategoriesByCategoryId(accessToken!, categoryId),
    ];
    const listingApiReponses = await Promise.allSettled(promises);

    const response1 = listingApiReponses[0].status === 'fulfilled' && listingApiReponses[0].value;
    const response2 = listingApiReponses[1].status === 'fulfilled' && listingApiReponses[1].value;

    const data = await response1.json();
    return {
      props: {
        ...(await serverSideTranslations(locale, ['categories', 'common'])),
        categoriesLogos: data.data.attributes.brandLogos || [],
        subCategories: response2.data || [],
      },
    };
  } catch (error) {
    console.log('error accured', error);

    return {
      props: {
        ...(await serverSideTranslations(locale, ['categories', 'common'])),
        destination: '/500',
        permanent: false,
      },
    };
  }
}
