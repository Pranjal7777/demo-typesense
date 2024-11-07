import React, { ChangeEvent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';
import Button from '@/components/ui/button';
import { useRouter } from 'next/router';
// import Model from '@/components/Model/Model'
import { gumletLoader } from '@/lib/gumlet';
import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';
import FormInput from '@/components/form/form-input';
import DividerWithText from '@/components/form/divider-with-text';
import { SIGN_UP_PAGE } from '@/routes';

const LoginWithEmailAndPasswordModel = () => {
  const router=useRouter();
  const { page } = router.query;

  const [showAndHidePassword,setShowAndHidePassword]=useState(false);
  const [formData,setFormData]=useState({
    email:'',
    password:''
  });

  const onChange=(e:ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=e.target;
    setFormData({...formData,[name]:value});

  };

  const loginWithPhone=()=>{
    router.push(`/auth?page=${page}&step=2`);
  };
  const loginWithEmail=()=>{
    router.push(`/auth?page=${page}&step=1`);
  };
  return (
    // <Model className=' mobile:!h-fit mobile:!max-h-[391px] !overflow-scroll' modelClassName='mobile:px-8'>
    <div className={'mobile:!py-5 overflow-y-auto mobile:px-5 h-full mobile:w-full sm:w-full border-primary px-10 !pt-7 pb-6 w-[40%] flex flex-col items-center justify-between'}>
      <div className='max-w-[408px] w-full flex flex-col items-center justify-start'>

        <FormHeader>Login</FormHeader>
        <FormSubHeader>Please log in to continue</FormSubHeader>
            
        <FormInput label='Email' type="email" name="email" value={formData.email} onChange={(e)=>onChange(e)}/>
          
        <div className='mobile:mb-3 mb-6 relative w-full flex flex-col'>
          <FormInput error='' mainClassName='mobile:mb-0 mb-0' label='Password' type={`${showAndHidePassword ? 'text' : 'password'}`} name="password" value={formData.password} onChange={(e)=>onChange(e)}>
            <Image className='absolute right-4 bottom-[14px]' width={20} height={16} src={`${IMAGES.PASSWORD_HIDE_ICON_BLACK}`} loader={gumletLoader} onClick={()=>setShowAndHidePassword(!showAndHidePassword)} alt="password_hide_icon" />
          </FormInput>
          <Link href="/forgotpassword" className="mobile:text-sm text-brand-color text-sm font-medium text-right">Forgot Password</Link>
        </div>
            
        <Button onClick={()=>loginWithPhone()}>Continue</Button>

        <DividerWithText>or</DividerWithText>
            
        <Button buttonType="secondary" onClick={()=>loginWithEmail()}>
          <Image width={22} height={17} src={`${IMAGES.MAIL_ICON_BLACK}`} loader={gumletLoader}  alt="mail_icon" />
          <span className='mobile:text-base mobile:font-semibold ml-2'>Login With Phone</span>
        </Button>

        <DividerWithText>Or Connect With</DividerWithText>

        <div className='mobile:my-0 flex w-full items-center justify-between'>
          <Button buttonType="tertiary">
            <Image width={20} height={20} src={`${IMAGES.GOOGLE_LOGO}`} loader={gumletLoader}  alt="google_logo" />
            <span className='mobile:text-base mobile:font-semibold ml-2'> Google</span>  
          </Button>
              
          <Button buttonType="tertiary">
            <Image width={20} height={20} src={`${IMAGES.FACEBOOK_LOGO}`} loader={gumletLoader}  alt="facebook_logo" />
            <span className='mobile:text-base mobile:font-semibold ml-2'> Facebook</span>
          </Button>
        </div>
      </div>

      <div className=' mobile:mb-0 text-sm font-semibold'>
        <span>Don’t have an account?</span>
        <Link className='font-bold text-brand-color' href={SIGN_UP_PAGE}> Sign Up</Link>
      </div>
    </div>
    // </Model>
  );
};
export default LoginWithEmailAndPasswordModel;

