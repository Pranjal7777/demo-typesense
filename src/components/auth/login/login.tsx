import dynamic from 'next/dynamic';
import OAuth from '@/components/ui/o-auth';
import { IMAGES } from '@/lib/images';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { SIGN_IN_PAGE, SIGN_UP_PAGE } from '@/routes';
const FormSubHeader = dynamic(() => import('@/components/form/form-sub-header'));
const FormHeader = dynamic(() => import('@/components/form/form-header'));
const SignInButton = dynamic(() => import('@/components/ui/signin-button'));
const SignUpLink = dynamic(() => import('@/components/ui/signup-link'));
// import MobileIcon from '../../../../public/assets/svg/mobile_icon';

export type login = {
  signInPrompt: string;
  chooseOptionMessage: string;
  google: string;
  facebook: string;
  signInWithPhone: string;
  signInWithEmail: string;
  doNotHaveAccount: string;
  doNotHaveAccountLink: string;
};

const Login: React.FC = () => {
  const router = useRouter();

  const { t } = useTranslation('auth');
  const login: login = t('page.signIn', { returnObjects: true });

  const handleLoginWithPhoneClick = useCallback(() => {
    router.push(`${SIGN_IN_PAGE}?step=2`);
  }, [router]);

  const handleLoginWithEmailClick = useCallback(() => {
    router.push(`${SIGN_IN_PAGE}?step=4`);
  }, [router]);

  const handleSignUpClick = useCallback(() => {
    router.push(SIGN_UP_PAGE);
  }, [router]);

  const phoneIconSrc = useMemo(
    () => ({
      black: `${IMAGES.MOBILE_PHONE_ICON_BLACK}`,
      white: `${IMAGES.MOBILE_PHONE_ICON_WHITE}`,
    }),
    []
  );

  const emailIconSrc = useMemo(
    () => ({
      black: `${IMAGES.MAIL_ICON_BLACK}`,
      white: `${IMAGES.MAIL_ICON_WHITE}`,
    }),
    []
  );

  useEffect(() => {
    router.prefetch(SIGN_IN_PAGE);
    router.prefetch(SIGN_UP_PAGE);
  }, [router]);

  return (
    <>
      <div className="mobile:px-4 sm:max-w-[408px] w-full mobile:w-full h-full flex flex-col items-center justify-start">
        <FormHeader>{login.signInPrompt}</FormHeader>
        <FormSubHeader>{login.chooseOptionMessage}</FormSubHeader>

        <div className=" flex w-full items-center justify-between">
          <OAuth />
        </div>

        <SignInButton onClick={handleLoginWithPhoneClick} iconSrc={phoneIconSrc} iconAlt="phone_icon">
          {login.signInWithPhone}
        </SignInButton>

        <SignInButton onClick={handleLoginWithEmailClick} iconSrc={emailIconSrc} iconAlt="mail_icon">
          {login.signInWithEmail}
        </SignInButton>
      </div>

      <SignUpLink onClick={handleSignUpClick} text={login.doNotHaveAccount} linkText={login.doNotHaveAccountLink} />
    </>
  );
};

export default React.memo(Login);
