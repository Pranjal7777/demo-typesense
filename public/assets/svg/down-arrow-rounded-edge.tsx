import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';

type DownArrowRoundedEdgeProps = {
  width?: string;
  height?: string;
  primaryColor?: string;
  className?: string;
  onClick?:()=>void;
};

const DownArrowRoundedEdge: FC<DownArrowRoundedEdgeProps> = ({
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
      color={primaryColor}
      {...props}
      viewBox="0 0 12 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.99922 4.5998L9.89922 0.699805C10.0826 0.516471 10.3159 0.424805 10.5992 0.424805C10.8826 0.424805 11.1159 0.516471 11.2992 0.699805C11.4826 0.883138 11.5742 1.11647 11.5742 1.3998C11.5742 1.68314 11.4826 1.91647 11.2992 2.0998L6.69922 6.6998C6.59922 6.7998 6.49088 6.87064 6.37422 6.9123C6.25755 6.95397 6.13255 6.9748 5.99922 6.9748C5.86588 6.9748 5.74088 6.95397 5.62422 6.9123C5.50755 6.87064 5.39922 6.7998 5.29922 6.6998L0.699219 2.0998C0.515885 1.91647 0.424218 1.68314 0.424218 1.3998C0.424218 1.11647 0.515885 0.883138 0.699219 0.699804C0.882552 0.516471 1.11588 0.424804 1.39922 0.424804C1.68255 0.424804 1.91588 0.516471 2.09922 0.699804L5.99922 4.5998Z"
        fill={primaryColor}
      />
    </svg>
  );
};

export default DownArrowRoundedEdge;
