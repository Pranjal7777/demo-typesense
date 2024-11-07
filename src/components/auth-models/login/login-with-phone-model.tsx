import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';
import Button, { } from '@/components/ui/button';
import { useRouter } from 'next/router';
import Model from '@/components/model/index';
import { gumletLoader } from '@/lib/gumlet';
import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';
import FormInput from '@/components/form/form-input';
import DividerWithText from '@/components/form/divider-with-text';
import { SIGN_UP_PAGE } from '@/routes';

interface loginModalProps{
  changeisLoginModalOpen :()=>void
}

const LoginWithPhoneModel : React.FC<loginModalProps>= ({changeisLoginModalOpen}) => {
  const router=useRouter();
  const { page } = router.query;

  const loginWithPhone=()=>{
    router.push(`/auth?page=${page?page:'login'}&step=2`);
  };
  const loginWithEmail=()=>{
    router.push(`/auth?page=${page?page:'login'}&step=3`);
  };
  return (
    <Model onClose={changeisLoginModalOpen} className='dark:bg-bg-primary-dark mobile:!h-fit mobile:!max-h-[391px]' modelClassName='mobile:px-8'>
      <div className={' mobile:!py-5 mobile:px-5 h-full mobile:w-full sm:w-full border-primary px-10 !pt-7 pb-6 w-[40%] flex flex-col items-center justify-between'}>
        <div className='w-full max-w-[408px] flex flex-col items-center justify-start'>

          <FormHeader  >Login</FormHeader>
          <FormSubHeader className=''>Please log in to continue</FormSubHeader>
            
          <FormInput label='Phone Number' type="number" name="phoneNumber"/>
            
          <Button buttonType="primary" className='mobile:text-base mobile:font-semibold' onClick={()=>loginWithPhone()}>Continue</Button>

          <DividerWithText>or</DividerWithText>
            
          <Button buttonType="secondary" onClick={()=>loginWithEmail()}>
            <Image width={22} height={17} src={`${IMAGES.MAIL_ICON_BLACK}`} loader={gumletLoader} alt="mail_icon" />
            <span className='mobile:text-base mobile:font-semibold ml-2'>Login With Email</span>
          </Button>

          <DividerWithText>Or Connect With</DividerWithText>

          <div className='mobile:my-0 flex w-full items-center justify-between'>
            <Button className='' buttonType="tertiary">
              <Image width={20} height={20} src={`${IMAGES.GOOGLE_LOGO}`} loader={gumletLoader}  alt="google_logo" />
              <span className='mobile:text-base mobile:font-semibold ml-2'> Google</span>  
            </Button>
              
            <Button className='' buttonType="tertiary">
              <Image width={20} height={20} src={`${IMAGES.FACEBOOK_LOGO}`} loader={gumletLoader}  alt="facebook_logo" />
              <span className='mobile:text-base mobile:font-semibold ml-2'> Facebook</span>
            </Button>
          </div>
        </div>

        <div className=' mobile:mb-0 text-sm font-semibold dark:text-text-secondary-light'>
          <span>Don’t have an account?</span>
          <Link className='font-bold text-brand-color' href={SIGN_UP_PAGE}> Sign Up</Link>
        </div>
      </div>
    </Model>
  );
};

export default LoginWithPhoneModel;
