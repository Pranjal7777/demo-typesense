import { STATIC_IMAGE_URL } from '@/config';
import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import Image from 'next/image';
import React, { FC } from 'react';

export type category = {
  images?: { url: string }[];
  firstName: string;
  lastName: string;
  userName: string;
};

export type Props = {
  item: category;
};

const SearchUserAndCategoryCard: FC<Props> = ({ item }) => {
  return (
    <div className="cursor-pointer dark:hover:bg-menu-hover hover:bg-bg-tertiary-light w-full h-16 flex items-center justify-between">
      <div className=" flex w-full h-full items-center">
        <Image
          className="rounded-full h-10"
          width={40}
          height={40}
          src={item.images?.[0]?.url ? `${STATIC_IMAGE_URL}/${item.images[0].url}` : '/images/user-profile-icon-black.svg'}
          // src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"

          alt={''}
        />
        <div className="ml-2 rtl:mr-2 rtl:ml-0">
          <div className="text-sm font-medium">
            {item.firstName} {item.lastName}
          </div>
          <div className="text-xs font-normal text-text-secondary-color dark:text-text-tertiary-dark">
            {item.userName}
          </div>
        </div>
      </div>
      <Image width={12} height={12} src={IMAGES.UP_LEFT_ARROW_ICON} loader={gumletLoader} alt="up-left-arrow" />
    </div>
  );
};

export default SearchUserAndCategoryCard;
