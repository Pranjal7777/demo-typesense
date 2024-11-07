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
// commented few things to check perfomance on this page
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
      }  mx-auto h-[524px] mobile:h-auto bg-cover bg-top bg-no-repeat flex items-center justify-center ${stickyHeaderWithSearchBox && ' h-fit items-start'
      }`, className)}
      style={{ backgroundPosition: '50% 20%' }}
    >
      <HeroImage src={IMAGES.PRIMARY_BANNER}  className={imageClassName} />
      {/* image shadow or overlay */}
      
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