import { useTranslation } from 'next-i18next';
import React, { Suspense, useCallback, useState } from 'react';
import ProductSlider from '@/components/ui/product-slider';
import Layout from '@/components/layout';
import ProductAttribute from '@/components/product-attribute';
import Breadcrumb from '@/components/ui/breadcrumb';
import { useTheme } from '@/hooks/theme';
import EngagementStats from '@/components/ui/engagement-stats';
import HartSvg from '../../../public/assets/svg/heart';
import InfoBox from '@/components/ui/info-box';
import InfoSection from '@/components/sections/info-section';
import TogglePanel from '@/components/toggle-panel';
import ViewsIcon from '../../../public/assets/svg/views-icon';
import OffersIconSVG from '../../../public/assets/svg/offers-icon';
import { useRouter } from 'next/router';
const SimilarProductsList = React.lazy(() => import('@/components/similar-products'));
import { RootState } from '@/store/store';
import { useAppSelector } from '@/store/utils/hooks';
import { setCheckoutProduct } from '@/store/slices/checkout-slice';
import { useDispatch } from 'react-redux';
import { formatPriceWithoutCents } from '@/utils/price-formatter';
import ImageContainer from '@/components/ui/image-container';
import { STATIC_IMAGE_URL } from '@/config';
import ShareIcon from '../../../public/assets/svg/share-icon-flat';
import ChatIcon from '../../../public/assets/svg/chat-icon';
import Button from '@/components/ui/button';
import { productsApi } from '@/store/api-slices/products-api';
import showToast from '@/helper/show-toaster';
import FullScreenSpinner from '@/components/ui/full-screen-spinner';
const ProductDetailsCard = React.lazy(() => import('@/components/ui/product-details-card'));
const PdpCta = React.lazy(() => import('@/components/ui/pdp-cta'));

export type filteredProducts = {
  userName: string;
  timeStamp: string;
  productName: string;
  productPrice: string;
  location: string;
};

type hamburger = {
  home: string;
  pagename: string;
}[];

type engagementStats = {
  likes: string;
  views: string;
  offers: string;
}[];

type ctas = {
  firstBtn: string;
  secondBtn: string;
  nostock: string;
  makeOfferBtn: string;
}[];

type profileCard = {
  label: string;
  buttonLabel: string;
}[];

type togglePanelText = {
  toggleOne: string;
  toggleTwo: string;
}[];

type ProductProps = {
  data: any;
};

export type StickyHeaderDetails = {
  showProductImage: boolean;
  showShareIcon: boolean;
  showProductName: boolean;
  showPrice: boolean;
  showButtons: boolean;
};

const ProductDisplay: React.FC<ProductProps> = ({ data }) => {
  console.log(data, 'pdp data');
  
  const sellerAccountId = data?.result?.users?.accountId;
  const router = useRouter();
  const apidata = data.result;

  const assetId = apidata?._id;
  const categoryId = apidata?.categoryPath[0].id;
  const { t: productDetails } = useTranslation('productDetails');
  const { theme } = useTheme();
  const prodTitle = apidata?.title;
  const prodCategory = apidata?.mainCategory;
  const prodPrice = apidata?.price;
  const images = apidata?.images;
  const currencyCode = apidata?.units.currency_code;
  const prodDesc = apidata?.description;
  const viewCount = apidata?.viewCount;
  const offerTradeCount = apidata?.numberOfOfferCount;
  const sellerUserName = apidata?.users.username;
  const sellerProfilePic = apidata?.users.profilePic;
  const sellerRating = apidata?.users.totalRatingCount;
  const prodTimeStamp = apidata?.creationTs;
  const isSold = apidata?.sold;
  const shareLink = apidata?.shareLink;
  const desc: string = productDetails('page.desc');
  const postingLabel: string = productDetails('page.postedLabel');
  const hamburger = productDetails('page.hamburger', { returnObjects: true }) as hamburger;
  const engagementStats = productDetails('page.engagementStats', { returnObjects: true }) as engagementStats;
  const ctaText = productDetails('page.prodCTA', { returnObjects: true }) as ctas;
  const togglePanelText = productDetails('page.toggleInfo', { returnObjects: true }) as togglePanelText;
  const prodDetails = apidata?.details;
  const [totalLikedCount, setTotalLikeCount] = useState<number>(apidata?.likeCount || 0);
  const { userInfo, myLocation } = useAppSelector((state: RootState) => state.auth);
  const [isFirstButtonLoading, setIsFirstButtonLoading] = useState(false);
  const dispatch = useDispatch();  

    const [likeAndDislikeProduct, { isLoading: isLikeAndDislikeLoading }] =
      productsApi.useLikeAndDislikeProductMutation();
      const [isLiked, setIsLiked] = useState(apidata?.isLiked);

      const [isLikeChange, setIsLikeChange] = useState(false);

       const handleLike = useCallback(async () => {
         if (userInfo) {
           try {
             const newLikeState = !isLiked;
             if (typeof userInfo.accountId === 'string' && typeof assetId === 'string') {
               const userId: string = userInfo._id;
               const result = await likeAndDislikeProduct({ assetid: assetId, like: newLikeState, userId }).unwrap();
               setIsLiked(newLikeState);
               setTotalLikeCount((prev) => (newLikeState ? prev + 1 : prev - 1));
               showToast({ message: result.message });
               setIsLikeChange((prev) => !prev);
             }
           } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
             showToast({ message: errorMessage });
           }
         } else {
           router.push('/login');
         }
       }, [ isLiked, likeAndDislikeProduct]);

  const [stickyHeaderDetails, setStickyHeaderDetails] = useState<StickyHeaderDetails>({
    showShareIcon: false,
    showProductImage: false,
    showProductName: false,
    showPrice: false,
    showButtons: false,
  });
  
  const breadcrumbSteps = [
    {
      name: hamburger[0].home,
      link: '/',
    },
    {
      name: hamburger[0].pagename,
      link: router.asPath,
    },
  ];

  const EngagementStatsData = [
    {
      logo: (
        <HartSvg
          className="w-[12px] h-[12px] md:w-[16px] md:h-[16px]"
          borderColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
        />
      ),
      label: engagementStats[0].likes,
      value: totalLikedCount,
    },
    {
      logo: <ViewsIcon color={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'} />,
      label: engagementStats[0].views,
      value: viewCount,
    },
    {
      logo: <OffersIconSVG color={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'} />,
      label: engagementStats[0].offers,
      value: offerTradeCount,
    },
  ];
  const ToggleInfo = [
    // {
    //   label: togglePanelText[0].toggleOne,
    //   content: <UserProductList isLikeChange={isLikeChange} accoundId={sellerAccountId} page="1" />,
    // },
    {
      label: togglePanelText[0].toggleTwo,
      content: <SimilarProductsList isLikeChange={isLikeChange} assetName={prodTitle.replace(/ /g, '-') || ''} categoryId={categoryId} />,
    },
  ];

  const handleFirstButtonClick = useCallback(async () => {
    console.log(data.result, 'data.result');
    if (!userInfo) return router.push('/login');
    if (data.result.isNegotiable) return;
    try {
      setIsFirstButtonLoading(true);
      let payload = {
        sellerId: sellerAccountId!,
        assetId: assetId!,
        buyerId: userInfo?.accountId!,
        isExchange: false,
        userLocation: myLocation,
      };
      // const chatIdentifier = await getChatIdentifier(payload);
      if (data) {
        dispatch(setCheckoutProduct(data.result));
      }
      // await router.push(
      //   `/checkout/select-address?assetId=${assetId}&sellerId=${sellerAccountId}&chatId=${chatIdentifier.data.chatId}`
      // );
      await router.push(
        `/checkout/select-address?assetId=${assetId}&sellerId=${sellerAccountId}`
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsFirstButtonLoading(false);
    }
  }, [ myLocation]);

  const [activeProductImage, setActiveProductImage] = useState<string>('');

  const getImageSrc = (url: string) => {
    const src = url?.includes('http') ? url : `${STATIC_IMAGE_URL}/${url}`;
    return src;
  };

  const handleShareClick = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: prodTitle,
          text: 'Product from Kwibal',
          url: shareLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Sharing not supported.');
    }
  }, [prodTitle, shareLink]);

  return (
    <Layout
      containerClass="mobile:mt-[80px]"
      mobileHeaderContainerClassName="mobile:!hidden "
      mobileSearchBoxContainerClassName="mobile:top-0 !pl-[42px] !pr-[136px] pt-3"
      stickyHeader={true}
      stickyHeroSection={true}
      showBackArrowInSearchBox={true}
    >
      {(stickyHeaderDetails?.showProductImage || stickyHeaderDetails?.showShareIcon) && (
        <div
          // style={{ zIndex: 1 }}
          className=" z-[1] fixed flex justify-between items-center h-[61px] md:h-[80px] top-[66px]  md:top-[69px] left-0 right-0 bg-bg-secondary-light dark:bg-bg-primary-dark px-[4%] sm:px-[64px] py-2 mx-auto max-w-[1440px]"
        >
          <div className="flex gap-4">
            {stickyHeaderDetails.showProductImage && (
              <ImageContainer
                src={getImageSrc(activeProductImage)}
                alt={`Thumbnail`}
                width={110}
                height={110}
                className={` border !aspect-square h-9 w-9 md:h-[70px] md:w-[70px] object-cover rounded-lg`}
                layout="fixed"
              />
            )}

            <div className="flex items-center gap-x-3 text-text-primary-light dark:text-text-primary-dark">
              <div className="flex flex-col  gap-y-[5px] md:gap-y-2">
                {stickyHeaderDetails.showProductName && (
                  <span className="text-xs md:text-sm font-semibold">{prodTitle}</span>
                )}
                {stickyHeaderDetails.showPrice && (
                  <span className="font-semibold text-xs md:text-sm">{formatPriceWithoutCents(prodPrice)}</span>
                )}
              </div>
              {stickyHeaderDetails.showShareIcon && (
                <ShareIcon
                  aria-label="Share"
                  onClick={handleShareClick}
                  height={28}
                  width={28}
                  primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
                  className="cursor-pointer hidden md:block"
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-2 ">
            {stickyHeaderDetails.showShareIcon && (
              <>
              <HartSvg
                aria-label="Like"
                onClick={handleLike}
                height="24"
                width="24"
                className="hover:scale-105 cursor-pointer hidden md:block"
                borderColor={`${theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}`}
                color="var(--heart-fill-color)"
                isFilled={isLiked}
              />
              <HartSvg
                aria-label="Like"
                onClick={handleLike}
                height="20"
                width="20"
                className="hover:scale-105 cursor-pointer md:hidden"
                borderColor={`${theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}`}
                color="var(--heart-fill-color)"
                isFilled={isLiked}
              />
            </>
            )}
            {stickyHeaderDetails.showShareIcon && (
              <ShareIcon
                aria-label="Share"
                onClick={handleShareClick}
                height={24}
                width={24}
                primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
                className="cursor-pointer md:hidden"
              />
            )}
            {stickyHeaderDetails.showButtons && (
              <div className=" gap-2 hidden md:flex">
                <Button
                  isLoading={isFirstButtonLoading}
                  onClick={handleFirstButtonClick}
                  className={`w-[174px]  text-sm mb-0`}
                >
                  {data.result?.isNegotiable ? ctaText[0].makeOfferBtn : ctaText[0].firstBtn}
                </Button>

                {/* <Button
                  className="w-[174px] text-sm mb-0 dark:bg-bg-tertiary-dark dark:text-text-primary-dark"
                  buttonType="secondary"
                >
                  {ctaText[0].secondBtn}
                </Button> */}

                <ChatIcon
                  // onClick={chatIconClickHandler}
                  bgFillcolor={theme ? '#363636' : '#F4F4F4'}
                  fillColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
                  // size={isMobile ? 'mobile' : 'pc'}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mt-0 md:mt-5">
        <Breadcrumb steps={breadcrumbSteps} />
      </div>

      <div className="relative custom-container mt-[20px] mx-auto mobile:px-4">
        {/* first section box start */}
        <div className="flex gap-8 mobile:gap-2 w-full xl:h-[576px] lg:h-[530px] md:h-full sm:h-[400px] flex-col lg:flex-row overflow-y-scroll">
          <div className=" h-full w-full lg:w-[60%]">
            <ProductSlider
              handleLike={handleLike}
              setActiveProductImage={setActiveProductImage}
              setStickyHeaderDetails={setStickyHeaderDetails}
              stickyHeaderDetails={stickyHeaderDetails}
              className=""
              assetId={assetId}
              setTotalLikeCount={setTotalLikeCount}
              imagesArray={images}
              shareURL={shareLink}
              shareTitle={prodTitle}
              isProductLiked={isLiked}
              setIsLiked={setIsLiked}
              productCondition={apidata.assetCondition}
            />
            <div className="lg:mt-5 md:mt-3 sm:mt-2 flex items-end justify-between mobile:hidden"></div>
          </div>

          <Suspense fallback={<div>Loading Product Details...</div>}>
            <div className="w-full flex-2 lg:w-[40%] h-full  rtl:ml-0 rtl:mr-12 overflow-y-scroll">
              <div>
                <div className="mobile:mt-5 w-full flex flex-col">
                  <ProductDetailsCard
                    setStickyHeaderDetails={setStickyHeaderDetails}
                    stickyHeaderDetails={stickyHeaderDetails}
                    assetId={assetId}
                    familyName={prodCategory}
                    categoryTitle={prodTitle}
                    postTimeStamp={prodTimeStamp}
                    price={formatPriceWithoutCents(prodPrice)}
                    timestampLabel={postingLabel}
                    isSeller={apidata?.users?.accountId === userInfo?.accountId}
                    // currency={currencyCode}
                    assetCondition={`${apidata.city}, ${apidata.state}, ${apidata.country}`}
                  />
                  {apidata?.users?.accountId !== userInfo?.accountId && (
                    <div className="mobile:hidden">
                      <PdpCta
                        setStickyHeaderDetails={setStickyHeaderDetails}
                        stickyHeaderDetails={stickyHeaderDetails}
                        apiData={apidata}
                        firstButtonText={data.result?.isNegotiable ? ctaText[0].makeOfferBtn : ctaText[0].firstBtn}
                        isSold={isSold}
                        secondButtonText={ctaText[0].secondBtn}
                        noStockButtonText={ctaText[0].nostock}
                        handleFirstButtonClick={handleFirstButtonClick}
                        isFirstButtonLoading={isFirstButtonLoading}
                      />
                    </div>
                  )}

                  <EngagementStats data={EngagementStatsData} />
                </div>

                {/* hide seller info */}
                {/* <div className="h-[30%]">
                <ProfileCard
                  sellerName={sellerUserName}
                  sellerRating={sellerRating}
                  buttonLabel={profileCard[0].buttonLabel}
                  width="100%"
                  profilePic={sellerProfilePic}
                  label={profileCard[0].label}
                  unfollowLabel={followingBtn}
                  accoundId={sellerAccountId}
                  isFollow={apidata?.isFollow}
                />
              </div> */}
                {prodDesc && (
                  <div className="mt-5">
                    <InfoBox question={desc} answer={prodDesc} width={'100%'} />
                  </div>
                )}
                {prodDetails?.length > 0 ? (
                  <div className="mt-5 mobile:w-full mobile:p-4 h-auto">
                    <span className="text-lg md:text-xl font-semibold h-5 md:h-10 text-text-primary-light dark:text-text-primary-dark">
                      Features
                    </span>
                    <div className="overflow-y-scroll flex flex-col">
                      <ProductAttribute data={prodDetails} />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </Suspense>
        </div>
        {/* first section box end */}
      </div>

      {/* sticky button for mobile screen start */}
      {apidata?.users?.accountId !== userInfo?.accountId && (
        <div className=" px-2 z-10 sm:hidden flex items-center justify-between h-[76px] w-full fixed bottom-0 right-0 left-0 bg-bg-secondary-light dark:bg-bg-secondary-dark">
          <PdpCta
            apiData={apidata}
            firstButtonText={data.result?.isNegotiable ? ctaText[0].makeOfferBtn : ctaText[0].firstBtn}
            isSold={isSold}
            secondButtonText={ctaText[0].secondBtn}
            noStockButtonText={ctaText[0].nostock}
            handleFirstButtonClick={handleFirstButtonClick}
            isFirstButtonLoading={isFirstButtonLoading}
          />
        </div>
      )}
      {/* sticky button for mobile screen end */}

      {/* page divider start */}
      <div className="border-b border-border-tertiary-light dark:border-border-tertiary-dark mt-12"></div>
      {/* page divider end */}

      <div className=" relative mb-11 custom-container mx-auto sm:px-16 mobile:px-4 ">
        {/*product section start */}
        <Suspense fallback={<div>Loading Similar Products...</div>}>
          <div className="mt-12">
            <TogglePanel panelInfo={ToggleInfo} />
          </div>
        </Suspense>
        {/*product section end */}
      </div>
      <div className="custom-container mobile:px-4">
        <InfoSection />
      </div>
      {isLikeAndDislikeLoading && <FullScreenSpinner />}
    </Layout>
  );
};

export default ProductDisplay;
