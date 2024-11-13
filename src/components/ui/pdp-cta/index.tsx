import { useTheme } from '@/hooks/theme';
import ChatIcon from '../../../../public/assets/svg/chat-icon';
import Button from '../button';
import React, { useEffect, useState } from 'react';
type PdpCtaProps = {
  firstButtonText: string;
  secondButtonText?: string;
  noStockButtonText?: string;
  isSold?: boolean;
  handleFirstButtonClick?: () => void;
  isFirstButtonLoading?:boolean;

};
const PdpCta: React.FC<PdpCtaProps> = ({ isSold, firstButtonText, secondButtonText, noStockButtonText,isFirstButtonLoading,handleFirstButtonClick }) => {
  const theme = useTheme();

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

  return (
    <div className={`flex w-full gap-2 ${isSold ? 'mt-0' : 'mt-5'} justify-around`}>
      {!isSold ? (
        <>
          <Button isLoading={isFirstButtonLoading} onClick={handleFirstButtonClick} className={`${secondButtonText ? 'w-[15rem] mobile:w-[12rem]' : 'w-[90%]'} text-sm mb-0`}>
            {firstButtonText}
          </Button>
          {secondButtonText && (
            <Button className="w-[15rem] mobile:w-[12rem] text-sm mb-0" buttonType="secondary">
              {secondButtonText}
            </Button> 
          )}

          <ChatIcon bgFillcolor={theme.theme ? '#fff' : '#F4F4F4'} size={isMobile ? 'mobile' : 'pc'} />
        </>
      ) : (
        <div className="w-full">
          <Button buttonType="disabledBtn" isDisabled={true} className="!cursor-not-allowed w-full">
            {noStockButtonText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PdpCta;
