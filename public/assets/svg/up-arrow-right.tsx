import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';



type UpArrowIconRightProps={
    width?:string
    height?:string
    className?:string
    primaryColor?:string
}



const UpArrowIconRight:FC<UpArrowIconRightProps> = ({ width = '10', height = '10',className,primaryColor = '#202020', ...props }) => {
  return (
    <svg className={appClsx('fill-current ',className)}  width={width} height={height} {...props} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.29425 12.6443L0.25 11.6L10.0905 1.75H1.14425V0.25H12.6443V11.75H11.1443V2.80375L1.29425 12.6443Z" fill={primaryColor}/>
    </svg>
  );
};

export default UpArrowIconRight;



