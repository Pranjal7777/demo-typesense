import { STATIC_IMAGE_URL } from '@/config';
import Image from 'next/image';
import React, { FC } from 'react';
import UpLeftArrowIcon from '../../../public/images/up-left-arrow.svg';

export type category = {
  userName: string;
  profile_pic: string;
  first_name: string;
  last_name: string;
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
          src={item.profile_pic ? `${STATIC_IMAGE_URL}/${item.profile_pic}` : '/images/user-profile-icon-black.svg'}
          alt={''}
        />
        <div className="ml-2 rtl:mr-2 rtl:ml-0">
          <div className="text-sm font-medium">
            {item.first_name} {item.last_name}
          </div>
          <div className="text-xs font-normal text-text-secondary-color dark:text-text-tertiary-dark">
            {item.userName}
          </div>
        </div>
      </div>
      <Image width={12} height={12} src={UpLeftArrowIcon}  alt="up-left-arrow" />
    </div>
  );
};

export default SearchUserAndCategoryCard;
