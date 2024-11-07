import PageHeaderWithBreadcrumb from '@/components/ui/page-header-with-breadcrumb';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { memo, useCallback, useMemo, useState } from 'react';
// import { useTranslation } from 'next-i18next';
import PageBanner from '@/components/ui/page-banner';
import ContentSectionPageTitle from '@/components/ui/content-section-page-title';
import Description from '@/components/ui/description';

// import { FAQ_SECTION } from '@/api/endpoints';
import dynamic from 'next/dynamic';
import Layout from '@/components/layout';
import { useTranslation } from 'next-i18next';
import CustomHeader from '@/components/ui/custom-header';
import { seoProperties } from './about';
import formatArrayToStrings from '@/helper/functions/format-array-strings';

const FaqCard = dynamic(() => import('@/components/sections/faq/faq-card'));

export type HeroSectionTypes = {
  id: number;
  title: string;
  subtitle: string;
  heroImage: {
    id: number;
    alt: string;
    cover_image: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
};

export type LinksTypes = {
  id: number;
  name: string;
  link: string;
};

type FaqSectionTypes = {
  id: number;
  title: string;
  description: string;
};

type QuestionAndAnswersTypes = {
  id: number;
  question: string;
  answer: string;
};

type BuyerSectionTypes = {
  id: number;
  name: string;
  questionsAndAnswers: QuestionAndAnswersTypes[];
};

type SellerSectionTypes = {
  id: number;
  name: string;
  questionsAndAnswers: QuestionAndAnswersTypes[];
};

type faqDataTypes = {
  heroSection: HeroSectionTypes;
  FAQSection: FaqSectionTypes;
  BuyersSection: BuyerSectionTypes;
  SellersSection: SellerSectionTypes;
  // breadCrumbLinks: LinksTypes[];
  seoProperties?: seoProperties;
};
type BreadcrumbLinks = {
  name: string;
  link: string;
};

export interface FaqProps {
  faqData: faqDataTypes;
}

const Faq: React.FC<FaqProps> = ({ faqData }) => {
  const { t } = useTranslation('faq');
  // const headerBennerSection: HeaderBennerSection = t('page.headerBennerSection', { returnObjects: true });
  const breadcrumbLinks: BreadcrumbLinks[] = t('page.breadcrumbLinks', { returnObjects: true });
  // const faqSection: FaqSection = t('page.faqSection', { returnObjects: true });

  const [isBuyerOrSeller, setIsBuyerOrSeller] = useState(false);
  const [openCard, setOpenCard] = useState<number | null>(null);
  const strapiSeoData = faqData?.seoProperties;
  const handleCardClick = useCallback((id: number) => {
    setOpenCard((prev) => (prev === id ? null : id));
  }, []);

  const buyerQuestions = useMemo(
    () => faqData?.BuyersSection?.questionsAndAnswers,
    [faqData?.BuyersSection?.questionsAndAnswers]
  );

  const sellerQuestions = useMemo(
    () => faqData?.SellersSection?.questionsAndAnswers,
    [faqData?.SellersSection?.questionsAndAnswers]
  );
  const keywords = faqData?.seoProperties?.keywords;
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

      <PageHeaderWithBreadcrumb className=" " steps={breadcrumbLinks}></PageHeaderWithBreadcrumb>
      {faqData ? (
        <>
          {/* {faqData?.breadCrumbLinks?.length > 0 ? (
            <PageHeaderWithBreadcrumb className="" steps={faqData?.breadCrumbLinks}></PageHeaderWithBreadcrumb>
          ) : null} */}
          <div className=" mt-[50px] sm:mt-[69px] relative custom-container mx-auto sm:px-16 mobile:px-4">
            {/* <PageBanner
          bannerUrlForMobile={headerBennerSection.bannerUrlForMobile}
          bannerUrlForWeb={headerBennerSection.bannerUrlForWeb}
          headerText={headerBennerSection.headerText}
          headerDescription={headerBennerSection.headerDescription}
          headerDescriptionForMobile={headerBennerSection.headerDescriptionForMobile}
        /> */}
            {faqData?.heroSection ? (
              <PageBanner
                bannerUrlForMobile={faqData?.heroSection?.heroImage?.cover_image?.data?.attributes?.url}
                bannerUrlForWeb={faqData?.heroSection?.heroImage?.cover_image?.data?.attributes?.url}
                headerText={faqData?.heroSection?.title}
                headerDescription={faqData?.heroSection?.subtitle}
              />
            ) : null}

            <div className="py-12 pb-20 mobile:py-6 border-error">
              {faqData?.FAQSection ? (
                <>
                  <ContentSectionPageTitle className="mobile:mb-3">
                    {faqData?.FAQSection?.title}
                  </ContentSectionPageTitle>

                  <Description className="mobile:mb-5" desc={[faqData?.FAQSection?.description]} />
                </>
              ) : null}

              <div className="flex flex-col items-center justify-center">
                <div className="flex mb-20 mobile:mb-3 items-center justify-between h-[60px] mobile:h-[50px] rounded-full dark:bg-bg-tertiary-dark border-border-denary-light dark:border-border-primary-dark bg-bg-octonary-light  max-w-[400px] mobile:max-w-[350px] w-full border-2">
                  <button
                    className={`w-[50%] h-full rounded-full transition-all ease-in duration-300 dark:text-text-primary-dark ${
                      isBuyerOrSeller ? 'bg-brand-color text-text-secondary-light' : 'text-text-primary-light'
                    }`}
                    onClick={() => setIsBuyerOrSeller(true)}
                  >
                    {faqData?.BuyersSection?.name}
                  </button>
                  <button
                    className={`w-[50%] h-full rounded-full transition-all ease-in duration-300 dark:text-text-primary-dark  ${
                      !isBuyerOrSeller ? 'bg-brand-color text-text-secondary-light' : 'text-text-primary-light'
                    }`}
                    onClick={() => setIsBuyerOrSeller(false)}
                  >
                    {faqData?.SellersSection?.name}
                  </button>
                </div>
                {faqData.BuyersSection && faqData.SellersSection && (
                  <div className="w-full flex justify-center mobile:justify-start">
                    <div className="max-w-[792px]">
                      {(isBuyerOrSeller ? buyerQuestions : sellerQuestions).map((item) => (
                        <FaqCard
                          key={item.id}
                          id={item.id}
                          onClick={handleCardClick}
                          isOpen={item.id === openCard}
                          question={item.question}
                          answer={item.answer}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <NoTFound status={404} error={'Data not found'} />
      )}
    </Layout>
  );
};

export default memo(Faq);

export async function getStaticProps({ locale }: { locale: string }) {
  let faqData = null;
  try {
    const response = await fetch('https://strapi.le-offers.com/api/faq-section?populate=deep');
    // const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/${FAQ_SECTION}?populate=deep`);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    faqData = data?.data?.attributes;
  } catch (error) {
    console.log('Error while fetching:', error);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'faq'])),
      faqData,
    },
  };
}

export const NoTFound = ({ status = 404, error }: { status: number; error: string }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-text-primary-light dark:text-white text-4xl font-bold">{status}</h2>
        <h2 className="text-text-primary-light dark:text-white text-4xl font-bold">{error}</h2>
      </div>
    </>
  );
};
