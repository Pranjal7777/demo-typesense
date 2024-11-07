import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';

import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type ServerError={
    title:string,
    subTitle: string,
    link:string,
    linkText:string,
}

const ServerInternalError = () => {

  const { t } = useTranslation('serverError');
  const serverError:ServerError= t('page',{returnObjects:true});

  return (


    <div className=' flex items-center justify-center h-screen'>
      <div className='  w-full flex flex-col items-center justify-center mobile:px-4'>
        <Image width={300} height={300} className='' src={IMAGES.SERVER_ERROR} loader={gumletLoader} alt='not_found'/>
        <FormHeader className='mt-5 text-center'>{serverError.title}</FormHeader>
        <FormSubHeader className='mt-3 text-center max-w-[480px]'>{serverError.subTitle}</FormSubHeader>
                
                
        <FormSubHeader className='  text-center max-w-[554px]'>
          <Link href={'/'} className=' text-brand-color'>
            {serverError.link}
          </Link>

          {serverError.linkText}
        </FormSubHeader>

      </div>
    </div>
 
  );
};

export default ServerInternalError;

export async function getStaticProps({ locale }:{locale:string}) {
   
  return {
    props: {
      ...(await serverSideTranslations(locale,['serverError']))
    },
  };
}
