import React, { FC } from 'react';
import Layout from '@/components/layout';
// import PageBanner from '@/components/Ui/PageBanner';
import PageHeaderWithBreadcrumb from '@/components/ui/page-header-with-breadcrumb';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import CustomHeader from '@/components/ui/custom-header';
import { seoProperties } from './about';
import formatArrayToStrings from '@/helper/functions/format-array-strings';
// import ContentSectionPageTitle from '@/components/Ui/ContentSectionPageTitle';
// import ContentSection from '@/components/Sections/ContentSection';
const PageBanner = dynamic(() => import('@/components/ui/page-banner'), { ssr: true });
import cookie from 'cookie';
import { GetServerSidePropsContext } from 'next';
import { API, AUTH_URL_V1, BASE_API_URL, STRAPI_BASE_API_URL } from '@/config';
import { GET_PRIVACY_POLICY_DATA, STRAPI_PRIVACY_POLICY } from '@/api/endpoints';

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
  htmlContent:string
};

const PrivacyPolicy: FC<Props> = ({ PrivacyData,htmlContent }) => {
  const { t } = useTranslation('privacy-policy');
  const headerBennerSection = t('page.headerBennerSection', { returnObjects: true }) as HeaderBennerSection;
  const breadcrumbLinks = t('page.breadcrumbLinks', { returnObjects: true }) as BreadcrumbLinks[];
  // const privacyPolicySection: PrivacyPolicySection = t('page.privacyPolicySection', { returnObjects: true });
  const strapiSeoData = PrivacyData.attributes.seoProperties;
  const keywords = PrivacyData?.attributes?.seoProperties?.keywords;
  const joinedString = formatArrayToStrings(keywords);
  // const {data:htmlContent,isFetching,isError }=productsApi.useGetPrivacyPolicyDataQuery();

  return (
    <Layout stickyHeader={true} stickyHeroSection={true}>
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
      <div className="mt-[5px] sm:mt-[5px] relative custom-container mx-auto sm:px-16 mobile:px-4 ">
        {/* <PageBanner
          bannerUrlForMobile={headerBennerSection.bannerUrlForMobile}
          bannerUrlForWeb={headerBennerSection.bannerUrlForWeb}
          headerText={headerBennerSection.headerText}
          headerDescription={headerBennerSection.headerDescription}
          headerDescriptionForMobile={headerBennerSection.headerDescriptionForMobile}
        /> */}
        {/* new page banner start */}
        <PageBanner
          bannerUrlForMobile={PrivacyData?.attributes?.heroSection?.heroImage?.cover_image?.data?.attributes?.url}
          bannerUrlForWeb={PrivacyData?.attributes?.heroSection?.heroImage?.cover_image?.data?.attributes?.url}
          headerText={PrivacyData?.attributes?.heroSection?.title}
          headerDescription={PrivacyData?.attributes?.heroSection?.subtitle}
          headerDescriptionForMobile={headerBennerSection.headerDescriptionForMobile}
        />
        {/* new page banner end */}
        {/* <QaSection
          description={PrivacyData?.attributes?.privacySection?.description}
          title={PrivacyData?.attributes?.privacySection?.title}
          data={PrivacyData}
        /> */}

        <div className='my-8' dangerouslySetInnerHTML={{ __html: htmlContent }} />

        {/* <div className="py-12 mobile:pb-0 mobile:pt-9 border-error">
          <ContentSectionPageTitle className="">{privacyPolicySection.title}</ContentSectionPageTitle>
          {privacyPolicySection.items.map((item, key) => (
            <ContentSection key={key} className="" title={item.title} desc={item.desc} />
          ))}
        </div> */}
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;

export async function getServerSideProps({ locale ,req}: { locale: string ,req: GetServerSidePropsContext['req']}) {

  let accessToken;
  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie || '');
    accessToken = cookies.accessToken?.replace(/"/g, '') || null;
  }

  try {
    const promises = [
      fetch(`${STRAPI_BASE_API_URL}${API}${STRAPI_PRIVACY_POLICY}?populate=deep`),
      fetch(`${BASE_API_URL}${AUTH_URL_V1}${GET_PRIVACY_POLICY_DATA}?userType=1&type=1&lan=en`, {
        method: 'GET',
        headers: {
          Authorization: `${accessToken}`,
        },
      }),
    ];

    const listingApiReponses = await Promise.allSettled(promises);

    const response1 = listingApiReponses[0].status === 'fulfilled' ? listingApiReponses[0].value : null;
    const response2 = listingApiReponses[1].status === 'fulfilled' ? listingApiReponses[1].value : null;

    if (!response1 || !response2) {
      return { notFound: true };
    }
    console.log(response2);
    
    const data = await response1.json();  
    const data2 = await response2.json();
    const htmlContent = data2.data.pageContent;
    

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'privacy-policy'])),
        PrivacyData: data.data,
        htmlContent:htmlContent
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
