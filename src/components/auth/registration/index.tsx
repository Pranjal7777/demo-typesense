import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '@/components/ui/button';
import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';
import { useTranslation } from 'next-i18next';
const OAuthComponent = dynamic(() => import('@/components/ui/o-auth'), { ssr: false });
// import OAuth from '@/components/Ui/OAuth'
// import { gumletLoader } from '@/lib/gumlet';
// import { IMAGES } from '@/lib/images';
// import Image from 'next/image';
import { SIGN_IN_PAGE, SIGN_UP_PAGE } from '@/routes';
import dynamic from 'next/dynamic';
import MailIcon from '../../../../public/assets/svg/mail-icon';
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
}


const Registration = () => {
  const { t } = useTranslation('auth');
  const SignUp: SignUp = t('page.signUp', { returnObjects: true });
  const router = useRouter();
  // const { page,step } = router.query;
  // const { page } = router.query;

  const handelClick = () => {
    router.push(`${SIGN_UP_PAGE}?step=2`);
  };

  return (
    <div className=' mobile:px-4  h-full w-full flex flex-col items-center justify-between'>

      <div className='  sm:w-[408px]  mobile:w-full flex flex-col items-center justify-start'>

        <FormHeader>{SignUp.signupPrompt}</FormHeader>
        <FormSubHeader>{SignUp.chooseOptionMessage}</FormSubHeader>

        <div className='flex w-full items-center justify-between'>
          <OAuthComponent />
        </div>

        <Button className='text-[16px]' buttonType='tertiary' onClick={() => handelClick()}>{SignUp.signupWithEmail}
          {/* <Image className="absolute left-3 dark:hidden inline" width={20} height={20} src={`${IMAGES.MAIL_ICON_BLACK}`} loader={gumletLoader} loading='lazy' alt="facebook_logo" />
          <Image className="absolute left-3 dark:inline hidden" width={20} height={20} src={`${IMAGES.MAIL_ICON_WHITE}`} loader={gumletLoader} alt="facebook_logo" loading='lazy' /> */}
          <MailIcon  primaryColor={'#202020'} className="absolute left-3 dark:hidden inline"/>
          <MailIcon primaryColor={'#FFFFFF'} className="absolute left-3 hidden dark:inline"/>
        </Button>

      </div>

      <div className='mb-7 text-sm '>
        <span className='text-text-primary-light dark:text-text-primary-dark'>{SignUp.alreadyHaveAccount}</span>
        <Link className='font-semibold text-brand-color' href={`${SIGN_IN_PAGE}?step=1`}> {SignUp.alreadyHaveAccountLink}</Link>
      </div>

    </div>
  );
};

export default Registration;
