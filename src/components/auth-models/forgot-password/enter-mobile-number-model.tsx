
import Button from '@/components/ui/button';
import FormHeader from '@/components/form/form-header';
import FormInput from '@/components/form/form-input';
import FormSubHeader from '@/components/form/form-sub-header';
// import Model from '@/components/Model/Model';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useState } from 'react';

const EnterMobileNumberModel = () => {
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
  // <Model className='mobile:!h-fit mobile:!max-h-[391px] !overflow-auto' modelClassName='mobile:px-8'>

    <div className={'mobile:!py-5 mobile:px-5 h-full mobile:w-full sm:w-full border-primary px-10 !pt-7 pb-6 w-[40%] flex flex-col items-center justify-between'}>
      <div className=' max-w-[408px] w-full flex flex-col items-center justify-start'>

        <FormHeader className='mobile:text-center mobile:font-bold mobile:text-2xl text-[28px] font-bold mb-2'>Enter your Phone Number</FormHeader>
        <FormSubHeader className='mobile:font-normal mobile:text-sm text-base font-normal text-[#828282] text-center '>Please enter your valid phone number to get a verification code</FormSubHeader>

            
        <FormInput label='Phone Number' className='mobile:mt-1 mt-4 px-5 outline-none h-11 border border-bg-tertiary-light rounded' type="number" name="phoneNumber" value={phoneNumber} onChange={(e)=>onChange(e)}/>
            

        <Button className="mt-44" buttonType="primary" onClick={()=>Continue()}>
          <span className='mobile:text-base mobile:font-semibold'> Send Code</span>
        </Button>
          
      </div>

          
    </div>
    // </Model>
  );
};



export default EnterMobileNumberModel;