import { useTheme } from '@/hooks/theme';
import ChatIcon from '../../../../public/assets/svg/chat-icon';
import Button from '../button';
import React, { useEffect, useRef, useState } from 'react';
import FullScreenSpinner from '../full-screen-spinner';
import { StickyHeaderDetails } from '@/containers/pdp';
type PdpCtaProps = {
  firstButtonText: string;
  secondButtonText?: string;
  noStockButtonText?: string;
  isSold?: boolean;
  handleFirstButtonClick?: () => void;
  isFirstButtonLoading?: boolean;
  apiData?: any;
  setStickyHeaderDetails?: React.Dispatch<React.SetStateAction<StickyHeaderDetails>>;
  stickyHeaderDetails?: StickyHeaderDetails;
  askQuestionHandler?: ()=>void;
};
const PdpCta: React.FC<PdpCtaProps> = ({
  isSold,
  firstButtonText,
  secondButtonText,
  noStockButtonText,
  isFirstButtonLoading,
  handleFirstButtonClick,
  apiData,
  setStickyHeaderDetails,
  stickyHeaderDetails,
  askQuestionHandler,
}) => {
  const theme = useTheme();
  const [loadingChat, setLoadingChat] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Example breakpoint for mobile
    };

    handleResize(); // Initial check

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const chatIconClickHandler = async () => {
    console.log('chatIconClickHandler');
  };

  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (!buttonsRef.current) return;

      const buttonsRect = buttonsRef.current.getBoundingClientRect();

      setStickyHeaderDetails?.((prevDetails) => {
        let newDetails = { ...prevDetails };

        // Set showProductImage to true when the imageElement is either scrolled past 145px from the top or completely out of viewport
        if (buttonsRect.top <= 145 || buttonsRect.bottom < 0) {
          newDetails.showButtons = true;
        } else {
          newDetails.showButtons = false;
        }

        // Update state only if there's a change
        if (newDetails.showButtons !== prevDetails.showButtons) {
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
    <div className={`flex w-full gap-2 ${isSold ? 'mt-0' : 'mt-5'} justify-between`} ref={buttonsRef}>
      {!isSold ? (
        <>
          <Button
            isLoading={isFirstButtonLoading}
            onClick={handleFirstButtonClick}
            className={`${secondButtonText ? 'w-[15rem] mobile:w-[12rem]' : 'w-[90%]'} text-sm mb-0`}
          >
            {firstButtonText}
          </Button>
          {secondButtonText && (
            <Button
              className="w-[15rem] mobile:w-[12rem] text-sm mb-0"
              buttonType="secondary"
              onClick={askQuestionHandler}
            >
              Ask A Question
            </Button>
          )}

          {/* <ChatIcon
            aria-label="Chat"
            onClick={chatIconClickHandler}
            bgFillcolor={theme.theme ? '#fff' : '#F4F4F4'}
            size={isMobile ? 'mobile' : 'pc'}
          /> */}
        </>
      ) : (
        <div className="w-full">
          <Button buttonType="disabledBtn" isDisabled={true} className="!cursor-not-allowed w-full">
            {noStockButtonText}
          </Button>
        </div>
      )}
      {loadingChat && <FullScreenSpinner />}
    </div>
  );
};

export default PdpCta;
