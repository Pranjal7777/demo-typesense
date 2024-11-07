
import Button from '@/components/ui/button';
import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';
import Model from '@/components/model/index';
// import { useRouter } from 'next/router';
import React, { useState } from 'react';
import ForgotPasswordEnterEmailModel from './forgot-password-enter-email-model';

interface ForgotPasswordProps{
  changeForgotPasswordModal:() => void;
}

const ForgotPasswordMainModel : React.FC<ForgotPasswordProps> = ({changeForgotPasswordModal}) => {
  // const router=useRouter();
  const [isOpenEnterEmailModal,setIsOpenEnterEmailModal] = useState(false);
  // const { page,step } = router.query;

  const forgotpasswordWithEmail=()=>{
    setIsOpenEnterEmailModal(!isOpenEnterEmailModal);
    // router.push(`/forgotpassword?step=2`)
  };
  // const forgotpasswordWithPhone=()=>{
  //   router.push(`/forgotpassword?step=4`)
  // }

  return (

    <Model onClose={changeForgotPasswordModal}  className=' dark:bg-bg-nonary-dark mobile:!h-fit mobile:!max-h-[391px] !overflow-auto' modelClassName='mobile:px-8'>

      <div className='mobile:!py-5 mobile:px-5 h-full sm:w-full mobile:w-full px-10 py-7 !pt-[60px] w-[40%] flex flex-col items-center justify-center'>
        <div className=' max-w-[408px] w-full flex flex-col items-center justify-start'>

          <FormHeader className='mobile:font-bold mobile:text-2xl text-[28px] font-bold mb-2'>Forgot Password</FormHeader>
          <FormSubHeader className='mobile:font-normal mobile:text-sm text-base font-normal text-[#828282]'>Select the option to recover your password</FormSubHeader>

          <Button className="mt-1 h-[48px]" buttonType="primary" onClick={()=>forgotpasswordWithEmail()}>
            <span className='mobile:text-base mobile:font-semibold '> Email</span>  
          </Button>
            
          {/* <Button className='h-[48px]' buttonType="primary" onClick={()=>forgotpasswordWithPhone()}>
                <span className='mobile:text-base mobile:font-semibold '> Phone Number</span>
            </Button> */}
          
        </div>
      </div>

      {isOpenEnterEmailModal && <ForgotPasswordEnterEmailModel forgotpasswordWithEmail={forgotpasswordWithEmail}/>}

    </Model>
  );
};

export default ForgotPasswordMainModel;