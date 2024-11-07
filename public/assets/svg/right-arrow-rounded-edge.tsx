import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';

type RightArrowRoundedEdgeProps = {
  width?: string;
  height?: string;
  primaryColor?: string;
  className?: string;
};

const RightArrowRoundedEdge: FC<RightArrowRoundedEdgeProps> = ({
  width = '22',
  height = '22',
  primaryColor = '#6D3EC1',
  className,
  ...props
}) => {
  return (
    <svg
      className={appClsx('', className)}
      width={width}
      height={height}
      {...props}
      viewBox="0 0 10 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.41216 9.00071L1.30255 2.89106C1.09485 2.68339 0.988601 2.42234 0.983801 2.10791C0.978976 1.79351 1.08523 1.52766 1.30255 1.31036C1.51985 1.09304 1.7833 0.984375 2.0929 0.984375C2.4025 0.984375 2.66595 1.09304 2.88325 1.31036L9.62459 8.0517C9.76499 8.19207 9.86403 8.34015 9.9217 8.49592C9.9794 8.65167 10.0083 8.81994 10.0083 9.00071C10.0083 9.18149 9.9794 9.34975 9.9217 9.5055C9.86403 9.66127 9.76499 9.80935 9.62459 9.94973L2.88325 16.6911C2.67558 16.8988 2.41453 17.005 2.1001 17.0098C1.7857 17.0146 1.51985 16.9084 1.30255 16.6911C1.08523 16.4738 0.976562 16.2103 0.976562 15.9007C0.976562 15.5911 1.08523 15.3277 1.30255 15.1104L7.41216 9.00071Z"
        fill={primaryColor}
      />
    </svg>
  );
};

export default RightArrowRoundedEdge;
