/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import Layout from '@/components/layout';
import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
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
import FullScreenSpinner from '@/components/ui/full-screen-spinner';
import { AddressErrorType } from '@/store/types/profile-type';
import { toast } from 'sonner';
import isUserAuthenticated from '@/helper/validation/check-user-authentication';
import { SIGN_IN_PAGE } from '@/routes';
import showToast from '@/helper/show-toaster';
import SearchIcon from '../../../public/assets/svg/search-icon';
import { BASE_API_URL } from '@/config';

type Props = {
  sellerProfileData: SellerProfileType;
  followCountData: FollowCountDataType;
};

const SellerProfile: FC<Props> = ({ sellerProfileData, followCountData }) => {
  const [isFollow, setIsFollow] = useState(sellerProfileData.isFollow);
  const [totalFollower, setTotalFollower] = useState(followCountData.totalFollower);
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

  const debouncedSetSearchTerm = debounce(setDebouncedSearchTerm, 100);

  useEffect(() => {
    debouncedSetSearchTerm(searchTerm);
  }, [searchTerm]);

  const { data, isLoading, isFetching } = sellerProfileApi.useGetAllProductsQuery({
    accountId: accountId || '',
    page,
    search: debouncedSearchTerm,
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
  const [postFollow, { isLoading: isFollowPosting }] = sellerProfileApi.usePostFollowMutation();
  const [postUnFollow, { isLoading: isUnFollowPosting }] = sellerProfileApi.usePostUnFollowMutation();

  const followButtonHandler = useCallback(
    async (id: string) => {
      const isUserLogin = isUserAuthenticated();
      if (!isUserLogin) {
        router.push(SIGN_IN_PAGE);
        return;
      }
      if (isFollow) {
        try {
          await postUnFollow(id).unwrap();
          setIsFollow(false);
          setTotalFollower(totalFollower - 1);
          showToast({ message: `You are no longer following ${sellerProfileData?.username || ''}` });
        } catch (error) {
          const Error = error as AddressErrorType;
          showToast({ message: `${Error?.data?.message || 'Something went wrong'}`, messageType: 'error' });
        }
      } else {
        try {
          await postFollow(id).unwrap();
          setIsFollow(true);
          setTotalFollower(totalFollower + 1);
          showToast({ message: `You are now following ${sellerProfileData?.username || ''}` });
        } catch (error) {
          const Error = error as AddressErrorType;
          showToast({ message: `${Error?.data?.message || 'Something went wrong'}`, messageType: 'error' });
        }
      }
    },
    [postFollow, postUnFollow, isFollow, totalFollower, isUserAuthenticated]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
    setProductList([]);
    setIsSearchLoading(true);
  };

  return (
    <Layout stickyHeader={true} stickyHeroSection={true} excludeFooter={true}>
      {(isFollowPosting || isUnFollowPosting) && <FullScreenSpinner />}
      <div className="profile text-text-primary-light dark:text-text-primary-dark min-h-screen w-full px-[4%] md:px-[64px] mx-auto max-w-[1440px] border-t py-[20px] flex flex-col md:flex-row gap-x-[16px]">
        <div className="left w-full flex flex-col items-center md:w-[210px] text-text-primary-light dark:text-text-primary-dark ">
          {sellerProfileData && (
            <NewProfileCard
              fullName={`${sellerProfileData.firstName} ${sellerProfileData.lastName}`}
              userName={sellerProfileData.username}
              profilePic={sellerProfileData.profilePic || ''}
              ratingValue={sellerProfileData.totalAvgRating || 0}
              ratingText={`${sellerProfileData.totalAvgRating.toFixed(2)}`}
              ratingTextClass="text-xs text-text-tertiary-light dark:text-text-septenary-light"
              buttonType={isFollow ? 'quinary' : 'primary'}
              buttonText={isFollow ? 'Following' : 'Follow'}
              buttonClass="w-full sm:max-w-[343px] order-5 md:order-4 !h-9 md:w-[118px] md:h-[32px] flex justify-center items-center md:font-normal my-4"
              starColor="#FDB514"
              totalFollowers={totalFollower}
              totalFollowing={followCountData.totalFollowing}
              followingSectionClass="order-4 md:order-5"
              followButtonHandler={() => {
                followButtonHandler(sellerProfileData.accountId);
              }}
            />
          )}
        </div>
        <div className="right flex-1">
          <nav className="flex w-full border-b md:border-b-0 items-start justify-between">
            <ul className="flex text-sm md:text-[16px] w-full md:w-auto gap-[20px] text-text-quaternary-dark dark:text-text-septenary-light leading-[24px]">
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
                    (tab === item ? 'text-text-secondary-dark dark:text-text-secondary-light font-semibold  border-b-[3px] border-brand-color ' : '') +
                    'flex justify-center px-[8px] py-[11px] w-[50%] md:w-auto'
                  }
                >
                  {item}
                </li>
              ))}
            </ul>
          </nav>
          <div className="content w-full md:pl-0 md:p-[20px] md:border text-text-primary-light dark:text-text-primary-dark border-border-tertiary-light dark:border-border-tertiary-dark mt-[20px] rounded-t-[12px]">
            <div className="pb-[20px] flex justify-between items-center">
              <h3 className="md:text-[20px] text-text-secondary-dark dark:text-text-secondary-light  md:pl-[20px] font-semibold ">{tab}</h3>
              {tab == 'Listing' && (
                <div className="search-box w-[290px] h-[44px] hidden md:flex gap-3 rounded-[4px] items-center px-[10px] bg-bg-septenary-light dark:bg-bg-secondary-dark ">
                  <SearchIcon className='h-[24px] w-[24px]'/>
                  <input
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search product"
                    type="text"
                    className="w-full text-sm bg-bg-septenary-light dark:bg-bg-secondary-dark outline-none h-[100%]"
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
                  <div className=" flex justify-center text-xl font-semibold">No Product Found!</div>
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
                <nav className="border-b border-border-tertiary-light dark:border-border-tertiary-dark md:pl-[20px]">
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
                            : '') + 'px-[8px] py-[11px] text-text-quaternary-dark dark:text-text-septenary-light'
                        }
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="w-full">
                  {reviewTab == 'All' ? (
                    <AllReviewsSection accountId={accountId || ''} />
                  ) : reviewTab == 'From Buyers' ? (
                    <BuyersReviewSection accountId={accountId || ''} />
                  ) : reviewTab == 'From Sellers' ? (
                    <SellersReviewSection accountId={accountId || ''} />
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellerProfile;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, locale, params } = context;
  const { id } = params as { id: string };
  const cookies = cookie.parse(req.headers.cookie || '');
  const accessToken = cookies.accessToken?.replace(/"/g, '') || null;

  let sellerProfileData = null;
  let followCountData = null;

  if (accessToken) {
    try {
      // First API call to fetch profile data
      const profileRes = await fetch(`${BASE_API_URL}/v1/profile?accountId=${id}`, {
        method: 'GET',
        headers: {
          Authorization: `${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        sellerProfileData = profileData.data;
      } else {
        console.error(`Failed to fetch profile data: ${profileRes.status} ${profileRes.statusText}`);
        return {
          redirect: {
            destination: '/500',
            permanent: false,
          },
        };
      }
      // Second API call to fetch follow count data
      if (sellerProfileData) {
        const followRes = await fetch(
          `${BASE_API_URL}/v1/follow/count?userId=${sellerProfileData._id}&accountId=${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (followRes.ok) {
          const followData = await followRes.json();
          followCountData = followData.data;
        } else {
          console.error(`Failed to fetch follow count data: ${followRes.status} ${followRes.statusText}`);
          return {
            redirect: {
              destination: '/500',
              permanent: false,
            },
          };
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
      sellerProfileData,
      followCountData,
    },
  };
}
