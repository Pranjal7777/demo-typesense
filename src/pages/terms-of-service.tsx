
import Layout from '@/components/layout';
import PageBanner from '@/components/ui/page-banner';
import PageHeaderWithBreadcrumb from '@/components/ui/page-header-with-breadcrumb';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { FC, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import cookie from 'cookie';
import { HeroSectionType, qaSectionType } from './privacy-policy';
import { seoProperties } from './about';
import CustomHeader from '@/components/ui/custom-header';
import formatArrayToStrings from '@/helper/functions/format-array-strings';
import { AUTH_URL_V1, BASE_API_URL, STRAPI_BASE_API_URL } from '@/config';
import { GET_PRIVACY_POLICY_DATA, STRAPI_TERMS_OF_SERVICE } from '@/api/endpoints';
import { GetServerSidePropsContext } from 'next';
import { useTheme } from '@/hooks/theme';
import { getGuestTokenFromServer } from '@/helper/get-guest-token-from-server';

type HeaderBennerSection={
    bannerUrlForMobile:string
    bannerUrlForWeb:string
    headerText:string
    headerDescription:string
    headerDescriptionForMobile:string
}

type BreadcrumbLinks={
  name:string,
  link:string
}

export interface termsDataAttributes {
  heroSection: HeroSectionType,
  termsOfServiceSection:{
    title:string,
    description:string
  },
  qa_section: qaSectionType[],
  seoProperties?: seoProperties;

}

export interface termsData {
  attributes: termsDataAttributes;
}
export type Props = {
  termsOfServiceData: termsData;  
  htmlContent:string
};
const TermsAndService: FC<Props>= ({termsOfServiceData,htmlContent}) =>{ 
  const contentRef = useRef<HTMLDivElement>(null);
  const {theme}=useTheme();

   useEffect(() => {
     const container = contentRef.current;
     if (container) {
       const elements = container.querySelectorAll('*');
       elements.forEach((el:any) => {
         el.style.color = theme ? '#FFF' : '#202020';
       });
     }
   }, [theme]);

  const {t}=useTranslation('terms-of-service');
  const headerBennerSection = t('page.headerBennerSection', { returnObjects: true }) as HeaderBennerSection;
  const breadcrumbLinks = t('page.breadcrumbLinks', { returnObjects: true }) as BreadcrumbLinks[];
  const strapiSeoData = termsOfServiceData.attributes.seoProperties;
  const keywords = termsOfServiceData?.attributes?.seoProperties?.keywords;
  const joinedString = formatArrayToStrings(keywords);
  return (
    <Layout excludeHeroSection={true} stickyHeader={true}>
      <CustomHeader
        title={strapiSeoData?.metaTitle}
        keywords={joinedString}
        description={strapiSeoData?.metaDesc}
        image={strapiSeoData?.metaImage?.data?.attributes.url}
        twitterImage={strapiSeoData?.twitterCard?.twitterImageURL}
        twitterImageAlt={strapiSeoData?.twitterCard?.twitterImageAlt}
        twitterTitle={strapiSeoData?.twitterCard?.twitterTitle}
        twitterURL={strapiSeoData?.twitterCard?.twitterURL}
      />
      <PageHeaderWithBreadcrumb className="" steps={breadcrumbLinks}></PageHeaderWithBreadcrumb>
      <div className="mt-[50px] md:mt-[69px] relative custom-container mx-auto sm:px-16 mobile:px-4 ">
        <PageBanner
          bannerUrlForMobile={
            termsOfServiceData?.attributes?.heroSection?.heroImage?.cover_image?.data?.attributes?.url
          }
          bannerUrlForWeb={termsOfServiceData?.attributes?.heroSection?.heroImage?.cover_image?.data?.attributes?.url}
          headerText={termsOfServiceData?.attributes?.heroSection?.title}
          headerDescription={termsOfServiceData?.attributes?.heroSection?.subtitle}
          headerDescriptionForMobile={headerBennerSection.headerDescriptionForMobile}
        />
        <div ref={contentRef} className="my-8 dark:!text-text-secondary-light !text-text-secondary-dark" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </Layout>
  );
};

export default TermsAndService;

export async function getServerSideProps({ locale, req }: { locale: string; req: GetServerSidePropsContext['req'] }) {
  let accessToken;
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
      fetch(`${STRAPI_BASE_API_URL}${STRAPI_TERMS_OF_SERVICE}?populate=deep`),
      fetch(`${BASE_API_URL}${AUTH_URL_V1}${GET_PRIVACY_POLICY_DATA}?userType=1&type=2&lan=en`, {
        method: 'GET',
        headers: {
          Authorization: `${accessToken}`,
        },
      }),
    ];

    const listingApiResponses = await Promise.allSettled(promises);

    const response1 = listingApiResponses[0].status === 'fulfilled' ? listingApiResponses[0].value : null;
    const response2 = listingApiResponses[1].status === 'fulfilled' ? listingApiResponses[1].value : null;

    if (!response1 || !response2) {
      return { notFound: true };
    }
    const data = await response1.json();
    const data2 = await response2.json();
    const htmlContent = data2.data.pageContent;
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'terms-of-service'])),
        termsOfServiceData: data.data,
        htmlContent: htmlContent,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'terms-of-service'])),
        destination: '/500',
        permanent: false,
      },
    };
  }
}
