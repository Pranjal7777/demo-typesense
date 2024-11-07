import React, { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { IMAGES } from '@/lib/images';
import Image from 'next/image';
import Button from '@/components/ui/button';
// import Model from '@/components/Model/Model'
import { gumletLoader } from '@/lib/gumlet';
import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';
import FormInput from '@/components/form/form-input';

const ChangePasswordFormModel = () => {
  const router=useRouter();

  const [formData,setFormData]=useState({
    password:'',
    confirmPassword:''
  });
  
  const [showAndHidePassword,setShowAndHidePassword]=useState(false);
  const [showAndHideConfirmPassword,setShowAndHideConfirmPassword]=useState(false);

  // const [isError,setIsError]=useState(false)


  const onChange=(e:ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=e.target;
    setFormData({...formData,[name]:value});
  };
  // const { page,step } = router.query;
  const { page } = router.query;

  const handleSubmit=()=>{
    router.push(`/auth?page=${page}&step=3`);
  };

  return (
  // <Model className=' mobile:!h-fit mobile:!max-h-[391px] !overflow-auto' modelClassName='mobile:px-8'>

    <div className={' mobile:!py-5 mobile:px-5 h-full mobile:w-full sm:w-full border-primary px-10 !pt-7 pb-6 w-[40%] flex flex-col items-center justify-between'}>
      <div className=' max-w-[408px] w-full flex flex-col items-center justify-start'>

        <FormHeader >Enter New Password</FormHeader>
        <FormSubHeader>Please enter new password here</FormSubHeader>

        <FormInput label='Password'  type={`${showAndHidePassword ? 'text' : 'password'}`} name="password" value={formData.password} onChange={(e)=>onChange(e)}>
          <Image className='absolute right-4 bottom-[14px]' width={20} height={16} src={`${IMAGES.PASSWORD_HIDE_ICON_BLACK}`} loader={gumletLoader}  onClick={()=>setShowAndHidePassword(!showAndHidePassword)} alt="password_hide_icon" />
        </FormInput>
             
        <FormInput label='Password' type={`${showAndHideConfirmPassword ? 'text' : 'password'}`} name="confirmPassword" value={formData.confirmPassword} onChange={(e)=>onChange(e)}>
          <Image className='absolute right-4 bottom-[14px]' width={20} height={16} src={`${IMAGES.PASSWORD_HIDE_ICON_BLACK}`} loader={gumletLoader}  onClick={()=>setShowAndHideConfirmPassword(!showAndHideConfirmPassword)} alt="password_hide_icon" />
        </FormInput>
            
        <Button className='mobile:text-base mt-24 mobile:font-semibold' onClick={()=>handleSubmit()} >Change Password</Button>
      </div>

    </div>
    // </Model>
  );
};

export default ChangePasswordFormModel;