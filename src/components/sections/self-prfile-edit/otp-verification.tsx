import Button from '@/components/ui/button';
import { appClsx } from '@/lib/utils';
import React, { ChangeEvent, FC, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { VerificationDataType } from '.';
import { selfProfileApi } from '@/store/api-slices/profile/self-profile';
import CloseIcon from '../../../../public/assets/svg/close-icon';
import { useTheme } from '@/hooks/theme';
type OtpVerificationProps = {
  title?: string;
  description?: string;
  editButtonText?: string;
  editClassName?: string;
  verifyButtonText?: string;
  verifyButtonClassName?: string;
  sendAgainText?: string;
  sendAgainClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
  otpExpiryTime?: number;
  verificationError?: string;
  verificationData: VerificationDataType | null;
  setVerificationData: React.Dispatch<React.SetStateAction<VerificationDataType | null>>;
  countryCode: string;
  phoneNumber: string;
  onVerificationSuccess: () => void;
  setShowOtpVerification: React.Dispatch<React.SetStateAction<boolean>>;
};
const OtpVerification: FC<OtpVerificationProps> = ({
  title = 'Enter Verification Code',
  description = 'Please enter 4 digit verification code sent to Number',
  editButtonText = 'Edit',
  sendAgainText = 'Send again', 
  verifyButtonText = 'Verify',
  titleClassName,
  descriptionClassName,
  containerClassName,
  editClassName,
  sendAgainClassName,
  verifyButtonClassName,
  otpExpiryTime = 20,
  verificationError,
  verificationData,
  setVerificationData,
  countryCode,
  phoneNumber,
  onVerificationSuccess,
  setShowOtpVerification
}) => {
  const {theme} = useTheme();
  const [otp, setOTP] = useState(['', '', '', '']);
  const [error, setError] = useState(verificationError || '');
  const [isCompleted, setIsCompleted] = useState(false);
  const [verifyVerificationCode, {isLoading}] = selfProfileApi.useVerifyVerificationCodeMutation();
  const [reSendVerificationCode, {isLoading: isResendLoading}] = selfProfileApi.useReSendVerificationCodeMutation();
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

       const handleKeyPress = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
         if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
           handleFocus(index - 1);
         }
       };

       const handleChange = (index: number, value: string) => {
         if (!/^\d$/.test(value) && isNaN(Number(value))) {
           return;
         }
         if (value.length > 1) {
           value = value.slice(0, 1);
         }

         const newOTP = [...otp];
         newOTP[index] = value;
         setOTP(newOTP);

         if (value.length === 1 && index < otp.length - 1) {
           handleFocus(index + 1);
         }

         const isFilled = newOTP.every((digit) => digit.length === 1);
         setIsCompleted(isFilled);
       };

        useEffect(() => {
          // eslint-disable-next-line
          let interval: NodeJS.Timeout;
          if (otpExpiryTime && otpExpiryTime > 0) {

            interval = setInterval(() => {
              setVerificationData((prevData: VerificationDataType | null) => {

                const newTimer = prevData?.expiryTime ? prevData.expiryTime - 1 : 0;
                if (newTimer === 0) {
                  clearInterval(interval);
                }
                return {
                  ...prevData,
                  expiryTime: newTimer,
                  verificationId: prevData?.verificationId || ''
                };
              });
            }, 1000);
          }

          return () => clearInterval(interval);
        }, [otpExpiryTime]);

        useEffect(() => {
          if (isCompleted) {
            verifyButtonHandler();
          }
        }, [otp]);

        const verifyButtonHandler = async () => {
        if(verificationData?.expiryTime === 0){
            setError('OTP expired');
          }else{
            try{
              await verifyVerificationCode({verificationId: verificationData?.verificationId || '', code: otp.join(''), countryCode: countryCode, phoneNumber: phoneNumber, trigger: 3}).unwrap();
              onVerificationSuccess();
            }catch(error){
              const errorMessage = error as Error;
              setError(errorMessage.message);
            }
          }
        }

        const editButtonHandler = () => {
          setVerificationData(null);
          setIsCompleted(false);
          setOTP(['', '', '', '']);
          setError('');
          handleFocus(0);
          setShowOtpVerification(false);  
        }
        const closeModal = () => {
          setVerificationData(null);
          setShowOtpVerification(false);
          setOTP(['', '', '', '']);
          setError('');
          handleFocus(0);
        }
        const resendButtonHandler = async() => {
          const resendPayload = {
            countryCode: countryCode,
            emailOrPhone: phoneNumber,
            trigger: 3,
            type: 1
          }
          // await reSendVerificationCode(resendPayload);
        }
  return (
    <div className={appClsx('h-full relative w-full flex flex-col items-center gap-y-6 mt-4', containerClassName)}>
      <CloseIcon
        height={'18'}
        width={'18'}
        primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
        className=" cursor-pointer absolute left-0 top-0 md:hidden"
        onClick={closeModal}
      />
      <h3
        className={appClsx(
          'text-text-primary-light dark:text-text-primary-dark text-2xl font-medium text-center mobile:mt-10',
          titleClassName
        )}
      >
        {title}
      </h3>
      <p
        className={appClsx(
          'dark:text-text-secondary-light text-text-secondary-dark text-base text-center ',
          descriptionClassName
        )}
      >
        {description} {countryCode} {phoneNumber}
        <span className={appClsx('text-brand-color cursor-pointer', editClassName)} onClick={editButtonHandler}>
          {' ' + editButtonText}
        </span>
      </p>
      <div>
        {otp.map((digit, index) => (
          <input
            className="border rounded focus:outline-[var(--brand-color)] bg-transparent dark:border-border-tertiary-dark dark:text-text-primary-dark border-border-tertiary-light outline-brand-color !w-[62px] h-[62px] text-center"
            // autoFocus={index == 0 && true}
            key={index}
            ref={refs[index]}
            // type='number'
            autoComplete="one-time-code"
            inputMode="numeric"
            value={digit}
            maxLength={1}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyPress(index, e)}
            style={{ width: '30px', marginRight: '10px' }}
          />
        ))}
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {verificationData?.expiryTime && verificationData?.expiryTime > 0 ? (
        <span className="text-brand-color cursor-pointer">
          {Math.floor(verificationData?.expiryTime / 60)} min {verificationData?.expiryTime % 60} sec remaining
        </span>
      ) : (
        <span className={appClsx('text-brand-color cursor-pointer', sendAgainClassName)}>{sendAgainText}</span>
      )}
      <Button
        className={appClsx('mb-0 mt-6', verifyButtonClassName)}
        buttonType="primary"
        onClick={verifyButtonHandler}
        isLoading={isLoading}
      >
        {verifyButtonText}
      </Button>
    </div>
  );
}

export default OtpVerification;