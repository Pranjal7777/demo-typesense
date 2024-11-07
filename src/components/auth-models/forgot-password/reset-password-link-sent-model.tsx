
import Button from '@/components/ui/button';
import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';
import Model from '@/components/model/index';
import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React  from 'react';
interface ResetPasswordLinkSentModalProps{
  changeResetPasswordLinkSentModal:()=>void;
}

const ResetPasswordLinkSentModel:React.FC<ResetPasswordLinkSentModalProps> = ({changeResetPasswordLinkSentModal}) => {
  const router=useRouter();
  const message = localStorage.getItem('forgotPasswordMessage');

  
  const done=()=>{
    router.push('/');
  };
 

  return (
    <Model onClose={changeResetPasswordLinkSentModal} className='dark:bg-bg-nonary-dark  mobile:!h-fit mobile:!max-h-[391px] !overflow-auto' modelClassName='mobile:px-8'>

      <div className={'mobile:!py-5 mobile:px-5 h-full mobile:w-full sm:w-full border-primary px-10 !pt-7 pb-6 w-[40%] flex flex-col items-center justify-between'}>
        <div className=' max-w-[408px] w-full flex flex-col items-center justify-start'>

          <Image width={198} height={179} src={IMAGES.RESET_LINK_SENT_LOGO} loader={gumletLoader} alt="reset password"  />

          <FormHeader className=' mobile:font-semibold mobile:text-xl text-[24px] font-bold mb-2'>Reset link sent</FormHeader>
          <FormSubHeader className='mb-1 text-text-primary-light dark:text-text-primary-dark'>{message}</FormSubHeader>
           
          {/* <FormSubHeader className='mobile:text-base mobile:font-normal text-[18px] font-normal mb-2'>We have sent you the link to</FormSubHeader>
            
            <span className='mobile:text-base mobile:font-semibold text-base font-semibold text-center '>prajwal@appscrip.co</span> */}

          <Button className="mobile:mt-5 mt-32" buttonType='primary' onClick={()=>done()}>
            <span className=''> Done</span>
          </Button>
          
        </div>

          
      </div>
    </Model>
  );
};




export default ResetPasswordLinkSentModel;