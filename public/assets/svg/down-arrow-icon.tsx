import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';

type DownArrowIconProps = {
  width?: string;
  height?: string;
  primaryColor?: string;
  className?: string;
};

const DownArrowIcon: FC<DownArrowIconProps> = ({
  width = '10',
  height = '7',
  primaryColor = '#ffffff',
  className,
  ...props
}) => {
  return (
    <svg
      className={appClsx('', className)}
      width={width}
      height={height}
      color={primaryColor}
      {...props}
      viewBox="0 0 10 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 6.8112L0 1.8112L1.16667 0.644531L5 4.47786L8.83333 0.644531L10 1.8112L5 6.8112Z"
        fill={primaryColor}
      />
    </svg>
  );
};

export default DownArrowIcon;
