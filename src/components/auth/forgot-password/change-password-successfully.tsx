
import Button from '@/components/ui/button';
import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';
import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import { SIGN_IN_PAGE } from '@/routes';
// import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React  from 'react';

export type ForgotPasswordLinkSent = {
  resetLinkSentTitle: string;
  resetLinkSentMessage: string;
  resetEmail: string;
  doneButton: string;
}

const ChangePasswordSuccessfully = () => {
//   const { t } = useTranslation('auth');
  // const ForgotPasswordLinkSent:ForgotPasswordLinkSent= t('page.forgotPasswordLinkSent',{returnObjects:true});

  const router=useRouter();


  const done=()=>{
    
    router.push(`${SIGN_IN_PAGE}?step=1`);

  };
 


  return (
    // <div className='sm:w-full mobile:w-full lg:w-[40%] px-10 py-7 !pt-[60px] w-[40%] flex flex-col items-center justify-between'>
    <div className=' max-w-[408px] w-full flex flex-col items-center justify-start'>

      <Image width={198} height={179} src={IMAGES.PASSWORD_CHANGED_SUCCESSFULLY} loader={gumletLoader} alt="reset password"  />

      <FormHeader className='mt-9'>Password Changed!</FormHeader>
      <FormSubHeader className='mb-1 text-text-primary-light dark:text-text-primary-dark'>Your password has been changed successfully</FormSubHeader>
      {/* <span className='text-base font-semibold text-center text-text-primary-light dark:text-text-primary-dark'>{ForgotPasswordLinkSent.resetEmail}</span> */}

      <Button className="mt-16" buttonType="primary" onClick={()=>done()}>
        <span className=''> Back to Login</span>
      </Button>
      
    </div>

      
  // </div>
  );
};




export default ChangePasswordSuccessfully;