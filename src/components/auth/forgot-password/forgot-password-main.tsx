
import Button from '@/components/ui/button';
import FormHeader from '@/components/form/form-header';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';

export type ForgotPasswordWithEmailAndPhone = {
  forgotPasswordTitle: string;
  recoveryOptionsMessage: string;
  emailOption: string;
  phoneNumberOption: string;
}


const ForgotPasswordMain = () => {

  const { t } = useTranslation('auth');
  const ForgotPasswordWithEmailAndPhone:ForgotPasswordWithEmailAndPhone= t('page.forgotPasswordWithEmailAndPhone',{returnObjects:true});

  const router=useRouter();
  // const { page,step } = router.query;

  const forgotpasswordWithEmail=()=>{
    router.push('/forgotpassword?step=2');
  };
  const forgotpasswordWithPhone=()=>{
    router.push('/forgotpassword?step=4');
  };

  return (
    <>
      <div className=' max-w-[408px] w-full flex flex-col items-center justify-start'>

        <FormHeader>{ForgotPasswordWithEmailAndPhone.forgotPasswordTitle}</FormHeader>
        <span className='text-base font-normal text-[#828282]'>{ForgotPasswordWithEmailAndPhone.recoveryOptionsMessage}</span>

        <Button className="mt-9 h-[48px]" buttonType="primary" onClick={()=>forgotpasswordWithEmail()}>
          <span className=''> {ForgotPasswordWithEmailAndPhone.emailOption}</span>  
        </Button>
            
        <Button className='h-[48px]' buttonType="primary" onClick={()=>forgotpasswordWithPhone()}>
          <span className=''> {ForgotPasswordWithEmailAndPhone.phoneNumberOption}</span>
        </Button>
      
      </div>
    </>
    // <div className=' lg:w-[40%] sm:w-full mobile:w-full px-10 py-7 !pt-[60px] w-[40%] flex flex-col items-center justify-between'>

      
  // </div>
  );
};

export default ForgotPasswordMain;