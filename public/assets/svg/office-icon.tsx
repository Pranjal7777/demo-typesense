import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';

type OfficeIconProps = {
  width?: string;
  height?: string;
  className?: string;
  primaryColor?: string;
  ariaLabel?:string;
};

const OfficeIcon: FC<OfficeIconProps> = ({
  width = '22',
  height = '22',
  primaryColor = '#202020',
  className,
  ariaLabel= 'icon',
  ...props
}) => {
  return (
    <svg  
      width={width}
      height={height}
      aria-label={ariaLabel}
      {...props}
      className={appClsx('', className)}
      viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.7692 20.5771C4.3474 20.5771 3.98875 20.4294 3.69325 20.1338C3.39775 19.8383 3.25 19.4797 3.25 19.0579V8.59635C3.25 8.17456 3.39775 7.81591 3.69325 7.5204C3.98875 7.2249 4.3474 7.07715 4.7692 7.07715H7.25V4.59635C7.25 4.17456 7.39775 3.81591 7.69325 3.5204C7.98875 3.2249 8.3474 3.07715 8.7692 3.07715H15.2308C15.6526 3.07715 16.0112 3.2249 16.3067 3.5204C16.6022 3.81591 16.75 4.17456 16.75 4.59635V11.0771H19.2308C19.6526 11.0771 20.0112 11.2249 20.3067 11.5204C20.6022 11.8159 20.75 12.1746 20.75 12.5963V19.0579C20.75 19.4797 20.6022 19.8383 20.3067 20.1338C20.0112 20.4294 19.6526 20.5771 19.2308 20.5771H13.25V16.5771H10.75V20.5771H4.7692ZM4.74995 19.0772H7.25V16.5771H4.74995V19.0772ZM4.74995 15.0771H7.25V12.5771H4.74995V15.0771ZM4.74995 11.0771H7.25V8.57712H4.74995V11.0771ZM8.74995 15.0771H11.25V12.5771H8.74995V15.0771ZM8.74995 11.0771H11.25V8.57712H8.74995V11.0771ZM8.74995 7.07715H11.25V4.57712H8.74995V7.07715ZM12.75 15.0771H15.25V12.5771H12.75V15.0771ZM12.75 11.0771H15.25V8.57712H12.75V11.0771ZM12.75 7.07715H15.25V4.57712H12.75V7.07715ZM16.75 19.0772H19.25V16.5771H16.75V19.0772ZM16.75 15.0771H19.25V12.5771H16.75V15.0771Z" fill={primaryColor}/>
    </svg>

  );
};
export default OfficeIcon;
