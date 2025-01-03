import Layout from '@/components/layout';
import PageBanner from '@/components/ui/page-banner';
import PageHeaderWithBreadcrumb from '@/components/ui/page-header-with-breadcrumb';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
// import ContentSection from '@/components/Sections/ContentSection';
import ContentSectionPageTitle from '@/components/ui/content-section-page-title';
import Link from 'next/link';
import SectionTitle from '@/components/ui/section-title';
import PageDescription from '@/components/ui/page-description';
import Image from 'next/image';
import AboutTextContent from '@/components/sections/about-text-content';
import { HeroSectionType } from './privacy-policy';
import CustomHeader from '@/components/ui/custom-header';
import formatArrayToStrings from '@/helper/functions/format-array-strings';
import { PROJECT_NAME, STRAPI_ACCESS_TOKEN, STRAPI_BASE_URL } from '@/config';
import { SeoData } from '@/store/types/strapi-seo-types';

type AboutSection = {
  aboutSectionTitle: string;
  items: {
    title: string;
    desc: string[];
  };
};
// type OurServiceSection={
//   ourServiceLink:string
//   title:string
//   desc:string
//   ourServiceImage:string
// }
// type MeetourTeamSection={
//   title:string
//   items:{
//     image:string,
//     name:string,
//     designation:string
//   }[]
// }

// type HeaderBennerSection={
//   bannerUrlForMobile:string
//   bannerUrlForWeb:string
//   headerText:string
//   headerDescription:string
//   headerDescriptionForMobile:string
// }

type BreadcrumbLinks = {
  name: string;
  link: string;
};
///////////////////
export interface sideImageType {
  image: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  alt: string;
}

export interface ourServiceSectionType {
  ourServiceLink?: {
    text?: string;
    url?: string;
  };
  title?: string;
  description?: string;
  sideImage?: sideImageType;
}
export interface team_info_sectionType {
  title?: string;
  teamMemberDetails?: {
    designation?: string;
    name?: string;
    profile: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  }[];
}

export interface metaImage {
  data: {
    attributes: {
      url: string;
    };
  };
}
export interface twitterCard {
  twitterURL?: string;
  twitterTitle: string;
  twitterImageAlt?: string;
  twitterImageURL?: string;
}
export interface seoProperties {
  keywords?:
    | {
        [key: string]: string;
      }
    | any;
  metaTitle: string;
  metaDesc: string;
  schemaDesc: string;
  schemaName: string;
  twitterCard: twitterCard;
  metaImage: metaImage;
}
export interface aboutDataAttributes {
  heroSection: HeroSectionType;
  aboutUsSection?: {
    title?: string;
    aboutDescription: [];
  };
  ourServiceSection?: ourServiceSectionType;
  seoProperties?: seoProperties;
  team_info_section?: team_info_sectionType;
}

export interface termsData {
  attributes: aboutDataAttributes;
}
export type Props = {
  aboutData: termsData;
  aboutSeoData: {
    data: {
      seo: SeoData;
    };
  };
};
//////////////////

const About: FC<Props> = ({ aboutData , aboutSeoData}) => {
  const { t } = useTranslation('about');
  const breadcrumbLinks = t('page.breadcrumbLinks', { returnObjects: true, projectName: PROJECT_NAME }) as BreadcrumbLinks[];
  const aboutSection = t('page.aboutSection', { returnObjects: true, projectName: PROJECT_NAME }) as AboutSection;
  const seoData = aboutSeoData?.data?.seo;
  return (
    <>
        <CustomHeader
        title={seoData?.title}
        description={seoData?.description}
        image={seoData?.image?.url}
        url={seoData?.url}
      />
      <Layout excludeHeroSection={true} stickyHeader={true}>
      <PageHeaderWithBreadcrumb className="" steps={breadcrumbLinks}></PageHeaderWithBreadcrumb>
      <div className=" mt-[50px] sm:mt-[69px]  relative custom-container mx-auto sm:px-16 mobile:px-4 ">
        <PageBanner
          bannerUrlForMobile={aboutData?.attributes?.heroSection?.heroImage?.cover_image?.data?.attributes?.url}
          bannerUrlForWeb={aboutData?.attributes?.heroSection?.heroImage?.cover_image?.data?.attributes?.url}
          headerText={aboutData?.attributes?.heroSection?.title}
          headerDescription={aboutData?.attributes?.heroSection?.subtitle}
          headerDescriptionForMobile={aboutData?.attributes?.heroSection?.subtitle}
        />

        <div className="sm:py-4 mt-7 lg:py-12 mobile:pb-0 mobile:pt-9 border-error">
          <ContentSectionPageTitle className="">{aboutSection.aboutSectionTitle}</ContentSectionPageTitle>
          {/* new ontent section */}
          <AboutTextContent
            className="max-w-[1063px] mx-auto"
            title={aboutData?.attributes?.aboutUsSection?.title}
            desc={aboutData?.attributes?.aboutUsSection?.aboutDescription}
            sectionTitleClassName="text-center pb-8 mobile:pb-4 text-[28px] mobile:text-xl"
          />
          {/* new ontent section end */}
        </div>

        <div className="sm:py-4 lg:py-12 mobile:pb-0 mobile:pt-0 mobile:text-center sm:text-center lg:text-left flex sm:flex-col lg:flex-row mobile:flex-col items-center justify-between  border-error">
          <div className="max-w-[689px] flex-1">
            <Link
              href={aboutData?.attributes?.ourServiceSection?.ourServiceLink?.url || '#'}
              className="text-lg font-medium  text-brand-color"
            >
              {aboutData?.attributes?.ourServiceSection?.ourServiceLink?.text}
            </Link>
            <h2 className="mt-[6px] !text-[44px] mobile:!text-2xl !font-bold lg:max-w-[507px] mobile:max-w-full sm:max-w-full dark:text-text-primary-dark">
              {aboutData?.attributes?.ourServiceSection?.title}
            </h2>
            <PageDescription className="mobile:hidden  sm:hidden lg:inline mt-4 !text-base !font-normal">
              {aboutData?.attributes?.ourServiceSection?.description}
            </PageDescription>
          </div>

          <div className="flex-2 mobile:mt-4">
            <Image
              width={540}
              height={282}
              className=""
              src={aboutData?.attributes?.ourServiceSection?.sideImage?.image?.data?.attributes?.url || ''}
              alt={aboutData?.attributes?.ourServiceSection?.sideImage?.alt || 'side_image'}
            />
          </div>
          <div className="mobile:inline sm:inline lg:hidden">
            <PageDescription className="mt-4 !text-base !font-normal">
              {aboutData?.attributes?.ourServiceSection?.description}
            </PageDescription>
          </div>
        </div>

        <div className="sm:py-4 lg:py-12 mobile:py-9 flex flex-col items-center justify-center  border-error">
          <SectionTitle className=" mb-8 mobile:mb-4">{aboutData?.attributes?.team_info_section?.title}</SectionTitle>
          <div className=" border-error w-full flex items-center justify-center flex-wrap gap-x-11 gap-y-8 mobile:gap-5">
            {aboutData?.attributes?.team_info_section?.teamMemberDetails?.map((item, key) => (
              <div
                key={key}
                className=" max-w-[190px] mobile:max-w-[161px] w-full h-[268px] mobile:h-[231px] flex flex-col items-center justify-between"
              >
                <Image
                  width={190}
                  height={190}
                  className="mobile:max-h-[162px] mobile:max-w-[162px]"
                  src={item?.profile.data?.attributes?.url}
                  alt="team_images"
                />
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-xl mobile:text-base font-semibold dark:text-text-primary-dark">{item.name}</h3>
                  <h3 className="mt-1 text-base mobile:text-sm font-normal text-text-tertiary-light dark:text-text-tertiary-dark">
                    {item.designation}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
    </>
  );
};

export default About;

export async function getStaticProps({ locale }: { locale: string }) {
  let aboutData = {};
  let aboutSeoData = {};
  try {
    const promises = [
      fetch(`https://strapi.le-offers.com/api/about-us?populate=deep`),
      fetch(`${STRAPI_BASE_URL}/api/about-us?populate=seo.image`, {
        headers: { Authorization: `${STRAPI_ACCESS_TOKEN}` },
      }),
    ];

    const listingApiReponses = await Promise.allSettled(promises);

    const response1 = listingApiReponses[0].status === 'fulfilled' ? listingApiReponses[0].value : null;
    const response2 = listingApiReponses[1].status === 'fulfilled' ? listingApiReponses[1].value : null;

    if (response1) {
     const aboutResult = await response1?.json();
     aboutData = aboutResult?.data;
    }
    if (response2) {
      aboutSeoData = await response2?.json();
    }  
  } catch (error) {
    console.log(error);
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'about'])),
      aboutData: aboutData || {},
      aboutSeoData: aboutSeoData || {},
    },
  };
}
