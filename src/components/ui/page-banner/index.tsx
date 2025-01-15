import Image from 'next/image';
import React, { FC } from 'react';

import PageMainHeading from '../page-main-heading';
import PageDescription from '../page-description';


type PageBannerProps = {
  bannerUrlForWeb: string;
  bannerUrlForMobile: string;
  headerText?: string;
  headerDescription?: string;
  headerDescriptionForMobile?: string;
  priority?: boolean;
};

const PageBanner: FC<PageBannerProps> = ({
  bannerUrlForWeb,
  bannerUrlForMobile,
  headerText,
  headerDescription,
  headerDescriptionForMobile,
  priority = false,
}) => {
  return (
    <div className="relative  flex items-center justify-center">
      <div className={'relative w-full h-[332px] hidden sm:inline'}>
        <Image
          fill
          className={'object-cover'}
          src={bannerUrlForWeb}
          alt="page_banner_for_web"
          // priority={true}
          loading='lazy'
            priority={priority}
          quality={80}
        />
      </div>
      {bannerUrlForMobile ? (
        <div className={'relative w-full h-[332px] inline sm:hidden'}>
          <Image
            fill
            className={'object-cover'}
            src={bannerUrlForMobile}
            alt="page_banner_for_web"
            // priority={true}  
            loading='lazy'
            priority={priority}
            quality={50}
          />
        </div>
      ) : null}
      <div className="mobile:px-[14px] absolute mobile:text-center max-w-[787px] inset-0 sm:left-16 flex flex-col mobile:items-center justify-center text-text-secondary-light space-y-2">
        <PageMainHeading className="">
          {headerText}
        </PageMainHeading>
        <PageDescription className="mt-5 text-sm md:text-[20px] md:leading-8">{headerDescription}</PageDescription>
        {headerDescriptionForMobile ? (
          <PageDescription className="mt-5 mobile:inline hidden !leading-4">{headerDescriptionForMobile}</PageDescription>
        ) : null}
      </div>
    </div>
  );
};

export default PageBanner;
