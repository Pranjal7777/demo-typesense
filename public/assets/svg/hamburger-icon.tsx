import { appClsx } from '@/lib/utils';
import React, { FC, SVGAttributes } from 'react';

type HamburgerMenuIconProps = {
  width?: string;
  height?: string;
  primaryColor?: string;
  className?: string;
} & SVGAttributes<SVGElement>;

const HamburgerMenuIcon: FC<HamburgerMenuIconProps> = ({
  width = '18',
  height = '12',
  primaryColor = 'white',
  className,
  ...props
}) => {
  return (
    <svg
      className={appClsx('fill-current ', className)}
      width={width}
      height={height}
      {...props}
      viewBox="0 0 18 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 12V10H18V12H0ZM0 7V5H18V7H0ZM0 2V0H18V2H0Z" fill={primaryColor} />
    </svg>
  );
};

export default HamburgerMenuIcon;
