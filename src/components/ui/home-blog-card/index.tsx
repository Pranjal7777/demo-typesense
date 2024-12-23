import React, { FC, KeyboardEvent } from 'react';
import UpArrowIconRight from '../../../../public/assets/svg/up-arrow-right';
import Image from 'next/image';
import { useTheme } from '@/hooks/theme';
import { useRouter } from 'next/router';

type HomeBlogCardProps = {
  image: string;
  question: string;
  description: string;
  key: number;
  id: number;
};

const HomeBlogCard: FC<HomeBlogCardProps> = ({ key, image, description, question, id }) => {
  const { theme } = useTheme();
  const router = useRouter();

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      router.push(`blog/${id}`);
    }
  };

  return (
    <span
      onClick={() => router.push(`blog/${id}`)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      className="outline-none"
      key={key}
    >
      <div className="relative rounded-xl max-w-[427px] mobile:max-w-full w-full max-h-[379px] sm:max-h-fit flex flex-col items-start justify-between mobile:items-center cursor-pointer">
        <div className=" max-h-[224px] mobile:h-[180px] h-[200px] w-full overflow-hidden rounded-b-xl">
          <Image
            width={427}
            height={224}
            className="rounded-xl object-cover w-full h-full"
            src={image}
            alt="user_image"
          />
        </div>

        <div className="mt-4 flex items-center dark:text-text-primary-dark justify-between text-base sm:text-xl font-semibold w-full">
          <span className="font-semibold">{question}</span>
        </div>

        <div className="mt-2 text-xs sm:text-[10px] md:text-sm font-normal text-text-tertiary-light dark:text-text-tertiary-dark">
          {description}
        </div>
      </div>
    </span>
  );
};

export default HomeBlogCard;
