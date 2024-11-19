
import Layout from '@/components/layout';
import PageBanner from '@/components/ui/page-banner';
import PageHeaderWithBreadcrumb from '@/components/ui/page-header-with-breadcrumb';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
// import ContentSectionPageTitle from '@/components/Ui/ContentSectionPageTitle';
// import ContentSection from '@/components/Sections/ContentSection';
import { HeroSectionType, qaSectionType } from './privacy-policy';
import dynamic from 'next/dynamic';
import { seoProperties } from './about';
import CustomHeader from '@/components/ui/custom-header';
import formatArrayToStrings from '@/helper/functions/format-array-strings';
// import { description } from 'platform';
// import QaSection from '@/components/Sections/QA';
const QaSection = dynamic(() => import('@/components/sections/qa/index'),{ssr:true});

type HeaderBennerSection={
    bannerUrlForMobile:string
    bannerUrlForWeb:string
    headerText:string
    headerDescription:string
    headerDescriptionForMobile:string
}

// type TermsOfServiceSection={
//     title:string,
//     items:{
//         title:string,
//         desc:string[]
//     }[]
// }

type BreadcrumbLinks={
  name:string,
  link:string
}

///////////////////
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
};
///////////////////

const TermsAndService: FC<Props>= ({termsOfServiceData}) =>{
  // console.log(termsOfServiceData);
  

  const {t}=useTranslation('terms-of-service');
  const headerBennerSection = t('page.headerBennerSection', { returnObjects: true }) as HeaderBennerSection;
  const breadcrumbLinks = t('page.breadcrumbLinks', { returnObjects: true }) as BreadcrumbLinks[];
  // const termsOfServiceSection: TermsOfServiceSection = t('page.termsOfServiceSection', { returnObjects: true });
  const strapiSeoData = termsOfServiceData.attributes.seoProperties;
  const keywords = termsOfServiceData?.attributes?.seoProperties?.keywords;
  const joinedString = formatArrayToStrings(keywords);
  return (
    <Layout  excludeHeroSection={true} stickyHeader={true}>
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
      <PageHeaderWithBreadcrumb className='' steps={breadcrumbLinks}></PageHeaderWithBreadcrumb>
      <div className="mt-[50px] md:mt-[69px] relative custom-container mx-auto sm:px-16 mobile:px-4 ">
        {/* <PageBanner 
                bannerUrlForMobile={headerBennerSection.bannerUrlForMobile}
                bannerUrlForWeb={headerBennerSection.bannerUrlForWeb}
                headerText={headerBennerSection.headerText}
                headerDescription={headerBennerSection.headerDescription}
                headerDescriptionForMobile={headerBennerSection.headerDescriptionForMobile}
            /> */}

        {/* new page banner start */}
        <PageBanner
          bannerUrlForMobile={termsOfServiceData?.attributes?.heroSection?.heroImage?.cover_image?.data?.attributes?.url}
          bannerUrlForWeb={termsOfServiceData?.attributes?.heroSection?.heroImage?.cover_image?.data?.attributes?.url}
          headerText={termsOfServiceData?.attributes?.heroSection?.title}
          headerDescription={termsOfServiceData?.attributes?.heroSection?.subtitle}
          headerDescriptionForMobile={headerBennerSection.headerDescriptionForMobile}
        />
        {/* new page banner end */}

        <QaSection description={termsOfServiceData?.attributes?.termsOfServiceSection?.description} title={termsOfServiceData?.attributes?.termsOfServiceSection?.title} data={termsOfServiceData}/>

        {/* <div className='py-12 mobile:pb-0 mobile:pt-9 border-error'>
              <ContentSectionPageTitle className=''>{termsOfServiceSection.title}</ContentSectionPageTitle>
                {
                    termsOfServiceSection.items.map((item,key)=>(

                        <ContentSection key={key} className=''
                            title={item.title}
                            desc={item.desc}
                        />
                    ))
                }
            </div> */}
      </div>
    </Layout>
  );
};

export default TermsAndService;

export async function getStaticProps({ locale }: { locale: string }) {
  const res = await fetch('https://strapi.le-offers.com/api/terms-of-service?populate=deep');
  const data = await res.json();
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common','terms-of-service'])),
      termsOfServiceData: data.data,
    },
  };
}
