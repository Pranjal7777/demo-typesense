
import Button from '@/components/ui/button';
import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';
import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import { SIGN_IN_PAGE } from '@/routes';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React  from 'react';

export type ForgotPasswordLinkSent = {
  resetLinkSentTitle: string;
  resetLinkSentMessage: string;
  resetEmail: string;
  doneButton: string;
}

const ResetPasswordLinkSent = () => {
  const { t } = useTranslation('auth');
  const ForgotPasswordLinkSent = t('page.forgotPasswordLinkSent', { returnObjects: true }) as ForgotPasswordLinkSent;

  const router=useRouter();
  const message = localStorage.getItem('forgotPasswordMessage');


  const done=()=>{
    
    // router.push(`/forgotpassword?step=3`)
    router.push(SIGN_IN_PAGE);

  };
 


  return (
    // <div className='sm:w-full mobile:w-full lg:w-[40%] px-10 py-7 !pt-[60px] w-[40%] flex flex-col items-center justify-between'>
    <div className=' max-w-[408px] w-full flex flex-col items-center justify-start'>

      <Image width={198} height={179} src={IMAGES.RESET_LINK_SENT_LOGO} loader={gumletLoader} alt="reset password"  />

      <FormHeader className='mt-9'>{ForgotPasswordLinkSent.resetLinkSentTitle}</FormHeader>
      <FormSubHeader className='mb-1 text-text-primary-light dark:text-text-primary-dark'>{message}</FormSubHeader>
      {/* <span className='text-base font-semibold text-center text-text-primary-light dark:text-text-primary-dark'>{ForgotPasswordLinkSent.resetEmail}</span> */}

      <Button className="mt-16" buttonType="primary" onClick={()=>done()}>
        <span className=''> {ForgotPasswordLinkSent.doneButton}</span>
      </Button>
      
    </div>

      
  // </div>
  );
};




export default ResetPasswordLinkSent;
