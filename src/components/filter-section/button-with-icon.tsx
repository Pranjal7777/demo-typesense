import { appClsx } from '@/lib/utils';
import React, { FC, ReactNode, useState } from 'react';

export type Props = {
  title: string;
  color?: string;
  children?: ReactNode;
  imageLeftOrRightflag?: boolean;
  className?: string;
};

const ButtonWithIcon: FC<Props> = ({ title, color, children, imageLeftOrRightflag, className }) => {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <>
      <div
        className={appClsx(
          `mr-3 rtl:mr-0 rtl:ml-3 hover:cursor-pointer text-base font-normal border-2 rounded-full flex items-center justify-center px-4 py-[10px] border-border-quaternary-light ${
            color && 'border-' + color
          } ${isClicked && 'border-brand-color'} hover:border-brand-color`,
          className
        )}
        onClick={() => setIsClicked(!isClicked)}
        role='button'
        tabIndex={0}
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); 
            setIsClicked(!isClicked);
          }
        }}
      >
        {!imageLeftOrRightflag && <span className="mr-1 rtl:mr-0 rtl:ml-1">{children}</span>}

        <span
          className={appClsx(
            `dark:text-text-primary-dark text-text-primary-light ${isClicked && '!text-brand-color'} ${
              color && 'text-' + color
            }`
          )}
        >
          {title}
        </span>

        {imageLeftOrRightflag &&
          (isClicked ? (
            <span className="ml-1 rtl:ml-0 rtl:mr-1 border-2  dark:text-text-primary-light dark:bg-brand-color border-brand-color w-6 h-6 flex items-center justify-center rounded-full">
              2
            </span>
          ) : (
            imageLeftOrRightflag && <span className="ml-1 rtl:ml-0 rtl:mr-1">{children}</span>
          ))}
      </div>
    </>
  );
};

export default ButtonWithIcon;
