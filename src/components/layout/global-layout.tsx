import React, { FC } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Layout.module.css';
import CustomHeader from '../ui/custom-header';
import { appClsx } from '@/lib/utils';
import { ResponseGetAllCategoriesPayload, ResponseGetAllGrandParentCategoriesPayload, Token } from '@/store/types';
import { MyLocationFromIp } from '@/store/types/location-types';
import Schema from '../html-header';
import { SchemaItem } from '@/types';
import { SIGN_IN_PAGE, SIGN_UP_PAGE } from '@/routes';
import Header from '../sections/header';
// import PageHeader from '../sections/page-header';
import Footer from '../sections/footer-section';

export type Props = {
  // content:Content,
  title?: string;
  keywords?: string;
  description?: string;
  tokenFromServer?: Token;
  categories?: ResponseGetAllGrandParentCategoriesPayload;
  categoriesWithChildCategories?: ResponseGetAllCategoriesPayload;
  myLocationFromServer?: MyLocationFromIp;
  children: React.ReactNode;
};

// Define the type for the schema object

const GlobalLayout: FC<Props> = ({ children, categoriesWithChildCategories }) => {
  // const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const { locale } = useRouter();
  const router = useRouter();

  const excludeDefaultHeader = ['auth', SIGN_IN_PAGE, SIGN_UP_PAGE, 'forgotpassword', '500'];
  const excludeDefaultFooter = ['auth', SIGN_IN_PAGE, SIGN_UP_PAGE, 'forgotpassword', '500'];
  // const excludeDefaultPageHeader = ['auth', SIGN_IN_PAGE, SIGN_UP_PAGE, 'forgotpassword', '500', 'blogs'];

  const stickyHeaderWithSearchBox =
    router.pathname.includes('categories') || router.pathname.includes('product') || router.pathname.includes('blogs');

  const mobileHeaderForPdp = router.pathname.includes('blogs');

  const organizationSchema: SchemaItem = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    Keywords: 'Le-Offer',
    name: 'Le-Offer - The biggest buy & sell marketplace globally in 2024',
    description: 'Negotiate and get the best deals , buy direct or trade your products for another one.',
    url: 'https://webv2.le-offers.com/',
    logo: 'https://leoffer-media.s3.ap-south-1.amazonaws.com/og_image_36021e5b9a.svg',
    brand: 'Appscrip',
    address: ' 8530 Colonial Pl',
    city: 'Duluth',
    state: 'Georgia',
    country: 'United States Of America',
    currency: 'USD',
    zipcode: '30097',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-440-212-988',
      email: 'sales@appscrip.com',
    },
    sameAs: 'https://www.facebook.com/',
  };

  return (
    <div dir={locale === 'ar' ? 'rtl' : undefined}>
      <CustomHeader />
      <Schema item={organizationSchema} />
      {!excludeDefaultHeader.some((substring) => router.pathname.includes(substring)) && (
        <Header
          categoriesWithChildCategories={categoriesWithChildCategories}
          stickyHeaderWithSearchBox={stickyHeaderWithSearchBox}
        />
      )}
      {/* {!excludeDefaultPageHeader.some((substring) => router.pathname.includes(substring)) && (
        <PageHeader
          // content={content}
          stickyHeaderWithSearchBox={stickyHeaderWithSearchBox}
          handleGetLocationHelper={() => {}}
          handleRemoveLocationHelper={() => {}}
        />
      )} */}

      <div className={styles.container}>
        <main
          className={appClsx(
            `${mobileHeaderForPdp && 'mobile:mt-[68px] mt-[138px]'} ${
              stickyHeaderWithSearchBox && !mobileHeaderForPdp && 'mobile:mt-[134px] mt-[138px]'
            } dark:bg-bg-primary-dark w-full h-full mx-auto overflow-hidden`
          )}
        >
          {children}
        </main>
      </div>

      {!excludeDefaultFooter.some((substring) => router.pathname.includes(substring)) && (
        <footer>
          {''}
          <Footer />
          {''}
        </footer>
      )}
    </div>
  );
};

export default GlobalLayout;
