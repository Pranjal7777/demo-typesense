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
// import { HydrationGuard } from '@/components/ui/hydration-guard';
import { GetAllSubCategoriesByCategoryId } from '@/helper/categories-data-from-server';
import { Category, Product } from '@/store/types';
import dynamic from 'next/dynamic';
import cookie from 'cookie';
import { API, STRAPI_BASE_API_URL } from '@/config';
import { STRAPI_CATEGORIES_PLP } from '@/api/endpoints';
import CategorySlider from '@/components/sections/category-slider';
import { RootState } from '@/store/store';
import { useAppSelector } from '@/store/utils/hooks';
import AboutUs from '@/components/about-us';
import Accordion from '@/components/sections/accordion-card';
import InfoSection from '@/components/sections/info-section';
import { convertRTKQueryErrorToString } from '@/helper/convert-rtk-query-error-to-string';

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

// eslint-disable-next-line react/prop-types
const Categories: NextPage<CategoriesPageProps> = function ({ categoriesLogos, subCategories }) {
  const { t } = useTranslation('categories');
  // const sectionTitle: sectionTitle = t('page.sectionTitle', { returnObjects: true });
  const aboutUs = t('page.aboutUs', { returnObjects: true }) as aboutUs;
  const accordion = t('page.accordion', { returnObjects: true }) as accordion;
  const { myLocation } = useAppSelector((state: RootState) => state.auth);

  const router = useRouter();

  const {id}=router.query;
  
  const initialFilters = {
    type: '',
    condition: '',
    postedWithin: '',
    zipcode: '',
    pendingOffer: '',
    price: '',
    distance: '',
    address: '',
  };

  const [filtersDrawer, setFilterDrawer] = useState(false);
  const [selectedItemsFromFilterSection, setSelectedItemsFromFilterSection] = useState<filterTypes>(initialFilters);
  // const [isEnabled, setIsEnabled] = useState(false);

  // const { data: bannersAndProducts } = productsApi.useGetAllBannersAndProductsQuery({
  //   page: 1,
  //   latitude: '',
  //   longitude: '',
  //   country: '',
  // });
  // const {
  //   data: subCategories,
  //   // error: subCategoriesError,
  //   // isFetching: isFetchingSubCategories,
  // } = categoriesApi.useGetSubCategoriesByParentIdQuery({ parentId: '62690a902eb06c48582c5a7f' });

  const closeFilter = () => {
    setFilterDrawer(false);
  };
  const changeSelectedItem = (obj: {}) => {
    setSelectedItemsFromFilterSection({ ...selectedItemsFromFilterSection, ...obj });
  };
  const addFiltersToQuery = (selectedFilters: filterTypes) => {
    const { pathname, query } = router;

    // Create a copy of the existing query parameters
    const updatedQuery = { ...query };

    // Update query parameters based on selected filters
    (Object.keys(selectedFilters) as (keyof filterTypes)[]).forEach((filterName) => {
      const filterValue = selectedFilters[filterName];

      if (filterValue) {
        // Add filter to query if value is present
        updatedQuery[filterName] = String(filterValue);
      } else {
        // Remove filter from query if value is empty or null
        delete updatedQuery[filterName];
      }
    });

    // Replace the current URL with the updated query parameters
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
    const updatedFeaturedFilters = { ...selectedItemsFromFilterSection, [key]: '' };
    setSelectedItemsFromFilterSection(updatedFeaturedFilters);
    addFiltersToQuery(updatedFeaturedFilters);
  };

  // const clearFilter = () => {
  //   if (featuredFiltersDrawer) {
  //     setSelectedItemsFromFilterFeaturedSection(featureFilterObj);
  //   } else {
  //     setSelectedItemsFromFilterBestSection(bestFilterObj);
  //   }
  // };
  const selectedItemsFromFiltersSectionList = () => {
    return Object.entries(selectedItemsFromFilterSection).map(
      ([key, value]) =>
        value && (
          <div key={key} className="mb-2">
            <SelectedFilterCard label={value} onDelete={() => removeFilter(key)} />
          </div>
        )
    );
  };
  const handleFilterDrawer = () => {
    setFilterDrawer(true);
  };

  const [highlightedProductsPageCount, sethighlightedProductsPageCount] = useState(1);
  const handleHighlightedProductsPageCountPageCount = () => {
    sethighlightedProductsPageCount(highlightedProductsPageCount + 1);
  };
  const [allHighlightedProducts, setAllHighlightedProducts] = useState<Product[]>([]);
  const [
    trigger,
    {
      data: highlightedProducts,
      isError,
      error,
      isFetching,
    }] = productsApi.useLazyGetAllHighlightedProductsForFilterQuery();
  
  
  useEffect(() => {
    if(highlightedProductsPageCount){
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
    if(id){
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
    if(highlightedProducts){
      setAllHighlightedProducts([...allHighlightedProducts,...highlightedProducts.result]);
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
    triggerBannersAndRecommendedProducts,{
      data: bannersAndRecommendedProducts,
      isError: isErrorBannersAndRecommendedProducts,
      error: errorBannersAndRecommendedProducts,
      isFetching: isFetchingBannersAndRecommendedProducts,
    // refetch,
    }] = productsApi.useLazyGetAllBannersAndProductsForFilterQuery();
  
  useEffect(() => {
    if(bannersAndRecommendedProductsPageCount){
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
    if(id){
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
    if(bannersAndRecommendedProducts){
      setRecommendedProducts([...recommendedProducts,...bannersAndRecommendedProducts.result]);
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
    };
    setSelectedItemsFromFilterSection(updatedFilters);
  }, [router.query]);

  return (
    <>
      <FilterDrawer
        filtersDrawer={filtersDrawer}
        selectedItemsFromFilterSection={selectedItemsFromFilterSection}
        setSelectedItemsFromFilterSection={setSelectedItemsFromFilterSection}
        closeFilter={closeFilter}
        changeItems={changeSelectedItem}
        addFiltersToQuery={addFiltersToQuery}
      />

      <Layout>
        {/* header with image and search box */}
        {/* Section:- What are you looking for? */}
        <div className=" relative custom-container mx-auto sm:px-16 mobile:px-4 ">
          {/* start */}
          {/* subcategories card section start */}
          {subCategories.length > 0 && (
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
          {/* categories section starts */}
          <div className=" ">
            {allHighlightedProducts.length > 0 && (
              <div className=' w-full pt-9 sm:py-8 lg:py-12 flex flex-col items-center justify-center'>
                <div className=" flex  w-full justify-between">
                  <SectionTitle>Featured Products</SectionTitle>

                  <button className="flex cursor-pointer justify-between " onClick={handleFilterDrawer}>
                    <div>
                      {' '}
                      <Image
                        className="dark:inline-block hidden"
                        width={32}
                        height={32}
                        src={IMAGES.FILTERS_ICON_WHITE}
                        alt="dollar_coin_icon"
                        loader={gumletLoader}
                      />
                      <Image
                        className="dark:hidden inline-block"
                        width={32}
                        height={32}
                        src={IMAGES.FILTERS_ICON_BLACK}
                        alt="dollar_coin_icon"
                        loader={gumletLoader}
                      />
                    </div>
                  </button>
                </div>
                
                {
                  !Object.keys(selectedItemsFromFilterSection).every(
                    key => (initialFilters as { [key: string]: string })[key] === ''
                  ) && (
                    <div className="border-2 boreder-error flex gap-10 items-center w-full flex-wrap mt-5 mobile:overflow-x-scroll h-8 md:h-4">
                      <div className="flex gap-3 overflow-x-auto scrollbar-hide">{selectedItemsFromFiltersSectionList()}</div>
                    </div>
                  )
                }
                {/* Selected Filters categories section - 01 end */}
                {/* Product card categories section - 01 start */}
                <div className="mt-10 w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-3 gap-y-4 md:gap-x-2 md:gap-y-7">
                    {
                      isError ? (
                        <h2>{convertRTKQueryErrorToString(error)}</h2>
                      ) : highlightedProducts?.result !== undefined ? (
                        allHighlightedProducts.map((product, index) => <ProductCard key={index} product={product} />)
                      ) : null
                    }
                    {isFetching && (
                      <>
                        {Array.from({ length: 10 }).map((_, index) => (
                          <Skeleton key={index} />
                        ))}
                      </>
                    )}
                  </div>

                  <div className=" mt-7 w-full flex items-center justify-center">
                    {/* @todo this button should be one component */}
                    {highlightedProducts ? (
                      <button
                        className={`border-2 text-sm font-medium px-4 py-2 rounded dark:text-text-primary-dark
                    ${
                      (allHighlightedProducts.length >= highlightedProducts?.Totalcount ? 'hidden' : '')
                      }
                    
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
          
            {
              recommendedProducts.length > 0 && (
                <div className=' w-full pt-9 sm:py-8 lg:py-12 flex flex-col items-center justify-center'>
                  <div className=" flex  w-full justify-between">
                    <SectionTitle>All Products</SectionTitle>
                  </div>
                
                  <div className="mt-10 w-full">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-3 gap-y-4 md:gap-x-2 md:gap-y-7">
                      {
          
                        isErrorBannersAndRecommendedProducts ? <h2>{convertRTKQueryErrorToString(errorBannersAndRecommendedProducts)}</h2> : (bannersAndRecommendedProducts?.result !== undefined && bannersAndRecommendedProducts?.Totalcount !== 0 ) ? ( // <h2>{convertRTKQueryErrorToString(errorBannersAndRecommendedProducts)}</h2>
                          recommendedProducts.map((product, index) => (
                            <ProductCard key={index} product={product} />
                          ))
                        ) : null
                      }
                      {isFetchingBannersAndRecommendedProducts && (
                        <>
                          {Array.from({ length: 10 }).map((_, index) => (
                            <Skeleton key={index} />
                          ))}
                        </>
                      )}
                    </div>

                    <div className=" mt-7 w-full flex items-center justify-center">
                      {/* @todo this button should be one component */}
                      <button
                        className={`border-2 text-sm font-medium px-4 py-2 rounded dark:text-text-primary-dark
                  ${
                bannersAndRecommendedProducts &&
                        (recommendedProducts.length >= bannersAndRecommendedProducts?.Totalcount ? 'hidden' : '')
                }
                  ${!bannersAndRecommendedProducts ? 'hidden' : ''}
                  `}
                        onClick={() => handleBannersAndRecommendedProductsPageCount()}
                      >
                        View more
                      </button>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </div>
        <div className="border-b border-border-tertiary-light dark:border-border-tertiary-dark mt-12"></div>
        <div className=" relative custom-container mx-auto sm:px-16 mobile:px-4 ">
          <div className=" flex flex-col items-center justify-center ">
            <div className=" mobile:mb-[42px] flex flex-col w-full border-error">
              <AboutUs data={aboutUs} />
              <Accordion data={accordion} />
            </div>
          </div>
          <InfoSection />
        </div>
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
