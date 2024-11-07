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
};
//////////////////

const About: FC<Props> = ({ aboutData }) => {
  // function joinKeywords(keywordsObj: Record<string, string>): string {
  //   if (!keywordsObj) {
  //     return '';
  //   }

  //   const valuesArray = Object.values(keywordsObj);
  //   const joinedString = valuesArray.join(', ');

  //   return joinedString;
  // }

  const keywords = aboutData?.attributes?.seoProperties?.keywords;
  const joinedString = formatArrayToStrings(keywords);
  const { t } = useTranslation('about');
  // const headerBennerSection: HeaderBennerSection = t('page.headerBennerSection', { returnObjects: true });
  const breadcrumbLinks = t('page.breadcrumbLinks', { returnObjects: true }) as BreadcrumbLinks[];
  const aboutSection = t('page.aboutSection', { returnObjects: true }) as AboutSection;
  // const ourServiceSection: OurServiceSection = t('page.ourServiceSection', { returnObjects: true });
  // const meetourTeamSection: MeetourTeamSection = t('page.meetourTeamSection', { returnObjects: true });
  const strapiSeoData = aboutData.attributes.seoProperties;

  return (
    <Layout excludeHeroSection={true} stickyHeader={true}>
      {/* @ts-ignore */}
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
      <div className=" mt-[50px] sm:mt-[69px]  relative custom-container mx-auto sm:px-16 mobile:px-4 ">
        {/* <PageBanner 
                bannerUrlForMobile={headerBennerSection.bannerUrlForMobile}
                bannerUrlForWeb={headerBennerSection.bannerUrlForWeb}
                headerText={headerBennerSection.headerText}
                headerDescription={headerBennerSection.headerDescription}
                headerDescriptionForMobile={headerBennerSection.headerDescriptionForMobile}
            /> */}
        <PageBanner
          bannerUrlForMobile={aboutData?.attributes?.heroSection?.heroImage?.cover_image?.data?.attributes?.url}
          bannerUrlForWeb={aboutData?.attributes?.heroSection?.heroImage?.cover_image?.data?.attributes?.url}
          headerText={aboutData?.attributes?.heroSection?.title}
          headerDescription={aboutData?.attributes?.heroSection?.subtitle}
          headerDescriptionForMobile={aboutData?.attributes?.heroSection?.subtitle}
        />

        <div className="sm:py-4 mt-7 lg:py-12 mobile:pb-0 mobile:pt-9 border-error">
          <ContentSectionPageTitle className="">{aboutSection.aboutSectionTitle}</ContentSectionPageTitle>
          {/* <ContentSection className='max-w-[1063px] mx-auto'
                title={aboutSection.items.title}
                desc={aboutSection.items.desc}
                sectionTitleClassName='text-center pb-8 mobile:pb-4 text-[28px] mobile:text-xl'
              /> */}
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
  );
};

export default About;

export async function getStaticProps({ locale }: { locale: string }) {
  // const res = await fetch('https://strapi.le-offers.com/api/about-le-offer?populate=deep');
  const res = await fetch('https://strapi.le-offers.com/api/about-us?populate=deep');
  const data = await res.json();
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'about'])),
      aboutData: data.data,
    },
  };
}
