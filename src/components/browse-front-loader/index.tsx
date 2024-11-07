import React, { FC } from 'react';
import SectionTitle from '../ui/section-title';
import { appClsx } from '@/lib/utils';

type BrowseFrontLoaderProps={
    data:{
        title:string,
        items:string[]
    },
    className?:string
}

const BrowseFrontLoader:FC<BrowseFrontLoaderProps> = ({data,className}) => {
  return (
    <div className={appClsx('mobile:my-9 py-12 mobile:py-0  border-error flex flex-col items-center justify-center',className)}>
      <SectionTitle className='mb-7 text-2xl font-semibold !p-0 mobile:text-base mobile:font-semibold'>{data.title}</SectionTitle>
      <div className=' text-text-tertiary-light md:grid xl:grid-cols-4 2lg:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 sm:flex sm:flex-col items-center justify-center mobile:grid-cols-4 gap-x-[60px] gap-y-5  '>
        {data.items.map((item,key)=>(
          <div key={key} className='text-nowrap mobile:mb-[14px]'>{item}</div>
        ))}
      </div>
    </div>
  );
};

export default BrowseFrontLoader;