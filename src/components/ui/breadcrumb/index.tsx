import { appClsx } from '@/lib/utils';
import Link from 'next/link';
import React, { FC } from 'react';

export type Props = {
  steps: {
    name: string;
    link?: string;
  }[];
  className?: string;
  listClassName?: string;
  isLinkDisable?: boolean;
};

const Breadcrumb: FC<Props> = ({ steps, className, listClassName}) => {
  return (
    <ol
      className={appClsx(
        'flex items-center h-full custom-container w-full space-x-2 !pl-[16px] md:!pl-[64px] text-sm mobile:text-xs font-normal dark:text-text-quaternary-dark text-text-tertiary-light',
        className
      )}
    >
      {steps.map((step, index) => (
        <li key={index} className={appClsx(listClassName)}>
          {step.link ? (
            <Link
              href={step.link || '#'}
              className={`rtl:ml-2 ${index === steps.length - 1 ? 'text-brand-color ' : 'text-gray-500'} `}
            >
              {step.name}&nbsp;
            </Link>
          ) : (
            <span
              className={`rtl:ml-2 ${
                index === steps.length - 1 ? 'text-brand-color ' : 'text-gray-500'
              } `}
            >
              {step.name}&nbsp;
            </span>
          )}

          {index < steps.length - 1 && <span className="">&gt;</span>}
        </li>
      ))}
    </ol>
  );
};

// Breadcrumb.propTypes = {
//   steps: PropTypes.arrayOf(PropTypes.string).isRequired
// };

export default Breadcrumb;
