import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import React from 'react';
import NewsLetterInput from './news-letter-input';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '@/hooks/theme';
import MoonIcon from '../../../../public/assets/svg/moon-icon';
import SunIcon from '../../../../public/assets/svg/sun-icon';
import PrimaryLogo from '../../../../public/assets/svg/primary-logo';
import { PROJECT_NAME } from '@/config';

type FooterSection = {
  itemName: string,
  categories: {
    displayName:string
    link:string
  }[]
}

type ConnectSection = {
  title: string
  tollFree: string
  newsLetterTitle: string
  newsLetterInputPlaceholder: string
  newsLetterSubmitBtnText: string
  copyright:string
}

const Footer = () => {

  const router = useRouter();
  const {theme,toggleTheme}=useTheme();

  const { locales, locale: activeLocale } = router;

  const otherLocales = locales?.filter((locale) => locale !== activeLocale);

  const changeLocale = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}`;
  };

  const { t } = useTranslation('common');
  const footerSectionText: string = t('page.footerSectionText');
  const footerSection = t('page.footerSection', { returnObjects: true, projectName: PROJECT_NAME }) as FooterSection;

  const connectSection = t('page.connectSection', { returnObjects: true }) as ConnectSection;

  return (
    <div className=' w-full bg-bg-primary-light text-text-secondary-light'>
      <div className=' border-error max-w-[1440px] mx-auto px-[64px] mobile:px-4'>
        <div className=' border-yellow-50 flex item-center justify-center'>

          <div className='my-9 sm:my-12 border-yellow-400 max-w-[1203px] w-full flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 place-items-start'>
            <div className='relative mobile:order-3  max-w-[360px] mobile:max-w-full w-full mobile:flex mobile:flex-col mobile:items-center'>
              <Link href={'/'}>
                <PrimaryLogo logoType='secondary' className='hover:cursor-pointer' width={128} height={36}/>
              </Link>
              <div className='text-sm font-normal mobile:text-center mobile:max-w-[300px] mt-5 mb-7 text-text-primary-dark'>{footerSectionText}</div>
              <div className="flex ">
                <Link className="rtl:ml-4" target='_blank' href={'https://www.facebook.com/appscrip/'}>
                  <Image
                    className="cursor-pointer "
                    width={32}
                    height={32}
                    src={IMAGES.FACEBOOK_LOGO_BLACK}
                    alt="FACEBOOK_LOGO_BLACK"
                    // loader={gumletLoader}
                  />
                </Link>
                <Link href={'https://x.com/appscrip'} target='_blank' >
                  <Image
                    className="ml-4 cursor-pointer"
                    width={32}
                    height={32}
                    src={IMAGES.TWITTER_LOGO_BLACK}
                    alt="TWITTER_LOGO_BLACK"
                    // loader={gumletLoader}
                  />
                </Link>
                <Link href={'https://www.linkedin.com/company/appscrip?originalSubdomain=in'} target='_blank' >

                  <Image
                    className="ml-4 cursor-pointer"
                    width={32}
                    height={32}
                    src={IMAGES.LINKEDIN_LOGO_BLACK}
                    alt="LINKEDIN_LOGO_BLACK"
                    // loader={gumletLoader}
                  />
                </Link>
                <Link href={'https://www.instagram.com/appscrip01/?hl=en'} target='_blank' >

                  <Image
                    className="ml-4 cursor-pointer"
                    width={32}
                    height={32}
                    src={IMAGES.INSTAGRAM_LOGO_BLACK}
                    alt="INSTAGRAM_LOGO_BLACK"
                    // loader={gumletLoader}
                  />
                </Link>
                <Link href={'https://www.youtube.com/channel/UC7U65c_o1hNwiwTkWXG32fg'} target='_blank' >

                  <Image
                    className="ml-4 cursor-pointer"
                    width={32}
                    height={32}
                    src={IMAGES.YOUTUBE_LOGO_BLACK}
                    alt="YOUTUBE_LOGO_BLACK"
                    // loader={gumletLoader}
                  />
                </Link>
              </div>
              <div className=" mt-7 flex items-center justify-between ml-[86px] sm:ml-11 border-error switch translate-x-[-50%] bg-[#EDEDED] dark:bg-[#2C2C2C] w-[95px] h-[40px] rounded-[100px] ">
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={toggleTheme}
                  className={'left flex items-center justify-center w-[36px] h-[36px] rounded-full dark:bg-[#4A4A4A]'}
                >
                  <MoonIcon ariaLabel="moon_icon" primaryColor={theme ? '#FFFFFF' : '#929293'} />
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={toggleTheme}
                  className={
                    'left flex items-center justify-center w-[36px] h-[36px] rounded-full dark:bg-[#2C2C2C] bg-[#FFFFFF]'
                  }
                >
                  <SunIcon ariaLabel="sun_icon" primaryColor={theme ? '#FFFFFF' : '#202020'} />
                </div>
              </div>
            </div>
            <div className=' mobile:mb-9 max-w-[287px] mobile:max-w-full w-full flex flex-col mobile:items-center '>
              <div className='text-base font-bold mb-3'>{footerSection.itemName}</div>
              <div className='flex flex-col mobile:text-center sm:grid sm:grid-cols-2 gap-x-10 gap-y-2 text-sm font-normal text-text-primary-dark'>
                {
                  footerSection?.categories?.map((item, key) => (
                    <Link href={item.link} className='text-nowrap ' key={key}>{item.displayName}</Link>
                  ))
                }
              </div>
            </div>
            <div className='mobile:mb-9 sm:mt-9 lg:mt-0 max-w-[360px] mobile:max-w-full w-full flex flex-col '>
              <div className='mobile:order-1 mobile:mt-9 mobile:text-center'>
                <div className='text-base font-bold mobile:mb-3'>{connectSection.title}</div>

                <div className='text-sm font-normal'>
                  <span className='text-text-primary-dark '>
                    {connectSection.tollFree}
                  </span> :
                  <Link href={'tel:(866)856-5678'} className='hover:cursor-pointer text-brand-color '> (866)856-5678</Link>
                </div>

              </div>
              <div className='mobile:mt-0 mt-6'>
                <div className='mb-3 mobile:text-center'>{connectSection.newsLetterTitle}</div>
                <NewsLetterInput />
              </div>
              <div className="mt-9  w-full mobile:flex mobile:justify-center ">
                <span className="bg-brand-color border px-4 py-2 rounded-xl uppercase text-sm">{activeLocale}</span>
                {otherLocales?.map((locale, localeIndex) => {
                  const { pathname, query } = router;

                  return (
                    <Link
                      key={localeIndex}
                      href={{ pathname, query }}
                      locale={locale}
                      onClick={() => changeLocale(locale)}
                      className=" ml-2  hover:bg-[#414052]/80 active:bg-[#414052] px-4 py-2 rounded-xl uppercase text-sm transition-colors"
                    >
                      {locale}
                    </Link>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

        <div className='border-t h-[77px] flex items-center text-center text-xs justify-center'>
          &copy; {new Date().getFullYear()} {connectSection.copyright}
        </div>
      </div>
    </div>
  );
};

export default Footer;
