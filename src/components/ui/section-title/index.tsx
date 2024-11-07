import { appClsx } from '@/lib/utils';
import React, { FC, HTMLAttributes } from 'react';

type SectionTitleProps = {
  className?: string;
} & HTMLAttributes<HTMLHeadingElement>;

const SectionTitle: FC<SectionTitleProps> = ({ children, className, ...otherProps }) => {
  return (
    <h3
      className={appClsx(
        'font-semibold text-lg leading-[27px] md:text-2xl md:leading-9 text-text-primary-light dark:text-text-secondary-light',
        className
      )}
      {...otherProps}
    >
      {children}
    </h3>
  );
};

export default SectionTitle;
