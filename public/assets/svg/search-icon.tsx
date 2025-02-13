import { appClsx } from '@/lib/utils';
import React, { FC, SVGAttributes } from 'react';

type SearchIconProps = {
  width?: number;
  height?: number;
  className?: string;
  primaryColor?: string;
} & SVGAttributes<SVGSVGElement>;

const SearchIcon: FC<SearchIconProps> = ({
  width = 20,
  height = 20,
  primaryColor = '#57585A',
  className,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      {...props}
      className={appClsx('w-auto h-auto', className)}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5408 17.5769L10.26 11.2961C9.75999 11.7089 9.18499 12.032 8.53499 12.2654C7.88499 12.4987 7.21256 12.6154 6.51769 12.6154C4.80853 12.6154 3.36201 12.0236 2.17814 10.84C0.994277 9.65643 0.402344 8.21029 0.402344 6.50157C0.402344 4.79284 0.994127 3.34617 2.17769 2.16155C3.36126 0.976949 4.80741 0.384649 6.51614 0.384649C8.22486 0.384649 9.67153 0.976584 10.8561 2.16045C12.0408 3.34432 12.6331 4.79083 12.6331 6.5C12.6331 7.2141 12.5132 7.89615 12.2734 8.54615C12.0337 9.19615 11.7138 9.76153 11.3138 10.2423L17.5946 16.5231L16.5408 17.5769ZM6.51769 11.1154C7.80616 11.1154 8.89751 10.6683 9.79174 9.77405C10.686 8.87982 11.1331 7.78847 11.1331 6.5C11.1331 5.21153 10.686 4.12018 9.79174 3.22595C8.89751 2.33172 7.80616 1.8846 6.51769 1.8846C5.22923 1.8846 4.13788 2.33172 3.24364 3.22595C2.34943 4.12018 1.90232 5.21153 1.90232 6.5C1.90232 7.78847 2.34943 8.87982 3.24364 9.77405C4.13788 10.6683 5.22923 11.1154 6.51769 11.1154Z"
        fill={primaryColor}
      />
    </svg>
  );
};
export default SearchIcon;
