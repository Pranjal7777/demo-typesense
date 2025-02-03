import PageHeaderWithBreadcrumb from '@/components/ui/page-header-with-breadcrumb';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { memo, useCallback, useMemo, useState } from 'react';
import PageBanner from '@/components/ui/page-banner';
import ContentSectionPageTitle from '@/components/ui/content-section-page-title';
import Description from '@/components/ui/description';
import dynamic from 'next/dynamic';
import Layout from '@/components/layout';
import { useTranslation } from 'next-i18next';
import CustomHeader from '@/components/ui/custom-header';
import { seoProperties } from './about';
import { HIDE_SELLER_FLOW, STRAPI_ACCESS_TOKEN, STRAPI_BASE_URL } from '@/config';
import FAQ from '@/components/sections/faq';
import { SeoData } from '@/store/types/strapi-seo-types';

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
  faqSeoData: {
    data: {
      seo: SeoData;
    };
  };
}

const Faq: React.FC<FaqProps> = ({ faqData, faqSeoData }) => {

  const { t } = useTranslation('faq');
  const breadcrumbLinks = t('page.breadcrumbLinks', { returnObjects: true }) as BreadcrumbLinks[];
  const seoData = faqSeoData?.data?.seo;
  const [isBuyerOrSeller, setIsBuyerOrSeller] = useState(false);
  const [openCard, setOpenCard] = useState<number | null>(null);
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

  return (
    <>
      <CustomHeader
        title={seoData?.title}
        description={seoData?.description}
        image={seoData?.image?.url}
        url={seoData?.url}
      />
      <Layout excludeHeroSection={true} stickyHeader={true}>
        <PageHeaderWithBreadcrumb className="pl-0 mobile:pl-0" steps={breadcrumbLinks}></PageHeaderWithBreadcrumb>
        {faqData ? (
          <>
            <div className=" mt-[40px] sm:mt-[69px] relative custom-container mx-auto sm:px-16 mobile:px-4">
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

                    <Description className="mb-0" desc={[faqData?.FAQSection?.description]} />
                  </>
                ) : null}

                {!HIDE_SELLER_FLOW && (
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex my-9 md:my-16  items-center justify-between h-[60px] mobile:h-[50px] rounded-full dark:bg-bg-tertiary-dark border-border-denary-light dark:border-border-primary-dark bg-bg-octonary-light  max-w-[400px] mobile:max-w-[350px] w-full border-2">
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
                )}
                {HIDE_SELLER_FLOW && <FAQ />}
              </div>
            </div>
          </>
        ) : (
          <NoTFound status={404} error={'Data not found'} />
        )}
      </Layout>
    </>
  );
};

export default memo(Faq);

export async function getStaticProps({ locale }: { locale: string }) {
  let faqData = null;
  let faqSeoData = {};
  try {
     const promises = [
       fetch(`https://strapi.le-offers.com/api/faq-section?populate=deep`),
       fetch(`${STRAPI_BASE_URL}/api/faq?populate=seo.image`, {
         headers: { Authorization: `${STRAPI_ACCESS_TOKEN}` },
       }),
     ];

     const listingApiReponses = await Promise.allSettled(promises);

     const response1 = listingApiReponses[0].status === 'fulfilled' ? listingApiReponses[0].value : null;
     const response2 = listingApiReponses[1].status === 'fulfilled' ? listingApiReponses[1].value : null;

     if (response1) {
       const faqResult = await response1?.json();
       faqData = faqResult?.data?.attributes;
     }
     if (response2) {
       faqSeoData = await response2?.json();
     }  
  } catch (error) {
    console.log('Error while fetching:', error);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'faq'])),
      faqData,
      faqSeoData
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
