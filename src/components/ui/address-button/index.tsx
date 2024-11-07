import { appClsx } from '@/lib/utils';
import React, { FC, } from 'react';

export type Props = {
  children:string,
  className?: string,
  clickEvent?:()=>void
};

const AddressButton: FC<Props>= ({children ,className,clickEvent=()=>{},...otherProps}) =>{
  return (
    <button
      className={appClsx('bg-brand-color text-[#FFFFFF] text-[16px] font-[600] max-w-[343px] w-[96%] py-[12px] leading-[24px] rounded-[4px] my-[10px] mx-auto ', className)}
      onClick={clickEvent}
      {...otherProps}
          
    >
      {children}
    </button>
  );
};

export default AddressButton;