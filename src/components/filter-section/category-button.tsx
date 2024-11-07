import { appClsx } from '@/lib/utils';
import React, { FC, useState } from 'react';
import styles from '@/styles/CategoryButton.module.css';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';
import { gumletLoader } from '@/lib/gumlet';

type CategoryButtonProps = {
  className: string;
  title: string;
};

export const CategoryButton: FC<CategoryButtonProps> = ({ className, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue] = useState('');

  return (
    <div className={appClsx('cursor-pointer mr-3 rtl:mr-0 rtl:ml-3 relative', styles.myScrollableDiv, className)}>
      <div
        className={appClsx(
          ` dark:text-text-primary-dark text-base font-normal border-2 rounded-full flex items-center justify-around px-4 py-[10px] mobile:px-[13px] mobile:py-[4px] border-border-tertiary-light hover:border-brand-color ${
            isOpen && 'border-brand-color dark:border-brand-color'
          } ${selectedValue !== '' && 'border-brand-color dark:border-brand-color'} `
        )}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        role='button'
        tabIndex={0}
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
        className={` mt-2 rounded-md z-10 overflow-y-scroll bg-bg-secondary-light dark:bg-bg-nonary-dark dark:text-text-primary-dark shadow-md  flex flex-col items-center left-0 right-0  absolute w-[435px] h-[314px] ${
          isOpen ? 'inline-block' : 'hidden'
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className=" flex items-center relative w-full border-b border-border-tertiary-light dark:border-border-tertiary-dark hover:bg-bg-senary-light">
          <input
            className=" px-4 outline-none w-full h-[45px] dark:bg-bg-nonary-dark"
            type="text"
            placeholder="Search for category.."
          />
          <Image
            className="absolute right-5 rtl:right-96 dark:inline hidden"
            width={17}
            height={17}
            src={IMAGES.SEARCH_ICON_WHITE}
            alt="search_icon_white"
            loader={gumletLoader}
          />
          <Image
            className="absolute right-5 rtl:right-96 dark:hidden inline"
            width={17}
            height={17}
            src={IMAGES.SEARCH_ICON_BLACK}
            alt="search_icon_black"
            loader={gumletLoader}
          />
        </div>

        <div className="px-4 flex flex-col  w-full py-3 hover:bg-bg-senary-light dark:hover:bg-bg-denary-dark">
          <div className="flex items-center justify-between">
            <div className="text-sm font-normal text-text-primary-light dark:text-text-primary-dark">Farm Truck</div>
            <div className="text-brand-color bg-bg-duodenary-light text-xs font-normal py-1 px-3 rounded">
              Suggested
            </div>
          </div>
          <div className="flex ">
            <div className="text-xs font-normal text-text-tertiary-light dark:text-text-tertiary-dark">in Truck</div>
          </div>
        </div>

        <div className="px-4 flex flex-col  w-full py-3 hover:bg-bg-senary-light dark:hover:bg-bg-denary-dark">
          <div className="flex items-center justify-between">
            <div className="text-sm font-normal text-text-primary-light dark:text-text-primary-dark">Farm Truck</div>
            <div className="text-brand-color bg-bg-duodenary-light text-xs font-normal py-1 px-3 rounded">
              Suggested
            </div>
          </div>
          <div className="flex ">
            <div className="text-xs font-normal text-text-tertiary-light dark:text-text-tertiary-dark">in Truck</div>
          </div>
        </div>

        <div className="px-4 py-3 text-text-primary-light dark:text-text-primary-dark w-full border-b border-border-tertiary-light dark:border-border-tertiary-dark hover:bg-bg-senary-light dark:hover:bg-bg-denary-dark">
          All Categories
        </div>

        <div className="px-4 py-3 text-text-primary-light dark:text-text-primary-dark w-full hover:bg-bg-senary-light dark:hover:bg-bg-denary-dark">
          Trucks
        </div>

        <div className="px-4 py-3 text-text-primary-light dark:text-text-primary-dark w-full hover:bg-bg-senary-light dark:hover:bg-bg-denary-dark">
          Nearby
        </div>
      </div>
    </div>
  );
};
