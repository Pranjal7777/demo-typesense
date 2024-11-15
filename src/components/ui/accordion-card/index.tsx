// import useTheme from '@/hooks/theme'
import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import Image from 'next/image';
import React, { FC, useState } from 'react';
import { useTheme } from '@/hooks/theme';
import DownArrowRoundedEdge from '../../../../public/assets/svg/down-arrow-rounded-edge';
import UpArrowRoundedEdge from '../../../../public/assets/svg/up-arrow-rounded-edge';

export type Props = {
  item: {
    title: string;
    desc: string;
  };
};

const DescriptionDropdown: FC<Props> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {theme}=useTheme();

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
           {
          isOpen ? (
            <UpArrowRoundedEdge primaryColor={theme ? 'white' :  'black'} className={`sm:hidden `}/>
                    
          ) : (

            <DownArrowRoundedEdge primaryColor={theme ? 'white' :  'black'} className={`sm:hidden `}/>
          )
        }
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
