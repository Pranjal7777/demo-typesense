import React, { FC, useState } from 'react';
import { useWindowResize } from '@/hooks/use-window-resize';
import { appClsx } from '@/lib/utils';
import { IMAGES } from '@/lib/images';
import HeroImage from '@/components/ui/hero-image';

import { useTranslation } from 'next-i18next';
import NewSearchBox from '@/components/ui/search-box';
import { useNewWindowScroll } from '@/hooks/new-use-window-scroll';
import useTypesenseSearch from '@/hooks/useTypesenseSearch';

export type heroSection = {
  title: string;
  desc: string;
  searchUserandItem: { users: string; items: string };
  searchItem: { placeholder: string };
  searchPlace: { placeholder: string };
  button: string;
  popularSearch: string;
  locationPlaceholder: string;
  searchPlaceholder: string;
};

export type HeroSectionProps = {
  stickyHeaderWithSearchBox?: boolean;
  handleGetLocationHelper: () => Promise<boolean>;
  handleRemoveLocationHelper: () => void;
  className?: string;
  imageClassName?: string;
};

const HeroSection: FC<HeroSectionProps> = ({
  stickyHeaderWithSearchBox,
  handleGetLocationHelper,
  handleRemoveLocationHelper,
  className,
  imageClassName,
}) => {
  const maxThreshold = useNewWindowScroll(400);
  const minThreshold = useNewWindowScroll(180);
  const windowWidth = useWindowResize();
  const { t } = useTranslation('common');
  const heroSection = t('page.header.heroSection', { returnObjects: true }) as heroSection;
  const [selectedOption, setSelectedOption] = useState('Items');
  const { searchClient } = useTypesenseSearch({ queryBy: selectedOption === 'Items' ? 'title.en,description' : 'first_name,last_name'});

  return (
    <div
      className={appClsx(
        `relative ${
          maxThreshold ? '!static top-[69px]' : ''
        }  mx-auto h-[524px] mobile:h-[451px] bg-cover bg-top bg-no-repeat flex items-center justify-center ${
          stickyHeaderWithSearchBox && ' items-start !h-0'
        }`,
        className
      )}
      style={{ backgroundPosition: '50% 20%' }}
    >
      {
        !stickyHeaderWithSearchBox && <HeroImage src={IMAGES.PRIMARY_BANNER} className={imageClassName} />
      }
      {/* image shadow or overlay */}
      {/*       
      <SearchBox
        stickyHeaderWithSearchBox={stickyHeaderWithSearchBox}
        // content={content}
        windowScroll={windowScroll}
        windowWidth={windowWidth}
        handleGetLocationHelper={handleGetLocationHelper}
        handleRemoveLocationHelper={handleRemoveLocationHelper}
      /> */}

      <div
        className={` flex flex-col mt-14 border-error ${stickyHeaderWithSearchBox ? 'w-full' :
          minThreshold ? 'w-full ' : 'max-w-full sm:max-w-[1083px] sm:mx-[64px] '
        }`}
      >
        <h1
          className={`z-[0] mobile:text-2xl mobile:font-semibold mobile:leading-9 mobile:text-center mobile:order-1 text-text-secondary-light dark:text-text-primary-dark text-4xl  font-semibold mobile:px-4 ${
            stickyHeaderWithSearchBox && 'hidden'
          } ${minThreshold ? 'hidden' : ''} transition-all duration-300 ease-in`}
        >
          {heroSection.title}
        </h1>
        <NewSearchBox
          stickyHeaderWithSearchBox={stickyHeaderWithSearchBox}
          // content={content}
          windowWidth={windowWidth}
          handleGetLocationHelper={handleGetLocationHelper}
          handleRemoveLocationHelper={handleRemoveLocationHelper}
          searchClient={searchClient}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <p
          className={`z-[0] mobile:mt-2 mobile:mb-7 mobile:text-[10px] mobile:leading-4 mobile:font-medium mobile:text-center mobile:order-2 text-text-secondary-light dark:text-text-primary-dark text-base font-medium text-secondary transition-all duration-700 ease-in mobile:px-4 ${
            stickyHeaderWithSearchBox && 'hidden'
          } ${minThreshold ? 'hidden' : ''}`}
        >
          {heroSection.popularSearch}
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
