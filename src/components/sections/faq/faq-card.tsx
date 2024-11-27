// import { gumletLoader } from '@/lib/gumlet';
// import { IMAGES } from '@/lib/images';
import { appClsx } from '@/lib/utils';
// import Image from 'next/image';
import React, { FC } from 'react';
import PlusIcon from '../../../../public/assets/svg/plus-icon';
import { useTheme } from '@/hooks/theme';
import MinusIcon from '../../../../public/assets/svg/minus-icon';

type FaqCardProps = {
  question: string;
  answer: string;
  id: number;
  isOpen: boolean;
  onClick: (_id: number) => void;
};

const FaqCard: FC<FaqCardProps> = ({ question, answer, id, isOpen, onClick }) => {
  const { theme } = useTheme();

  const htmlContent = `${answer}`

  return (
    <div
      className={`flex  flex-col ${
        id === 0 ? '' : 'border-t border-border-tertiary-light dark:border-border-tertiary-dark'
      }`}
    >
      <div
        className="flex  mobile:my-4 my-5 hover:cursor-pointer"
        onClick={() => onClick(id)}
        role="button"
        tabIndex={0}
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(id);
          }
        }}
      >
        <div className=" flex items-center justify-center">
          {isOpen ? (
            <MinusIcon ariaLabel="minus_icon" primaryColor={theme ? '#FFF' : '#202020'} />
          ) : (
            <PlusIcon ariaLabel="plus_icon" primaryColor={theme ? '#FFF' : '#202020'} />
          )}
        </div>
        <div
          className={`break-words ml-5 rtl:ml-0 rtl:mr-5 mobile:text-base  font-semibold text-xl text-text-primary-light dark:text-text-secondary-light`}
        >
          {question}
        </div>
      </div>
      <div
        className={appClsx(
          `${
            isOpen ? 'inline' : 'hidden'
          } mobile:text-sm mt-2 mb-5 mobile:ml-0 ml-8 rtl:ml-0 rtl:mr-10 font-normal text-base text-text-tertiary-light dark:text-text-tertiary-dark`
        )}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
        {/* {answer} */}
      {/* </div> */}
    </div>
  );
};

export default FaqCard;
