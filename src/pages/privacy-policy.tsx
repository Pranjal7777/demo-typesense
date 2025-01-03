import React, { FC } from 'react';
import Layout from '@/components/layout';
// import PageBanner from '@/components/Ui/PageBanner';
import PageHeaderWithBreadcrumb from '@/components/ui/page-header-with-breadcrumb';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import CustomHeader from '@/components/ui/custom-header';
import { seoProperties } from './about';
const PageBanner = dynamic(() => import('@/components/ui/page-banner'), { ssr: true });
import cookie from 'cookie';
import { GetServerSidePropsContext } from 'next';
import { AUTH_URL_V1, BASE_API_URL, STRAPI_ACCESS_TOKEN, STRAPI_BASE_API_URL, STRAPI_BASE_URL } from '@/config';
import { GET_PRIVACY_POLICY_DATA, STRAPI_PRIVACY_POLICY } from '@/api/endpoints';
import { getGuestTokenFromServer } from '@/helper/get-guest-token-from-server';
import { SeoData } from '@/store/types/strapi-seo-types';

type HeaderBennerSection = {
  bannerUrlForMobile: string;
  bannerUrlForWeb: string;
  headerText: string;
  headerDescription: string;
  headerDescriptionForMobile: string;
};

type BreadcrumbLinks = {
  name: string;
  link: string;
};
export interface HeroImageType {
  cover_image: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  alt: string;
}

export interface HeroSectionType {
  heroImage: HeroImageType;
  title: string;
  subtitle: string;
}
export interface qaSectionType {
  question: string;
  allAnswersPara: {
    ansPara: string;
  }[];
}

export interface PrivacyDataAttributes { 
  seoProperties?: seoProperties;
  heroSection: HeroSectionType;
  privacySection: {
    title: string;
    description: string;
  };
  qa_section: qaSectionType[];
}

export interface PrivacyDataType {
  attributes: PrivacyDataAttributes;
}
export type Props = {
  PrivacyData: PrivacyDataType;
  htmlContent:string,
  privacyPolicySeoData: {
    seo: SeoData;
  }
};

const PrivacyPolicy: FC<Props> = ({ PrivacyData,htmlContent,privacyPolicySeoData }) => {
  const seoData = privacyPolicySeoData?.seo;
  const { t } = useTranslation('privacy-policy');
  const headerBennerSection = t('page.headerBennerSection', { returnObjects: true }) as HeaderBennerSection;
  const breadcrumbLinks = t('page.breadcrumbLinks', { returnObjects: true }) as BreadcrumbLinks[];

  return (
    <Layout  excludeHeroSection={true} stickyHeader={true}>
      <CustomHeader
        title={seoData?.title}
        description={seoData?.description}
        image={seoData?.image?.url}
        url={seoData?.url}
      />

      <PageHeaderWithBreadcrumb className="" steps={breadcrumbLinks}></PageHeaderWithBreadcrumb>
      <div className="mt-[5px] sm:mt-[5px] relative custom-container mx-auto sm:px-16 mobile:px-4 ">
        <PageBanner
          bannerUrlForMobile={PrivacyData?.attributes?.heroSection?.heroImage?.cover_image?.data?.attributes?.url}
          bannerUrlForWeb={PrivacyData?.attributes?.heroSection?.heroImage?.cover_image?.data?.attributes?.url}
          headerText={PrivacyData?.attributes?.heroSection?.title}
          headerDescription={PrivacyData?.attributes?.heroSection?.subtitle}
          headerDescriptionForMobile={headerBennerSection.headerDescriptionForMobile}
        />

        <div className='my-8 text-text-primary-light dark:text-text-primary-dark' dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;

export async function getServerSideProps({ locale ,req}: { locale: string ,req: GetServerSidePropsContext['req']}) {

  let accessToken;
  let privacyPolicySeoData = {};
  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie || '');
    accessToken = cookies.accessToken?.replace(/"/g, '') || null;
  }
   if (!accessToken) {
     const guestToken = await getGuestTokenFromServer();
     accessToken = guestToken.data.token.accessToken;
   }
  try {
    const promises = [
      fetch(`${STRAPI_BASE_API_URL}${STRAPI_PRIVACY_POLICY}?populate=deep`),
      fetch(`${BASE_API_URL}${AUTH_URL_V1}${GET_PRIVACY_POLICY_DATA}?userType=1&type=1&lan=en`, {
        method: 'GET',
        headers: {
          Authorization: `${accessToken}`,
        },
      }),
      fetch(`${STRAPI_BASE_URL}/api/privacy-policy?populate=seo.image`, {
        headers: { Authorization: `${STRAPI_ACCESS_TOKEN}` },
      }),
    ];

    const listingApiReponses = await Promise.allSettled(promises);

    const response1 = listingApiReponses[0].status === 'fulfilled' ? listingApiReponses[0].value : null;
    const response2 = listingApiReponses[1].status === 'fulfilled' ? listingApiReponses[1].value : null;
    const response3 = listingApiReponses[2].status === 'fulfilled' ? listingApiReponses[2].value : null;

    if (!response1 || !response2) {
      return { notFound: true };
    }
    if(response3){
      const privacyPolicyResult = await response3.json();
      privacyPolicySeoData = privacyPolicyResult?.data;
    }
    const data = await response1.json();  
    const data2 = await response2.json();
    const htmlContent = data2.data.pageContent;
    

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'privacy-policy'])),
        PrivacyData: data.data,
        htmlContent:htmlContent,
        privacyPolicySeoData: privacyPolicySeoData
      },
    };
  } catch (error) {
    console.log('error accured', error);

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'privacy-policy'])),
        destination: '/500',
        permanent: false,
      },
    };
  }
}
