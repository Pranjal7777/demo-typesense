import { appClsx } from '@/lib/utils';
import React, { FC, SVGAttributes } from 'react';

type ShoppingBagIconProps = {
  width?: string;
  height?: string;
  primaryColor?: string;
  className?: string;
} & SVGAttributes<SVGElement>;

const ShoppingBagIcon: FC<ShoppingBagIconProps> = ({width = '28',height = '28',primaryColor = 'white',className }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={appClsx('', className)}>
      <path
        d="M2.19492 23.0829C1.61308 23.0829 1.11613 22.8768 0.704067 22.4648C0.29198 22.0527 0.0859375 21.5557 0.0859375 20.9739V7.69193C0.0859375 7.1101 0.29198 6.61314 0.704067 6.20108C1.11613 5.78899 1.61308 5.58295 2.19492 5.58295H4.7526C4.7526 4.12613 5.26339 2.88694 6.28496 1.86537C7.30656 0.843795 8.54576 0.333008 10.0026 0.333008C11.4594 0.333008 12.6986 0.843795 13.7202 1.86537C14.7418 2.88694 15.2525 4.12613 15.2525 5.58295H17.8102C18.3921 5.58295 18.889 5.78899 19.3011 6.20108C19.7132 6.61314 19.9192 7.1101 19.9192 7.69193V20.9739C19.9192 21.5557 19.7132 22.0527 19.3011 22.4648C18.889 22.8768 18.3921 23.0829 17.8102 23.0829H2.19492ZM2.19492 21.3329H17.8102C17.9 21.3329 17.9823 21.2955 18.0571 21.2207C18.1319 21.1459 18.1692 21.0637 18.1692 20.9739V7.69193C18.1692 7.60218 18.1319 7.5199 18.0571 7.4451C17.9823 7.37031 17.9 7.33292 17.8102 7.33292H2.19492C2.10517 7.33292 2.02289 7.37031 1.94808 7.4451C1.8733 7.5199 1.83591 7.60218 1.83591 7.69193V20.9739C1.83591 21.0637 1.8733 21.1459 1.94808 21.2207C2.02289 21.2955 2.10517 21.3329 2.19492 21.3329ZM6.50258 5.58295H13.5026C13.5026 4.61073 13.1623 3.78434 12.4817 3.10378C11.8012 2.42323 10.9748 2.08295 10.0026 2.08295C9.03035 2.08295 8.20397 2.42323 7.52341 3.10378C6.84285 3.78434 6.50258 4.61073 6.50258 5.58295ZM9.98464 13.7496C11.3038 13.7496 12.4888 13.3031 13.5396 12.4101C14.5903 11.5172 15.1097 10.5038 15.0977 9.37006C15.0977 9.12926 15.017 8.92399 14.8554 8.75424C14.6939 8.58447 14.489 8.49959 14.2407 8.49959C14.0358 8.49959 13.8526 8.57026 13.691 8.7116C13.5295 8.85294 13.4151 9.05 13.3478 9.30278C13.1788 10.094 12.7757 10.7413 12.1385 11.2446C11.5013 11.7479 10.7834 11.9996 9.98464 11.9996C9.1859 11.9996 8.46496 11.7479 7.82181 11.2446C7.17865 10.7413 6.77854 10.094 6.62149 9.30278C6.55417 9.03804 6.44573 8.83799 6.29616 8.70262C6.1466 8.56726 5.96936 8.49959 5.76445 8.49959C5.51617 8.49959 5.30827 8.58447 5.14075 8.75424C4.97324 8.92399 4.88948 9.12926 4.88948 9.37006C4.88948 10.5038 5.40886 11.5172 6.44763 12.4101C7.48641 13.3031 8.66541 13.7496 9.98464 13.7496Z"
        fill={primaryColor}
      />
    </svg>
  );
};

export default ShoppingBagIcon;
