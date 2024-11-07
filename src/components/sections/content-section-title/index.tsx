import { appClsx } from '@/lib/utils';
import React, { FC, HTMLAttributes } from 'react';

type ContentSectionPageProps={
    className?: string;
} & HTMLAttributes<HTMLHeadingElement>;

const ContentSectionTitle:FC<ContentSectionPageProps> = ({children,className,...otherProps }) => {
  return (
    <h3 className={appClsx('mb-4  font-bold border-border-tertiary-light dark:border-border-tertiary-dark dark:text-text-primary-dark',className)} {...otherProps}>
      {children}
    </h3>
  );
};

export default ContentSectionTitle;

