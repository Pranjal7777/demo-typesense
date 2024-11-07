import React from 'react';

type TextWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

const TextWrapper: React.FC<TextWrapperProps> = ({ children, className, ...props }) => {
  return (
    <p className={`text-bg-primary-light dark:text-bg-secondary-light font-normal ${className}`} {...props}>
      {children}
    </p>
  );
};

export default TextWrapper;
