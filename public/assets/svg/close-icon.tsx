import { appClsx } from '@/lib/utils';
import React, { FC, SVGAttributes } from 'react';

type CloseIconProps = {
  width?: string;
  height?: string;
  className?: string;
  primaryColor?: string;
} & SVGAttributes<SVGSVGElement>;

const CloseIcon: FC<CloseIconProps> = ({
  width = '22',
  height = '22',
  primaryColor = '#202020',
  className,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      {...props}
      className={appClsx('cursor-pointer', className)}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.33522 11.5448L0.457031 10.6666L5.1237 5.99993L0.457031 1.33327L1.33522 0.455078L6.00189 5.12174L10.6686 0.455078L11.5467 1.33327L6.88007 5.99993L11.5467 10.6666L10.6686 11.5448L6.00189 6.87812L1.33522 11.5448Z"
        fill={primaryColor}
      />
    </svg>
  );
};
export default CloseIcon;
