import React, { FC, useEffect, useMemo, useState } from 'react';
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
const PrimaryLogo = dynamic(() => import('../../../../public/assets/svg/primary-logo'), { ssr: false });
import ProfileDropdown from '../profile-dropdown';
import { RequestLogoutPayload } from '@/store/types';
import { generateDeviceId } from '@/helper/generate-device-id';
import authApi from '@/store/api-slices/auth';
import { toast } from 'sonner';
import AddressHeader from '../address-header';
const MoonIcon = dynamic(() => import('../../../../public/assets/svg/moon-icon'), { ssr: false });
const SunIcon = dynamic(() => import('../../../../public/assets/svg/sun-icon'), { ssr: false });
import HeaderDropdown from '@/components/ui/header-drop-down';
import { useNewWindowScroll } from '@/hooks/new-use-window-scroll';
const CategoriesIcon = dynamic(() => import('../../../../public/assets/svg/categories-icon'), { ssr: false });
const HamburgerMenuIcon = dynamic(() => import('../../../../public/assets/svg/hamburger-icon'), { ssr: false });
const ChatIcon = dynamic(() => import('../../../../public/assets/svg/chat-icon1'), { ssr: false });
const FeedsIcon = dynamic(() => import('../../../../public/assets/svg/feed-icon'), { ssr: false });
const NotificationIcon = dynamic(() => import('../../../../public/assets/svg/notification-icon'), { ssr: false });
import { removeCookie } from '@/utils/cookies';
const LeftArrowIcon = dynamic(() => import('../../../../public/assets/svg/left-arrow-icon'), { ssr: false });
import { HIDE_SELLER_FLOW, STATIC_IMAGE_URL } from '@/config';
import HartSvg from '../../../../public/assets/svg/heart';
import { appClsx } from '@/lib/utils';
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
  containerClassName?: string;
  mobileContainerClassName?: string;
};

////////////////////////////////////////
type menuOptions = {
  item: string;

};
///////////////////////////////////////

const Header: FC<Props> = ({
  stickyHeaderWithSearchBox = false,
  showItems:showNoOfItems = 6,
  // categoriesWithChildCategories,
  containerClassName,
  mobileContainerClassName,
}) => {
  const { theme, toggleTheme } = useTheme();
  const minThreshold = useNewWindowScroll(0);
  const maxThreshold = useNewWindowScroll(130);
  const windowWidth = useWindowResize();
  const [showItems, setShowItems] = useState(showNoOfItems);

  const { categories } = useAppSelector((state: RootState) => state.auth);

  const { t } = useTranslation('common');
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
  const sellPage = () => {
    if (userInfo) {
      // write the code to route to sell page
    } else {
      router.push(SIGN_IN_PAGE);
    }
  };

  const CategoriesInMobileRoute = ['/search', '/categories'];
const showCategoriesInMobile = useMemo(() => {
  const router = useRouter();
  return CategoriesInMobileRoute.some((route) => router.pathname.startsWith(route));
}, [router.pathname]);

 useEffect(() => {
  if (window.innerWidth > 1320) {
    setShowItems(6);
  } else if (window.innerWidth > 1144) {
    setShowItems(5);
  } else if (window.innerWidth > 963) {
    setShowItems(3);
  } else if (window.innerWidth > 831) {
    setShowItems(2);
  } else if (window.innerWidth > 634) {
    setShowItems(1);
  } else {
    setShowItems(0);
  }
 }, []);

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

  const activeThemeChange = () => {
    toggleTheme();
  };

  const handBurgerMenuClickHandler = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <>
      <CategoriesDrawer
        isSearchCategoriesDrower={isSearchCategoriesDrower}
        changMenu={changMenu}
        // data={categoriesWithChildren}
      />
      {/* // desktop,letop,tab screen  */}

      <nav
        // ${windowWidth <= 639 && 'hidden'}
        className={appClsx(
          `z-[2] mobile:hidden ${
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
          } h-[69px] w-full fixed top-0 text-sm font-medium capitalize transition ease-in-out duration-2000`,
          containerClassName
        )}
      >
        <div className=" max-w-[1440px] px-[64px] m-auto h-full flex items-center justify-between">
          <div className="flex items-center h-full w-[65%]">
            <Link aria-label="Brand Logo" className="sm:mb-2" href="/">
              <PrimaryLogo
                ariaLabel="primary-logo"
                primaryColor={`${
                  stickyHeaderWithSearchBox
                    ? theme
                      ? 'var(--icon-primary-dark)'
                      : 'var(--icon-primary-light)'
                    : theme
                    ? minThreshold
                      ? 'var(--icon-primary-dark)'
                      : 'var(--icon-primary-dark)'
                    : minThreshold
                    ? 'var(--icon-primary-light)'
                    : 'var(--icon-primary-dark)'
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
                        ? 6
                        : windowWidth > 1144
                        ? 5
                        : windowWidth >= 1144
                        ? 3
                        : windowWidth >= 963
                        ? 3
                        : windowWidth >= 831
                        ? 2
                        : windowWidth >= 634
                        ? 1
                        : 0
                    )
                    .map((item, index) => (
                      <HeaderDropdown key={index} item={item} />
                    ))
                }
              </>

              <li className="flex mx-4 items-center justify-center">
                <button className="flex items-center justify-center" onClick={() => changMenu()}>
                  <CategoriesIcon
                    color={`${
                      stickyHeaderWithSearchBox
                        ? theme
                          ? 'var(--icon-primary-dark)'
                          : 'var(--icon-primary-light)'
                        : theme
                        ? minThreshold
                          ? 'var(--icon-primary-dark)'
                          : 'var(--icon-primary-dark)'
                        : minThreshold
                        ? 'var(--icon-primary-light)'
                        : 'var(--icon-primary-dark)'
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
                <div className="hidden md:flex gap-6 ">
                  {/* for like route */}
                  <div className="cursor-pointer">
                    <HartSvg
                      height="24"
                      width="24"
                      onClick={() => router.push('/my-favorites')}
                      className="hover:scale-105"
                      borderColor={`${
                        stickyHeaderWithSearchBox
                          ? theme
                            ? 'var(--icon-primary-dark)'
                            : 'var(--icon-primary-light)'
                          : theme
                          ? minThreshold
                            ? 'var(--icon-primary-dark)'
                            : 'var(--icon-primary-dark)'
                          : minThreshold
                          ? 'var(--icon-primary-light)'
                          : 'var(--icon-primary-dark)'
                      }`}
                    />
                  </div>
                  {!HIDE_SELLER_FLOW && (
                    <div className="cursor-pointer relative">
                      <NotificationIcon
                        className="hover:scale-105"
                        primaryColor={`${
                          stickyHeaderWithSearchBox
                            ? theme
                              ? 'var(--icon-primary-dark)'
                              : 'var(--icon-primary-light)'
                            : theme
                            ? minThreshold
                              ? 'var(--icon-primary-dark)'
                              : 'var(--icon-primary-dark)'
                            : minThreshold
                            ? 'var(--icon-primary-light)'
                            : 'var(--icon-primary-dark)'
                        }`}
                      />
                    </div>
                  )}
                </div>
              )}

              {userInfo ? (
                <UserLogin
                  primaryColor={`${
                    stickyHeaderWithSearchBox
                      ? theme
                        ? 'var(--icon-primary-dark)'
                        : 'var(--icon-primary-light)'
                      : theme
                      ? minThreshold
                        ? 'var(--icon-primary-dark)'
                        : 'var(--icon-primary-dark)'
                      : minThreshold
                      ? 'var(--icon-primary-light)'
                      : 'var(--icon-primary-dark)'
                  }`}
                />
              ) : (
                <Link aria-label="Login" className="mx-9 " href={SIGN_IN_PAGE}>
                  {' '}
                  {loginOrUserName.login}
                </Link>
                // <div className=" mx-9" onClick={changeisLoginModalOpen}> {loginOrUserName.login}</div>
              )}
            </HydrationGuard>
          </div>
        </div>
      </nav>

      {isLoginModalOpen && <LoginWithPhoneModel changeisLoginModalOpen={changeisLoginModalOpen} />}

      {/* <CategoryDrower className={`sm:hidden mobile:inline-block ${searchCategoryDrower && "!hidden"} transition duration-700`} searchCategoryDrower={searchCategoryDrower} setsearchCategoryDrower={setsearchCategoryDrower}/> */}
      <nav
        style={{ zIndex: 1 }}
        className={appClsx(
          ` border-error ${stickyHeaderWithSearchBox && 'bg-bg-secondary-light dark:bg-bg-secondary-dark'} ${
            minThreshold && 'dark:bg-bg-primary-dark bg-bg-secondary-light'
          } mobile:inline-block sm:hidden h-[69px] w-full fixed top-0  flex items-center justify-center px-[16px]`,
          mobileContainerClassName
        )}
      >
        <div className=" flex items-center justify-between h-full w-full max-w-[638px]">
          <div className={` flex items-center ${stickyHeaderWithSearchBox && 'mobile:hidden'} `}>
            <HamburgerMenuIcon
              className="h-[12px] cursor-pointer w-[18px] min-h-3 hover:scale-110"
              onClick={handBurgerMenuClickHandler}
              primaryColor={`${
                !(minThreshold && theme !== true) ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'
              }`}
            />
            <Link aria-label="Brand Logo" className="pl-5 rtl:pl-0 rtl:pr-6 mb-[5px]" href="/">
              <PrimaryLogo
                ariaLabel="primary-logo"
                height={28}
                width={99}
                primaryColor={`${
                  stickyHeaderWithSearchBox
                    ? theme
                      ? 'var(--icon-primary-dark)'
                      : 'var(--icon-primary-light)'
                    : theme
                    ? minThreshold
                      ? 'var(--icon-primary-dark)'
                      : 'var(--icon-primary-dark)'
                    : minThreshold
                    ? 'var(--icon-primary-light)'
                    : 'var(--icon-primary-dark)'
                }`}
              />
            </Link>
          </div>
          <div className={` flex items-center justify-evenly  h-full ${stickyHeaderWithSearchBox && 'mobile:hidden'} `}>
            <div className=" text-text-secondary-light flex-1 w-[40%]">
              <HydrationGuard>
                {!userInfo && (
                  <Link
                    aria-label="Login"
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
                )}
              </HydrationGuard>
            </div>
          </div>

          {stickyHeaderWithSearchBox && (
            <>
              <div className=" relative w-12 h-12 flex items-center justify-center">
                <Link aria-label="left-arrow" className="relative w-12 h-12 flex items-center justify-center" href="/">
                  <LeftArrowIcon
                    ariaLabel="left-arrow"
                    className="hover:cursor-pointer absolute left-0"
                    height="18"
                    width="18"
                    primaryColor={theme ? '#FFFFFF' : '#202020'}
                  />
                </Link>
              </div>
            </>
          )}
          {/* mobile header right side start */}
          {showCategoriesInMobile && (
            <div className="flex items-center justify-center gap-3">
              <CategoriesIcon
                height="19"
                width="19"
                onClick={() => changMenu()}
                color={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'}
              />
              <ChatIcon height='21' width='21' primaryColor={theme ? 'var(--icon-primary-dark)' : 'var(--icon-primary-light)'} />
              <HydrationGuard>
                {userInfo ? (
                  userInfo?.profilePic ? (
                    <Image
                      onClick={() => router.push(`/profile/${userInfo?.fullName.replace(/\s+/g, '')}`)}
                      src={
                        userInfo?.profilePic.includes('http')
                          ? userInfo?.profilePic
                          : `${STATIC_IMAGE_URL}/${userInfo?.profilePic}`
                      }
                      alt="profile"
                      width={54}
                      height={37}
                      className="rounded-full min-h-8 max-h-8 min-w-8 max-w-8 object-cover"
                    />
                  ) : (
                    <div className="border-2 min-h-8 max-h-8 min-w-8 max-w-8 flex items-center justify-center rounded-full text-sm text-center bg-bg-tertiary-light text-text-primary-light font-semibold">
                      {(userInfo?.firstName?.[0] + '' + (userInfo?.lastName?.[0] || '')).toLocaleUpperCase()}
                    </div>
                  )
                ) : (
                  <Link
                    aria-label="Login"
                    className={'rtl:mr-0 flex items-center justify-center text-text-secondary-light'}
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
                )}
              </HydrationGuard>
            </div>
          )}

          {/* mobile header right side end */}
        </div>
      </nav>
      {/* profile dropdown start */}
      {/* <ProfileDropdown/> */}
      {showProfileDropdown ? (
        <div className="profile-dropdown fixed z-50 w-screen h-screen sm:hidden hover:cursor-pointer  bg-bg-secondary-light dark:bg-[#1A1A1A] text-text-primary-light dark:text-text-primary-dark">
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
