import React, { FC } from 'react';
import CloseIcon from '../../../../public/assets/svg/close-icon';
import { useTheme } from '@/hooks/theme';
import { appClsx } from '@/lib/utils';

export type Props = {
  className?: string;
  confirmLocation?: boolean;
  clickEvent?: () => void;
  children: string;
  progressbar?: boolean;
  iconClass?:string;
};

const EnterAddressHeader: FC<Props> = ({
  children,
  className,
  progressbar = true,
  confirmLocation,
  clickEvent = () => {},
  iconClass
}) => {
  const { theme } = useTheme();
  return (
    <header
      className={appClsx(
        'w-full relative flex py-[20px] items-center justify-center dark:bg-bg-primary-dark  dark:text-text-primary-dark ',
        className
      )}
    >
      {progressbar ? (
        <div className="w-full absolute bottom-0 flex gap-[4px] justify-between sm:hidden">
          <div className={'left w-[50%] h-[4px] rounded-[10px] bg-[#6D3EC1] '}></div>
          <div className={'right w-[50%] h-[4px] rounded-[10px] ' + (confirmLocation ? 'bg-[#6D3EC1]' : '')}></div>
        </div>
      ) : null}

      <h1 className="text-[18px] md:text-[20px] leading-[28px] md:leading-[30px] font-semibold mobile:!text-xl ">{children}</h1>
      {theme ? (
        <CloseIcon
          onClick={clickEvent}
          primaryColor="white"
          height={'12'}
          width={'13'}
          className={appClsx(
            'absolute right-[22px] ',
            iconClass
          )}  
        />
      ) : (
        <CloseIcon
          onClick={clickEvent}
          primaryColor="black"
          height={'12'}
          width={'13'}
          className={appClsx( 'absolute right-[22px] ', iconClass )} 
        />
      )}
    </header>
  );
};

export default EnterAddressHeader;
