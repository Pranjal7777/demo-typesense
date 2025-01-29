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
import { Category, Product, ResponseGetAllGrandParentCategoriesPayload, ResponseGetSubCategoriesByParentIdPayload } from '@/store/types';
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
import { useTypesenseCategory } from '@/hooks/useTypesenseCategory';
import Placeholder from '@/containers/placeholder/placeholder';
import FilterButtonDropdown from '@/components/ui/filter-button-dropdown';

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
  categoriesBanner: ResponseGetSubCategoriesByParentIdPayload;
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
  categoriesBanner: categoriesBannerData,
}) {
  const { t } = useTranslation('categories');
  const aboutUs = t('page.aboutUs', { returnObjects: true }) as aboutUs;
  const accordion = t('page.accordion', { returnObjects: true }) as accordion;
  const { myLocation } = useAppSelector((state: RootState) => state.auth);
  const { data: filterParameters, error: filterParametersError } = productsApi.useGetFilterParametersQuery();
  const theme = useTheme();
  const router = useRouter();

  const { 'categoryName-id': categoryNameId , selectedCategory} = router.query;
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
    country: searchParams.get('country') || myLocation?.country || 'India',
    category: { title: searchParams.get('categoryTitle') || '', _id: searchParams.get('categoryId') || '' },
    sort: searchParams.get('sort') || '',
  };

  const [filtersDrawer, setFilterDrawer] = useState(false);
  const [selectedItemsFromFilterSection, setSelectedItemsFromFilterSection] = useState<filterTypes>(initialFilters);
  const [threshold, setThreshold] = useState(700);

  const minThreshold = useNewWindowScroll(threshold);
  useEffect(() => {
    if (window.innerWidth < 643) {
      setThreshold(200);
    } else {
      setThreshold(700);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setThreshold(window.innerWidth < 643 ? 200 : 700);
    });
    return () => {
      window.removeEventListener('resize', () => {
        setThreshold(window.innerWidth < 643 ? 200 : 700);
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

          if (!filterValue._id || filterValue._id == 'undefined' || !filterValue.title) {
            
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

  const removeFilter = (key: string) => {
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
  
  const sortOptions = filterParameters?.data?.filters
    ?.find((filter: any) => filter.typeCode === 5)
    ?.data?.map((item: any) => ({ value: item?.value, label: item?.name }));

  const getSortLabel = (value:string)=>{
    const sortOption = sortOptions?.find((option)=>option.value == value)
    return sortOption?.label || '';
  }

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
                typeof value === 'string' ? (key == 'sort' ? getSortLabel(value) : value) : 'title' in value ? value.title : `$${value.min} - $${value.max}`
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
      sort: getQueryParam(router.query.sort),
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
    country: selectedItemsFromFilterSection.country,
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
    updateFilters(typesenseFilters);
  }, []);

  const customStyles: StylesConfig<SortOption, false> = {
    control: (provided) => ({
      ...provided,
      width: '100%',
      minWidth: '181px',
      outline: 'none',
      border: theme.theme ? '1px solid #433934' : `1px solid var(--border-tertiary-light)`,
      borderRadius: '0.775rem',
      backgroundColor: theme.theme ? 'var(--bg-primary-dark)' : 'var(--bg-primary-light)',
      fontSize: '14px',
      color: theme.theme ? '#fff' : 'var(--text-primary-light)',
      fontWeight: '400',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
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
      whiteSpace: 'nowrap',
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

   const getSortOptionTitle = (value: string) => {
     return sortOptions?.find((option: any) => option.value === value)?.label;
   };

  const handleFilterClick = (filterType: keyof filterTypes, value: string) => {
    const updatedFilters = { ...selectedItemsFromFilterSection };
    if (value && filterType !== 'address' && filterType !== 'category') {
      updatedFilters[filterType] = value;
    }
    addFiltersToQuery(updatedFilters);

    // updateFilters(typesenseFilters);
  };

  return (
    <>
      <CustomHeader
        title={` Explore the best products from ${categoriesBannerData?.parentCategoryName} category in kwibal`}
        description={`Explore the ${categoriesBannerData?.parentCategoryName} category on kwibal. Discover a wide range of products designed to meet your needs, from ${categoriesBannerData?.parentCategoryName} essentials to premium options.`}
        image={
          categoriesBannerData?.webBanner?.includes('http')
            ? categoriesBannerData?.webBanner
            : `${STATIC_IMAGE_URL}/${categoriesBannerData?.webBanner}`
        }
      />
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
        tokenFromServer={tokenFromServer}
        myLocationFromServer={myLocationFromServer}
        categories={categories}
        heroImageSrc={categoriesBannerData?.webBanner || IMAGES.PRIMARY_BANNER}
        description={categoriesBannerData?.description || ''}
        stickyHeader={threshold <= 540}
        stickyHeroSection={threshold <= 540}
      >
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
            <Slider className=" border-error pt-4 sm:py-8 lg:pt-12 lg:pb-8 ">
              <SectionTitle className="mb-4 sm:mb-3">Popular brands</SectionTitle>
              <BrandSlider data={categoriesLogos} />
            </Slider>
          )}

          {/* subcategories brand section end  */}
          <Breadcrumb
            isLinkDisable={true}
            className="!pl-0 md:!pl-0 my-5"
            steps={[{ name: 'Home', link: '/' }, { name: 'Categories' }, { name: categoryName || '' }]}
          ></Breadcrumb>
          {/* categories section starts */}
          <div className="mobile:pb-9">
            <div className=" ">
              {allHighlightedProducts.length > 0 && (
                <div className=" w-full pt-9 sm:py-8 lg:py-12 flex flex-col items-center justify-center">
                  <div className=" flex  w-full justify-between">
                    <SectionTitle>Featured Products</SectionTitle>
                  </div>
                  {hasActiveFilters() && (
                    <div className="border-2 boreder-error flex gap-10 items-center w-full flex-wrap mt-5 mobile:overflow-x-scroll h-8 md:h-4 border-none">
                      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                        {selectedItemsFromFiltersSectionList()}
                      </div>
                    </div>
                  )}{' '}
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
              <div className=" w-full pt-3 md:pt-6 lg:pt-6 sm:py-0 lg:py-0 flex flex-col items-center justify-center">
                <div
                  style={{ zIndex: 1 }}
                  className={`w-full ${
                    minThreshold
                      ? `fixed !z-1 ${
                          threshold < 300 ? 'top-[118px]' : 'top-[69px]'
                        } left-0 right-0 bg-bg-secondary-light dark:bg-bg-primary-dark px-[4%] sm:px-[64px] pt-2 pb-5 mx-auto max-w-[1440px]`
                      : ''
                  }`}
                >
                  <div className=" flex  w-full justify-between filterselectContainer">
                    <SectionTitle>All Products</SectionTitle>
                    <div className="ml-auto mr-[24px] relative  items-center gap-2 hidden sm:inline-flex">
                      {/* <Select
                        isSearchable={false}
                        className="w-fit min-w-[140px]  mobile:text-sm text-[14px] overflow-ellipsis"
                        onChange={(option) => {
                          updateFilters({ sort: option?.value });
                        }}
                        autoFocus={false}
                        // options={[
                        //   { value: 'newest', label: 'Newest First' },
                        //   { value: 'oldest', label: 'Oldest First' },
                        //   { value: 'price_asc', label: 'Low to High' },
                        //   { value: 'price_desc', label: 'High to Low' },
                        // ]}
                        options={sortOptions}
                        defaultValue={{ value: 'newest', label: 'Newest First' }}
                        // value={{ value: 'newest', label: 'Newest First' }}
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
                      /> */}
                      <FilterButtonDropdown
                        containerClassName="hidden lg:block"
                        title={`Sort by ${
                          selectedItemsFromFilterSection.sort
                            ? `: ${getSortOptionTitle(selectedItemsFromFilterSection.sort)}`
                            : ''
                        }`}
                        options={sortOptions || []}
                        allSelectedValues={selectedItemsFromFilterSection.sort || ''}
                        type="radio"
                        onChange={(selected) => {
                          handleFilterClick('sort', selected as string);
                        }}
                      />
                    </div>
                    <button className="flex cursor-pointer justify-between items-center" onClick={handleFilterDrawer}>
                      <div>
                        <img
                          className=" inline-block mobile:hidden"
                          width={28}
                          height={24}
                          src={'/images/filters_icon_white.svg'}
                          alt="dollar_coin_icon"
                        />
                        <img
                          className=" mobile:block hidden"
                          width={20}
                          height={18}
                          src={'/images/filters_icon_white.svg'}
                          alt="dollar_coin_icon"
                        />
                      </div>
                    </button>
                  </div>
                  {hasActiveFilters() && (
                    // <div className="border-2 boreder-error flex gap-10 items-center w-full flex-wrap mt-5 mobile:overflow-x-scroll h-8 md:h-4 border-none mb-2">
                      <div className="flex gap-x-3 mt-3 overflow-x-auto  scrollbar-hide">
                        {selectedItemsFromFiltersSectionList()}
                      </div>
                    // {/* </div> */}
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
                      <Placeholder
                        containerClassName="col-span-full mb-8"
                        title="No products found"
                        description="Please search for something else"
                      />
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
  const paramsArray = params['categoryName-id']?.split('-');
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
      fetch(`${BASE_API_URL}${AUTH_URL_V2}${GET_SUB_CATEGORIES_BY_ID_URL}/?parentId=${categoryId}&country=India`, {
        method: 'GET',
        headers: {
          Authorization: `${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }),
    ];
    const listingApiReponses = await Promise.allSettled(promises);


    
    const response1 = listingApiReponses[0].status === 'fulfilled' && listingApiReponses[0].value;
    const response2 = listingApiReponses[1].status === 'fulfilled' && listingApiReponses[1].value;
    const categories = listingApiReponses[2].status === 'fulfilled' && listingApiReponses[2].value ;
    const categoriesBannerResponse = listingApiReponses[3].status === 'fulfilled' && listingApiReponses[3].value ;

    const categoriesBanner = await categoriesBannerResponse.json();
    const data = await response1.json();
    return {
      props: {
        ...(await serverSideTranslations(locale, ['categories', 'common'])),
        categoriesLogos: data.data.attributes.brandLogos || [],
        subCategories: response2.data || [],
        tokenFromServer: tokenFromServer || null,
        categories,
        categoriesBanner: categoriesBanner || null
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
