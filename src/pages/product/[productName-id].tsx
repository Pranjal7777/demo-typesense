import React, { useEffect, useState } from 'react';
import ProductDisplay from '@/containers/pdp/index';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSidePropsContext } from 'next';
import PDPskeleton from '@/components/ui/skeleton/pdp-skeleton';
import cookie from 'cookie';
import { ADD_RECENT_SEARCH_DATA_WITH_SINGLE_PRODUCT_SEARCH_URL } from '@/api/endpoints';
import { PdpProductData } from '@/store/types/pdp-types';
import CustomHeader from '@/components/ui/custom-header';
import { BASE_API_URL, STATIC_IMAGE_URL } from '@/config';
import { getGuestTokenFromServer } from '@/helper/get-guest-token-from-server';

type ProductPageProps = {
  pdpProductData: PdpProductData;
};

function PdpPage({ pdpProductData }: ProductPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  console.log(pdpProductData, 'pdpProductData');
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <CustomHeader
        key={pdpProductData?.result?.title}
        title={`${pdpProductData?.result?.title} - Buy Best ${pdpProductData?.result?.title} Online in kwibal`}
        description={`Discover the perfect ${pdpProductData?.result?.title} crafted to meet your needs with exceptional quality and design.`}
        image={
          pdpProductData?.result?.images?.[0]?.url.includes('http')
            ? pdpProductData?.result?.images?.[0]?.url
            : `${STATIC_IMAGE_URL}/${pdpProductData?.result?.images?.[0]?.url}`
        }
      />
      {isLoading ? <PDPskeleton /> : <ProductDisplay data={pdpProductData} />}
    </>
  );
}

export default PdpPage;

export async function getServerSideProps({
  locale,
  req,
  params,
}: {
  locale: string;
  req: GetServerSidePropsContext['req'];
  params: any;
}) {
  const paramsArray = params['productName-id']?.split('-');
  let accessToken;

  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie || '');
    accessToken = cookies.accessToken?.replace(/"/g, '') || null;
  }
  if (!accessToken) {
    const guestToken = await getGuestTokenFromServer();
    accessToken = guestToken.data.token.accessToken;
  }

  if (accessToken) {
    try {
      let apidata = null;
      const id = paramsArray[paramsArray.length - 1];

      const res = await fetch(
        `${BASE_API_URL}/v2/${ADD_RECENT_SEARCH_DATA_WITH_SINGLE_PRODUCT_SEARCH_URL}/?assetId=${id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      apidata = await res.json();

      const translations = await serverSideTranslations(locale, ['categories', 'common', 'productDetails']);

      return {
        props: {
          ...translations,
          pdpProductData: apidata,
        },
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      return {
        notFound: true,
      };
    }
  }
  return {
    notFound: true,
  };
}
