import React, { useEffect, useState } from 'react';
import ProductDisplay from '@/containers/pdp/index';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSidePropsContext } from 'next';
import PDPskeleton from '@/components/ui/skeleton/pdp-skeleton';
import cookie from 'cookie';
import { ADD_RECENT_SEARCH_DATA_WITH_SINGLE_PRODUCT_SEARCH_URL } from '@/api/endpoints';
import { PdpProductData } from '@/store/types/pdp-types';
import CustomHeader from '@/components/ui/custom-header';
import { BASE_API_URL } from '@/config';

type ProductPageProps = {
  pdpProductData: PdpProductData;
};

function PdpPage({ pdpProductData }: ProductPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  console.log(pdpProductData);
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return <> 
    <CustomHeader />
    {isLoading ? <PDPskeleton /> : <ProductDisplay data={pdpProductData} />}</>;
}

export default PdpPage;

export async function getServerSideProps({
  locale,
  req,
  params,
}: {
  locale: string;
  req: GetServerSidePropsContext['req'];
  id: string;
  params: {
    id:string;
  };
}) {
  try {
    let apidata = null;
    const { id } = params;
    if (req.headers.cookie) {
      const cookies = cookie.parse(req.headers.cookie || '');
      const accessToken = cookies.accessToken?.replace(/"/g, '') || null;
      const res = await fetch(`${BASE_API_URL}/v2/${ADD_RECENT_SEARCH_DATA_WITH_SINGLE_PRODUCT_SEARCH_URL}/?assetId=${id}`, {
        method: 'GET',
        headers: {
          Authorization: `${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      apidata = await res.json();
    }

    const translations = await serverSideTranslations(locale, ['categories', 'common', 'productDetails']);

    return {
      props: {
        ...translations,
        pdpProductData: apidata
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      notFound: true,
    };
  }
}

