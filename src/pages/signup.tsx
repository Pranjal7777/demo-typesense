import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import Registration from '@/components/auth/registration/index';
const RegisterWithEmailAndPassword = dynamic(
  () => import('@/components/auth/registration/register-with-email-and-password'),
  { ssr: true }
);
const RegistrationDetails = dynamic(() => import('@/components/auth/registration/registration-details'), { ssr: true });
const OtpForm = dynamic(() => import('@/components/auth/otp-form'), { ssr: true });
const ThankYouPage = dynamic(() => import('@/components/auth/registration/thank-you-page'), { ssr: true });
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CustomHeader from '@/components/ui/custom-header';
import Schema from '@/components/html-header';
import { SchemaItem } from '@/types';
import PrimaryLogo from '../../public/assets/svg/primary-logo';
import DownArrowRoundedEdge from '../../public/assets/svg/down-arrow-rounded-edge';
import CloseIcon from '../../public/assets/svg/close-icon';

const Auth = () => {
  const router = useRouter();
  const { step } = router.query;

  const organizationSchema: SchemaItem = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    Keywords: 'Sign up',
    name: 'Sign up | Le-offer - The biggest buy & sell marketplace globally in 2024',
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      router.push('/');
    }
  };
  const closeIconHandler =()=>{
    router.push('/');
  };

  const query = useMemo(()=>{
    if(step =='2'){
      return '/signup';
    }
    else if(step == '3'){
      return '/signup?step=2';
    }
    else if(step == '4'){
      return '/signup?step=3';
    }
    else if(step== '5'){
      return '/signup?step=4'; 
    }
    else{
      return '/';
    }
  },[step]);

  const backIconHandler = ()=>{
    router.push(query);
  };

  return (
    <>
      <CustomHeader />
      <Schema item={organizationSchema} />
      <div className={'h-screen overflow-scroll flex flex-col items-center'}>
        {
          (router.pathname.includes('/signup')  && step === undefined )? <div className='md:hidden'>
            <CloseIcon primaryColor='#FFF' height='14px' width='14px' className='hidden cursor-pointer dark:inline-block absolute right-4 top-4 ' onClick={closeIconHandler}/>
            <CloseIcon height='14px' width='14px' className='dark:hidden cursor-pointer absolute right-4 top-4' onClick={closeIconHandler}/>
          </div>
            : null
        }
        {
          (router.pathname.includes('/signup') && step !== undefined )? <div className='md:hidden'>
            <DownArrowRoundedEdge onClick={backIconHandler}  height='16px' width='14px' className='hidden cursor-pointer dark:inline-block rotate-90 absolute left-4 top-4' primaryColor='#FFF'/>
            <DownArrowRoundedEdge onClick={backIconHandler}  height='16px' width='14px' className=' dark:hidden cursor-pointer rotate-90 absolute left-4 top-4' primaryColor='#202020'/>        
          </div>
            : null
        }
        {/* <DownArrowRoundedEdge  height='16px' width='14px' className='hidden dark:inline-block rotate-90 absolute left-4 top-4 sm:hidden' primaryColor='#FFF'/>
        <DownArrowRoundedEdge  height='16px' width='14px' className=' dark:hidden rotate-90 absolute left-4 top-4 sm:hidden' primaryColor='#202020'/> */}
        <section
          role="button"
          onClick={() => router.push('/')}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className={`h-[15vh] flex justify-center items-end cursor-pointer sm:mb-10  mobile:mb-[38px]  ${step === '5' ? 'hidden' : ''}`}
        >
          <PrimaryLogo width={127} height={36} primaryColor={'var(--brand-color)'} className='absolute top-[40px]'/>
        </section>
        {(() => {
          switch (step) {
          case '1':
            return <Registration />;
          case '2':
            return <RegisterWithEmailAndPassword />;
          case '3':
            return <RegistrationDetails />;
          case '4':
            return <OtpForm />;
          case '5':
            return <ThankYouPage />;
          default:
            return <Registration />;
          }
        })()}
      </div>
    </>
  );
};

export default Auth;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['auth'])),
    },
  };
}
