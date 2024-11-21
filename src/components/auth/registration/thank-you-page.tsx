import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';
import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';


import React from 'react';
import { useRouter } from 'next/router';
import { appClsx } from '@/lib/utils';
import { useTheme } from '@/hooks/theme';
import { useActions } from '@/store/utils/hooks';
import DownArrowRoundedEdge from '../../../../public/assets/svg/down-arrow-rounded-edge';
import PrimaryLogo from '../../../../public/assets/svg/primary-logo';
import ThankYouImage from '../../../../public/assets/images/thankyou_logo.svg';
import { PROJECT_NAME } from '@/config';

export type ThankyouPage = {
  thanksMessage: string;
  welcomeMessage: string;
  nextStepsMessage: string;
  buyOption: string;
  sellOption: string;
}

const ThankYouPage = () => {
  const router=useRouter();
  const {theme}=useTheme();
  const { t } = useTranslation('auth');
  const ThankyouPage = t('page.thankyouPage', { returnObjects: true, projectName: PROJECT_NAME}) as ThankyouPage;
  const {setUserDetailsDispatch} = useActions();

  const {data} = router.query;
  const buttonClickHandler = ()=>{
    if(typeof data == 'string'){
      setUserDetailsDispatch(JSON.parse(data));
      // console.log(JSON.parse(data),'qu');
    }
  };
  const backIconHandler =()=>{
    router.back();
  };
  

  return (
    // <div className=' lg:w-[40%] sm:w-full mobile:w-full px-10 py-7 !pt-[60px] w-[40%] flex flex-col items-center justify-between'>
    <>
      {/* bg image */}
      {
        (router.pathname.includes('/signup') && router.query.step !== undefined )? <div className='md:hidden'>
          <DownArrowRoundedEdge onClick={backIconHandler}  height='16px' width='14px' className='hidden z-50 cursor-pointer dark:inline-block rotate-90 absolute left-4 top-4' primaryColor='#FFF'/>
          <DownArrowRoundedEdge onClick={backIconHandler}  height='16px' width='14px' className=' dark:hidden z-50 cursor-pointer rotate-90 absolute left-4 top-4' primaryColor='#FFF'/>        
        </div>
          : null
      }
      <Image width={300} height={300} className={`h-screen object-cover w-screen absolute ${theme ? '' : 'z-[10]'}`} src={IMAGES.THANK_YOU_PAGE_BG_IMAGE} alt="thank_you" 
      // loader={gumletLoader}
      />
   
      
      <div className='z-10 mobile:px-4 sm:max-w-[408px] w-full mobile:w-full flex flex-col items-center justify-center h-full light:bg-bg-secondary-light'>
        <Link href={'/'} className={'sm:mt-20 sm:mb-10 mobile:mt-14 mobile:mb-10 z-10'}>
          {/* <Image onClick={()=>{router.push('/');}} className={appClsx('')} width={126} height={36} src={IMAGES.PRIMARY_LOGO_WHITE_OTHER} alt="left_banner" loader={gumletLoader}/> */}
          <PrimaryLogo secondaryColor='#FFF' logoType='secondary' onClick={buttonClickHandler}/>
        </Link>
    

        <FormHeader className='text-[#FFF] text-[28px]'>{ThankyouPage.thanksMessage}</FormHeader> 
        <FormSubHeader className='!text-text-primary-dark'>{ThankyouPage.welcomeMessage}</FormSubHeader> 

        {/* <Image width={300} height={300} src={IMAGES.THANK_YOU_LOGO} alt="thank_you" loader={gumletLoader}/> */}

      
        {/* <Button onClick={()=>handleSubmit()} >Continue</Button> */}
        <span className='text-xl  font-medium mt-4 text-[#FFF] '>{ThankyouPage.nextStepsMessage}</span>
        <div className=' flex my-20 mb-[50px] w-full gap-x-3 mt-6 items-center justify-center'>
              
          <button onClick={buttonClickHandler}  className="w-[166px] h-[48px] md:h-[44px] md:w-[198px] rounded-[4px] text-[16px] font-semibold  bg-[#FFF] !text-brand-color  hover:!scale-100 " >
            <Link href={'/'} className=' w-full h-full flex items-center justify-center'> {ThankyouPage.buyOption}</Link>  
          </button>
           
          {/* <button onClick={buttonClickHandler}  className='w-[166px] h-[48px] md:h-[44px] md:w-[198px] rounded-[4px] text-[16px] font-semibold bg-transparent border border-border-[#FFF] text-text-primary-dark  hover:!scale-100 '  >
            <Link href={'/'} className=' w-full h-full flex items-center justify-center'> {ThankyouPage.sellOption}</Link>
          </button> */}
          
        </div>
      </div>
    </>

      
  // </div>
  );
};

export default ThankYouPage;