import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';

type PlusIconProps = {
  width?: string;
  height?: string;
  className?: string;
  primaryColor?: string;
  ariaLabel?: string;
};

const PlusIcon: FC<PlusIconProps> = ({
  width = '13',
  height = '13',
  primaryColor = '#202020',
  ariaLabel = 'icon',
  className,
  ...props
}) => {
  return (
    <svg   width={width}
      height={height}
      aria-label={ariaLabel}
      {...props}
      className={appClsx('', className)} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.25 7.74995H0.5V6.25H6.25V0.5H7.74995V6.25H13.5V7.74995H7.74995V13.5H6.25V7.74995Z" fill={primaryColor}/>
    </svg>

  );
};
export default PlusIcon;
