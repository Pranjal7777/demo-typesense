import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';

type FilterBarIconProps = {
  width?: string;
  height?: string;
  className?: string;
  primaryColor?: string;
  alt?: string;
  onClick?: () => void;
};

const FilterBarIcon: FC<FilterBarIconProps> = ({
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
      viewBox="0 0 18 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.25 11.5C1.0375 11.5 0.859375 11.428 0.715625 11.2842C0.571875 11.1404 0.5 10.9622 0.5 10.7496C0.5 10.537 0.571875 10.3589 0.715625 10.2154C0.859375 10.0718 1.0375 9.99998 1.25 9.99998H5.12498C5.33748 9.99998 5.5156 10.0719 5.65935 10.2157C5.8031 10.3595 5.87498 10.5377 5.87498 10.7503C5.87498 10.9629 5.8031 11.141 5.65935 11.2846C5.5156 11.4282 5.33748 11.5 5.12498 11.5H1.25ZM1.25 6.74995C1.0375 6.74995 0.859375 6.67805 0.715625 6.53425C0.571875 6.39043 0.5 6.21223 0.5 5.99965C0.5 5.78705 0.571875 5.60896 0.715625 5.46538C0.859375 5.32179 1.0375 5.25 1.25 5.25H10.9327C11.1452 5.25 11.3233 5.3219 11.467 5.4657C11.6108 5.60952 11.6827 5.78772 11.6827 6.0003C11.6827 6.2129 11.6108 6.39099 11.467 6.53458C11.3233 6.67816 11.1452 6.74995 10.9327 6.74995H1.25ZM1.25 1.99998C1.0375 1.99998 0.859375 1.92807 0.715625 1.78425C0.571875 1.64045 0.5 1.46225 0.5 1.24965C0.5 1.03707 0.571875 0.858984 0.715625 0.715401C0.859375 0.571801 1.0375 0.5 1.25 0.5H16.75C16.9625 0.5 17.1406 0.571909 17.2843 0.715726C17.4281 0.859542 17.5 1.03774 17.5 1.25033C17.5 1.46293 17.4281 1.64102 17.2843 1.7846C17.1406 1.92818 16.9625 1.99998 16.75 1.99998H1.25Z"
        fill="#202020"
      />
    </svg>
  );
};

export default FilterBarIcon;