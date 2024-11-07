import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';

type UpArrowRoundedEdgeProps = {
  width?: string;
  height?: string;
  primaryColor?: string;
  className?: string;
};

const UpArrowRoundedEdge: FC<UpArrowRoundedEdgeProps> = ({
  width = '12',
  height = '24',
  primaryColor = '#1C1B1F',
  className,
  ...props
}) => {
  return (
    <svg
      className={appClsx('', className)}
      width={width}
      height={height}
      {...props}
      viewBox="0 0 12 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.99922 2.4002L9.89922 6.3002C10.0826 6.48353 10.3159 6.5752 10.5992 6.5752C10.8826 6.5752 11.1159 6.48353 11.2992 6.3002C11.4826 6.11686 11.5742 5.88353 11.5742 5.6002C11.5742 5.31686 11.4826 5.08353 11.2992 4.9002L6.69922 0.300195C6.59922 0.200196 6.49088 0.129362 6.37422 0.0876953C6.25755 0.0460288 6.13255 0.0251954 5.99922 0.0251954C5.86588 0.0251954 5.74088 0.0460289 5.62422 0.0876954C5.50755 0.129362 5.39922 0.200196 5.29922 0.300195L0.699219 4.9002C0.515885 5.08353 0.424218 5.31686 0.424218 5.6002C0.424218 5.88353 0.515885 6.11686 0.699219 6.3002C0.882552 6.48353 1.11588 6.5752 1.39922 6.5752C1.68255 6.5752 1.91588 6.48353 2.09922 6.3002L5.99922 2.4002Z"
        fill={primaryColor}
      />
    </svg>
  );
};

export default UpArrowRoundedEdge;
