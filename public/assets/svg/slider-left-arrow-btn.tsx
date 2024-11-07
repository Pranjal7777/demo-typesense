import { appClsx } from '@/lib/utils';
import React, { FC, SVGAttributes } from 'react';

type RightArrowRoundedEdgeProps = {
  width?: string;
  height?: string;
  primaryColor?: string;
  secondaryColor?:string;
  className?: string;
} & SVGAttributes<SVGElement>;

const SliderLeftArrowBtn: FC<RightArrowRoundedEdgeProps> = ({
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
      <rect width="52" height="52" rx="26" transform="matrix(-1 0 0 1 52 0)" fill="black" fillOpacity="0.39" />
      <mask id="mask0_114_30670" maskUnits="userSpaceOnUse" x="8" y="8" width="36" height="36">
        <rect width="36" height="36" transform="matrix(-1 0 0 1 44 8)" fill={primaryColor} />
      </mask>
      <g mask="url(#mask0_114_30670)">
        <path
          d="M24.58 26.0007L30.6896 19.8911C30.8973 19.6834 31.0036 19.4223 31.0084 19.1079C31.0132 18.7935 30.907 18.5277 30.6896 18.3104C30.4723 18.093 30.2089 17.9844 29.8993 17.9844C29.5897 17.9844 29.3262 18.093 29.1089 18.3104L22.3676 25.0517C22.2272 25.1921 22.1282 25.3401 22.0705 25.4959C22.0128 25.6517 21.9839 25.8199 21.9839 26.0007C21.9839 26.1815 22.0128 26.3497 22.0705 26.5055C22.1282 26.6613 22.2272 26.8093 22.3676 26.9497L29.1089 33.6911C29.3166 33.8988 29.5777 34.005 29.8921 34.0098C30.2065 34.0146 30.4723 33.9084 30.6896 33.6911C30.907 33.4738 31.0156 33.2103 31.0156 32.9007C31.0156 32.5911 30.907 32.3277 30.6896 32.1104L24.58 26.0007Z"
          fill={secondaryColor}
        />
      </g>
    </svg>
  );
};

export default SliderLeftArrowBtn;

