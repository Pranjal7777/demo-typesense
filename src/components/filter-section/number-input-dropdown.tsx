import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import { appClsx } from '@/lib/utils';
import Image from 'next/image';
import React, { FC, useState } from 'react';

type NumberInputDropdownProps = {
  className: string;
  title: string;
};

const NumberInputDropdown: FC<NumberInputDropdownProps> = ({ className, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [max, setMax] = useState(0);
  const [min, setMin] = useState<number>();

  const handleClear = () => {
    setMax(0);
    setMin(0);
    setSelectedValue('');
  };

  const handleSubmit = () => {
    setSelectedValue(`USD ${min} - USD ${max}`);
  };

  return (
    <div className={appClsx('cursor-pointer mr-3 rtl:mr-0 rtl:ml-3 relative', className)}>
      <div
        className={appClsx(
          `dark:text-text-primary-dark text-base font-normal border-2 rounded-full flex items-center justify-around px-4 py-[10px] border-border-tertiary-light hover:border-brand-color ${
            isOpen && 'border-brand-color dark:border-brand-color'
          } ${selectedValue !== '' && 'border-brand-color dark:border-brand-color'} `
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
        <span
          className={appClsx(
            `${isOpen && 'text-brand-color dark:text-text-primary-dark'} ${selectedValue !== '' && 'text-brand-color'} `
          )}
        >
          {selectedValue !== '' ? selectedValue : title}
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
        className={`mt-2 rounded-md z-10 bg-bg-secondary-light dark:bg-bg-nonary-dark dark:text-text-primary-dark shadow-md  flex flex-col items-center justify-between left-0 right-0  absolute w-[435px] h-[154px] ${
          isOpen ? 'inline-block' : 'hidden'
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="w-full flex items-center justify-between py-6  px-4 text-sm">
          <div className="relative flex items-center justify-between text-text-primary-light dark:text-text-primary-dark">
            <span className="absolute ml-3 rtl:ml-0 rtl:mr-3 ">USD</span>
            <input
              type="number"
              className="outline-none border py-[14px] px-12 rounded w-[194px] border-border-tertiary-light dark:border-border-tertiary-dark bg-bg-secondary-light dark:bg-bg-nonary-dark"
              placeholder="Minimum"
              value={min}
              onChange={(e) => setMin(parseFloat(e.target.value))}
            />
          </div>

          <div className="relative flex items-center justify-between text-text-primary-light dark:text-text-primary-dark">
            <span className="absolute ml-3 rtl:ml-0 rtl:mr-3">USD</span>
            <input
              type="number"
              className="outline-none border py-[14px] px-12 rounded w-[194px] border-border-tertiary-light dark:border-border-tertiary-dark bg-bg-secondary-light dark:bg-bg-nonary-dark"
              placeholder="Maximum"
              value={max}
              onChange={(e) => setMax(parseFloat(e.target.value))}
            />
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-end py-3 px-4 text-base font-medium">
          <button
            className="border h-[34px] px-8 rounded border-border-octonary-light dark:border-x-border-octonary-light dark:text-brand-color text-text-primary-light fonte"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            className=" h-[34px] px-8 ml-2 rtl:ml-0 rtl:mr-2 rounded bg-brand-color text-text-undenary-light"
            onClick={handleSubmit}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default NumberInputDropdown;
