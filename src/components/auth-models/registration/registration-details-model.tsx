
import Link from 'next/link';
import React, { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/ui/button';
// import Model from '@/components/Model/Model'
import FormSubHeader from '@/components/form/form-sub-header';
import FormHeader from '@/components/form/form-header';
import FormLabel from '@/components/form/form-label';
import FormInput from '@/components/form/form-input';


const RegistrationDetailsModel = () => {
  const router=useRouter();

  const [isIndividualOrCompany,setIsIndividualOrCompany]=useState(true);

  const [individualData,setIndividualData]=useState({
    fName:'',
    lName:'',
    accName:'',
    phoneNumber:''
  });

  const [companyData,setCompanyData]=useState({
    fName:'',
    lName:'',
    companyName:'',
    accName:''
  });
  
  // const [isError,setIsError]=useState(false)

  const onIndividualChange=(e:ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=e.target;
    setIndividualData({...individualData,[name]:value});
  }; 

  const onCompanyChange=(e:ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=e.target;
    setCompanyData({...companyData,[name]:value});
  };

  // const { page,step } = router.query;
  const { page } = router.query;

  const handleSubmit=()=>{
    router.push(`/auth?page=${page}&step=4`);
  };

  return (
  // <Model className=' mobile:!h-fit mobile:!max-h-[391px] !overflow-scroll' modelClassName='mobile:px-8'>

    <div className={'mobile:!py-5 mobile:px-5 h-full mobile:w-full sm:w-full border-primary px-10 !pt-7 pb-6 w-[40%] flex flex-col items-center justify-between'}>
      <div className=' max-w-[408px] w-full flex flex-col items-center justify-start'>

        <FormHeader>Complete Registration</FormHeader>
        <FormSubHeader>We just need few more details</FormSubHeader>

        <div className='mt-4 w-full flex flex-col'>
          <FormLabel className='mobile:text-xs mobile:font-normal text-sm mb-2'>Account Type</FormLabel>
          <div className='flex mt-1 items-center justify-between'>
            <Button buttonType='tertiary' className={`mobile:text-base mobile:font-semibold ${isIndividualOrCompany && 'bg-[#fefcf7] text-brand-color !border-brand-color'} border border-bg-tertiary-light w-[48%] h-11 rounded`} onClick={()=>setIsIndividualOrCompany(true)}>Individual</Button>
            <Button buttonType='tertiary' className={`mobile:text-base mobile:font-semibold ${!isIndividualOrCompany && 'bg-[#fefcf7] text-brand-color !border-brand-color'} border border-bg-tertiary-light w-[48%] h-11 rounded`} onClick={()=>setIsIndividualOrCompany(false)}>Company</Button>
          </div>
        </div>

        {
          isIndividualOrCompany ? (
            <>
                        
              <FormInput label='First Name' className='mt-1 px-5 outline-none h-11 border border-bg-tertiary-light rounded' type="text" name="fName" value={individualData.fName} onChange={(e)=>onIndividualChange(e)}/>
                            
              <FormInput label='Last Name' className='mt-1 px-5 outline-none h-11 border border-bg-tertiary-light rounded' type="text" name="lName" value={individualData.lName} onChange={(e)=>onIndividualChange(e)}/>
                            
              <FormInput label='Account Name' className='mt-1 px-5 outline-none h-11 border border-bg-tertiary-light rounded' type="text" name="accName" value={individualData.accName} onChange={(e)=>onIndividualChange(e)}/>
                            
              <FormInput label='Phone Number' className='mt-1 px-5 outline-none h-11 border border-bg-tertiary-light rounded' type="number" name="phoneNumber" value={individualData.phoneNumber} onChange={(e)=>onIndividualChange(e)}/>
                            
            </>

          ) :(
            <>
                            
              <FormInput label='First Name' className='mt-1 px-5 outline-none h-11 border border-bg-tertiary-light rounded' type="text" name="fName" value={companyData.fName} onChange={(e)=>onCompanyChange(e)}/>
                            
              <FormInput label='Last Name' className='mt-1 px-5 outline-none h-11 border border-bg-tertiary-light rounded' type="text" name="lName" value={companyData.lName} onChange={(e)=>onCompanyChange(e)}/>
                            
              <FormInput label='Company' className='mt-1 px-5 outline-none h-11 border border-bg-tertiary-light rounded' type="text" name="companyName" value={companyData.companyName} onChange={(e)=>onCompanyChange(e)}/>
                            
              <FormInput label='Account Name' className='mt-1 px-5 outline-none h-11 border border-bg-tertiary-light rounded' type="text" name="accName" value={companyData.accName} onChange={(e)=>onCompanyChange(e)}/>
                            
            </>
          )        
        }

        <span className='mb-4 mobile:text-xs mobile:font-normal text-xs text-center w-[70%]'>By signing up you are accepting our TERMS & CONDITIONS and PRIVACY POLICY</span>
                

                
        <Button className='mobile:text-base mobile:font-semibold' onClick={()=>handleSubmit()}>Continue</Button>
      </div>

      <div className='mobile:text-xs mobile:font-normal text-sm font-semibold'>
        <span>Already have account?</span>
        <Link className='font-bold text-brand-color' href="/auth?page=login"> Login</Link>
      </div>
    </div>
    // </Model>

    
  );
};

export default RegistrationDetailsModel;
