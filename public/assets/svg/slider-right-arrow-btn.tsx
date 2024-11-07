import { appClsx } from '@/lib/utils';
import React, { FC, SVGAttributes } from 'react';

type SliderRightArrowBtnProps = {
  width?: string;
  height?: string;
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
} & SVGAttributes<SVGElement>;

const SliderRightArrowBtn: FC<SliderRightArrowBtnProps> = ({
  width = '52',
  height = '52',
  primaryColor = '#D9D9D9',
  secondaryColor = 'white',
  className,
  ...props
}) => {
  return (
    <svg
      className={appClsx('', className)}
      width={width}
      height={height}
      {...props}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="52" height="52" rx="26" fill="black" fillOpacity="0.39" />
      <mask id="mask0_114_30665" maskUnits="userSpaceOnUse" x="8" y="8" width="36" height="36">
        <rect x="8" y="8" width="36" height="36" fill={primaryColor} />
      </mask>
      <g mask="url(#mask0_114_30665)">
        <path
          d="M27.42 26.0007L21.3104 19.8911C21.1027 19.6834 20.9964 19.4223 20.9916 19.1079C20.9868 18.7935 21.093 18.5277 21.3104 18.3104C21.5277 18.093 21.7911 17.9844 22.1007 17.9844C22.4103 17.9844 22.6738 18.093 22.8911 18.3104L29.6324 25.0517C29.7728 25.1921 29.8718 25.3401 29.9295 25.4959C29.9872 25.6517 30.0161 25.8199 30.0161 26.0007C30.0161 26.1815 29.9872 26.3497 29.9295 26.5055C29.8718 26.6613 29.7728 26.8093 29.6324 26.9497L22.8911 33.6911C22.6834 33.8988 22.4223 34.005 22.1079 34.0098C21.7935 34.0146 21.5277 33.9084 21.3104 33.6911C21.093 33.4738 20.9844 33.2103 20.9844 32.9007C20.9844 32.5911 21.093 32.3277 21.3104 32.1104L27.42 26.0007Z"
          fill={secondaryColor}
        />
      </g>
    </svg>
  );
};

export default SliderRightArrowBtn;
