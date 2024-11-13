import React from 'react';
import Image from 'next/image';
import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import NewsLetterInput from '../footer-section/news-letter-input';

type AppDownloadSection={
   heading: string; 
   subHeading: string
   qrText:string,
   newsLetterTitle:string
}


const DownloadCard: React.FC = () => {
  const { t } = useTranslation('common');
  const appDownloadSection:AppDownloadSection = t('page.appDownloadSection', { returnObjects: true });

  return (
    <div className=" w-screen mobile:h-fit  md:h-[539px] bg-gradient-to-b from-gradient-color-from to-gradient-color-to">
      <div className="px-16  h-full flex flex-col items-center justify-between md:flex-row gap-6 place-items-center custom-container">
        <div className="  border-error md:ml-20 py-6">
          <p className="font-semibold  text-2xl md:text-[40px] text-center md:text-left  dark:text-text-primary-dark pt-0 order-1">
            {appDownloadSection?.heading}
          </p>
          <p className="  font-normal text-xs max-w-[465px] text-center md:text-left md:text-base dark:text-text-primary-dark py-3">
            {appDownloadSection?.subHeading}
          </p>
          <div className='mobile:hidden mobile:mt-0 mt-6 max-w-[316px]'>
            <div className='mb-3 text-base font-bold dark:text-text-primary-dark'>{appDownloadSection?.newsLetterTitle}</div>
            <NewsLetterInput />
          </div>
        </div>
        
      
      
        <div className="md:mr-36 border-error flex flex-col md:flex-row items-center md:items-start gap-12">
          <div className="space-y-4">
            <Link href={''} className="cursor-pointer">
              <Image
                src={IMAGES.PLAY_STORE_ICON}
                height={62}
                width={220}
                alt="play-store Image"
                loader={gumletLoader}
              />
            </Link>

            <Link href={'https://testflight.apple.com/join/taGW9cmp'} className="cursor-pointer">
              <Image
                className="mt-4"
                src={IMAGES.APP_STORE_ICON}
                height={62}
                width={220}
                alt="app-store Image"
                loader={gumletLoader}
              />
            </Link>
          </div>
          <div className='flex flex-col items-center justify-between'>
            <Image
              src={IMAGES.QR_CODE_DOWNLOAD_LINK}
              width={128}
              height={128}
              alt="download_qr"
              loader={gumletLoader}
            />
            <p className='mt-2 text-xs font-normal text-text-primary-light dark:text-text-primary-dark'>{appDownloadSection.qrText}</p>
          </div>
        </div>
     
      </div>
    </div>
  );
};

export default DownloadCard;
