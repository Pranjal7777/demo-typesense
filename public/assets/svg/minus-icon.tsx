import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';

type MinusIconProps = {
  width?: string;
  height?: string;
  className?: string;
  primaryColor?: string;
  ariaLabel?: string;
};

const MinusIcon: FC<MinusIconProps> = ({
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
      className={appClsx('', className)} viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.5 1.74995V0.25H13.5V1.74995H0.5Z" fill={primaryColor}/>
    </svg>

  );
};
export default MinusIcon;

