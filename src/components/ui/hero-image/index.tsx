import React, { FC } from 'react';
import Image from 'next/image';
import { appClsx } from '@/lib/utils';
import { GUMLET_API_URL } from '@/config';

type HeroImageProps = {
  className?: string;
  src: string;
};

const HeroImage: FC<HeroImageProps> = ({ className, src }) => {
  
  return (
    <div className='reletive'>
      <Image
        className={appClsx(
          'brightness-50 relative mx-auto max-h-[524px] bg-cover bg-top bg-no-repeat flex items-center justify-center',
          className
        )}
        src={`${GUMLET_API_URL}/${src}`}
        alt="Header Image"
        layout="fill"
        objectFit="cover"
        objectPosition="50% 20%"
        quality={80}
        placeholder="blur"
        blurDataURL={`${GUMLET_API_URL}/${src}?q=10&blur=10`}
        priority={true}
        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes for responsive images
      />
    </div>
  );
};

export default React.memo(HeroImage);
