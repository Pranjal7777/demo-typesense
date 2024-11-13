import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
// import Button from '@/components/Ui/Button'
import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';
import { useTranslation } from 'next-i18next';
const OAuthComponent = dynamic(() => import('@/components/ui/o-auth'));
// import { gumletLoader } from '@/lib/gumlet'
import { IMAGES } from '@/lib/images';
// import Image from 'next/image'
import { SIGN_IN_PAGE, SIGN_UP_PAGE } from '@/routes';
import dynamic from 'next/dynamic';
import SignUpLink from '@/components/ui/signup-link';

const SignInButton = dynamic(() => import('@/components/ui/signin-button'));
// import SignInButton from '@/components/Ui/SignInButton';
// import dynamic from 'next/dynamic'

export type SignUp = {
  signupPrompt: string;
  chooseOptionMessage: string;
  signupWithEmail: string;
  connectWith: string;
  google: string;
  facebook: string;
  alreadyHaveAccount: string;
  alreadyHaveAccountLink: string;
};

const Registration: React.FC = () => {
  const { t } = useTranslation('auth');
  const SignUp: SignUp = t('page.signUp', { returnObjects: true });
  const router = useRouter();

  const handelClick = useCallback(() => {
    router.push(`${SIGN_UP_PAGE}?step=2`);
  }, []);

  const emailIconSrc = useMemo(
    () => ({
      black: `${IMAGES.MAIL_ICON_BLACK}`,
      white: `${IMAGES.MAIL_ICON_WHITE}`,
    }),
    []
  );

  const handleSignInClick = useCallback(() => {
    router.push(SIGN_IN_PAGE);
  }, [router]);

  return (
    <div className=" mobile:px-4  h-full w-full flex flex-col items-center justify-between">
      <div className="  sm:w-[408px]  mobile:w-full flex flex-col items-center justify-start">
        <FormHeader>{SignUp.signupPrompt}</FormHeader>
        <FormSubHeader>{SignUp.chooseOptionMessage}</FormSubHeader>
        <div className="flex w-full items-center justify-between">
          <OAuthComponent />
        </div>
        <SignInButton iconAlt="email_logo" iconSrc={emailIconSrc} onClick={handelClick}>
          {SignUp.signupWithEmail}
        </SignInButton>
      </div>
      <SignUpLink
        linkText={SignUp.alreadyHaveAccountLink}
        onClick={handleSignInClick}
        text={SignUp.alreadyHaveAccount}
      />
    </div>
  );
};

export default React.memo(Registration);
