import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';



type MailIconProps={
    width?:string
    height?:string
    className?:string
    primaryColor?:string,
    alt?:string,
    onClick?: () => void;
    ariaLabel?: string;
}



const MailIcon:FC<MailIconProps> = ({
  width = '20',
  height = '20',
  primaryColor = '#FFF',
  ariaLabel = 'mail_icon',
  className,
  ...props
}) => {
  return (
    <svg width={width} height={height} 
      viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaLabel}
      {...props}
      className={appClsx(' cursor-pointer', className)}
    >
      <path d="M2.52695 17.7499C1.93763 17.7499 1.4388 17.5458 1.03047 17.1374C0.622135 16.7291 0.417969 16.2303 0.417969 15.641V2.35898C0.417969 1.76966 0.622135 1.27083 1.03047 0.8625C1.4388 0.454167 1.93763 0.25 2.52695 0.25H20.4756C21.0649 0.25 21.5637 0.454167 21.9721 0.8625C22.3804 1.27083 22.5846 1.76966 22.5846 2.35898V15.641C22.5846 16.2303 22.3804 16.7291 21.9721 17.1374C21.5637 17.5458 21.0649 17.7499 20.4756 17.7499H2.52695ZM11.5013 9.45763C11.5985 9.45763 11.695 9.44304 11.7907 9.41388C11.8864 9.38471 11.9791 9.3447 12.0689 9.29385L20.4128 3.95183C20.5459 3.86958 20.6402 3.76302 20.6955 3.63214C20.7509 3.50126 20.7673 3.36328 20.7449 3.2182C20.7299 2.94898 20.5983 2.74893 20.35 2.61807C20.1017 2.48719 19.8512 2.49878 19.5984 2.65284L11.5013 7.8333L3.40414 2.65284C3.15136 2.49878 2.90271 2.48644 2.65817 2.61583C2.41362 2.74519 2.28012 2.94224 2.25769 3.20698C2.23525 3.36403 2.2517 3.50986 2.30704 3.64448C2.36237 3.77909 2.4566 3.88154 2.58972 3.95183L10.9337 9.29385C11.0234 9.3447 11.1161 9.38471 11.2119 9.41388C11.3076 9.44304 11.4041 9.45763 11.5013 9.45763Z" fill={primaryColor}/>

    </svg>
  );
};

export default MailIcon;