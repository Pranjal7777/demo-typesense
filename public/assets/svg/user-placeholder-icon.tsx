import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';

type UserPlaceholderIconProps = {
  width?: string;
  height?: string;
  primaryColor?: string;
  className?: string;
  secondaryColor?: string;
};

const UserPlaceholderIcon: FC<UserPlaceholderIconProps> = ({
  width = '32',
  height = '32',
  primaryColor = '#B7B7B7', // user logo color
  secondaryColor = '#E9E9E9', // background color
  className,
  ...props
}) => {
  return (
    <svg
      className={appClsx(' ', className)}
      width={width}
      height={height}
      {...props}
      viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="36" height="36" rx="18" fill={secondaryColor}/>
      <path fillRule="evenodd" clipRule="evenodd" d="M16.6132 6.77311C19.5234 6.49114 21.4094 7.72931 22.2714 10.4876C22.5485 13.4335 21.2671 15.2907 18.4273 16.0593C16.0344 16.2955 14.321 15.331 13.2875 13.1655C12.4624 10.0064 13.571 7.87561 16.6132 6.77311Z" fill={primaryColor}/>
      <path fillRule="evenodd" clipRule="evenodd" d="M16.3572 19.0397C18.9673 18.9564 21.4724 19.4315 23.8726 20.465C25.0496 20.9803 25.9854 21.7722 26.6801 22.8406C26.8298 23.1444 26.8875 23.4612 26.8528 23.7908C24.2556 27.457 20.6995 29.0839 16.1845 28.6715C12.9088 28.1277 10.3317 26.5008 8.45312 23.7908C8.52986 22.9036 8.91859 22.1693 9.6193 21.588C10.9723 20.5988 12.4697 19.9078 14.1112 19.5148C14.8749 19.3708 15.6236 19.2125 16.3572 19.0397Z" fill={primaryColor}/>

    </svg>
  );
};

export default UserPlaceholderIcon;
