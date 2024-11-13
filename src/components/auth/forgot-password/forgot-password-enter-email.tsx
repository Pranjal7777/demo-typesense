
import Button from '@/components/ui/button';
import FormHeader from '@/components/form/form-header';
import FormInput from '@/components/form/form-input';
import FormSubHeader from '@/components/form/form-sub-header';
import { useDebounce } from '@/hooks/use-debounce';
import authApi from '@/store/api-slices/auth';
import { RequestForgotPasswordPayload } from '@/store/types';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useState } from 'react';

export type ForgotPasswordWithEmail = {
  enterEmailTitle: string;
  emailInputLabel: string;
  continueButton: string;
  emailPlaceholder: string;
}

const ForgotPasswordEnterEmail = () => {
  const { t } = useTranslation('auth');
  const ForgotPasswordWithEmail:ForgotPasswordWithEmail= t('page.forgotPasswordWithEmail',{returnObjects:true});

  const router=useRouter();
  const [email,setEmail]=useState('');
  const [loginErrorForEmail ,setLoginErrorForEmail] = useState<string>('');

  const [forgotPassword] =authApi.useForgotPasswordMutation();

  // const { page,step } = router.query;

  
  // Debounce the email input value
  const debouncedEmail = useDebounce(email, 500);

  // Email validation function
  const validateEmail = (email: string) => {
    if (!email) {
      // If email is empty, return true without validation
      return true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate email when debounced value changes
  const isValidEmail = validateEmail(debouncedEmail);


  const onChange=(e:ChangeEvent<HTMLInputElement>)=>{
    setLoginErrorForEmail('');

    setEmail(e.target.value);
  };

  const Continue=async()=>{
    const reqPayloadForForgotPassword : RequestForgotPasswordPayload ={
      emailOrPhone:email,
      type:2
    };


    const {message} = await forgotPassword(reqPayloadForForgotPassword).unwrap();



    if(message){
      localStorage.setItem('forgotPasswordMessage',message);
      router.push('/forgotpassword?step=2');
    }
    
  };
 

  return (
    <>
      <div className=' max-w-[408px] w-full flex flex-col items-center justify-start'>
        {/* <div className="absolute top-4 left-4" onClick={() => router.back()}>

          <Image className='hover:cursor-pointer hover:scale-102  left-1 h-6 w-6 dark:hidden' width={15} height={15} src={IMAGES.BACK_ARROW_ICON_BLACK} alt="back-arrow-icon" loader={gumletLoader}/>
          <Image className='hover:cursor-pointer hover:scale-102  left-1 h-6 w-6 hidden dark:inline-block' width={15} height={15} src={IMAGES.BACK_ARROW_ICON_WHITE} alt="back-arrow-icon" loader={gumletLoader}/>
      </div> */}


        <FormHeader>{ForgotPasswordWithEmail.enterEmailTitle}</FormHeader>
        <FormSubHeader>{ForgotPasswordWithEmail.emailPlaceholder}</FormSubHeader>

        
        <FormInput label={ForgotPasswordWithEmail.emailInputLabel} error={!isValidEmail ? 'Invalid email format' : loginErrorForEmail} type="email" name="email" value={email} onChange={(e)=>onChange(e)}/>
        

        <Button  buttonType="primary" onClick={()=>Continue()}>
          <span className=''> {ForgotPasswordWithEmail.continueButton}</span>
        </Button>
      
      </div>
    </>
    // <div className='sm:w-full mobile:w-full  lg:w-[40%] px-10 py-7 !pt-[60px] w-[40%] flex flex-col items-center justify-between'>

      
  // </div>
  );
};



export default ForgotPasswordEnterEmail;