import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import { appClsx } from '@/lib/utils';
import Image from 'next/image';
import React, { FC, useState } from 'react';

export type Props = {
  title: string;
  color?: string;
  className?: string;
  leftText?: string;
  data: string[];
};

const RadioButtonDropdown: FC<Props> = ({ data, title, color, className, leftText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false); // Close dropdown after selection

    if (value == '') {
      setSelectedValue('');
    }
  };

  return (
    <div className={appClsx('cursor-pointer mr-3 rtl:mr-0 rtl:ml-3 relative', className)}>
      <div
        className={appClsx(
          `dark:text-text-primary-dark text-base font-normal border-2 rounded-full flex items-center justify-around px-4 py-[10px] border-border-tertiary-light hover:border-brand-color ${
            color && 'border-' + color
          } ${isOpen && 'border-brand-color dark:border-brand-color'} ${
            selectedValue !== '' && 'border-brand-color dark:border-brand-color'
          } `
        )}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        tabIndex={0}
        role='button'
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); 
            setIsOpen(!isOpen);
          }
        }}
      >
        {leftText && <span className="mr-1 rtl:mr-0 rtl:ml-1 text-text-septenary-light">{leftText}</span>}
        <span
          className={appClsx(
            `${isOpen && 'text-brand-color dark:text-text-primary-dark'} ${
              selectedValue !== '' && 'text-brand-color'
            } ${color && 'text-' + color}`
          )}
        >
          {/*selectedValue ? selectedValue :  title*/ title}
        </span>
        <span>
          {selectedValue === '' ? (
            isOpen ? (
              <>
                <Image
                  width={12}
                  height={7}
                  className=" ml-[10px] rtl:ml-0 rtl:mr-[10px]"
                  src={IMAGES.UP_ARROW_ICON_YELLOW}
                  loader={gumletLoader}
                  alt="up-arrow-icon"
                />
              </>
            ) : (
              <>
                <Image
                  width={12}
                  height={7}
                  className=" ml-[10px] rtl:ml-0 rtl:mr-[10px] dark:hidden inline-block"
                  src={IMAGES.DOWN_ARROW_ICON_BLACK}
                  loader={gumletLoader}
                  alt="down-arrow-icon"
                />
                <Image
                  width={12}
                  height={7}
                  className=" ml-[10px] rtl:ml-0 rtl:mr-[10px] dark:inline-block hidden"
                  src={IMAGES.DOWN_ARROW_ICON_WHITE}
                  loader={gumletLoader}
                  alt="down-arrow-icon"
                />
              </>
            )
          ) : (
            <>
              <Image
                width={12}
                height={7}
                className=" ml-[10px] rtl:ml-0 rtl:mr-[10px]"
                src={IMAGES.DOWN_ARROW_ICON_YELLOW}
                loader={gumletLoader}
                alt="up-arrow-icon"
              />
            </>
          )}
        </span>
      </div>
      <div
        className={`mt-2 rounded-md z-10 bg-bg-secondary-light dark:bg-bg-nonary-dark dark:text-text-primary-dark shadow-md  flex flex-col items-center justify-center left-0 right-0  absolute w-60 ${
          isOpen ? 'inline-block' : 'hidden'
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="rounded-md hover:bg-bg-senary-light flex w-full h-10 items-center hover:text-brand-color dark:bg-bg-nonary-dark dark:hover:bg-bg-denary-dark "
          >
            <input
              className="ml-3 rtl:ml-0 rtl:mr-3 h-4 w-4  accent-brand-color"
              type="checkbox"
              name={title}
              value={item}
              onChange={() => handleSelect(item)}
            />
            <label className="ml-2 rtl:ml-0 rtl:mr-2 text-sm font-medium " htmlFor={title}>
              {item}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioButtonDropdown;
