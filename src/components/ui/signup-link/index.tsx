import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';

interface SignUpLinkProps {
  onClick: () => void;
  text: string;
  linkText: string;
  className?: string;
}

const SignUpLink: FC<SignUpLinkProps> = ({ onClick, text, linkText, className }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };
  return (
    <div className={appClsx('mb-7 text-sm ', className)} >
      <span className="text-text-primary-light dark:text-text-primary-dark">{text} </span>
      <span
        className="font-semibold text-brand-color cursor-pointer"
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
      >
        {linkText}
      </span>
    </div>
  );
};

export default React.memo(SignUpLink);
