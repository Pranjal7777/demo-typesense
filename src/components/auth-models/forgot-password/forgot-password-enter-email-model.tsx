
import Button from '@/components/ui/button';
import FormHeader from '@/components/form/form-header';
import FormInput from '@/components/form/form-input';
import FormSubHeader from '@/components/form/form-sub-header';
import Model from '@/components/model/index';
import { useDebounce } from '@/hooks/use-debounce';
import authApi from '@/store/api-slices/auth';
import {  RequestForgotPasswordPayload } from '@/store/types';
import React, { ChangeEvent, useState } from 'react';
import ResetPasswordLinkSentModel from './reset-password-link-sent-model';

interface ForgotpasswordWithEmailProps {
  forgotpasswordWithEmail: () => void
}

const ForgotPasswordEnterEmailModel: React.FC<ForgotpasswordWithEmailProps> = ({ forgotpasswordWithEmail }) => {
  // const router = useRouter();
  const [email, setEmail] = useState('');
  // const { page,step } = router.query;

  const [loginErrorForEmail, setLoginErrorForEmail] = useState<string>('');
  const [isResetPasswordLinkSentModal, setIsResetPasswordLinkSentModal] = useState(false);

  const [forgotPassword] = authApi.useForgotPasswordMutation();

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


  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginErrorForEmail('');

    setEmail(e.target.value);
  };

  const Continue = async () => {
    const reqPayloadForForgotPassword: RequestForgotPasswordPayload = {
      emailOrPhone: email,
      type: 2
    };

    try {
      const { message } = await forgotPassword(reqPayloadForForgotPassword).unwrap();



      if (message) {
        localStorage.setItem('forgotPasswordMessage', message);
        changeResetPasswordLinkSentModal();
        // router.push(`/forgotpassword?step=2`)
      }
    } catch (e) {

      const error = e as { data: { message: string } };
      console.error(error);
      setLoginErrorForEmail(error.data.message);

    }

  };



  const changeResetPasswordLinkSentModal = () => {
    setIsResetPasswordLinkSentModal(!isResetPasswordLinkSentModal);

  };


  return (
    <Model onClose={forgotpasswordWithEmail} className=' dark:bg-bg-nonary-dark mobile:!h-fit mobile:!max-h-[391px] !overflow-auto' modelClassName='mobile:px-8'>

      <div className={'mobile:!py-5 mobile:px-5 h-full mobile:w-full sm:w-full border-primary px-10 !pt-7 pb-6 w-[40%] flex flex-col items-center justify-between'}>
        <div className=' max-w-[408px] w-full flex flex-col items-center justify-start'>

          <FormHeader className='mobile:font-bold mobile:text-2xl text-[28px] font-bold mb-2'>Enter your Email</FormHeader>
          <FormSubHeader className='mobile:font-normal mobile:text-sm text-base font-normal text-[#828282] text-center '>Please enter your valid email address to get a reset link</FormSubHeader>

          <FormInput label='Email' className='dark:bg-bg-nonary-dark mobile:mt-1 px-5 outline-none h-11 border border-bg-tertiary-light rounded' error={!isValidEmail ? 'Invalid email format' : loginErrorForEmail} type="email" name="email" value={email} onChange={(e) => onChange(e)} required/>

          <Button className="mt-[86%]" buttonType="primary" onClick={() => Continue()}>
            <span className=''> Continue</span>
          </Button>

        </div>


      </div>

      {isResetPasswordLinkSentModal && <ResetPasswordLinkSentModel changeResetPasswordLinkSentModal={changeResetPasswordLinkSentModal} />}
    </Model>
  );
};



export default ForgotPasswordEnterEmailModel;