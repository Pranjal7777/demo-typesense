import React, { FC } from 'react';
import { appClsx } from '@/lib/utils';

type SvgWrapperProps = {
    path: string; // SVG path data
    width?: string;
    height?: string;
    primaryColor?: string;
    className?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
    alt?: string;
    viewBox?:string;
};

const SvgWrapper: FC<SvgWrapperProps> = ({
  path,
  width = '22',
  height = '22',
  primaryColor = '#202020',
  className,
  viewBox = "0 0 20 20",
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={appClsx('cursor-pointer', className)}
    >
      <path d={path} fill={primaryColor} />
    </svg>
  );
};

export default SvgWrapper;
