import React, { useEffect, useRef, useState } from 'react';
import ReportFlagSVG from '../../../../public/assets/svg/report-icon';
import { useTheme } from '@/hooks/theme';
import { useRouter } from 'next/router';
import { getCookie } from '@/utils/cookies';
import { getFormattedDateFromTimestamp } from '@/helper/get-formatted-date';
const ProductReport = React.lazy(() => import('./product-report'));
// import ProductReport from './product-report';
import LocationSvg from '../../../../public/assets/svg/location';
import { StickyHeaderDetails } from '@/containers/pdp';

type ProductDetailsCardProps = {
  familyName: string;
  categoryTitle: string;
  postTimeStamp: number;
  price: string;
  currency?: string;
  timestampLabel: string;
  assetCondition?: string;
  assetId?: string;
  setStickyHeaderDetails: React.Dispatch<React.SetStateAction<StickyHeaderDetails>>;
  stickyHeaderDetails: StickyHeaderDetails;
  isSeller?: boolean;
};

const ProductDetailsCard: React.FC<ProductDetailsCardProps> = ({
  familyName,
  categoryTitle,
  postTimeStamp,
  price,
  currency,
  timestampLabel,
  assetCondition,
  assetId,
  setStickyHeaderDetails,
  stickyHeaderDetails,
  isSeller
}) => {
  const theme = useTheme();
  const currentTheme = theme.theme;
  const [showReport, setShowReport] = useState(false);
  const postedTime = getFormattedDateFromTimestamp(postTimeStamp);
  const router = useRouter();
  const isLoggedIn = getCookie('isUserAuth');

  const handleReport = () => {
    if (isLoggedIn) {
      setShowReport(true);
    } else {
      router.push('/login');
    }
  };

  const handleCloseReport = () => {
    setShowReport(false);
  };

    const productNameElementRef = useRef<HTMLDivElement>(null);
    const priceElementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const updatePosition = () => {
        if (!productNameElementRef.current || !priceElementRef.current) return;

        const productNameRect = productNameElementRef.current.getBoundingClientRect();
        const priceRect = priceElementRef.current.getBoundingClientRect();

        setStickyHeaderDetails((prevDetails) => {
          let newDetails = { ...prevDetails };

          // Set showProductImage to true when the imageElement is either scrolled past 145px from the top or completely out of viewport
          if (productNameRect.top <= 145 || productNameRect.bottom < 0) {
            newDetails.showProductName = true;
          } else {
            newDetails.showProductName = false;
          }

          if (priceRect.top <= 145) {
            newDetails.showPrice = true;
          } else {
            newDetails.showPrice = false;
          }

          // Update state only if there's a change
          if (
            newDetails.showPrice !== prevDetails.showPrice ||
            newDetails.showProductName !== prevDetails.showProductName
          ) {
            return newDetails;
          }
          return prevDetails;
        });
      };

      updatePosition(); // Initial update when component mounts
      window.addEventListener('scroll', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition);
      };
    }, []);

  return (
    <>
      <div className="flex flex-col  md:gap-1">
        <div className="flex justify-between items-center">
          <span className="text-xs md:text-base leading-[18px] md:leading-[24px] text-text-tertiary-light dark:text-text-tertiary-dark">
            {familyName}
          </span>
          <div
            onClick={handleReport}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyUp={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleReport();
              }
            }}
          >
            {!isSeller && <ReportFlagSVG aria-label="Report" fillColor={currentTheme ? '#fff' : '#000'} />}
          </div>
        </div>
        <h1
          ref={productNameElementRef}
          className="text-lg md:text-2xl leading-[27px] md:leading-[36px] font-semibold text-text-primary-light dark:text-text-quinary-dark"
        >
          {categoryTitle}
        </h1>
        <div className="flex justify-between mt-1">
          <span className="text-xs md:text-base text-text-tertiary-light dark:text-text-tertiary-dark flex items-center gap-1">
            <LocationSvg
              aria-label="Location"
              className="hidden md:block"
              height="16"
              width="16"
              color={theme ? 'var(--text-light)' : 'var(--text-secondary-color)'}
            />
            <LocationSvg
              aria-label="Location"
              className="md:hidden"
              height="12"
              width="12"
              color={theme ? 'var(--text-light)' : 'var(--text-secondary-color)'}
            />
            {assetCondition}
          </span>
          <span className="text-xs md:text-base leading-[18px] md:leading-[24px] text-text-tertiary-light dark:text-text-tertiary-dark">
            {postedTime}
          </span>
        </div>
      </div>

      <div className="flex flex-col mobile:flex-row  mobile:justify-between mobile:items-center">
        <span
          ref={priceElementRef}
          className=" mt-3 md:mt-5 text-xl md:text-[28px] font-bold text-text-primary-light dark:text-text-quinary-dark"
        >
          {currency} {price}
        </span>
      </div>

      {showReport && <ProductReport assetId={assetId || ''} handleCloseReport={handleCloseReport} />}
    </>
  );
};

export default ProductDetailsCard;
