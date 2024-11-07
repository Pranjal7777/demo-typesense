import { appClsx } from '@/lib/utils';
import Link from 'next/link';
import React, { FC } from 'react';

export type Props = {
  children: React.ReactNode;
  className?: string;
  link?: string;
  href?: string;
};

const TextWithLink: FC<Props> = ({ className, children, href = '', link }) => {
  return (
    <>
      <p className={appClsx('text-base font-normal text-[#828282]', className)}>{children}</p>
      {link && <Link href={href}> {link}</Link>}
    </>
  );
};

export default TextWithLink;
