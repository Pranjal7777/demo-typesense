

import Button from '@/components/ui/button';
import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState, ChangeEvent, KeyboardEvent, useRef } from 'react';

export type OtpVerification = {
  verificationPrompt: string;
  enterCodeMessage: string;
  editButton: string;
  codeArrivalMessage: string;
  timer: string;
  sendAgain: string;
  verifyButton: string;
}


const ForgotPasswordOtpForm = () => {

  const { t } = useTranslation('auth');
  const OtpVerification = t('page.otpVerification', { returnObjects: true }) as OtpVerification;

  const router=useRouter();
  const [otp, setOTP] = useState(['', '', '', '']);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading,setIsLoading]=useState(false);

  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleFocus = (index: number) => {
    if (refs[index]?.current) {
      refs[index]?.current?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1); // Limit to one character
    }

    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value.length === 1 && index < otp.length - 1) {
      handleFocus(index + 1);
    }

    // Check if all OTP digits are filled
    const isFilled = newOTP.every(digit => digit.length === 1);
    setIsCompleted(isFilled);
  };

  const handleKeyPress = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      handleFocus(index - 1);
    }
  };


  const handleSubmit=()=>{
    setIsCompleted(false);
    setIsLoading(!isLoading);

    setTimeout(()=>{
      setIsLoading(!isLoading);
      setTimeout(()=>(
        router.push('/forgotpassword?step=6')
      ),2000);
    },2000);

  };

  return (
    <>
      {/* <div className=' mobile:w-full lg:w-[40%] sm:w-full px-10 py-7 !pt-[60px] w-[40%] flex flex-col items-center justify-between'> */}
      <div className=' max-w-[408px] w-full flex flex-col items-center justify-start'>

        <FormHeader>{OtpVerification.verificationPrompt}</FormHeader>
        <FormSubHeader className='mb-7'>{OtpVerification.enterCodeMessage}<span className='text-primary'> {OtpVerification.editButton}</span> </FormSubHeader>

        <div className=' w-full flex items-center justify-center'>
          {otp.map((digit, index) => (
            <input
              className='border dark:bg-bg-primary-dark dark:text-text-primary-dark dark:border-border-tertiary-dark rounded border-bg-tertiary-light outline-brand-color !w-[62px] h-[62px] text-center'
              // autoFocus={index==0 && true}
              key={index}
              ref={refs[index]}
              type="number"
              value={digit}
              maxLength={1}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyPress(index, e)}
              style={{ width: '30px', marginRight: '10px' }}
            />
          ))}
        </div>
        
        {!isCompleted ? (
          <p className='mt-7 mb-24 text-base font-normal text-text-primary-light dark:text-text-primary-dark text-center'>{OtpVerification.codeArrivalMessage} <span className='text-brand-color'>{OtpVerification.timer}</span> </p>

        ) : (
          <p className='mt-7 mb-24 text-brand-color'>{OtpVerification.sendAgain}</p>

        )}

        {/* <input className={`mt-6 hover:cursor-pointer w-[70%] my-2 outline-none h-11 rounded bg-bg-tertiary-light text-sm font-semibold text-text-secondary-color ${isCompleted && "text-text-tertiary-color bg-secondary-light"}`}  type="button" disabled={!isCompleted} value="Verify" onClick={()=>handleSubmit()} /> */}

        <Button isLoading={isLoading} className={`mt-6 hover:cursor-pointer w-[70%] my-2 outline-none h-11 rounded !bg-bg-tertiary-light text-sm font-semibold !text-[#888888] ${isCompleted && '!text-secondary !bg-brand-color'}`} disabled={!isCompleted} onClick={()=>handleSubmit()}>{OtpVerification.verifyButton}</Button>
          
          
          
      </div>

      
      {/* </div> */}
    </>
  );
};

export default ForgotPasswordOtpForm;
