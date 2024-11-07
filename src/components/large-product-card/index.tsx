import { gumletLoader } from '@/lib/gumlet';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
interface LargeProductCardProps {
  data: {
    title: string;
    subTitle: string;
    description: string;
    image: string;
    btnText: string;
  };
}

const LargeProductCard: React.FC<LargeProductCardProps> = ({ data }) => {
  return (
    <div className="lg:max-w-[648px] mobile:h-[343px] sm:w-full relative flex items-end">
      <div className="absolute z-[1] mb-6 ml-6 rtl:mr-6">
        <div className="text-2xl font-semibold leading-9 text-text-secondary-light dark:text-text-primary-dark">
          {data?.title}
        </div>
        <div className="text-sm font-normal leading-5 text-text-secondary-light dark:text-text-primary-dark mt-2 mb-4">
          {data?.subTitle}
        </div>

        <Link href={'/'} passHref>
          <div className="bg-brand-color rounded px-3 py-2 flex items-center justify-between w-[50%] mobile:w-[73%] mobile:h-[44px]">
            <span className="text-sm font-medium leading-5 text-text-primary-light dark:text-text-secondary-dark">
              {data?.description}
            </span>
            <Image width={10} height={10} src={'/images/up_right_arrow_black.svg'} alt="up_right_arrow_icon" loader={gumletLoader} />
          </div>
        </Link>
      </div>
      <div
        className="rounded-xl"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))',
        }}
      ></div>
      <Image
        width={100}
        height={100}
        className="object-cover w-full h-full rounded-xl"
        src={data?.image}
        alt="truck_image"
      />
    </div>
  );
};

export default LargeProductCard;
