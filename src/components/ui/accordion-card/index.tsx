// import useTheme from '@/hooks/theme'
import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import Image from 'next/image';
import React, { FC, useState } from 'react';

export type Props = {
  item: {
    title: string;
    desc: string;
  };
};

const DescriptionDropdown: FC<Props> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [theme] = useTheme();

  return (
    <>
      <div
        className=" cursor-pointer h-[70px] flex justify-between items-center bg-bg-septenary-light dark:bg-bg-secondary-dark px-5 rounded mt-6 dark:text-text-primary-dark text-text-tertiary-light"
        onClick={() => setIsOpen(!isOpen)}
        role='button' tabIndex={0}
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); 
            setIsOpen(!isOpen);
          }
        }}
      >
        <span className="text-xl font-medium mobile:text-sm  text-text-tertiary-light dark:text-text-secondary-light">{item.title}</span>
        {isOpen ? (
          <>
            

            <Image
              className="dark:hidden inline-block"
              width={13}
              height={13}
              src={IMAGES.PLUS_ICON_BLACK}
              loader={gumletLoader}
              alt="plus_icon_white"
            />
            <Image
              className="dark:inline-block hidden"
              width={13}
              height={13}
              src={IMAGES.PLUS_ICON_WHITE}
              loader={gumletLoader}
              alt="plus_icon_white"
            />
          </>
        ) : (
          <>
            <Image
              className="dark:hidden inline-block"
              width={13}
              height={1.5}
              src={IMAGES.MINUS_ICON_BLACK}
              loader={gumletLoader}
              alt="plus_icon_white"
            />
            <Image
              className="dark:inline-block hidden"
              width={13}
              height={1.5}
              src={IMAGES.MINUS_ICON_WHITE}
              loader={gumletLoader}
              alt="plus_icon_white"
            />
          </>
        )}
      </div>
      <span
        className={`text-base mobile:text-xs text-text-tertiary-light dark:text-text-tertiary-dark mt-6  ${
          isOpen ? 'inline-block' : 'hidden'
        }`}
      >
        {item.desc}
      </span>
    </>
  );
};

export default DescriptionDropdown;
