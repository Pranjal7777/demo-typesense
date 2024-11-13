import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { toast } from 'sonner';
// import Image from 'next/image';
// import { IMAGES } from '@/lib/images';
import { useRouter } from 'next/router';
// import { gumletLoader } from '@/lib/gumlet';
// import Button from '@/components/Ui/Button';

const Button = dynamic(() => import('@/components/ui/button'));
const FormHeader = dynamic(() => import('@/components/form/form-header'));
const FormSubHeader = dynamic(() => import('@/components/form/form-sub-header'));
const FormInput = dynamic(() => import('@/components/form/form-input'));

import { useTranslation } from 'next-i18next';
import { OtpDataWithVerificationId, RequestSendVerificationCodeForLoginWithEmail } from '@/store/types';
// import platform from 'platform';
// import { generateDeviceId } from '@/helper/generateDeviceId';
import authApi from '@/store/api-slices/auth';
import { useActions } from '@/store/utils/hooks';

const ForgotPasswordMainModel = dynamic(
  () => import('@/components/auth-models/forgot-password/forgot-password-main-model')
);

// import ForgotPasswordMainModel from '@/components/AuthModels/ForgotPassword/ForgotPasswordMainModel';
import { SIGN_IN_PAGE, SIGN_UP_PAGE } from '@/routes';
import useError from '@/helper/use-error';
import SignUpLink from '@/components/ui/signup-link';
import DownArrowRoundedEdge from '../../../../public/assets/svg/down-arrow-rounded-edge';

export type LoginWithEmail = {
  loginPrompt: string;
  continueMessage: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  forgotPassword: string;
  continueButton: string;
  or: string;
  loginWithPhone: string;
  connectWith: string;
  google: string;
  facebook: string;
  signUpPrompt: string;
  signUpPromptLink: string;
  otherSignUpOptions: string;
  otherLoginOptions: string;
};

const LoginWithEmailAndPassword: React.FC = () => {
  const { t } = useTranslation('auth');
  const LoginWithEmail: LoginWithEmail = t('page.loginWithEmail', { returnObjects: true });

  const router = useRouter();

  // const [login] = authApi.useLoginMutation();
  const [sendVerificationCode] = authApi.useSendVerificationCodeMutation();
  const { setOtpVerificationDetailsDispatch } = useActions();
  const { error, setError, clearError } = useError();

  // const [showAndHidePassword, setShowAndHidePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [loginErrorForEmail, setLoginErrorForEmail] = useState<string>("");
  // const [passwordError, setPasswrodError] = useState<string>("");
  const [formData, setFormData] = useState({
    email: '',
    // password: ""
  });
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    // setLoginErrorForEmail("");
    clearError();
    // setPasswrodError("")

    const { name, value } = e.target;
    if (name === 'password' && value.length > 12) {
      return;
    }
    setFormData({ ...formData, [name]: value });
  }, []);

  // const deviceId = generateDeviceId();

  // Email validation function
  const validateEmail = (email: string) => {
    if (!email) {
      // If email is empty, return true without validation
      return true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const changeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen((prev) => !prev);
  };

  let isValidEmail;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        loginWithEmail();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [formData.email]);

  const loginWithEmail = async () => {
    if (formData.email === '') {
      // setLoginErrorForEmail("Email is required")
      setError('Email is required');
      return;
    }
    isValidEmail = validateEmail(formData.email);
    if (!isValidEmail) {
      // setLoginErrorForEmail("Incorrect Email")
      setError('Incorrect Email');
      return;
    }

    // try {
    //   const reqPayloadForLogin: RequestLoginPaylodWithEmail = {
    //     // password: formData.password,
    //     appVersion: "1",
    //     loginType: 4,
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

    setIsLoading(true);
    try {
      const reqPayload: RequestSendVerificationCodeForLoginWithEmail = {
        trigger: 2,
        loginType: 2,
        email: formData.email,
      };

      const { data } = await sendVerificationCode(reqPayload).unwrap();

      if (data) {
        const otpVerificationPayload: OtpDataWithVerificationId = {
          countryCode: '',
          phoneNumberOrEmail: formData.email, //here phone
          verificationId: data.verificationId,
          expiryTime: data.expiryTime,
          loginType: 2,
        };

        setOtpVerificationDetailsDispatch(otpVerificationPayload);

        setIsLoading(false);

        router.push(`${SIGN_IN_PAGE}?step=3`);
      }
    } catch (e) {
      setIsLoading(false);
      const error = e as { data: { message: string }; status: number };
      if (error.data && error.data.message) {
        // setLoginErrorForEmail(error.data.message);
        setError(error?.data?.message);
        if (error?.status === 412) {
          localStorage.setItem('auth_email', formData?.email);

          toast.info('Redirecting to SignUp page', {
            duration: 3500,
            onAutoClose: () => {
              router.push(`${SIGN_UP_PAGE}?step=2`);
            },
          });
        }
      } else {
        console.error('Unexpected error:', error);
        setError(error?.data?.message || 'Unexpected error');
      }
    }
  };

  useEffect(() => {
    const email = localStorage.getItem('auth_email');
    if (email) {
      setFormData({ email: email });
      localStorage.removeItem('auth_email');
    }
  });

  const handleSignUpClick = useCallback(() => {
    router.push(`${SIGN_UP_PAGE}?step=1`);
  }, [router]);

  const backIconHandler =()=>{
    router.push('/login');
  };

  return (
    <>
      <div className="mobile:px-4 sm:max-w-[408px] w-full h-full flex flex-col items-center justify-start">
        <div className='md:hidden'>
          <DownArrowRoundedEdge onClick={backIconHandler}  height='16px' width='14px' className='hidden cursor-pointer dark:inline-block rotate-90 absolute left-4 top-4 md:hidden' primaryColor='#FFF'/>
          <DownArrowRoundedEdge onClick={backIconHandler}  height='16px' width='14px' className=' dark:hidden cursor-pointer rotate-90 absolute left-4 top-4 md:hidden' primaryColor='#202020'/>        
        </div>
        <FormHeader>{LoginWithEmail.loginPrompt}</FormHeader>
        <FormSubHeader>{LoginWithEmail.continueMessage}</FormSubHeader>

        {/* Email input with error message */}
        <FormInput
          label={LoginWithEmail.emailPlaceholder}
          error={error}
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => onChange(e)}
          // autoFocus={true}
          required
        />

        {/* <div className='mb-6 relative w-full flex flex-col'> */}
        {/* <FormInput
            error={passwordError && passwordError}
            mainClassName='mb-0'
            label={LoginWithEmail.passwordPlaceholder}
            type={`${showAndHidePassword ? "text" : "password"}`}
            name="password"
            value={formData.password}
            onChange={(e) => onChange(e)}
            required
          >
            Password show/hide toggle
            {
              showAndHidePassword ? (
                <>
                  <Image className='absolute right-4 dark:hidden inline' width={20} height={16} src={`${IMAGES.PASSWORD_SHOW_ICON_BLACK}`} loader={gumletLoader} onClick={() => setShowAndHidePassword(!showAndHidePassword)} alt="password_show_icon" />
                  <Image className='absolute right-4 dark:inline hidden' width={20} height={16} src={`${IMAGES.PASSWORD_SHOW_ICON_WHITE}`} loader={gumletLoader} onClick={() => setShowAndHidePassword(!showAndHidePassword)} alt="password_hide_icon" />
                </>
              ) : (
                <>
                  <Image className='absolute right-4 dark:hidden inline' width={20} height={16} src={`${IMAGES.PASSWORD_HIDE_ICON_BLACK}`} loader={gumletLoader} onClick={() => setShowAndHidePassword(!showAndHidePassword)} alt="password_show_icon" />
                  <Image className='absolute right-4 dark:inline hidden' width={20} height={16} src={`${IMAGES.PASSWORD_HIDE_ICON_WHITE}`} loader={gumletLoader} onClick={() => setShowAndHidePassword(!showAndHidePassword)} alt="password_hide_icon" />
                </>
              )
            }
          </FormInput> */}
        {/* <Link href="/forgotpassword" className="text-brand-color text-sm font-medium text-right">{LoginWithEmail.forgotPassword} ?</Link> */}
        {/* <div onClick={changeForgotPasswordModal} className="text-brand-color text-sm font-medium text-right cursor-pointer">{LoginWithEmail.forgotPassword} ?</div> */}
        {/* </div> */}

        {/* code to open forgotpassword modal */}
        {isForgotPasswordModalOpen && <ForgotPasswordMainModel changeForgotPasswordModal={changeForgotPasswordModal} />}

        <Button buttonType="primary" className='mt-[136px]' isLoading={isLoading} onClick={loginWithEmail}>
          {LoginWithEmail.continueButton}
        </Button>
        <Link className="font-semibold text-brand-color" href={`${SIGN_IN_PAGE}?step=1`}>
          {' '}
          {LoginWithEmail.otherLoginOptions}
        </Link>
      </div>

      <SignUpLink
        linkText={LoginWithEmail.signUpPromptLink}
        onClick={handleSignUpClick}
        text={LoginWithEmail.signUpPrompt}
      />
    </>
  );
};

export default React.memo(LoginWithEmailAndPassword);
