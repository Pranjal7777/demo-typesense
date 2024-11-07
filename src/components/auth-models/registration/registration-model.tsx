import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';
import { useRouter } from 'next/router';
import Button from '@/components/ui/button';
// import Model from '@/components/Model/Model'
import { gumletLoader } from '@/lib/gumlet';
import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';
import DividerWithText from '@/components/form/divider-with-text';

const RegistrationModel = () => {

  const router=useRouter();
  // const { page,step } = router.query;
  const { page } = router.query;

  const handelClick=()=>{
    
    router.push(`/auth?page=${page}&step=2`);

  };

  return (
    // <Model className=' mobile:!h-fit mobile:!max-h-[391px] !overflow-auto' modelClassName='mobile:px-8'>
    <div className={'mobile:!py-5 mobile:px-5 h-full mobile:w-full sm:w-full border-primary px-10 !pt-7 pb-6 w-[40%] flex flex-col items-center justify-between'}>
      <div className=' max-w-[408px] w-full flex flex-col items-center justify-start'>

        <FormHeader>Sign up</FormHeader>
        <FormSubHeader>Please choose an option to continue</FormSubHeader>

            
        <Button className='mobile:text-base mobile:font-semibold' onClick={()=>handelClick()}>Sign up With Email</Button>
        <DividerWithText>Or Connect With</DividerWithText>

        <div className='flex w-full items-center justify-between'>
          <Button buttonType="tertiary">
            <Image width={20} height={20} src={`${IMAGES.GOOGLE_LOGO}`} loader={gumletLoader}  alt="google_logo" />
            <span className='mobile:text-base mobile:font-semibold ml-2'> Google</span>  
          </Button>
                
          <Button buttonType="tertiary">
            <Image width={20} height={20} src={`${IMAGES.FACEBOOK_LOGO}`} loader={gumletLoader}  alt="facebook_logo" />
            <span className='mobile:text-base mobile:font-semibold ml-2'> Facebook</span>
          </Button>
        </div>
      </div>

      <div className='absolute bottom-6 mobile:bottom-[-60px] text-sm font-semibold'>
        <span>Already have account?</span>
        <Link className='font-bold text-brand-color' href="/auth?page=login"> Login</Link>
      </div>
    </div>
    // </Model>
  );
};

export default RegistrationModel;