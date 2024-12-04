import Layout from '@/components/layout'
import { myFavoritesApi } from '@/store/api-slices/my-favorites';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useMemo, useState } from 'react'
import cookie from 'cookie';
import { SellerProfileType } from '@/store/types/seller-profile-type';
import { buildQueryString } from '@/helper/build-query-string';
import ProductCard from '@/components/ui/product-card';

const MyFavorites = ({ profileData }: { profileData: SellerProfileType }) => {
  const [page, setPage] = useState(1);
  const query = useMemo(() => {
    return buildQueryString({
      page,
      limit: 10,
      userId: profileData?._id || '',
    });
  }, [page, profileData?._id]);
  const { data, isLoading, isError } = myFavoritesApi.useGetAllFavoritesQuery({ query });
  console.log(data, 'likes');
  
  return (
    <div className="w-full h-screen relative text-text-primary-light dark:text-text-secondary-light ">
      <Layout excludeFooter={true} excludeHeroSection={true} stickyHeader={true}>
        <div className="w-full px-[4%] md:px-[64px] mx-auto max-w-[1440px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-3 gap-y-4">
            {data?.result?.map((product:any)=>(
              <ProductCard showProfilePic={true} key={product._id} product={product} />
            ))}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default MyFavorites

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