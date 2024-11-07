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
};

const PageBanner: FC<PageBannerProps> = ({
  bannerUrlForWeb,
  bannerUrlForMobile,
  headerText,
  headerDescription,
  headerDescriptionForMobile,
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
          quality={100}
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
            quality={30}
          />
        </div>
      ) : null}
      <div className="mobile:px-[14px] absolute mobile:text-center max-w-[787px] inset-0 sm:left-16 flex flex-col mobile:items-center justify-center text-text-secondary-light space-y-2">
        <PageMainHeading className="!leading-[66px] mobile:leading-[42px] md:max-w-[580px]">
          {headerText}
        </PageMainHeading>
        <PageDescription className="mt-5 ">{headerDescription}</PageDescription>
        {headerDescriptionForMobile ? (
          <PageDescription className="mt-5 mobile:inline hidden !leading-4">{headerDescriptionForMobile}</PageDescription>
        ) : null}
      </div>
    </div>
  );
};

export default PageBanner;
