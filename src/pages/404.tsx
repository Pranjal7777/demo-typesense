import Button, { BUTTON_TYPE_CLASSES } from '@/components/ui/button';
import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';


import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type NotFound={
    title:string,
    subTitle:string,
    btnText:string
}

const PageNotFound = () => {

  const { t } = useTranslation('notFound');
  const notFound = t('page',{returnObjects:true}) as NotFound;

  return (


    <div className=' flex items-center justify-center h-screen border-2 '>
      <div className=' max-w-[598px] w-full flex flex-col items-center justify-center mobile:px-4'>
        <Image width={300} height={300} className='' src={IMAGES.PAGE_NOT_FOUND} loader={gumletLoader} alt='not_found'/>
        <FormHeader className='mt-5 text-center'>{notFound.title}</FormHeader>
        <FormSubHeader className='mt-3 text-center'>{notFound.subTitle}</FormSubHeader>
              
        <Link href={'/'} className='mt-12 border-error max-w-[408px] w-full'>
          <Button className=' ' buttonType={BUTTON_TYPE_CLASSES.primary}>{notFound.btnText}</Button>

        </Link>
      </div>
    </div>

  );
};

export default PageNotFound;

export async function getStaticProps({ locale }:{locale:string}) {
   
  return {
    props: {
      ...(await serverSideTranslations(locale,['notFound']))
    },
  };
}
