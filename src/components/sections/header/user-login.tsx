import { generateDeviceId } from '@/helper/generate-device-id';
// import { IMAGES } from '@/lib/images';
import authApi from '@/store/api-slices/auth';
import { RequestLogoutPayload } from '@/store/types';
import { useActions, useAppSelector } from '@/store/utils/hooks';
import { useTranslation } from 'next-i18next';
// import Image from 'next/image';
// import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'sonner';
import ProfileDropdown from '../profile-dropdown';
import DownArrowRoundedEdge from '../../../../public/assets/svg/down-arrow-rounded-edge';
import { removeCookie } from '@/utils/cookies';
import UpArrowRoundedEdge from '../../../../public/assets/svg/up-arrow-rounded-edge';
import Image from 'next/image';
import { STATIC_IMAGE_URL } from '@/config';
type menuOptions = {
  item: string;
};

type UserLoginProps = { primaryColor?: any };

const UserLogin: React.FC<UserLoginProps> = ({primaryColor}) => {
  const { t } = useTranslation('common');
  const menuOptions = t('page.menuOptions', { returnObjects: true }) as menuOptions[];
  const userInfo = useAppSelector((state) => state.auth.userInfo);  
  const [isHovered, setIsHovered] = useState(false);

  const deviceId = generateDeviceId();
  const { setRemoveUserDataDispatch, setGuestTokenDispatch } = useActions();
  const storedRefreshToken = useAppSelector((state) => state.auth.token?.refreshToken);
  const [logout] = authApi.useLogoutMutation();
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
        const { data } = await getGuestToken().unwrap();
        setGuestTokenDispatch(data?.token);
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
      removeCookie('isUserAuth');
      removeCookie('accessToken');
      removeCookie('userInfo');
      localStorage.clear();
      toast.success('You have logged out successfully.');
      window.location.href = '/';
    }
  };


  return (
    <>
      <div className="relative md:flex md:text-sm sm:text-[12px] h-full w-full">
        <div className="h-full w-full cursor-pointer px-2 flex gap-1  items-center justify-between">
          {userInfo?.profilePic ? (
            <Image
              src={userInfo?.profilePic.includes('http') ? userInfo?.profilePic : `${STATIC_IMAGE_URL}/${userInfo?.profilePic}`}
              alt="profile"
              width={54}
              height={37}
              className="rounded-full min-h-8 max-h-8 min-w-8 max-w-8 object-cover"
            />
          ) : (
            <div className="border-2 min-h-8 max-h-8 min-w-8 max-w-8 flex items-center justify-center rounded-full text-sm text-center bg-bg-tertiary-light text-text-primary-light font-semibold">
              {(userInfo?.firstName?.[0] + '' + (userInfo?.lastName?.[0] || '')).toLocaleUpperCase()}
            </div>
          )}
          <div
            className="justify-center h-full flex w-full text-nowrap flex-nowrap items-center text-sm"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {`${userInfo?.firstName} ${userInfo?.lastName}`}
          </div>
          <div>
            {isHovered ? (
              <UpArrowRoundedEdge primaryColor={primaryColor} />
            ) : (
              <DownArrowRoundedEdge primaryColor={primaryColor} />
            )}
          </div>
        </div>

        {isHovered && (
          <div
            className={`hover:cursor-pointer !min-w-[230px] rounded-lg p-2 !font-semibold absolute z-50 sm:mt-[0px] md:mt-[69px] right-0 bg-bg-secondary-light dark:bg-bg-nonary-dark text-text-primary-light dark:text-text-primary-dark`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <ProfileDropdown menuOptions={menuOptions} signOut={signOut} />
          </div>
        )}
      </div>
    </>
  );
};

export default UserLogin;
