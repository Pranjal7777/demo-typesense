import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';



type LeftArrowIconProps={
    width?:string
    height?:string
    className?:string
    primaryColor?:string,
    alt?:string,
    onClick?:()=>void
}



const LeftArrowIcon:FC<LeftArrowIconProps> = ({
  width = '18',
  height = '18',
  primaryColor = '#202020',
  className,
  ...props
}) => {
  return (
    <svg width={width} 
      height={height}
      viewBox="0 0 13 12" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={appClsx('cursor-pointer', className)}
      {...props}
    >
      <path d="M2.14258 6.62474L6.45029 10.9325C6.57422 11.0564 6.63538 11.2014 6.63377 11.3675C6.63217 11.5337 6.56674 11.6814 6.43746 11.8106C6.30819 11.9314 6.16183 11.9939 5.99837 11.9981C5.83492 12.0024 5.68856 11.9399 5.55929 11.8106L0.275646 6.52699C0.19766 6.44901 0.142639 6.36674 0.110583 6.2802C0.0785277 6.19367 0.0625 6.10019 0.0625 5.99976C0.0625 5.89933 0.0785277 5.80585 0.110583 5.71933C0.142639 5.63278 0.19766 5.55052 0.275646 5.47253L5.55929 0.188889C5.67467 0.0734996 5.81756 0.0144719 5.98796 0.0118052C6.15836 0.00913853 6.30819 0.0681663 6.43746 0.188889C6.56674 0.318152 6.63137 0.466652 6.63137 0.634388C6.63137 0.802124 6.56674 0.950625 6.43746 1.07989L2.14258 5.37478H11.6234C11.8007 5.37478 11.9492 5.43461 12.0689 5.55426C12.1885 5.67392 12.2484 5.82242 12.2484 5.99976C12.2484 6.17711 12.1885 6.32561 12.0689 6.44526C11.9492 6.56492 11.8007 6.62474 11.6234 6.62474H2.14258Z" fill={primaryColor}/>
    </svg>
  );
};

export default LeftArrowIcon;