/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import Layout from '@/components/layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { FC, useEffect, useMemo, useState } from 'react';
import cookie from 'cookie';
import NewProfileCard from '@/components/ui/new-profile-card';
import { GetServerSidePropsContext } from 'next';
import ProductCard from '@/components/ui/product-card';
import ProductCardSkeleton from '@/components/ui/product-card-skeleton';
import { Product } from '@/store/types';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
import { sellerProfileApi } from '@/store/api-slices/seller-profile/seller-profile-api';
import { FollowCountDataType, SellerProfileType } from '@/store/types/seller-profile-type';
import AllReviewsSection from '@/components/sections/all-reviews-section';
import BuyersReviewSection from '@/components/sections/buyers-review-section';
import SellersReviewSection from '@/components/sections/sellers-review-section';


import SearchIcon from '../../../../public/assets/svg/search-icon';
import SelfProfileEditSection from '@/components/sections/self-prfile-edit';
import { HIDE_SELLER_FLOW } from '@/config';
import Placeholder from '@/containers/placeholder/placeholder';
import { getFormattedRating } from '@/helper';
import CustomHeader from '@/components/ui/custom-header';

type Props = {
  userProfileData: SellerProfileType;
  followCountData: FollowCountDataType;
};

const Profile: FC<Props> = ({ userProfileData, followCountData }) => {
  console.log(userProfileData, 'userProfileData');
  const [profileData, setProfileData] = useState<SellerProfileType>(userProfileData);

  const router = useRouter();
  const { id } = router.query as { id?: string };
  const accountId = useMemo(() => id, [id]);
  const tabs = ['Listing', 'Reviews'];
  const [tab, setTab] = useState('Listing');
  const reviewTabs = ['All', 'From Buyers', 'From Sellers'];
  const [reviewTab, setReviewTab] = useState('All');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [productList, setProductList] = useState<Product[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const debouncedSetSearchTerm = debounce(setDebouncedSearchTerm, 100);

  const closeEditProfileModal = () => {
    setIsEditProfileModalOpen(false);
  };

  useEffect(() => {
    debouncedSetSearchTerm(searchTerm);
  }, [searchTerm]);

  const { data, isLoading, isFetching } = sellerProfileApi.useGetAllProductsQuery({
    page,
    search: debouncedSearchTerm,
    accountId: profileData.accountId,
  });

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setProductList(data.result);
      } else {
        setProductList((prevProducts) => [...prevProducts, ...data.result]);
      }
      setIsSearchLoading(false);
    }
    setIsSearchLoading(false);
  }, [data]);

  const handleViewMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const editProfileButtonHandler = () => {
    setIsEditProfileModalOpen(true);
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
    setProductList([]);
    setIsSearchLoading(true);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobile(false);
      }
      if (window.innerWidth < 768) {
        setIsMobile(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <CustomHeader
        url={profileData?.profileLink}
        keywords={`${profileData?.firstName} ${profileData?.lastName}`}
        image={profileData?.profilePic || ''}
        title={profileData?.firstName + ' ' + profileData?.lastName}
        description={`Explore the profile of ${profileData?.firstName} ${profileData?.lastName}`}
      />
      <div className="w-full min-h-screen text-text-primary-light dark:text-text-primary-dark">
        {isMobile && isEditProfileModalOpen ? (
          <div className="w-full px-[4%] pt-5 text-text-primary-light dark:text-text-primary-dark">
            <SelfProfileEditSection
              profileData={profileData}
              setProfileData={setProfileData}
              isMobile={isMobile}
              leftArrowClickHandler={closeEditProfileModal}
            />
          </div>
        ) : (
          <Layout stickyHeader={true} stickyHeroSection={true} excludeFooter={true}>
            {/* {(isFollowPosting || isUnFollowPosting) && <FullScreenSpinner />} */}
            <div className="profile w-full px-[4%] md:px-[64px] mx-auto max-w-[1440px] border-t py-[20px] flex flex-col md:flex-row gap-x-[16px] text-text-primary-light dark:text-text-primary-dark">
              {isEditProfileModalOpen ? (
                <SelfProfileEditSection
                  setProfileData={setProfileData}
                  profileData={profileData}
                  isMobile={isMobile}
                  leftArrowClickHandler={closeEditProfileModal}
                />
              ) : (
                <>
                  <div className="left w-full flex flex-col items-center md:w-[210px] text-text-secondary-dark dark:text-text-secondary-light">
                    {profileData && (
                      <NewProfileCard
                        profileLink={profileData.website}
                        firstName={profileData.firstName}
                        lastName={profileData.lastName}
                        fullName={`${profileData.firstName} ${profileData.lastName}`}
                        profilePic={profileData.profilePic || ''}
                        ratingValue={profileData.totalAvgRating || 0}
                        ratingText={`${getFormattedRating(profileData.totalAvgRating)}`}
                        ratingTextClass="text-xs text-text-tertiary-light"
                        buttonType={'primary'}
                        buttonText={'Edit'}
                        buttonClass="w-full sm:max-w-[343px] order-5 md:order-4 !h-9 md:w-[118px] md:h-[32px] flex justify-center items-center md:font-normal my-4"
                        starColor="var(--brand-color)"
                        totalFollowers={followCountData.totalFollower}
                        totalFollowing={followCountData.totalFollowing}
                        followingSectionClass="order-4 md:order-5"
                        followButtonHandler={editProfileButtonHandler}
                        bio={profileData.bio}
                      />
                    )}
                  </div>
                  <div className="right flex-1">
                    <nav className="flex w-full border-b border-border-tertiary-light dark:border-border-tertiary-dark md:border-b-0 items-start justify-between">
                      <ul className="flex text-sm md:text-[16px] w-full md:w-auto gap-[20px] text-text-quaternary-dark leading-[24px]">
                        {tabs.map((item, index) => (
                          <li
                            key={index}
                            onClick={() => setTab(item)}
                            tabIndex={0}
                            role="button"
                            onKeyUp={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setTab(item);
                              }
                            }}
                            className={
                              (tab === item
                                ? 'text-text-secondary-dark dark:text-text-secondary-light font-semibold border-b-[3px] border-brand-color '
                                : '') + 'flex justify-center px-[8px] py-[11px] w-[50%] md:w-auto'
                            }
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </nav>
                    <div className="content w-full md:pl-0 md:p-[20px] md:border text-text-primary-light dark:text-text-primary-dark border-border-tertiary-light dark:border-border-tertiary-dark mt-[20px] rounded-t-[12px]">
                      <div className="pb-[20px] md:flex justify-between items-center hidden">
                        <h3 className="md:text-[20px]  md:pl-[20px] text-text-secondary-dark dark:text-text-secondary-light font-semibold ">
                          {tab}
                        </h3>
                        {tab == 'Listing' && data && data?.result?.length > 0 && (
                          <div className="search-box w-[290px] h-[44px] hidden rounded-[4px] md:flex gap-3 items-center px-[10px] bg-bg-septenary-light dark:bg-bg-secondary-dark">
                            <SearchIcon className="h-[24px] w-[24px]" />
                            <input
                              value={searchTerm}
                              onChange={handleSearch}
                              placeholder="Search product"
                              type="text"
                              className="w-[100%] text-[14px] outline-none bg-bg-septenary-light dark:bg-bg-secondary-dark h-[100%]"
                            />
                          </div>
                        )}
                      </div>
                      {tab === 'Listing' ? (
                        <>
                          <div className="product md:pl-[20px] w-full grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                            {data && productList.length > 0
                              ? productList.map((product) => (
                                  <ProductCard showProfilePic={false} key={product._id} product={product} />
                                ))
                              : null}
                            {(isLoading || isSearchLoading || isFetching) &&
                              [...Array(6)].map((_, index) => <ProductCardSkeleton key={index} />)}
                          </div>

                          {!isFetching && !isSearchLoading && productList.length < 1 ? (
                            <Placeholder alt="no-products" title="No Product Found!" />
                          ) : null}

                          {!isLoading && !isSearchLoading && data?.result && productList.length < data?.Totalcount ? (
                            <div className="w-full flex justify-center items-center mt-6">
                              <button
                                className={'border-2 text-sm font-medium px-4 py-2 rounded dark:text-text-primary-dark'}
                                onClick={handleViewMore}
                              >
                                View more
                              </button>
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <div className="review">
                          <AllReviewsSection accountId={profileData.accountId || ''} />
                          {!HIDE_SELLER_FLOW && (
                            <>
                              <nav className="border-b md:pl-[20px]">
                                <ul className="flex gap-[12px] text-sm md:text-[16px] text-text-tertiary-light dark:text-text-septenary-light leading-[24px]">
                                  {reviewTabs.map((item, index) => (
                                    <li
                                      key={index}
                                      onClick={() => setReviewTab(item)}
                                      tabIndex={0}
                                      role="button"
                                      onKeyUp={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                          e.preventDefault();
                                          setReviewTab(item);
                                        }
                                      }}
                                      className={
                                        (reviewTab === item
                                          ? ' text-text-secondary-dark dark:text-text-secondary-light font-semibold  border-b-[3px] border-brand-color '
                                          : '') +
                                        'px-[8px] py-[11px] text-text-quaternary-dark dark:text-text-septenary-light'
                                      }
                                    >
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </nav>
                              <div className="w-full text-text-primary-light dark:text-text-primary-dark">
                                {reviewTab == 'All' ? (
                                  <AllReviewsSection accountId={accountId || ''} />
                                ) : reviewTab == 'From Buyers' ? (
                                  <BuyersReviewSection accountId={accountId || ''} />
                                ) : reviewTab == 'From Sellers' ? (
                                  <SellersReviewSection accountId={accountId || ''} />
                                ) : null}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Layout>
        )}
      </div>
    </>
  );
};

export default Profile;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, locale } = context;

  const cookies = cookie.parse(req.headers.cookie || '');
  const accessToken = cookies.accessToken?.replace(/"/g, '') || null;

  let profileData = null;
  let followCountData = null;

  if (accessToken) {
    try {
      // First API call to fetch profile data
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      const profileRes = await fetch(`${baseUrl}/v1/profile`, {
        method: 'GET',
        headers: {
          Authorization: `${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (profileRes.ok) {
        const profileDetails = await profileRes.json();
        profileData = profileDetails.data;
      } else {
        if (profileRes.status === 401 || !profileRes.ok) {
          return {
            redirect: {
              destination: '/500',
              permanent: false,
            },
          };
        }
      }

      // Second API call to fetch follow count data
      if (profileData) {
        const followRes = await fetch(`${baseUrl}/v1/follow/count`, {
          method: 'GET',
          headers: {
            Authorization: `${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (followRes.ok) {
          const followData = await followRes.json();
          followCountData = followData.data;
        } else {
          console.log(`Failed to fetch follow count data: ${followRes.status} ${followRes.statusText}`);
        }
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  } else {
    console.log('No access token found');
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
      userProfileData: profileData,
      followCountData,
    },
  };
}

