import React from 'react';
import dynamic from 'next/dynamic';
import { appClsx } from '@/lib/utils';
import { useTheme } from '@/hooks/theme';
const LeftArrowIcon = dynamic(() => import('../../../../public/assets/svg/left-arrow-icon'), {
  ssr: false,
});
type Props = {
  className:string,
  children:string,
  iconClassName?:string,
  iconClickEvent?:()=>void
}

function AddressHeader ({className,children,iconClassName,iconClickEvent}:Props) {
  const {theme} = useTheme();
  return (
    <header className={appClsx('relative flex py-[20px] items-center justify-center sm:justify-start dark:text-text-primary-dark ', className)}
    >
      <LeftArrowIcon primaryColor={theme ? '#FFFFFF' : '#000000'} height='16' width='16' onClick={iconClickEvent} className = {appClsx(' absolute left-0 sm:hidden ',iconClassName)}/>
        
      <h1 className='text-[18px] md:text-[24px] font-semibold'>{children}</h1>
        
    </header>
  );
}

export default AddressHeader;