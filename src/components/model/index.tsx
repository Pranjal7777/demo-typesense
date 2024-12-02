import { appClsx } from '@/lib/utils';
import React, { CSSProperties, Dispatch, FC, ReactNode } from 'react';
import ReactPortal from './react-portal';
import CloseIcon from '../../../public/assets/svg/close-icon';
import { useTheme } from '@/hooks/theme';

export type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  maxHeight?: string;
  // maxWidth?:string;
  modelClassName?: string;
  // setVisible?:any
  visible?: boolean;
  setVisible?: Dispatch<React.SetStateAction<boolean>>;
  backgroundClickClose?: boolean;
  onClose: () => void;
  closeIconClassName?: string;
  closeIconHeight?: string;
  closeIconWidth?: string;
};

const Model: FC<Props> = ({
  modelClassName,
  className,
  children,
  style,
  visible = true,
  setVisible,
  backgroundClickClose = false,
  onClose,
  closeIconClassName,
  closeIconHeight,
  closeIconWidth
}) => {
  // maxHeight="592px",maxWidth="488px" max-h-[592px]
  const {theme} = useTheme();

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <>
        <div
          className={`${modelClassName} ${
            !visible && 'hidden'
          } fixed w-full h-screen inset-0 z-50 flex bg-[#00000099] items-center justify-center`}
          onClick={backgroundClickClose ? () => setVisible?.(!visible) : undefined}
          tabIndex={0}
          role='button'
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault(); 
              {backgroundClickClose ? () => setVisible?.(!visible) : undefined;}
            }
          }}
        >
          <div
            className={appClsx(
              'relative bg-bg-secondary-light max-w-[488px] w-full rounded-3xl h-full max-h-[664px] overflow-y-scroll',
              className
            )}
            style={style}
          >
            <CloseIcon height={closeIconHeight || '22'} width={closeIconWidth || '22'} className={closeIconClassName || ''  } primaryColor={theme ? '#fff' : '#202020'} onClick={onClose}/>

            {/* children starts */}
            {children}
          </div>
        </div>
      </>
    </ReactPortal>
  );
};

export default Model;

{
  /* mobile screen */
}
//  <Model modelClassName="sm:hidden" className=''>
//  <div className='mobile:w-full lg:w-[40%] sm:w-full border-primary px-10 py-7 !pt-[60px] w-[40%] flex flex-col items-center justify-between'>
//    <div className='max-w-[408px] w-full flex flex-col items-center justify-start'>

//        <span className='text-[28px] font-bold mb-2'>Login</span>
//        <span className='text-base font-normal text-[#828282]'>Please log in to continue</span>

//        <div className='my-4  w-full flex flex-col'>
//        <span className='text-sm'>Phone Number*</span>
//        <input className='mt-4 px-5 outline-none h-11 border border-bg-tertiary-light rounded' type="number" name="phoneNumber"/>
//        </div>

//        <Button onClick={()=>loginWithPhone()}>Continue</Button>

//        <div>or</div>

//        <Button buttonType={"secondary"} onClick={()=>loginWithEmail()}>
//          <Image width={22} height={17} src={`${IMAGES.MAIL_ICON}`} alt="" />
//          <span className='ml-2'>Login With Email</span>
//        </Button>

//        <div>Or Connect With</div>

//        <div className='flex my-2 w-full items-center justify-between'>
//        <Button buttonType={BUTTON_TYPE_CLASSES.tertiary}>
//            <Image width={20} height={20} src={`${IMAGES.GOOGLE_LOGO}`} alt="google_logo" />
//            <span className='ml-2'> Google</span>
//        </Button>

//        <Button buttonType={BUTTON_TYPE_CLASSES.tertiary}>
//            <Image width={20} height={20} src={`${IMAGES.FACEBOOK_LOGO}`} alt="facebook_logo" />
//            <span className='ml-2'> Facebook</span>
//        </Button>
//        </div>
//    </div>

//    <div className='text-sm'>
//        <span>Don’t have an account?</span>
//      <Link className='font-bold text-brand-color' href={SIGN_UP_PAGE}> Sign Up</Link>
//    </div>
//  </div>
// </Model>
