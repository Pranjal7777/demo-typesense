
import Button from '@/components/ui/button';
import FormHeader from '@/components/form/form-header';
import FormInput from '@/components/form/form-input';
import FormSubHeader from '@/components/form/form-sub-header';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useState } from 'react';

export type ForgotPasswordWithPhone = {
  phoneNumberTitle: string;
  phoneNumberPlaceholder: string;
  phoneNumberSubTitle: string;
  sendCodeButton: string;
}

const EnterMobileNumber = () => {
  const { t } = useTranslation('auth');
  const ForgotPasswordWithPhone = t('page.forgotPasswordWithPhone', { returnObjects: true }) as ForgotPasswordWithPhone;

  const router=useRouter();
  const [phoneNumber,setPhoneNumber]=useState('');
  // const { page,step } = router.query;


  const onChange=(e:ChangeEvent<HTMLInputElement>)=>{
    setPhoneNumber(e.target.value);
  };

  const Continue=()=>{
    router.push('/forgotpassword?step=5');
  };
 

  return (
    <>
      <div className=' max-w-[408px] w-full flex flex-col items-center justify-start'>

        <FormHeader>{ForgotPasswordWithPhone.phoneNumberTitle}</FormHeader>
        <FormSubHeader className='mb-8'>{ForgotPasswordWithPhone.phoneNumberSubTitle}</FormSubHeader>

      
        <FormInput  label={ForgotPasswordWithPhone.phoneNumberPlaceholder} type="number" name="phoneNumber" value={phoneNumber} onChange={(e)=>onChange(e)}/>
        

        <Button className="mt-24" buttonType="primary" onClick={()=>Continue()}>
          <span className=''> {ForgotPasswordWithPhone.sendCodeButton} </span>
        </Button>
      
      </div>
    </>
    // <div className='sm:w-full mobile:w-full  lg:w-[40%] px-10 py-7 !pt-[60px] w-[40%] flex flex-col items-center justify-between'>

      
  // </div>
  );
};



export default EnterMobileNumber;