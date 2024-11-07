'use client';
import { useRouter } from 'next/router';
import React from 'react';
import ForgotPasswordEnterEmail from '@/components/auth/forgot-password/forgot-password-enter-email';
import ResetPasswordLinkSent from '@/components/auth/forgot-password/reset-password-link-sent';
import ChangePasswordForm from '@/components/auth/forgot-password/change-password-form';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ChangePasswordSuccessfully from '@/components/auth/forgot-password/change-password-successfully';
import Link from 'next/link';
import { SchemaItem } from '@/types';
import CustomHeader from '@/components/ui/custom-header';
import Schema from '@/components/html-header';
import PrimaryLogo from '../../public/assets/svg/primary-logo';

const ForgotPassword = () => {
  const router = useRouter();
  const { step } = router.query;

  // return (
  //     <div>{JSON.stringify(query, null, 2)}</div>
  // )

  const organizationSchema: SchemaItem = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    Keywords: 'Forgot-Password',
    name: 'Forgot-Password | Le-offer - The biggest buy & sell marketplace globally in 2024',
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
    <
    // content={ {
    //     heroImage: {
    //       data: "fdsfsd",
    //     },
    //     heading: "string",
    //     trendingSearchText: "string"
    //   }}
    >
      <CustomHeader />
      <Schema item={organizationSchema} />

      <div className={' dark:bg-bg-primary-dark w-full h-screen flex mobile:px-4 flex-col justify-center items-center'}>
                
        <Link href={'/'} className={`sm:mt-20 sm:mb-10 mobile:mt-14 mobile:mb-10  ${step==='5' ? 'hidden' : '' }`}>
          <PrimaryLogo width={127} height={36} primaryColor={'var(--brand-color)'}/>
        </Link>
        {(() => {
          switch (step) {
          //with email
          case '1':
            return <ForgotPasswordEnterEmail />;
          case '2':
            return <ResetPasswordLinkSent />;
          case '3':
            return <ChangePasswordForm />;
          case '4':
            return <ChangePasswordSuccessfully />;
            // case "3":
            // return <ForgotPasswordMain/>

            // with mobile number
            // case "4":
            // return <EnterMobileNumber/>
            // case "5":
            // return <ForgotPasswordOtpForm/>
            // case "6":
            // return <ChangePasswordForm/>

          default:
            return <ForgotPasswordEnterEmail />;
          }
        })()}
      </div>
    </>
  );
};

export default ForgotPassword;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['auth'])),
    },
  };
}
