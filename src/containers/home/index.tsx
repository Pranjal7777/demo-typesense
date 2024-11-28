
import dynamic from 'next/dynamic';
import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { IMAGES } from '@/lib/images';
import { convertRTKQueryErrorToString } from '@/helper/convert-rtk-query-error-to-string';
import Image from 'next/image';

import { RootState } from '@/store/store';
import { useAppSelector } from '@/store/utils/hooks';

import { productsApi } from '@/store/api-slices/products-api';
import { SIGN_IN_PAGE } from '@/routes';

const DownloadCard = dynamic(() => import('@/components/download-card'), { ssr: false });
// const Layout = dynamic(() => import('@/components/layout'), { ssr: true });
const Faq = dynamic(() => import('@/components/sections/faq'), { ssr: false });
const InfoSection = dynamic(() => import('@/components/sections/info-section'), { ssr: false });
const TestimonialSection = dynamic(() => import('@/components/sections/testimonial-section'), { ssr: false });
const WhatAreYouLookingFor = dynamic(() => import('@/components/sections/what-are-you-looking-for'));
const SectionDescription = dynamic(() => import('@/components/ui/section-description'), { ssr: true });
const SectionTitle = dynamic(() => import('@/components/ui/section-title'), { ssr: true });
const ImgSlider = dynamic(() => import('@/components/ui/img-slider'), { ssr: true });
// const CategoriesDrawer = dynamic(() => import('@/components/CategoriesDrawer'), { ssr: false });
import { Product, ResponseGetAllCategoriesPayload, ResponseGetAllGrandParentCategoriesPayload, Token } from '@/store/types';
import Skeleton from '@/components/ui/product-card-skeleton';
import ImageSliderSkeleton from '@/components/ui/image-slider-skeleton';
import UpArrowIconRight from '../../../public/assets/svg/up-arrow-right';
// import CategoriesDrawer from '@/components/CategoriesDrawer';
// import NewProductCard from '@/components/ui/new-product-card';
import HomeBlogCard from '@/components/ui/home-blog-card';
import { postsItemsProps } from '@/pages/blog';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import WhatAreYouLookingForSkeleton from '@/components/ui/what-you-looking-skeleton';
import ProductCard from '@/components/ui/product-card';
import { HIDE_SELLER_FLOW, PROJECT_NAME } from '@/config';

export type highlightSection = {
  title: string;
  productList: {
    userName: string;
    timeStamp: string;
    productName: string;
    productPrice: string;
    location: string;
  }[];
};

interface RecommendedSection {
  title: string;
}

interface SellAndBuySection {
  title: string;
  items: {
    image: string;
    title: string;
    description: string;
  }[];
}

interface DealersSection {
  title: string;
  description: string;
  items: {
    image: string;
    question: string;
    description: string;
    btnText: string;
  }[];
}

interface NewAndUsedBannerSection {
  title: string;
  description: string;
  items: {
    image: string;
    mobileImage: string;
    title: string;
    description: string;
    btnText: string;
  }[];
}

interface BrandLogoSection {
  title: string;
  description: string;
  items: {
    image: string;
  }[];
}

export interface MyLocationFromIp {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
  countryName: string;
  latitude: string;
  longitude: string;
}

interface HomeProps {
  tokenFromServer: Token;
  categories: ResponseGetAllGrandParentCategoriesPayload;
  categoriesWithChildCategories: ResponseGetAllCategoriesPayload;
  myLocationFromServer: MyLocationFromIp;
  posts: {
    data: postsItemsProps;
  };
}

type BlogDataType = {
  data:postsItemsProps
}

const HomePage: FC<HomeProps> = ({
  tokenFromServer,
  categories,
  categoriesWithChildCategories,
  myLocationFromServer,
  // posts,
}) => {
  const router = useRouter();

  const { t } = useTranslation('common');
  const { myLocation } = useAppSelector((state: RootState) => state.auth);
  const userInfo = useAppSelector((state: RootState) => state.auth.userInfo);

  const recommendedSection = t('page.recommendedSection', { returnObjects: true }) as RecommendedSection;
  const sellAndBuySection = t('page.sellAndBuySection', { returnObjects: true, projectName: PROJECT_NAME }) as SellAndBuySection;
  const dealersSection = t('page.dealersSection', { returnObjects: true }) as DealersSection;
  const newAndUsedBannerSection = t('page.newAndUsedBannerSection', { returnObjects: true }) as NewAndUsedBannerSection;
  
  const brandLogoSection = t('page.brandLogoSection', { returnObjects: true }) as BrandLogoSection;

  const [blogData, setBlogData] = useState<BlogDataType | null>(null);
  useEffect( ()=>{
    const getBlogData = async ()=>{

      const response = await fetch('https://strapi.le-offers.com/api/blog?populate=deep');
      const data = await response.json();
      setBlogData(data);  
    };
    getBlogData();
  },[]);
  
  const [highlightedProductsPageCount, sethighlightedProductsPageCount] = useState(1);
  const {
    data: highlightedProducts,
    isError,
    error,
    isFetching,
    // refetch: refetchHighlitedProduct,
  } = productsApi.useGetAllHighlightedProductsQuery({
    page: highlightedProductsPageCount,
    latitude: myLocation?.latitude,
    longitude: myLocation?.longitude,
    country: myLocation?.country,
  });

  const [allHighlightedProducts, setAllHighlightedProducts] = useState<Product[]>([]);
  useEffect(() => {
    if(highlightedProducts){
      if (highlightedProducts?.result) {
        const existingIds = new Set(allHighlightedProducts.map(item => item._id));

        const newUniqueItems = highlightedProducts.result.filter(item => !existingIds.has(item._id));
        setAllHighlightedProducts((prevProducts:Product[]) => [...prevProducts, ...newUniqueItems]);
      }
    }
  }, [highlightedProducts]);


  const handleHighlightedProductsPageCountPageCount = () => {
    sethighlightedProductsPageCount(highlightedProductsPageCount + 1);
  };

  const [bannersAndRecommendedProductsPageCount, setBannersAndRecommendedProductsPageCount] = useState(1);
  const {
    data: bannersAndRecommendedProducts,
    isError: isErrorBannersAndRecommendedProducts,
    error: errorBannersAndRecommendedProducts,
    isFetching: isFetchingBannersAndRecommendedProducts,
    // refetch,
  } = productsApi.useGetAllBannersAndProductsQuery({
    page: bannersAndRecommendedProductsPageCount,
    latitude: myLocation?.latitude,
    longitude: myLocation?.longitude,
    country: myLocation?.country,
  });
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  useEffect(() => {
    if (bannersAndRecommendedProducts?.result) {
      // Filter out duplicates before merging
      const existingIds = new Set(recommendedProducts.map(item => item._id));
      const newUniqueItems = bannersAndRecommendedProducts.result.filter(item => !existingIds.has(item._id));
      setRecommendedProducts((prevProducts:Product[]) => [...prevProducts, ...newUniqueItems]);
    }
  }, [bannersAndRecommendedProducts]);

  const handleBannersAndRecommendedProductsPageCount = () => {
    setBannersAndRecommendedProductsPageCount(bannersAndRecommendedProductsPageCount + 1);
  };

  const sellPage = () => {
    if (userInfo) {
      // write the code to route to sell pag
    } else {
      router.push(SIGN_IN_PAGE);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      router.push('/productList');
    }
  };  
  
  return (
    <>
      <Layout
        tokenFromServer={tokenFromServer}
        categories={categories}
        // stickyHeader={true}
        categoriesWithChildCategories={categoriesWithChildCategories}
        myLocationFromServer={myLocationFromServer}
      >
        {/* <main className="dark:bg-bg-primary-dark w-full h-full mx-auto overflow-hidden"> */}

        {/* @ todo  */}
        <div className="relative custom-container mx-auto sm:px-16 mobile:px-4 ">
          {HIDE_SELLER_FLOW && (categories ? (
            <WhatAreYouLookingFor allCategoriesIcon={IMAGES.CATEGORY_GRID_ICON} categories={categories} />
          ) : (
            <WhatAreYouLookingForSkeleton />
          ))}
          {/* <WhatAreYouLookingFor
            allCategoriesIcon={IMAGES.CATEGORY_GRID_ICON}
            categories={categories}
          /> */}
          {/* @todo sell button should be separate component */}

          
          {/* <span
            className="cursor-pointer hover:scale-102 shadow-sm bg-brand-color text-text-secondary-light dark:text-text-secondary-light hidden mobile:flex items-center justify-center fixed w-[89px] h-[44px] bottom-3 right-4 rounded-full z-[1]"
            onClick={sellPage}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                sellPage();
              }
            }}
            tabIndex={0}
            role="button"
          >
            <span className="text-3xl">+</span>
            <span className="ml-1 text-base font-semibold mr-1 tracking-wide">Sell</span>
          </span> */}


          {/*Highlight Product Sections*/}
          {!HIDE_SELLER_FLOW && <div className="mx-auto ">
            {(!isFetching && highlightedProducts?.result==null) ? null:  <SectionTitle className="sm:mt-12 sm:mb-8 mt-8 mb-4 ">Featured Products</SectionTitle> }

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-3 gap-y-4 md:gap-x-4 md:gap-y-7">
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
          </div>}
          {/*Highlight Product Sections Ends*/}
          {/** Banner Section Starts */}
          <>
          {isErrorBannersAndRecommendedProducts ? (
            <h2>{convertRTKQueryErrorToString(errorBannersAndRecommendedProducts)}</h2>
          ) : bannersAndRecommendedProducts?.result !== undefined ? (
            <ImgSlider banners={bannersAndRecommendedProducts?.banners} />
          ) : null}
          {
            isFetchingBannersAndRecommendedProducts && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-x-5 gap-y-7">
                {Array.from({ length: 2 }).map((_, index) => (
                  <ImageSliderSkeleton key={index} />
                ))}
              </div>
            )
          }
          </>
          {/** Banner Section Ends */}

          {/* Recommended Product Sections */}
          <div className="mx-auto ">
            {!(bannersAndRecommendedProducts?.result == undefined || isErrorBannersAndRecommendedProducts || bannersAndRecommendedProducts?.Totalcount == 0) ? (
              <div>
                <SectionTitle className="sm:mt-14 sm:mb-8 mt-16 mb-4">{recommendedSection.title}</SectionTitle>
              </div>
            ) : null}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-3 gap-y-4 md:gap-x-4 md:gap-y-7">
              {
  
                isErrorBannersAndRecommendedProducts ? null : (bannersAndRecommendedProducts?.result !== undefined && bannersAndRecommendedProducts?.Totalcount !== 0 ) ? ( // <h2>{convertRTKQueryErrorToString(errorBannersAndRecommendedProducts)}</h2>
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
          {/*Recommended Product Sections Ends*/}
          {/* brand logo section start */}
          <div className={`mobile:my-0 mobile:mt-9 ${recommendedProducts?.length > 0 ? 'my-12' :'mt-0 mb-12'} rounded-[20px] flex flex-col items-center justify-center`}>
            {' '}
            {/*px-16  mobile:px-2 bg-bg-tertiary-light dark:bg-bg-nonary-dark */}
            <SectionTitle className=" mb-3 mobile:mb-2 ">{brandLogoSection.title}</SectionTitle>
            <SectionDescription className="mb-8 mobile:mb-4 text-center !leading-[18px] mobile:px-5">
              {brandLogoSection.description}
            </SectionDescription>
            <div className="flex items-center justify-center w-full flex-wrap gap-4 mobile:gap-2">
              {brandLogoSection.items.map((data, index) => (
                <div
                  key={index}
                  className="hover:scale-102 hover:cursor-pointer flex justify-center items-center shadow rounded-xl h-[80px] w-[80px] sm:min-h-[184px] sm:min-w-[184px] p-12 mobile:p-4 bg-bg-terdenary-light transition-all duration-100 ease-in"
                >
                  <Image
                    width={100}
                    height={100}
                    className="w-full h-full object-contain"
                    src={data.image}
                    alt="eq.svg"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* brand logo section end */}

          {/* Explore New & Used Trucks for Sale section starts */}
          <div className="sm:py-12 mobile:py-0 mobile:mt-9 flex flex-col items-center justify-center">
            <SectionTitle className=" mb-3 mobile:mb-2">{newAndUsedBannerSection.title}</SectionTitle>
            <SectionDescription className=" mb-8 mobile:mb-4 text-center !leading-[18px] mobile:px-5">
              {newAndUsedBannerSection.description}
            </SectionDescription>

            <div className=" w-full h-full flex flex-col lg:flex-row gap-x-2 gap-3 items-center justify-between  rounded-xl">
              {newAndUsedBannerSection.items.map((_item, _id) => {
                return (
                  <div
                    key={_id}
                    className="mobile:w-full h-full w-1/2 py-6 px-5 rounded-xl !bg-[var(--brand-color)]  lg:max-w-[648px] mobile:h-[426px]  sm:w-full relative flex  flex-col-reverse md:flex-row items-center justify-center md:justify-between lg:items-center "
                  >
                    <div className=" self-baseline md:self-center">
                      <div className="text-2xl font-semibold leading-9 text-text-secondary-light dark:text-text-primary-dark">
                        {_item.title}
                      </div>
                      <div className="text-sm font-normal leading-5 text-text-secondary-light dark:text-text-primary-dark mt-2 mb-4">
                        {_item.description}
                      </div>

                      <span
                        // onClick={() => router.push('/categories')}
                        // onKeyDown={handleKeyDown}
                        // tabIndex={0}
                        // role="button"
                        className="bg-bg-secondary-light rounded px-3 py-2 flex items-center gap-3 justify-between mobile:justify-around w-fit mobile:h-[44px]"
                      >
                        <span className="text-sm font-bold leading-5 text-brand-color">{_item.btnText}</span>
                        <UpArrowIconRight primaryColor={'var(--brand-color)'} />
                      </span>
                    </div>
                    {/* <Image
                      width={750}
                      height={750}
                      className=" object-cover w-full h-full rounded-xl hidden sm:inline-block"
                      src={_item.mobileImage}
                      alt="truck_image"
                    /> */}
                    <Image
                      width={200}
                      height={200}
                      className=" w-[200px] top-10 left-24 h-[200px] inline-block"
                      src={_item.mobileImage}
                      alt="truck_image"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {/* Explore New & Used Trucks for Sale section ends */}

          {/* Sell and buy every kinda thing on Equipnow start */}
          <div className=" flex flex-col items-center justify-center sm:py-12 mobile:py-0 mobile:mt-9 mobile:mb-9">
            <SectionTitle className=" mb-8 mobile:mb-4 !leading-[18px] mobile:px-20 mobile:!leading-7 text-center">
              {sellAndBuySection.title}
            </SectionTitle>

            <div className=" w-full h-full flex mobile:flex-col gap-x-4 mobile:gap-y-5">
              {/* max-w-[50%] mobile:max-h-[343px] mobile:h-[343px]  this three classes are diffrent in first one and  max-w-[50%] second two are [25%] [25%]*/}

              {sellAndBuySection.items.map((item, key) => (
                <div
                  key={key}
                  className="relative rounded-xl max-w-[427px] mobile:max-w-full w-full max-h-[379px] flex flex-col  items-start mobile:items-center"
                >
                  <div className=" relative rounded-xl max-w-[427px] mobile:max-w-full w-full max-h-[379px] flex flex-col  items-center ">
                    <div className=" max-h-[224px] h-full mobile:h-[180px] w-full">
                      <Image
                        width={750}
                        height={750}
                        className="rounded-xl object-cover w-full h-full"
                        src={item.image}
                        alt="user_image"
                      />
                    </div>

                    <div className=" lg:mt-5 sm:mt-2 mobile:mt-4 text-sm md:text-xl font-semibold text-center dark:text-text-primary-dark">
                      {item.title}
                    </div>

                    <div className="lg:mt-5 sm:mt-1 mobile:mt-1 mobile:text-xs sm:text-[10px] md:text-base font-bold text-center text-text-tertiary-light dark:text-text-tertiary-dark">
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Sell and buy every kinda thing on Equipnow end */}

          {/* Comments Sections Starts Here*/}
          <TestimonialSection />
          {/* Comments Sections Ends Here*/}

            
          {/* For Dealers & Virtual Retailing */}
          {
            blogData ? blogData?.data?.attributes?.blog_data?.length > 1 && (
              <div className=" flex flex-col items-center justify-center sm:py-12 mobile:py-0 mobile:mt-9 mobile:mb-9">
                <SectionTitle className=" mb-3 mobile:mb-2">{dealersSection.title}</SectionTitle>
  
                <SectionDescription className="max-w-[877px] text-center mb-8 mobile:mb-4">
                  {dealersSection.description}
                </SectionDescription>
  
                <div className="w-full h-full flex mobile:flex-col gap-x-4 mobile:gap-y-5">
                  {/* max-w-[50%] mobile:max-h-[343px] mobile:h-[343px]  this three classes are diffrent in first one and  max-w-[50%] second two are [25%] [25%]*/}
                  {blogData?.data?.attributes?.blog_data?.length > 0
                    ? blogData?.data?.attributes?.blog_data
                      ?.slice(0, 3)
                      ?.map((blog, key) => (
                        <HomeBlogCard
                          id = {blog.id}
                          key={key}
                          description={blog?.blog_section[0]?.slug_paragraphs[0]?.paragraph?.slice(0, 120)}
                          question={blog?.title}
                          image={blog?.cover_image?.data?.attributes?.url}
                        />
                      ))
                    : null}
                </div>
              </div>
            ) : null
          }
          {/* //// {blogData?.data?.attributes?.blog_data?.length > 1 && (
            <div className=" flex flex-col items-center justify-center sm:py-12 mobile:py-0 mobile:mt-9 mobile:mb-9">
              <SectionTitle className=" mb-3 mobile:mb-2">{dealersSection.title}</SectionTitle>

              <SectionDescription className="max-w-[877px] text-center mb-8 mobile:mb-4">
                {dealersSection.description}
              </SectionDescription>

              <div className="w-full h-full flex mobile:flex-col gap-x-4 mobile:gap-y-5">
                {/* max-w-[50%] mobile:max-h-[343px] mobile:h-[343px]  this three classes are diffrent in first one and  max-w-[50%] second two are [25%] [25%]*/}
          {/* {blogData?.data?.attributes?.blog_data?.length > 0
                  ? blogData?.data?.attributes?.blog_data
                    ?.slice(0, 3)
                    ?.map((blog, key) => (
                      <HomeBlogCard
                        key={key}
                        description={blog?.blog_section[0]?.slug_paragraphs[0]?.paragraph?.slice(0, 120)}
                        question={blog?.title}
                        image={blog?.cover_image?.data?.attributes?.url}
                      />
                    ))
                  : null}
              </div>
            </div>
          )} */} 
          {/* For Dealers & Virtual Retailing */}

          {/* FAQ’s section starts */}
          <Faq />
          {/* FAQ’s section ends */}
        </div>

        {/* App Download Starts Here*/}
        <>
          <DownloadCard />
        </>
        {/* App Download Starts Here*/}

        {/* start */}
        {
          !HIDE_SELLER_FLOW &&  <div className=" relative custom-container mx-auto sm:px-16 mobile:px-4 ">
          <InfoSection />
        </div>
        }
       
      </Layout>

      {/* <CategoriesDrawer
        isSearchCategoriesDrower={isSearchCategoriesDrower}
        changMenu={changMenu}
        // data={categoriesWithChildren}
      /> */}
    </>
  );
};

export default HomePage;

// Comment -- 1 do not remove this code (Bh.. old code)
// const callingHighlightandBanneprodudtApi = async (tokens: Token, location: myLocationFieldWithIp) => {
//   const highlightedProductsResponse = await ProductsApiForHighlightFromServer(tokens?.accessToken, location);
//   const bannerProductsResponse = (await ProductsApiForBannerFromServer(tokens?.accessToken, location)) || [];

//   setBannerProducts(bannerProductsResponse);
//   setHighlightedProducts(highlightedProductsResponse);
// };

// useEffect(() => {
//   if (token) {
//     const locationForProductAndHighlightApi = myLocation
//       ? { ip: ipAddress, ...myLocation }
//       : {
//           ip: myLocationFromServer.ip,
//           address:
//             myLocationFromServer.city + ' ' + myLocationFromServer.region + ' ' + myLocationFromServer.country_name,
//           country: myLocationFromServer.country_name,
//           latitude: myLocationFromServer.latitude,
//           longitude: myLocationFromServer.longitude,
//           city: myLocationFromServer.city,
//         };

//     const locationAndIpAddress = locationForProductAndHighlightApi;
//     callingHighlightandBanneprodudtApi(token, locationAndIpAddress);
//   } else {
//     const locationAndIpAddress = {
//       ip: myLocationFromServer.ip,
//       address:
//         myLocationFromServer.city + ' ' + myLocationFromServer.region + ' ' + myLocationFromServer.country_name,
//       country: myLocationFromServer.country_name,
//       latitude: myLocationFromServer.latitude,
//       longitude: myLocationFromServer.longitude,
//       city: myLocationFromServer.city,
//     };
//     callingHighlightandBanneprodudtApi(tokenFromServer, locationAndIpAddress);
//   }
// }, []);

// Comment -- 2 @todo all the model that is need popups
{
  /* <Model/> */
}
{
  /* <Location/> */
}
{
  /* <LoginWithPhoneModel/> */
}
{
  /* <LoginWithEmailAndPasswordModel/> */
}
{
  /* <RegistrationModel/> */
}
{
  /* <RegistrationDetailsModel/> */
}
{
  /* <RegisterWithEmailAndPasswordModel/> */
}

{
  /* <OTPFormModel/> */
}
{
  /* <ChangePasswordFormModel/> */
}
{
  /* <EnterMobileNumberModel /> */
}
{
  /* <ForgotPasswordEnterEmailModel/> */
}
{
  /* <ForgotPasswordMainModel/> */
}
{
  /* <ForgotPasswordOtpFormModel/> */
}
{
  /* <ResetPasswordLinkSentModel/> */
}

// Comment 3
{
  /* Equipnow Guides & Tips section starts */
}

// interface GuidesAndTipsSection {
//   title: string;
//   description: string;
//   items: {
//     image: string;
//     title: string;
//     description: string;
//   }[];
// }

{
  /* <div className=" flex flex-col items-center justify-center sm:py-12 mobile:py-0 mobile:mt-9">
        <span className="font-semibold text-2xl leading-9 text-text-primary-light text-center mobile:text-base dark:text-text-primary-dark">
          {guidesAndTipsSection.title}
        </span>
        <p className="max-w-[877px] font-normal text-base leading-6 mt-3 mb-8 mobile:mt-2 mobile:mb-4 text-center mobile:text-xs text-text-tertiary-light dark:text-text-tertiary-dark">
          {guidesAndTipsSection.description}
        </p>
        <div className=" w-full flex mobile:flex-col gap-x-4 mobile:gap-y-3">
          {guidesAndTipsSection.items.map((item, key) => (
            <div
              key={key}
              className={`relative rounded-xl ${
                key === 0
                  ? 'max-w-[50%] mobile:max-h-[343px] mobile:h-[343px] max-h-[224px]'
                  : 'max-w-[25%] max-h-[224px] mobile:max-h-[228px] mobile:h-[228px]'
              } w-full mobile:max-w-full flex items-end cursor-pointer`}
              onClick={() => router.push('blogs')}
            >
              <div className=" absolute z-[1] lg:mb-4 sm:mb-2 ml-4 rtl:mr-4 w-[67%]">
                <div className="max-w-[306px] lg:font-semibold lg:text-xl lg:leading-7 sm:text-xs mobile:text-2xl  text-text-secondary-light">
                  {item.title}
                </div>
                <div className="hover:cursor-pointer mt-1 xl:font-normal xl:text-xs lg:leading-4 sm:text-[6px] mobile:text-sm text-text-secondary-light">
                  {item.description}
                </div>
              </div>
              <div
                className="rounded-xl "
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))',
                }}
              ></div>
              <Image
                width={750}
                height={750}
                className="rounded-xl object-cover w-full h-full"
                src={item.image}
                alt="user_image"
              />
            </div>
          ))}
        </div>
      </div> */
}
{
  /* Equipnow Guides & Tips section ends */
}

// comment 4 old imports
{
  /* Equipnow Guides & Tips section starts */
}
{
  /* const guidesAndTipsSection: GuidesAndTipsSection = t('page.guidesAndTipsSection', { returnObjects: true });
          import SellAndBuy from '@/components/Sections/SellAndBuy';
          interface GuidesAndTipsSection {
            title: string,
            description: string,
            items: {
              image: string,
              title: string
              description: string,
            }[]
          }
          <div className=" flex flex-col items-center justify-center sm:py-12 mobile:py-0 mobile:mt-9">
  
            <SectionTitle className=" mb-3 mobile:mb-2">
              {guidesAndTipsSection.title}
            </SectionTitle>
  
            <SectionDescription className="max-w-[877px] text-center mb-8 mobile:mb-4">
              {guidesAndTipsSection.description}
            </SectionDescription>
  
            <div className=" w-full flex mobile:flex-col gap-x-4 mobile:gap-y-3">
              {
                guidesAndTipsSection.items.map((item, key) => (
                  <div key={key} className={`relative rounded-xl ${key === 0 ? "max-w-[50%] mobile:max-h-[343px] mobile:h-[343px] max-h-[224px]" : "max-w-[25%] max-h-[224px] mobile:max-h-[228px] mobile:h-[228px]"} w-full mobile:max-w-full flex items-end cursor-pointer`} onClick={() => router.push('blogs')}>
                    <div className=" absolute z-[1] lg:mb-4 sm:mb-2 ml-4 rtl:mr-4 w-[67%]">
                      <div className="max-w-[306px] lg:font-semibold lg:text-xl lg:leading-7 sm:text-xs mobile:text-2xl  text-text-secondary-light">
                        {item.title}
                      </div>
                      <div className="hover:cursor-pointer mt-1 xl:font-normal xl:text-xs lg:leading-4 sm:text-[6px] mobile:text-sm text-text-secondary-light">
                        {item.description}
                      </div>
                    </div>
                    <div
                      className="rounded-xl "
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))',
                      }}
                    ></div>
                    <Image
                      width={750}
                      height={750}
                      className="rounded-xl object-cover w-full h-full"
                      src={item.image}
                      alt="user_image"
                    />
                  </div>
                ))
              }
            </div>
          </div> */
}
{
  /* Equipnow Guides & Tips section ends */
}

// comment 5 old imports

// import { getLocationData } from '@/helper/GetLocationFromServer';
// import useTheme from '@/hooks/theme';
// import DownloadCard from '@/components/Sections/DownloadCard';
// import Layout from '@/components/Layout';
// import TestimonialSection from '@/components/Sections/TestimonialSection';
// import { categoriesApi } from '@/store/apiSlices/categoriesApi';
// import { categoriesApi } from '@/store/apiSlices/categoriesApi';
// import { productsApi } from '@/store/apiSlices/productsApi';
// import { useTranslation } from 'next-i18next';
// import { useEffect } from 'react';
// import { useTranslation } from 'next-i18next';
// import debounce from 'lodash.debounce';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useEffect, useState,  } from 'react';
// import { RootState } from '@/store/store';
// import RecommendedProduct from '@/components/Sections/RecommendedProduct';
// import WhatAreYouLookingFor from '@/components/Sections/WhatAreYouLookingFor';
// import { IMAGES } from '@/lib/images';
// import { useTranslation } from 'next-i18next';
// import FAQ from '@/components/Sections/FAQ';
// import { useRouter } from 'next/router';
// import { useAppSelector } from '@/store/utils/hooks';
// import InfoSection from '@/components/Sections/InfoSection';
// import SectionDescription from '@/components/Ui/SectionDescription';
// import SectionTitle from '@/components/Ui/SectionTitle';
// import { productsApi } from '@/store/apiSlices/productsApi';
// import { convertRTKQueryErrorToString } from '@/helper/convertRTKQueryErrorToString';
// import HighlightedProducts from '@/components/Sections/HighlightedProducts';
// import ImgSlider from '@/components/Ui/ImgSlider';