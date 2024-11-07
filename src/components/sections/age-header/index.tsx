import React, { FC } from 'react';
import SearchBox from '../../search-box/search-box';
import { useWindowScroll } from '@/hooks/use-window-scroll';
import { useWindowResize } from '@/hooks/use-window-resize';
import { appClsx } from '@/lib/utils';
import { IMAGES } from '@/lib/images';
import HeroImage from '@/components/ui/hero-image';

export type Props = {
  stickyHeaderWithSearchBox?: boolean;
  handleGetLocationHelper: () => Promise<boolean>;
  handleRemoveLocationHelper: () => void;
  className?: string
  imageClassName?: string
};

const PageHeader: FC<Props> = ({
  stickyHeaderWithSearchBox,
  handleGetLocationHelper,
  handleRemoveLocationHelper,
  className,
  imageClassName
}) => {
  const windowScroll = useWindowScroll();
  const windowWidth = useWindowResize();



  return (
    <div
      className={appClsx(` relative ${windowScroll > 400 ? '!static top-[69px]' : ''
      }  mx-auto h-[524px] mobile:h-[451px] bg-cover bg-top bg-no-repeat flex items-center justify-center ${stickyHeaderWithSearchBox && ' h-fit items-start'
      }`, className)}
      style={{ backgroundPosition: '50% 20%' }}
    >
      <HeroImage src={IMAGES.PRIMARY_BANNER}  />
      {/* image shadow or overlay */}
      <div
        className={appClsx(`${windowScroll > 400 ? 'hidden' : ''} ${stickyHeaderWithSearchBox && 'hidden'}`, imageClassName)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))',
        }}
      ></div>
      <SearchBox
        stickyHeaderWithSearchBox={stickyHeaderWithSearchBox}
        // content={content}
        windowScroll={windowScroll}
        windowWidth={windowWidth}
        handleGetLocationHelper={handleGetLocationHelper}
        handleRemoveLocationHelper={handleRemoveLocationHelper}
      />
    </div>
  );
};

export default PageHeader;