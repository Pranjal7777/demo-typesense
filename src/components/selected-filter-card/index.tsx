import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import Image from 'next/image';
import React from 'react';

type SelectedFilterProps = {
  label: string;
  onDelete: () => void;
};

const SelectedFilterCard: React.FC<SelectedFilterProps> = ({ label, onDelete }) => {
  return (
    <div className="border md:h-10 h-8 px-4 py-3 rounded-full flex justify-between gap-2 items-center dark:border-[#3D3B45] border-[#DBDBDB]">
      <p className="text-xs w-auto md:text-sm md:font-normal text-text-primary-light text-nowrap dark:text-text-secondary-light">
        {label}
      </p>
      <Image
        src={IMAGES.CROSS_ICON}
        alt="crossIcon"
        height={8}
        width={8}
        className="dark:hidden inline cursor-pointer "
        loader={gumletLoader}
        onClick={onDelete}
      />
      <Image
        src={IMAGES.CROSS_ICON_WHITE}
        alt="crossIcon"
        height={8}
        width={8}
        className="hidden dark:inline cursor-pointer "
        loader={gumletLoader}
        onClick={onDelete}
      />
    </div>
  );
};

export default SelectedFilterCard;
