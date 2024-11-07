

import React, { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { IMAGES } from '@/lib/images';
import Image from 'next/image';
import Button from '@/components/ui/button';
import { gumletLoader } from '@/lib/gumlet';
import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';
import FormInput from '@/components/form/form-input';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

export type CreateNewPassword = {
  newPasswordTitle: string;
  passwordPlaceholder: string;
  confirmPasswordPlaceholder: string;
  newPasswordSubTitle: string;
  continueButton: string;
}

const ChangePasswordForm = () => {

  const { t } = useTranslation('auth');
  const CreateNewPassword:CreateNewPassword= t('page.createNewPassword',{returnObjects:true});

  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading,setIsLoading]=useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router=useRouter();

  const [formData,setFormData]=useState({
    password:'',
    confirmPassword:''
  });
  
  const [showAndHidePassword,setShowAndHidePassword]=useState(false);
  const [showAndHideConfirmPassword,setShowAndHideConfirmPassword]=useState(false);

  // const [isError,setIsError]=useState(false)


  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'confirmPassword') {
      if (formData.password !== value) {
        setErrorMessage('* Passwords do not match!');
      } else {
        setErrorMessage('');
        setIsCompleted(true);
        // Passwords match, proceed with form submission or further processing
      }
    }

    setFormData({ ...formData, [name]: value });
  };
  // const { page,step } = router.query;

  const handleSubmit=()=>{
    setIsCompleted(false);
    setIsLoading(!isLoading);

    setTimeout(()=>{
      setIsLoading(!isLoading);
      setTimeout(()=>(
        router.push('/forgotpassword?step=4')
      ),2000);
    },2000);
    
  };

    

  
  return (
    // <div className='mobile:w-full lg:w-[40%] sm:w-full px-10 py-7 !pt-[60px] w-[40%] flex flex-col items-center justify-between'>
    <>
      <div className=' max-w-[408px] w-full flex flex-col items-center justify-start'>

        <FormHeader>{CreateNewPassword.newPasswordTitle}</FormHeader>
        <FormSubHeader>{CreateNewPassword.newPasswordSubTitle}</FormSubHeader>
        
        <FormInput error=''  label={CreateNewPassword.passwordPlaceholder} type={`${showAndHidePassword ? 'text' : 'password'}`} name="password" value={formData.password} onChange={(e)=>onChange(e)}>
          {
            showAndHidePassword ? (
              <Image className='absolute right-4 bottom-[14px]' width={20} height={16} src={`${IMAGES.PASSWORD_SHOW_ICON_BLACK}`} loader={gumletLoader} onClick={()=>setShowAndHidePassword(!showAndHidePassword)} alt="password_show_icon" />
              
            ) : (
              <Image className='absolute right-4 bottom-[14px]' width={20} height={16} src={`${IMAGES.PASSWORD_HIDE_ICON_BLACK}`} loader={gumletLoader} onClick={()=>setShowAndHidePassword(!showAndHidePassword)} alt="password_hide_icon" />
                
            )
          }
        </FormInput>

        <FormInput error={errorMessage} className='' label={CreateNewPassword.confirmPasswordPlaceholder} type={`${showAndHideConfirmPassword ? 'text' : 'password'}`} name="confirmPassword" value={formData.confirmPassword} onChange={(e)=>onChange(e)}>
          {
            showAndHideConfirmPassword ? (
              <Image className='absolute right-4 bottom-[14px]' width={20} height={16} src={`${IMAGES.PASSWORD_SHOW_ICON_BLACK}`} loader={gumletLoader} onClick={()=>setShowAndHideConfirmPassword(!showAndHideConfirmPassword)} alt="password_show_icon" />
              
            ) : (
              <Image className='absolute right-4 bottom-[14px]' width={20} height={16} src={`${IMAGES.PASSWORD_HIDE_ICON_BLACK}`} loader={gumletLoader} onClick={()=>setShowAndHideConfirmPassword(!showAndHideConfirmPassword)} alt="password_hide_icon" />

            )
          }
        </FormInput>
            
        <Button isLoading={isLoading} className={`mt-24 mb-0 !bg-bg-tertiary-light !text-[#888888] ${isCompleted && '!text-text-tertiary-color !bg-brand-color'}`} onClick={()=>handleSubmit()} disabled={!isCompleted}>{CreateNewPassword.continueButton}</Button>
        <Link className='mt-4 text-base text-brand-color' href="/auth?page=login">Back to Login </Link>
      </div>

    
    </>
  // </div>
  );
};

export default ChangePasswordForm;