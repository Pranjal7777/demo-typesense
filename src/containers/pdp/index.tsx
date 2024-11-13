import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import ProductSlider from '@/components/ui/product-slider';
import Layout from '@/components/layout';
import ProductAttribute from '@/components/product-attribute';
import Breadcrumb from '@/components/ui/breadcrumb';
import { useTheme } from '@/hooks/theme';
import EngagementStats from '@/components/ui/engagement-stats';
import HartSvg from '../../../public/assets/svg/heart';
import ProfileCard from '@/components/ui/profile-card';
import ProductDetailsCard from '@/components/ui/product-details-card';
import InfoBox from '@/components/ui/info-box';
import InfoSection from '@/components/sections/info-section';
import TogglePanel from '@/components/toggle-panel';
import PdpCta from '@/components/ui/pdp-cta';
import ViewsIcon from '../../../public/assets/svg/views-icon';
import OffersIconSVG from '../../../public/assets/svg/offers-icon';
import { useRouter } from 'next/router';
import SimilarProductsList from '@/components/similar-products';
import UserProductList from '@/components/user-product-list';
import { RootState } from '@/store/store';
import { useAppSelector } from '@/store/utils/hooks';
import { setCheckoutProduct } from '@/store/slices/checkout-slice';
import { useDispatch } from 'react-redux';
import { getChatIdentifier } from '@/helper/payment';
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
const ProductDisplay: React.FC<ProductProps> = ({ data }) => {
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
  const followingBtn: string = productDetails('page.follwingBtn');
  const hamburger = productDetails('page.hamburger', { returnObjects: true }) as hamburger;
  const engagementStats = productDetails('page.engagementStats', { returnObjects: true }) as engagementStats;
  const ctaText = productDetails('page.prodCTA', { returnObjects: true }) as ctas;
  const profileCard = productDetails('page.profileCard', { returnObjects: true }) as profileCard;
  const togglePanelText = productDetails('page.toggleInfo', { returnObjects: true }) as togglePanelText;
  const prodDetails = apidata?.details;
  const [totalLikedCount, setTotalLikeCount] = useState<number>(apidata?.likeCount || 0);
  const { userInfo, myLocation } = useAppSelector((state: RootState) => state.auth);
  const [isFirstButtonLoading, setIsFirstButtonLoading] = useState(false);
  const dispatch = useDispatch();
  
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
      logo: <HartSvg color={theme ? '#fff' : '#000'} className="w-[12px] h-[12px] md:w-[16px] md:h-[16px]" />,
      label: engagementStats[0].likes,
      value: totalLikedCount,
    },
    {
      logo: <ViewsIcon color={theme ? '#fff' : '#000'} />,
      label: engagementStats[0].views,
      value: viewCount,
    },
    {
      logo: <OffersIconSVG color={theme ? '#fff' : '#000'} />,
      label: engagementStats[0].offers,
      value: offerTradeCount,
    },
  ];
  const ToggleInfo = [
    {
      label: togglePanelText[0].toggleOne,
      content: <UserProductList accoundId={sellerAccountId} page="1" />,
    },
    {
      label: togglePanelText[0].toggleTwo,
      content: <SimilarProductsList assetId={assetId} categoryId={categoryId} />,
    },
  ];

  const handleFirstButtonClick = async () => {
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
      const chatIdentifier = await getChatIdentifier(payload);
      if (data) {
        dispatch(setCheckoutProduct(data.result));
      }
      await router.push(
        `/buy/select-address?assetId=${assetId}&sellerId=${sellerAccountId}&chatId=${chatIdentifier.data.chatId}`
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsFirstButtonLoading(false);
    }
  };

  return (
    <Layout stickyHeader={true} stickyHeroSection={true}>
      <div className="mt-10 md:mt-5">
        <Breadcrumb steps={breadcrumbSteps} />
      </div>

      <div className="relative custom-container mt-[20px] mx-auto mobile:px-4">
        {/* first section box start */}
        <div className="flex gap-8 mobile:gap-2 w-full xl:h-[576px] lg:h-[530px] md:h-full sm:h-[400px] flex-col lg:flex-row overflow-y-scroll">
          <div className=" h-full w-full lg:w-[60%]">
            <ProductSlider
              className=""
              setTotalLikeCount={setTotalLikeCount}
              imagesArray={images}
              shareURL={shareLink}
              shareTitle={prodTitle}
              isProductLiked={apidata.isLiked}
            />
            <div className="lg:mt-5 md:mt-3 sm:mt-2 flex items-end justify-between mobile:hidden"></div>
          </div>

          <div className="w-full flex-2 lg:w-[40%] h-full  rtl:ml-0 rtl:mr-12 overflow-y-scroll">
            <div>
              <div className="mobile:mt-5 w-full flex flex-col">
                <ProductDetailsCard
                  familyName={prodCategory}
                  categoryTitle={prodTitle}
                  postTimeStamp={prodTimeStamp}
                  price={prodPrice}
                  timestampLabel={postingLabel}
                  currency={currencyCode}
                />
                <div className="mobile:hidden">
                  <PdpCta
                    firstButtonText={data.result?.isNegotiable ? ctaText[0].makeOfferBtn : ctaText[0].firstBtn}
                    isSold={isSold}
                    secondButtonText={ctaText[0].secondBtn}
                    noStockButtonText={ctaText[0].nostock}
                    handleFirstButtonClick={handleFirstButtonClick}
                    isFirstButtonLoading={isFirstButtonLoading}
                  />
                </div>
                <EngagementStats data={EngagementStatsData} />
              </div>
              <div className="h-[30%]">
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
              </div>
              <div className="mt-5">
                <InfoBox question={desc} answer={prodDesc} width={'100%'} />
              </div>
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
        </div>
        {/* first section box end */}
      </div>

      {/* sticky button for mobile screen start */}
      <div className=" px-2 z-10 sm:hidden flex items-center justify-between h-[76px] w-full fixed bottom-0 right-0 left-0 bg-bg-secondary-light dark:bg-bg-secondary-dark">
        <PdpCta
          firstButtonText={data.result?.isNegotiable ? ctaText[0].makeOfferBtn : ctaText[0].firstBtn}
          isSold={isSold}
          secondButtonText={ctaText[0].secondBtn}
          noStockButtonText={ctaText[0].nostock}
          handleFirstButtonClick={handleFirstButtonClick}
          isFirstButtonLoading={isFirstButtonLoading}
        />
      </div>
      {/* sticky button for mobile screen end */}

      {/* page divider start */}
      <div className="border-b border-border-tertiary-light dark:border-border-tertiary-dark mt-12"></div>
      {/* page divider end */}

      <div className=" relative mb-11 custom-container mx-auto sm:px-16 mobile:px-4 ">
        {/*product section start */}
        <div className="mt-12">
          <TogglePanel panelInfo={ToggleInfo} />
        </div>
        {/*product section end */}
      </div>
      <div className="custom-container mobile:px-4">
        <InfoSection />
      </div>
    </Layout>
  );
};

export default ProductDisplay;
