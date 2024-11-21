import Button from '@/components/ui/button';
import { useRouter } from 'next/router';
import React, { useState, ChangeEvent, KeyboardEvent, useRef, useEffect, useMemo } from 'react';
import FormHeader from '../form/form-header';
import FormSubHeader from '../form/form-sub-header';
import { useTranslation } from 'next-i18next';
import platform from 'platform';
import { generateDeviceId } from '@/helper/generate-device-id';
import {
  OtpDataWithVerificationForSignUp,
  OtpDataWithVerificationId,
  RequestLoginPayload,
  RequestLoginPaylodWithEmail,
  RequestReSendVerificationCodePayload,
  RequestResendOtpData,
  RequestSendVerificationCodePayload,
} from '@/store/types';
import authApi from '@/store/api-slices/auth';
import { useActions, useAppSelector } from '@/store/utils/hooks';
import { SIGN_IN_PAGE, SIGN_UP_PAGE } from '@/routes';
import { RootState } from '@/store/store';

export type otpVerification = {
  verificationPrompt: string;
  enterCodeMessage: string;
  editButton: string;
  codeArrivalMessage: string;
  timer: string;
  sendAgain: string;
  verifyButton: string;
};

const OTPForm: React.FC = () => {
  const { t } = useTranslation('auth');
  const otpVerification = t('page.otpVerification', { returnObjects: true }) as otpVerification;

  // Todo Need to remove this.

  const router = useRouter();
  const [otp, setOTP] = useState(['', '', '', '']);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const [signupError, setSignupError] = useState('');

  const [login] = authApi.useLoginMutation();
  const [signup] = authApi.useSignUpMutation();
  const [validVerificationCode] = authApi.useValidVerificationCodeMutation();
  const [reSendVerificationCode] = authApi.useReSendVerificationCodeMutation();
  const [sendVerificationCode] = authApi.useSendVerificationCodeMutation();
  const { setUserDetailsDispatch, setOtpVerificationDetailsDispatch } = useActions();

  const { otpData } = useAppSelector((state: RootState) => state.auth);

  // const { countryCode, phoneNumber, emailOrPhone ,phoneNumberOrEmail} =
  const { countryCode, phoneNumberOrEmail, phoneNumber } =
    typeof window !== 'undefined' && localStorage.getItem('otpData')
      ? JSON.parse(localStorage.getItem('otpData')!)
      : null;

  const { expiryTime } = useAppSelector((state) => state.auth?.otpData as OtpDataWithVerificationId);

  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    // eslint-disable-next-line
    let interval: NodeJS.Timeout;

    const storedTimer = localStorage.getItem('timer');

    if (expiryTime > 0) {
      if (storedTimer && Number(storedTimer) > 0) {
        setTimer(Number(storedTimer));
      } else {
        setTimer(expiryTime);
      }

      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer ? prevTimer - 1 : 0;
          if (newTimer === 0) {
            clearInterval(interval);
            localStorage.removeItem('timer'); // Remove timer from local storage
          } else {
            localStorage.setItem('timer', String(newTimer));
          }
          return newTimer;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [expiryTime, otpData]);

  useEffect(() => {
    if (isCompleted) {
      console.log('new in useEffect');
      handleSubmit();
    }
  }, [otp]);

  const handleFocus = (index: number) => {
    if (refs[index]?.current) {
      refs[index]?.current?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    console.log('', value, 'mir otp');
    
    if (!/^\d$/.test(value) && isNaN(Number(value))) {
      return; // Exit early if the value is not a single digit
    }
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

  const resendVerificationCode = async () => {
    setIsCompleted(false);
    setOTP(['', '', '', '']);
    if (router.pathname.includes(SIGN_UP_PAGE)) {
      const { countryCode, phoneNumber } =
        typeof window !== 'undefined' && localStorage.getItem('otpData')
          ? JSON.parse(localStorage.getItem('otpData')!)
          : null;

      const reqPayload: RequestSendVerificationCodePayload = {
        countryCode: `${countryCode}`,
        phoneNumber: phoneNumber,
        trigger: 1,
      };

      const { data } = await sendVerificationCode(reqPayload).unwrap();

      if (data) {
        const otpVerificationPayload: OtpDataWithVerificationForSignUp = {
          countryCode: `${countryCode}`,
          phoneNumber: phoneNumber,
          verificationId: data.verificationId,
          expiryTime: data.expiryTime,
        };

        setOtpVerificationDetailsDispatch(otpVerificationPayload);
      }
    } else {
      const { countryCode, phoneNumberOrEmail, loginType } =
        typeof window !== 'undefined' && localStorage.getItem('otpData')
          ? JSON.parse(localStorage.getItem('otpData')!)
          : null;

      console.log('loginType', loginType);

      // try {
      //   const reqPayloadForLogin: RequestLoginPaylodWithEmail = {
      //     // password: formData.password,
      //     appVersion: "1",
      //     loginType: "4",
      //     deviceOs: platform?.os?.family as string + "-" + platform?.os?.version as string,
      //     browserVersion: platform.version as string,
      //     deviceTypeCode: 3,
      //     deviceId,
      //     deviceMake: platform.name as string,
      //     deviceModel: platform.version as string,
      //     email: formData.email,
      //   };

      //   const { data } = await login(reqPayloadForLogin).unwrap();

      //   if (data) {
      //     setUserDetailsDispatch(data);
      //     router.push('/');
      //   }
      // } catch (e) {
      //   const error = e as { data: { message: string }, status: number };
      //   console.error("error==>", error)
      //   // if (error.status == 409) {
      //   //   setPasswrodError(error.data.message)
      //   // }
      //   if (error.status == 422) {
      //     setLoginErrorForEmail(error.data.message)
      //   }
      //   else {
      //     setLoginErrorForEmail(error.data.message);
      //   }
      // }

      if (loginType === 1) {
        const reqPayload: RequestReSendVerificationCodePayload = {
          countryCode: `${countryCode}`,
          emailOrPhone: phoneNumberOrEmail,
          trigger: loginType,
          type: loginType,
        };

        try {
          const { data } = await reSendVerificationCode(reqPayload).unwrap();

          if (data) {
            const otpVerificationPayload: RequestResendOtpData = {
              countryCode: `${countryCode}`,
              phoneNumberOrEmail: phoneNumberOrEmail,
              verificationId: data.verificationId,
              expiryTime: data.expiryTime,
              loginType: loginType,
            };

            setOtpVerificationDetailsDispatch(otpVerificationPayload);
          }
        } catch (e) {
          const error = e as { data: { message: string } };
          setSignupError(error.data.message);
          setIsLoading(false);
        }
      } else if (loginType === 2) {
        const reqPayload: RequestReSendVerificationCodePayload = {
          emailOrPhone: phoneNumberOrEmail,
          trigger: 4,
          type: loginType,
        };

        try {
          const { data } = await reSendVerificationCode(reqPayload).unwrap();
          if (data) {
            const otpVerificationPayload: RequestResendOtpData = {
              phoneNumberOrEmail: phoneNumberOrEmail,
              verificationId: data.verificationId,
              expiryTime: data.expiryTime,
              loginType: loginType,
            };

            setOtpVerificationDetailsDispatch(otpVerificationPayload);
          }
        } catch (e) {
          const error = e as { data: { message: string } };
          setSignupError(error.data.message);
          setIsLoading(false);
        }
      }
    }
  };

  const deviceId = generateDeviceId();

  const handleSubmit = async () => {
    setIsCompleted(false);
    setIsLoading(!isLoading);

    if (router.pathname.includes(SIGN_UP_PAGE)) {
      const password = otp.join('');
      const signUpDataString: string | null = localStorage.getItem('signUpData');
      let reqPayloadForSignUp;
      if (signUpDataString) {
        reqPayloadForSignUp = JSON.parse(signUpDataString);
      }

      const { countryCode, phoneNumber, emailOrPhone } = reqPayloadForSignUp;

      const { verificationId } =
        typeof window !== 'undefined' && localStorage.getItem('otpData')
          ? JSON.parse(localStorage.getItem('otpData')!)
          : null;

      const validVerificationpayload = {
        code: password,
        countryCode: countryCode,
        phoneNumber: phoneNumber || emailOrPhone,
        verificationId: verificationId,
        trigger: 1,
      };
      try {
        const data = await validVerificationCode(validVerificationpayload).unwrap();

        if (data?.message) {
          if (signUpDataString) {
            const { data } = await signup(reqPayloadForSignUp).unwrap();

            if (data) {
              localStorage.removeItem('timer');
              localStorage.removeItem('signUpData');
              // console.log(data);
              
              // setUserDetailsDispatch(data);

              setTimeout(() => {
                setIsLoading(!isLoading);
                setTimeout(() => {
                  if (router.pathname.includes(SIGN_UP_PAGE)) {
                    // router.push(`${SIGN_UP_PAGE}?step=5?data=${JSON.stringify(data)}`);
                    router.push({
                      pathname: `${SIGN_UP_PAGE}`,
                      query: { step: '5', data: `${JSON.stringify(data)}`},
                    });
                  } else {
                    router.push('/');
                  }
                }, 500);
              }, 500);
            }
          }
        }
      } catch (e) {
        const error = e as { data: { message: string } };
        setSignupError(error.data.message);
        setIsLoading(false);
      }
    } else if (router.pathname.includes(SIGN_IN_PAGE)) {
      // const { countryCode, phoneNumber, emailOrPhone,loginType, phoneNumberOrEmail, verificationId } =
      const { countryCode, loginType, phoneNumberOrEmail, verificationId } =
        typeof window !== 'undefined' && localStorage.getItem('otpData')
          ? JSON.parse(localStorage.getItem('otpData')!)
          : null;
      const password = otp.join('');
      console.log('loginType', loginType);

      if (loginType === 1) {
        const reqPayloadForLogin: RequestLoginPayload = {
          countryCode: countryCode,
          // phoneNumber: phoneNumber || emailOrPhone,
          phoneNumber: phoneNumberOrEmail,
          verificationId: verificationId,
          password,
          appVersion: '1',
          loginType: loginType,
          deviceOs: ((platform?.os?.family as string) + '-' + platform?.os?.version) as string,
          browserVersion: platform.version as string,
          deviceTypeCode: 3,
          deviceId, // Assuming deviceId is defined elsewhere
          deviceMake: platform.name as string,
          deviceModel: platform.version as string,
        };
        try {
          const { data } = await login(reqPayloadForLogin).unwrap();
          setUserDetailsDispatch(data);
          localStorage.removeItem('auth_email');
          router.push('/');
        } catch (e) {
          const error = e as { data: { message: string } };
          setSignupError(error.data.message);
          setIsLoading(false);
        }
      } else if (loginType === 2) {
        console.log('inside else if 2');
        const reqPayloadForLogin: RequestLoginPaylodWithEmail = {
          // countryCode: countryCode,
          // phoneNumber: phoneNumber || emailOrPhone,
          verificationId: verificationId,
          email: phoneNumberOrEmail,
          password: password,
          appVersion: '1',
          loginType: 4,
          deviceOs: ((platform?.os?.family as string) + '-' + platform?.os?.version) as string,
          browserVersion: platform.version as string,
          deviceTypeCode: 3,
          deviceId,
          deviceMake: platform.name as string,
          deviceModel: platform.version as string,
        };

        console.log(reqPayloadForLogin);

        try {
          console.log('inside try');
          const { data } = await login(reqPayloadForLogin).unwrap();
          console.log('data', data);

          if (data) {
            setUserDetailsDispatch(data);
            localStorage.removeItem('auth_email');
            router.push('/');
          }
        } catch (e) {
          const error = e as { data: { message: string } };
          setSignupError(error.data.message);
          setIsLoading(false);
        }
      }
    }
  };

  const hidePhoneNumber = useMemo(() => {
    if (router.pathname.includes(SIGN_UP_PAGE)){
      const hidePart = '*'.repeat(phoneNumber.length-2);
      const lastPart = phoneNumber.slice(-2);
      return (hidePart + lastPart);
    }
    else if(router.pathname.includes(SIGN_IN_PAGE)){
      const hidePart = '*'.repeat(phoneNumberOrEmail.length-2);
      const lastPart = phoneNumberOrEmail.slice(-2);
      return (hidePart + lastPart);
    }
  }, [phoneNumber,router,phoneNumberOrEmail]);

  const goBack = () => {
    router.back();
  };

  return (
    <>
      {/* <div className={` lg:w-[40%] sm:w-full mobile:w-full px-10 py-7 !pt-[60px] w-[40%] flex flex-col items-center justify-between`}> */}
      <div className=" mobile:px-4 sm:max-w-[408px] w-full mobile:w-full flex flex-col items-center justify-start">
        <FormHeader>{otpVerification.verificationPrompt}</FormHeader>
        <FormSubHeader className=" text-text-quaternary-light">
          {otpVerification.enterCodeMessage} <br />
          {/* {countryCode} {phoneNumber ? phoneNumber : emailOrPhone}{' '} */}
          {countryCode} {hidePhoneNumber}{' '}
          <span
            onClick={() => goBack()}
            role="button"
            tabIndex={0}
            onKeyUp={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goBack();
              }
            }}
            className="text-brand-color cursor-pointer"
          >
            {otpVerification.editButton}
          </span>{' '}
        </FormSubHeader>

        <div className="mt-6 w-full flex items-center justify-center">
          {otp.map((digit, index) => (
            <input
              className="border rounded focus:outline-[var(--brand-color)] dark:bg-bg-primary-dark dark:border-border-tertiary-dark dark:text-text-primary-dark border-border-tertiary-light outline-brand-color !w-[62px] h-[62px] text-center"
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

        {timer > 0 ? (
          <p className="mt-7 mb-12 text-base font-normal text-text-primary-light dark:text-text-primary-dark text-center">
            {otpVerification.codeArrivalMessage}
            <span className="text-brand-color">
              {' '}
              {Math.floor(timer / 60)} min {timer % 60} sec{' '}
            </span>{' '}
          </p>
        ) : (
          // <p className='mt-7 mb-12 text-brand-color hover:cursor-pointer'>{otpVerification.sendAgain}</p>
          <></>
        )}
        <p style={{ color: 'red' }}>{signupError}</p>

        {/* <input className={`mt-6 hover:cursor-pointer w-[70%] my-2 outline-none h-11 rounded bg-bg-tertiary-light text-sm font-semibold text-text-secondary-color ${isCompleted && "text-text-tertiary-color bg-secondary-light"}`}  type="button" disabled={!isCompleted} value="Verify" onClick={()=>handleSubmit()} /> */}
        {timer > 0 ? (
          <Button
            buttonType="primary"
            isLoading={isLoading}
            className={`mt-6 hover:cursor-pointer w-[70%] min-w-[303px] my-2 outline-none h-11 rounded
                 text-sm font-semibold
                 ${
              (isCompleted || isLoading) ? '!text-text-tertiary-color !bg-brand-color' : 'bg-bg-tertiary-light dark:bg-bg-undenary-dark !text-[#888888]'
            }`}
            disabled={!isCompleted}
            onClick={ handleSubmit}
          >
            {otpVerification.verifyButton}
          </Button>
        ) : (
          <span
            className="mt-7 mb-12 text-brand-color hover:cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={resendVerificationCode}
            onKeyUp={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                resendVerificationCode;
              }
            }}
          >
            {otpVerification.sendAgain}
          </span>
        )}
      </div>

      {/* </div> */}
    </>
  );
};

export default React.memo(OTPForm);