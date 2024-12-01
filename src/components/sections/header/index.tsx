import React, { FC, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '../../ui/button';
import { useTranslation } from 'next-i18next';
import { useWindowResize } from '@/hooks/use-window-resize';
import { HydrationGuard } from '../../ui/hydration-guard';
import { useAppSelector, useActions } from '@/store/utils/hooks';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const CategoriesDrawer = dynamic(() => import('@/components/categories-drawer'), { ssr: false });
import LoginWithPhoneModel from '../../auth-models/login/login-with-phone-model';
import { SIGN_IN_PAGE } from '@/routes';
import { RootState } from '@/store/store';
import { ResponseGetAllCategoriesPayload } from '@/store/types';
import UserLogin from './user-login';
import { useTheme } from '@/hooks/theme';
import PrimaryLogo from '../../../../public/assets/svg/primary-logo';
import ProfileDropdown from '../profile-dropdown';
import { RequestLogoutPayload } from '@/store/types';
import { generateDeviceId } from '@/helper/generate-device-id';
import authApi from '@/store/api-slices/auth';
import { toast } from 'sonner';
import AddressHeader from '../address-header';
import MoonIcon from '../../../../public/assets/svg/moon-icon';
import SunIcon from '../../../../public/assets/svg/sun-icon';
import HeaderDropdown from '@/components/ui/header-drop-down';
import { useNewWindowScroll } from '@/hooks/new-use-window-scroll';
import CategoriesIcon from '../../../../public/assets/svg/categories-icon';
import HamburgerMenuIcon from '../../../../public/assets/svg/hamburger-icon';
import ChatIcon from '../../../../public/assets/svg/chat-icon1';
import FeedsIcon from '../../../../public/assets/svg/feed-icon';
import NotificationIcon from '../../../../public/assets/svg/notification-icon';
import { removeCookie } from '@/utils/cookies';
import LeftArrowIcon from '../../../../public/assets/svg/left-arrow-icon';
import { HIDE_SELLER_FLOW } from '@/config';
export type loginOrUserName = {
  login: string;
  userName: string;
};

export type categories = {
  category: string;
  subCategory: string[];
};

export type Props = {
  stickyHeaderWithSearchBox?: boolean;
  showItems?: number;
  categoriesWithChildCategories?: ResponseGetAllCategoriesPayload;
};

////////////////////////////////////////
type menuOptions = {
  item: string;
};
///////////////////////////////////////

const Header: FC<Props> = ({
  stickyHeaderWithSearchBox = false,
  showItems = 4,
  // categoriesWithChildCategories,
}) => {
  const { theme, toggleTheme } = useTheme();
  const minThreshold = useNewWindowScroll(0);
  const maxThreshold = useNewWindowScroll(130);
  const windowWidth = useWindowResize();

  const { categories } = useAppSelector((state: RootState) => state.auth);
  // const {data,isLoading,isError}=categoriesApi.useGetAllCategoriesQuery();

  const { t } = useTranslation('common');
  // const categories:categories[] = t('page.header.categories', { returnObjects: true });
  const allcategories: string = t('page.header.allcategories');
  const router = useRouter();

  const loginOrUserName = t('page.header.loginOrUserName', { returnObjects: true }) as loginOrUserName;
  const btnText: string = t('page.header.button');

  const [isSearchCategoriesDrower, setIsSearchCategoriesDrower] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const changeisLoginModalOpen = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const changMenu = () => {
    setIsSearchCategoriesDrower(!isSearchCategoriesDrower);
  };

  const { userInfo } = useAppSelector((state: RootState) => state.auth);
  // console.log('88888888888888888888888 user in', userInfo);

  const sellPage = () => {
    if (userInfo) {
      // write the code to route to sell page
    } else {
      router.push(SIGN_IN_PAGE);
    }
  };

  ///// profile drop down data start
  const menuOptions = t('page.menuOptions', { returnObjects: true }) as menuOptions[];
  const deviceId = generateDeviceId();
  const storedRefreshToken = useAppSelector((state) => state.auth.token?.refreshToken);
  const [logout] = authApi.useLogoutMutation();
  const { setRemoveUserDataDispatch, setGuestTokenDispatch } = useActions();
  const [getGuestToken] = authApi.useGetGuestTokenMutation();
  const signOut = async () => {
    const reqPayload: RequestLogoutPayload = {
      deviceId: deviceId,
      refreshToken: storedRefreshToken as string,
    };

    try {
      const { message }: { message: string } = await logout(reqPayload).unwrap();

      if (message === 'Success') {
        setRemoveUserDataDispatch();
        toast.success('You have logged out successfully.');
        const { data } = await getGuestToken().unwrap();
        setGuestTokenDispatch(data.token);
      }

      removeCookie('refreshAccessToken');
      removeCookie('accessToken');
      removeCookie('isUserAuth');
      removeCookie('userInfo');
      localStorage.clear();
      toast.success('You have logged out successfully.');
      window.location.href = '/';
    } catch (error: unknown) {
      removeCookie('refreshAccessToken');
      removeCookie('accessToken');
      removeCookie('isUserAuth');
      removeCookie('userInfo');
      localStorage.clear();
      toast.success('You have logged out successfully.');
      window.location.href = '/';
      // toast.error(`* ${error}`);
    }
  };

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  // const [activeTheme, setActiveTheme] = useState(false);

  // useEffect(() => {
  //   if (theme) {
  //     setActiveTheme(true);
  //   }
  // }, []);

  const activeThemeChange = () => {
    // setActiveTheme((prev) => !prev);
    toggleTheme();
  };

  // console.log(showProfileDropdown, '&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');

  const handBurgerMenuClickHandler = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  const handleLogin = () => {
    router.push('/login');
  };
  //// profile drop down data end
  // console.log('do not re render');

  return (
    <>
      <CategoriesDrawer
        isSearchCategoriesDrower={isSearchCategoriesDrower}
        changMenu={changMenu}
        // data={categoriesWithChildren}
      />
      {/* // desktop,letop,tab screen  */}
      {/* {
        !(windowWidth<638) && ( */}

      <nav
        // ${windowWidth <= 639 && 'hidden'}
        className={`z-[2] mobile:hidden ${
          maxThreshold && ' border-b border-border-tertiary-light dark:border-b-border-tertiary-dark'
        }  
         ${stickyHeaderWithSearchBox && 'border-b border-b-border-tertiary-light dark:border-b-border-tertiary-dark'} ${
          minThreshold
            ? stickyHeaderWithSearchBox
              ? 'text-text-primary-light dark:text-text-primary-dark bg-bg-secondary-light dark:bg-bg-primary-dark'
              : 'text-text-primary-light dark:text-text-primary-dark bg-bg-secondary-light dark:bg-bg-primary-dark'
            : stickyHeaderWithSearchBox
            ? 'text-text-primary-light dark:text-text-primary-dark bg-bg-secondary-light dark:bg-bg-primary-dark'
            : 'text-text-secondary-light dark:text-text-primary-dark'
        } h-[69px] w-full fixed top-0 text-sm font-medium capitalize transition ease-in-out duration-2000`}
      >
        <div className=" max-w-[1440px] px-[64px] m-auto h-full flex items-center justify-between">
          <div className="flex items-center h-full w-[65%]">
            <Link className="sm:mb-2" href="/">            
              <PrimaryLogo
                primaryColor={`${
                  stickyHeaderWithSearchBox
                    ? theme
                    ? 'var(--icon-primary-dark)'
                    : 'var(--icon-primary-light)' :
                     theme ?
                       minThreshold ?
                         'var(--icon-primary-dark)'
                        : 'var(--icon-primary-dark)'
                      : minThreshold ? 'var(--icon-primary-light)' : 'var(--icon-primary-dark)'
                    
                }`}
              />
            </Link>

            <ul className=" flex ml-9 mobile:text-[12px] h-full">
              <>
                {
                  // isLoading ? "Loading..." : isError ? "error" :
                  // data && (
                    categories?.data
                    ?.slice(
                      0,
                      windowWidth > 1440
                        ? showItems
                        : windowWidth > 1320
                        ? 4
                        : windowWidth > 1144
                        ? 3
                        : windowWidth >= 1144
                        ? 2
                        : windowWidth >= 963
                        ? 1
                        : windowWidth >= 831
                        ? 0
                        : windowWidth >= 634
                        ? 0
                        : 0
                    )
                    .map((item, index) => (
                      <HeaderDropdown key={index} item={item} />
                    ))
                }
              </>

              <li className="flex mx-4 items-center justify-center">
                <button className="flex items-center justify-center" onClick={() => changMenu()}>
                  {/* <CategoriesIcon
                    color={`${
                      stickyHeaderWithSearchBox
                        ? 'var(--icon-primary-light)'
                        : theme
                        ? minThreshold
                          ? 'var(--icon-primary-dark)'
                          : 'var(--icon-primary-dark)'
                        : minThreshold
                        ? 'var(--icon-primary-light)'
                        : 'var(--icon-primary-dark)'
                    }`}
                  /> */}
                  <CategoriesIcon
                    color={`${
                      stickyHeaderWithSearchBox
                        ? theme
                        ? 'var(--icon-primary-dark)'
                        : 'var(--icon-primary-light)' :
                         theme ?
                           minThreshold ?
                             'var(--icon-primary-dark)'
                            : 'var(--icon-primary-dark)'
                          : minThreshold ? 'var(--icon-primary-light)' : 'var(--icon-primary-dark)'
                        
                    }`}
                  />

                  <span className="ml-2 rtl:ml-0 rtl:mr-2 truncate">{allcategories}</span>
                </button>
              </li>
            </ul>
          </div>

          <div className=" h-full flex items-center justify-center gap-4">
            <HydrationGuard>
              {userInfo && (
                <div className="hidden md:flex gap-6 mr-8">
                  {/* <div className="cursor-pointer relative">
                    <MessageIcon
                      className="hover:scale-105"
                      primaryColor={`${
                        stickyHeaderWithSearchBox
                          ? 'var(--icon-primary-light)'
                          : theme
                          ? minThreshold
                            ? 'var(--icon-primary-dark)'
                            : 'var(--icon-primary-dark)'
                          : minThreshold
                          ? 'var(--icon-primary-light)'
                          : 'var(--icon-primary-dark)'
                      }`}
                    />
                  </div> */}
                  {/* for like route */}
                  {/* <div className="cursor-pointer">
                    <FeedsIcon
                      className="hover:scale-105"
                      primaryColor={`${
                        stickyHeaderWithSearchBox
                          ? theme
                          ? 'var(--icon-primary-dark)'
                          : 'var(--icon-primary-light)' :
                           theme ?
                             minThreshold ?
                               'var(--icon-primary-dark)'
                              : 'var(--icon-primary-dark)'
                            : minThreshold ? 'var(--icon-primary-light)' : 'var(--icon-primary-dark)'
                          
                      }`}
                    />
                  </div> */}
                  {
                    !HIDE_SELLER_FLOW && <div className="cursor-pointer relative">
                    <NotificationIcon
                      className="hover:scale-105"
                      primaryColor={`${
                        stickyHeaderWithSearchBox
                          ? theme
                          ? 'var(--icon-primary-dark)'
                          : 'var(--icon-primary-light)' :
                           theme ?
                             minThreshold ?
                               'var(--icon-primary-dark)'
                              : 'var(--icon-primary-dark)'
                            : minThreshold ? 'var(--icon-primary-light)' : 'var(--icon-primary-dark)'
                          
                      }`}
                    />
                  </div>
                  }
              
                </div>
              )}

              {userInfo ? (
                <UserLogin
                  primaryColor={`${
                    stickyHeaderWithSearchBox
                      ? theme
                      ? 'var(--icon-primary-dark)'
                      : 'var(--icon-primary-light)' :
                       theme ?
                         minThreshold ?
                           'var(--icon-primary-dark)'
                          : 'var(--icon-primary-dark)'
                        : minThreshold ? 'var(--icon-primary-light)' : 'var(--icon-primary-dark)'
                      
                  }`}
                />
              ) : (
                <Link className="mx-9 " href={SIGN_IN_PAGE}>
                  {' '}
                  {loginOrUserName.login}
                </Link>
                // <div className=" mx-9" onClick={changeisLoginModalOpen}> {loginOrUserName.login}</div>
              )}
            </HydrationGuard>
            {/* <Button
              onClick={sellPage}
              type="button"
              className={'mb-0 rounded-lg py-2 w-24 h-[34px] text-center hover:scale-105 transition-all duration-200'}
              // ${!(windowScroll > 0)
              //   ? stickyHeaderWithSearchBox
              //     ? '!text-text-secondary-light dark:text-text-secondary-dark'
              //     : `text-text-primary-light dark:text-tes`
              //   : stickyHeaderWithSearchBox
              //   ? '!text-text-secondary-light dark:text-text-secondary-dark'
              //   : `!text-text-secondary-light dark:text-text-secondary-dark`}
            >
              {btnText}
            </Button> */}
          </div>
        </div>
      </nav>

      {isLoginModalOpen && <LoginWithPhoneModel changeisLoginModalOpen={changeisLoginModalOpen} />}

      {/* <CategoryDrower className={`sm:hidden mobile:inline-block ${searchCategoryDrower && "!hidden"} transition duration-700`} searchCategoryDrower={searchCategoryDrower} setsearchCategoryDrower={setsearchCategoryDrower}/> */}
      <nav
        className={`z-[2] border-error ${
          stickyHeaderWithSearchBox && 'bg-bg-secondary-light dark:bg-bg-secondary-dark'
        } ${
          minThreshold && 'dark:bg-bg-primary-dark bg-bg-secondary-light'
        } mobile:inline-block sm:hidden h-[69px] w-full fixed top-0  flex items-center justify-center px-[16px]`}
      >
        <div className=" flex items-center justify-between h-full w-full max-w-[638px]">
          <div className={` flex items-center ${stickyHeaderWithSearchBox && 'mobile:hidden'} `}>
            {
              // stickyHeaderWithSearchBox ? (
              //     !(theme!==true)
              //     ? (<Image width={18} height={12} className='h-[12px] cursor-pointer w-[18px] min-h-3 hover:scale-110' onClick={()=>setsearchCategoryDrower(!searchCategoryDrower)} src={IMAGES.HAND_BURGER_MENU_ICON_WHITE} loader={gumletLoader} alt="hand-burger-menu-icon-white" />)
              //     : (<Image width={18} height={12} className='h-[12px] cursor-pointer w-[18px] min-h-3 hover:scale-110' onClick={()=>setsearchCategoryDrower(!searchCategoryDrower)} src={IMAGES.HAND_BURGER_MENU_ICON_BLACK} loader={gumletLoader} alt="hand-burger-menu-icon-black" />)
              // ) : (
              // !(minThreshold && theme !== true)? (
              //   <Image
              //     onClick={handBurgerMenuClickHandler}
              //     width={18}
              //     height={12}
              //     className="h-[12px] cursor-pointer w-[18px] min-h-3 hover:scale-110"
              //     src={IMAGES.HAND_BURGER_MENU_ICON_WHITE}
              //     loader={gumletLoader}
              //     alt="hand-burger-menu-icon-white"
              //   />
              // ) : (
              //   <Image
              //     onClick={handBurgerMenuClickHandler}
              //     width={18}
              //     height={12}
              //     className="h-[12px] cursor-pointer w-[18px] min-h-3 hover:scale-110"
              //     src={IMAGES.HAND_BURGER_MENU_ICON_BLACK}
              //     loader={gumletLoader}
              //     alt="hand-burger-menu-icon-black"
              //   />
              // )
              // )
            }
            <HamburgerMenuIcon
              className="h-[12px] cursor-pointer w-[18px] min-h-3 hover:scale-110"
              onClick={handBurgerMenuClickHandler}
              primaryColor={`${
                !(minThreshold && theme !== true) ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'
              }`}
            />
            <Link className="pl-5 rtl:pl-0 rtl:pr-6 mb-[5px]" href="/">
              <PrimaryLogo
                height={28}
                width={99}
                primaryColor={`${
                  stickyHeaderWithSearchBox
                    ? theme
                    ? 'var(--icon-primary-dark)'
                    : 'var(--icon-primary-light)' :
                     theme ?
                       minThreshold ?
                         'var(--icon-primary-dark)'
                        : 'var(--icon-primary-dark)'
                      : minThreshold ? 'var(--icon-primary-light)' : 'var(--icon-primary-dark)'
                    
                }`}
              />
            </Link>
          </div>
          <div className={` flex items-center justify-evenly  h-full ${stickyHeaderWithSearchBox && 'mobile:hidden'} `}>
            <div className=" text-text-secondary-light flex-1 w-[40%]">
              <HydrationGuard>
                {!userInfo && (
                  <Link
                    className={'rtl:mr-0 mr-4 flex items-center justify-center text-text-secondary-light'}
                    href={SIGN_IN_PAGE}
                  >
                    <span
                      className={`${
                        stickyHeaderWithSearchBox && '!text-text-primary-light dark:!text-text-secondary-light'
                      } ${
                        minThreshold
                          ? '!text-text-primary-light dark:!text-text-secondary-light'
                          : 'text-text-secondary-light'
                      }  text-sm font-semibold rtl:ml-0 ml-0 `}
                    >
                      {loginOrUserName.login}
                    </span>
                  </Link>
                ) }
              </HydrationGuard>
            </div>
          </div>

          {stickyHeaderWithSearchBox && (
            <>
              <div className=" relative w-12 h-12 flex items-center justify-center">
                <Link className="relative w-12 h-12 flex items-center justify-center" href="/">
                  <LeftArrowIcon height="15" width="15" primaryColor={theme ? '#FFFFFF' : '#202020'} />
                  {/* <Image
                    className="hover:cursor-pointer hover:scale-102 absolute left-1 dark:hidden"
                    width={15}
                    height={15}
                    src={IMAGES.BACK_ARROW_ICON_BLACK}
                    alt="back-arrow-icon"
                    loader={gumletLoader}
                  />
                  <Image
                    className="hover:cursor-pointer hover:scale-102 absolute left-1 hidden dark:inline-block"
                    width={15}
                    height={15}
                    src={IMAGES.BACK_ARROW_ICON_WHITE}
                    alt="back-arrow-icon"
                    loader={gumletLoader}
                  /> */}
                </Link>
              </div>

              {/* <div className=" flex items-center justify-center ">
                <div className="mr-9">
                  <Image
                    width={21}
                    height={21}
                    className=" cursor-pointer hover:scale-110 dark:hidden inline"
                    src={IMAGES.CHAT_ICON_BLACK}
                    loader={gumletLoader}
                    alt="chat-icon-black"
                  />
                  <Image
                    width={21}
                    height={21}
                    className=" cursor-pointer hover:scale-110 dark:inline hidden"
                    src={IMAGES.CHAT_ICON_WHITE}
                    loader={gumletLoader}
                    alt="chat-icon-white"
                  />
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (e.key == 'Enter' || e.key == ' ') {
                      handBurgerMenuClickHandler();
                    }
                  }}
                  onClick={handBurgerMenuClickHandler}
                >
                  <Image
                    width={18}
                    height={12}
                    className="h-[12px] cursor-pointer w-[18px] min-h-3 hover:scale-110 dark:inline hidden "
                    src={IMAGES.HAND_BURGER_MENU_ICON_WHITE}
                    loader={gumletLoader}
                    alt="hand-burger-menu-icon-white"
                  />
                  <Image
                    width={18}
                    height={12}
                    className="h-[12px] cursor-pointer w-[18px] min-h-3 hover:scale-110 dark:hidden inline"
                    src={IMAGES.HAND_BURGER_MENU_ICON_BLACK}
                    loader={gumletLoader}
                    alt="hand-burger-menu-icon-black"
                  />
                </div>
              </div> */}
            </>
          )}
        </div>
      </nav>
      {/* profile dropdown start */}
      {/* <ProfileDropdown/> */}
      {showProfileDropdown ? (
        <div className="profile-dropdown fixed z-50 w-screen h-screen sm:hidden hover:cursor-pointer   bg-bg-secondary-light dark:bg-[#1A1A1A] text-text-primary-light dark:text-text-primary-dark">
          <div className="max-h-[90%] overflow-y-scroll">
            <AddressHeader
              iconClickEvent={handBurgerMenuClickHandler}
              className="py-[17px]"
              iconClassName="left-[16px]"
            >
              My Account
            </AddressHeader>
            <ProfileDropdown menuOptions={menuOptions} signOut={signOut} />
            {!userInfo?.accountId ? (
              <Button
                onClick={handleLogin}
                buttonType="primary"
                className=" h-[48px] w-[343px] rounded-[4px] block font-[600] absolute bottom-[10%] left-[50%] translate-x-[-50%]"
              >
                Login
              </Button>
            ) : null}

            <div className=" switch absolute left-[50%] translate-x-[-50%] bottom-[15px] flex justify-between bg-[#EDEDED] dark:bg-[#2C2C2C] w-[95px] h-[40px] border-2 rounded-[100px] mx-auto">
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  e.preventDefault();
                  activeThemeChange();
                }}
                onClick={activeThemeChange}
                className={'left flex items-center justify-center w-[36px] h-[36px] rounded-full dark:bg-[#4A4A4A]'}
              >
                <MoonIcon ariaLabel="moon_icon" primaryColor={theme ? '#FFFFFF' : '#929293'} />
              </div>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  e.preventDefault();
                  activeThemeChange();
                }}
                onClick={activeThemeChange}
                className={
                  'left flex items-center justify-center w-[36px] h-[36px] rounded-full dark:bg-[#2C2C2C] bg-[#FFFFFF]'
                }
              >
                <SunIcon ariaLabel="sun_icon" primaryColor={theme ? '#FFFFFF' : '#202020'} />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* profile dropdown end */}
    </>
  );
};

export default Header;
