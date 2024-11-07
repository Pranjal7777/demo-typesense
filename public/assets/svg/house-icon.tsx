import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';

type HouseIconProps = {
  width?: string;
  height?: string;
  className?: string;
  primaryColor?: string;
  ariaLabel?: string;
};

const HouseIcon: FC<HouseIconProps> = ({
  width = '22',
  height = '22',
  primaryColor = '#202020',
  ariaLabel='icon',
  className,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      aria-label={ariaLabel}
      {...props}
      className={appClsx('', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 18.5V10.2212L6.34615 6.29808H7.5V4.5H8.99998V6.29808H17.6538L21.5 10.2212V18.5H2.5ZM15.5 17H20V10.8442L17.7596 8.5365L15.5 10.8635V17ZM3.99998 17H14V11.8942H3.99998V17Z"
        fill={primaryColor}
      />
    </svg>
  );
};
export default HouseIcon;
