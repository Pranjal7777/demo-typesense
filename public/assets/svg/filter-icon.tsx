import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';



type FilterIconProps={
    width?:string
    height?:string
    className?:string
    primaryColor?:string,
    alt?:string,
    onClick?: (event: React.MouseEvent) => void;
}



const FilterIcon:FC<FilterIconProps> = ({
  width = '24',
  height = '24',
  primaryColor = '#202020',
  className,
  ...props
}) => {
  return (
    <svg
    width={width}
    height={height}
    {...props}
    className={appClsx('w-auto h-auto', className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.6158 4.64346C21.5004 4.37675 21.3091 4.14986 21.0657 3.99101C20.8223 3.83216 20.5377 3.74836 20.247 3.75002H3.74705C3.45673 3.7506 3.17282 3.8354 2.92976 3.99416C2.68669 4.15291 2.49492 4.37879 2.3777 4.64438C2.26049 4.90998 2.22286 5.20389 2.2694 5.49045C2.31593 5.77701 2.44462 6.04391 2.63986 6.25877L2.64736 6.26721L8.99705 13.0472V20.25C8.99698 20.5215 9.0706 20.7879 9.21004 21.0208C9.34948 21.2538 9.54953 21.4445 9.78885 21.5727C10.0282 21.7008 10.2978 21.7617 10.5689 21.7486C10.8401 21.7356 11.1027 21.6493 11.3286 21.4988L14.3286 19.4981C14.5343 19.3612 14.7029 19.1755 14.8195 18.9576C14.9361 18.7398 14.9971 18.4965 14.997 18.2494V13.0472L21.3477 6.26721L21.3552 6.25877C21.5525 6.04489 21.6824 5.77764 21.7288 5.49037C21.7751 5.2031 21.7358 4.90854 21.6158 4.64346ZM13.7014 12.2419C13.5717 12.3795 13.4987 12.5609 13.497 12.75V18.2494L10.497 20.25V12.75C10.4971 12.5596 10.4247 12.3762 10.2945 12.2372L3.74705 5.25002H20.247L13.7014 12.2419Z"
      fill={primaryColor}
    />
  </svg>
  );
};

export default FilterIcon;