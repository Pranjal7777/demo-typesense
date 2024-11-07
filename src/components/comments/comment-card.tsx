import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import Image from 'next/image';
import React, { FC } from 'react';

export type Props = {
  item: {
    name: string;
    DateAndTime: string;
    text: string;
  };
};

export const CommentCard: FC<Props> = ({ item }) => {
  return (
    <div className=" flex mobile:mb-3 mb-6 w-full">
      <div className=" ">
        <Image
          className="mobile:h-7 mobile:w-7"
          width={48}
          height={48}
          src={IMAGES.USER_ICON}
          loader={gumletLoader}
          alt="user-image"
        />
      </div>
      <div className="flex flex-col ml-2 rtl:ml-0 rtl:mr-2">
        <div className=" flex mb-2 w-full items-center">
          <div className="mobile:text-xs text-sm font-medium text-text-primary-light dark:text-text-quinary-dark">
            {item.name}&nbsp;&middot;&nbsp;
          </div>
          <div className="text-xs font-normal text-text-tertiary-light mobile:hidden dark:text-text-tertiary-dark">
            {item.DateAndTime}
          </div>
        </div>

        <div className="mobile:text-sm text-text-tertiary-light w-full text-wrap dark:text-text-tertiary-dark">
          {item.text}
        </div>
        <div className="mobile:mt-2 text-xs font-normal text-text-tertiary-light sm:hidden mobile:inline-block dark:text-text-tertiary-dark">
          {item.DateAndTime}
        </div>
      </div>
    </div>
  );
};
