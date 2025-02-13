
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useLayoutEffect } from 'react';
const LoginWithEmailAndPassword = dynamic(() => import('@/components/auth/login/login-with-email-and-password'), {
  ssr: false,
});
const LoginWithPhone = dynamic(() => import('@/components/auth/login/login-with-phone'), { ssr: false });
const OTPForm = dynamic(() => import('@/components/auth/otp-form'), { ssr: false });
const Login = dynamic(() => import('@/components/auth/login/index'), { ssr: false });
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Schema from '@/components/html-header';
import { SchemaItem } from '@/types';
import CustomHeader from '@/components/ui/custom-header';
const PrimaryLogo = dynamic(() => import('../../public/assets/svg/primary-logo'), { ssr: false });
const DownArrowRoundedEdge = dynamic(() => import('../../public/assets/svg/down-arrow-rounded-edge'), { ssr: false });
const CloseIcon = dynamic(() => import('../../public/assets/svg/close-icon'), { ssr: false });
import { useTheme } from '@/hooks/theme';
import { GetServerSidePropsContext } from 'next';
import cookie from 'cookie';
import { getGuestTokenFromServer } from '@/helper/get-guest-token-from-server';
import { setGuestTokenDispatch } from '@/store/slices/auth-slice';
import { Token } from '@/store/types';
import { useDispatch } from 'react-redux';

const Auth = ({ token }: { token: Token | null }) => {
  const router = useRouter();
  const { step } = router.query;
  const { theme } = useTheme();
  const dispatch = useDispatch();
    useLayoutEffect(() => {
      if(token){
        dispatch(setGuestTokenDispatch(token));
      }
  }, [token]);

  const organizationSchema: SchemaItem = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    Keywords: 'Login',
    name: 'Login | Le-offer - The biggest buy & sell marketplace globally in 2024',
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
  const closeIconHandler = () => {
    router.push('/');
  };
  const backIconHandler = () => {
    router.back();
  };
  useEffect(() => {
    localStorage.removeItem('auth_email');
  }, []);
  return (
    <>
      <CustomHeader />
      <Schema item={organizationSchema} />
      <div className={'h-screen max-h-screen overflow-hidden flex flex-col items-center'}>
        {router.pathname.includes('/login') && (step === undefined || step == '1') ? (
          <div className="md:hidden">
            <CloseIcon
              primaryColor="#FFF"
              height={'14'}
              width={'14'}
              className="hidden dark:inline-block md:hidden absolute right-4 top-4"
              onClick={closeIconHandler}
            />
            <CloseIcon
              height="14"
              width="14"
              className="dark:hidden md:hidden absolute right-4 top-4"
              onClick={closeIconHandler}
            />
          </div>
        ) : null}
        {router.pathname.includes('/login') && step == '3' ? (
          <div className="md:hidden">
            <DownArrowRoundedEdge
              onClick={backIconHandler}
              height="16px"
              width="14px"
              className="hidden dark:inline-block rotate-90 absolute left-4 top-4 md:hidden"
              primaryColor="#FFF"
            />
            <DownArrowRoundedEdge
              onClick={backIconHandler}
              height="16px"
              width="14px"
              className=" dark:hidden rotate-90 absolute left-4 top-4 md:hidden"
              primaryColor="#202020"
            />
          </div>
        ) : null}
        <section
          role="button"
          onClick={() => router.push('/')}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className={`h-[15vh] flex justify-center items-end cursor-pointer sm:mb-10  mobile:mb-[38px]  ${
            step === '5' ? 'hidden' : ''
          } cursor-pointer`}
        >
          <PrimaryLogo
            width={127}
            height={36}
            primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
            className="absolute top-[40px]"
          />
        </section>
        {(() => {
          switch (step) {
            case '1':
              return <Login />;
            case '2':
              return <LoginWithPhone />;
            case '3':
              return <OTPForm />;
            case '4':
              return <LoginWithEmailAndPassword />;
            default:
              return <Login />;
          }
        })()}
      </div>
    </>
  );
};

export default Auth;

export async function getServerSideProps({ locale, req }: { locale: string; req: GetServerSidePropsContext['req']; }) {
  let accessToken;
  let token = null;
  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie || '');
    accessToken = cookies.accessToken?.replace(/"/g, '') || null;
  }
  if (!accessToken) {
    const guestToken = await getGuestTokenFromServer();
    token = guestToken.data.token;
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['auth'])),
      ...(token ? { token: token } : null),
    },
  };
}
