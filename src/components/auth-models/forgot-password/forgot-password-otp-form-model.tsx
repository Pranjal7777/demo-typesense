import Button from '@/components/ui/button';
// import Model from '@/components/Model/Model';
import { useRouter } from 'next/router';
import { useState, ChangeEvent, KeyboardEvent, useRef } from 'react';

const ForgotPasswordOtpFormModel = () => {
  const router = useRouter();
  const [otp, setOTP] = useState(['', '', '', '']);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

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
    const isFilled = newOTP.every((digit) => digit.length === 1);
    setIsCompleted(isFilled);
  };

  const handleKeyPress = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      handleFocus(index - 1);
    }
  };

  const handleSubmit = () => {
    setIsCompleted(false);
    setIsLoading(!isLoading);

    setTimeout(() => {
      setIsLoading(!isLoading);
      setTimeout(() => router.push('/forgotpassword?step=6'), 2000);
    }, 2000);
  };

  return (
    // <Model className=' mobile:!h-fit mobile:!max-h-[391px] !overflow-auto' modelClassName='mobile:px-8'>
    <div
      className={'mobile:!py-5 mobile:px-5 h-full mobile:w-full sm:w-full border-primary px-10 !pt-7 pb-6 w-[40%] flex flex-col items-center justify-between'}
    >
      <div className=" max-w-[408px] w-full flex flex-col items-center justify-start">
        <span className="mobile:text-center mobile:font-bold mobile:text-2xl text-[28px] font-bold mb-4">
          Enter Verification Code
        </span>
        <span className="mobile:font-normal mobile:text-sm text-base font-normal text-[#828282] text-center">
          Please enter 4 digit verification code sent to +91 9526676156 <span className="text-primary">Edit</span>{' '}
        </span>

        <div className="mt-6 w-full flex items-center justify-center">
          {otp.map((digit, index) => (
            <input
              className="border border-bg-tertiary-light outline-brand-color !w-[62px] h-[62px] text-center"
              // autoFocus={index == 0 && true}
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
          <p className="mt-7 mb-12 text-base font-normal text-[#828282] text-center">
            Code will arrive in <span className="text-brand-color">1:54 mins</span>{' '}
          </p>
        ) : (
          <p className="mt-7 mb-12 text-brand-color">Send Again</p>
        )}

        {/* <input className={`mt-6 hover:cursor-pointer w-[70%] my-2 outline-none h-11 rounded bg-bg-tertiary-light text-sm font-semibold text-text-secondary-color ${isCompleted && "text-text-tertiary-color bg-secondary-light"}`}  type="button" disabled={!isCompleted} value="Verify" onClick={()=>handleSubmit()} /> */}

        <Button
          isLoading={isLoading}
          className={`mt-32 mobile:text-base mobile:font-semibold hover:cursor-pointer w-[70%] outline-none h-11 rounded !bg-bg-tertiary-light text-sm font-semibold !text-[#888888] ${
            isCompleted && '!text-secondary !bg-brand-color'
          }`}
          disabled={!isCompleted}
          onClick={() => handleSubmit()}
        >
          Verify
        </Button>
      </div>
    </div>
    // </Model>
  );
};

export default ForgotPasswordOtpFormModel;
