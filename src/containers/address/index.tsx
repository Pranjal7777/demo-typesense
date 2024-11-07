import { appClsx } from '@/lib/utils';
import React, { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

const AddressContainer:FC<Props> = ({children,className=''}) =>{
  return (
    <div 
      className={appClsx('w-full px-[4%] sm:px-0 h-[79vh] flex justify-center md:block sm:h-[77vh] overflow-y-scroll  bg-[#FFFFFF] dark:bg-bg-primary-dark', className)}>
      <div className=' h-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px]'>
        {children}
      </div>
    </div>
  );
};

export default AddressContainer;