import { myFavoritesApi } from '@/store/api-slices/my-favorites';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect, useMemo, useState } from 'react';
import cookie from 'cookie';
import { SellerProfileType } from '@/store/types/seller-profile-type';
import { buildQueryString } from '@/helper/build-query-string';
import ProductCard from '@/components/ui/product-card';
import Header from '@/components/sections/header';
import ProductCardSkeleton from '@/components/ui/product-card-skeleton';
import LeftArrowIcon from '../../../public/assets/svg/left-arrow-icon';
import { useRouter } from 'next/router';
import { useTheme } from '@/hooks/theme';
import { Product } from '@/store/types';
import Placeholder from '@/containers/placeholder/placeholder';

const MyFavorites = ({ profileData }: { profileData: SellerProfileType }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const query = useMemo(() => {
    return buildQueryString({
      skip: page,
      limit: 10,
      userId: profileData?._id || '',
    });
  }, [page, profileData?._id]);
  const { data, isLoading, isFetching, isError } = myFavoritesApi.useGetAllFavoritesQuery({ query });
  const [allFavorites, setAllFavorites] = useState<Product[]>([]);
  useEffect(() => {
    if (data?.result && page === 0) {
      setAllFavorites(data?.result);
    } else if (data?.result) {
      setAllFavorites([...allFavorites, ...data?.result]);
    }
    setTotalCount(data?.totalCount || 0);
  }, [data?.result]);

  const handleViewMore = () => {
    setPage(page + 1);
  };
  const onLikeClick = (assetId: string) => {
    const newFavorites = allFavorites.filter((product) => product.assetId !== assetId);
    setAllFavorites(newFavorites);
    setTotalCount(totalCount - 1);
  };

  return (
    <div className="w-full flex flex-col min-h-screen relative text-text-primary-light dark:text-text-secondary-light ">
      <div className=" hidden md:block ">
        <Header stickyHeaderWithSearchBox />
      </div>
      <div className="w-full md:mt-[69px] mt-[0px] px-[4%] md:px-[64px] mx-auto max-w-[1440px] relative">
        <h2
          className={`text-text-primary-light w-full bg-bg-secondary-light dark:bg-bg-primary-dark z-50 dark:text-text-secondary-light
             text-lg py-5 md:text-2xl font-semibold md:static fixed md:top-[69px] left-[4%] md:left-[64px] mobile:flex items-center justify-center gap-2`}
        >
          <LeftArrowIcon
            primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
            onClick={() => router.back()}
            className="md:hidden absolute left-0"
          />
          My Favorites
        </h2>
        <div className="flex-1 mt-[68px] md:mt-0 overflow-y-scroll grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-3 gap-y-4">
          {allFavorites.map((product: Product) => (
            <ProductCard onLikeClick={onLikeClick} userID = {profileData._id} showLikeIcon={true} showProfilePic={true} key={product._id} product={product} />
          ))}
          {isFetching && [...Array(10)].map((_, index) => <ProductCardSkeleton key={index} />)}
        </div>
        {!isLoading && !isFetching && data?.result && allFavorites.length < totalCount ? (
          <div className="w-full flex justify-center items-center my-6 ">
            <button
              className={'border-2 text-sm font-medium px-4 py-2 rounded dark:text-text-primary-dark'}
              onClick={handleViewMore}
            >
              View more
            </button>
          </div>
        ) : null}

        {allFavorites.length === 0 && (
          <Placeholder containerClassName="mt-20" title="You haven't saved anything yet!" description="Your favorite products will appear here as you like them." />
        )}
      </div>
    </div>
  );
};

export default MyFavorites;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, locale } = context;

  const cookies = cookie.parse(req.headers.cookie || '');
  const accessToken = cookies.accessToken?.replace(/"/g, '') || null;

  let profileData = null;

  if (accessToken) {
    try {
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
        console.error(`Failed to fetch profile data: ${profileRes.status} ${profileRes.statusText}`);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
      return {
        redirect: {
          destination: '/500',
          permanent: false,
        },
      };
    }
  } else {
    console.log('No access token found');
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
      profileData,
    },
  };
}
