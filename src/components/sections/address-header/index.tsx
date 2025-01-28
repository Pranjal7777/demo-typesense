import React from 'react';
// import UpArrowIconRight from '../../../../public/assets/svg/up_arrow_right'
import LeftArrowIcon from '../../../../public/assets/svg/left-arrow-icon';
import { appClsx } from '@/lib/utils';
import { useTheme } from '@/hooks/theme';
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