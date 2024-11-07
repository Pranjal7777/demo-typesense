import { appClsx } from '@/lib/utils';
import React, { FC, HTMLAttributes } from 'react';

type ContentSectionPageTitleProps={
    className: string;
} & HTMLAttributes<HTMLHeadingElement>;

const ContentSectionPageTitle:FC<ContentSectionPageTitleProps> = ({children,className,...otherProps }) => {
  return (
    <h2 className={appClsx('sm:mb-12 mobile:mb-9 mobile:text-center text-4xl mobile:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark',className)} {...otherProps}>
      {children}
    </h2>
  );
};

export default ContentSectionPageTitle;

