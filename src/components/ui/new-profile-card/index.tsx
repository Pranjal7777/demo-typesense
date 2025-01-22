import React, { FC, useState } from 'react';
// import { PROFILE_IMAGE } from '../../../../public/images/productcard';
import Rating from '../rating';
import { appClsx } from '@/lib/utils';
import Button from '../button';
import { HIDE_SELLER_FLOW } from '@/config';
import Link from 'next/link';
import UserProfile from '../user-profile';
import Model from '@/components/model';
import FollowDetails from './follow-details';
import { SellerProfileType } from '@/store/types/seller-profile-type';
type Props = {
  cardClass?: string;
  fullNameClass?: string;
  userNameClass?: string;
  ratingClass?: string;
  starColor?: string;
  ratingText?: string;
  ratingTextClass?: string;
  ratingValue?: number;
  buttonClass?: string;
  buttonType?: string;
  profilePic: string;
  userName?: string;
  fullName?: string;
  buttonText?: string;
  showFollowingSection?: boolean;
  followingSectionClass?: string;
  totalFollowers?: number;
  totalFollowing?: number;
  followButtonHandler?: () => void;
  showFollowButton?: boolean;
  bio?: string;
  firstName?: string;
  lastName?: string;
  profileLink?: string;
};
const NewProfileCard: FC<Props> = ({
  cardClass,
  fullNameClass,
  userNameClass,
  starColor,
  ratingClass,
  ratingText,
  ratingTextClass,
  buttonClass,
  buttonType,
  profilePic,
  fullName,
  userName,
  buttonText,
  ratingValue = 0,
  showFollowingSection = true,
  followingSectionClass,
  totalFollowers,
  totalFollowing,
  followButtonHandler,
  showFollowButton = true,
  bio,
  profileLink,
  firstName,
  lastName,
}) => {
  // const profileSrc = profilePic ? (profilePic.includes('http') ? profilePic : `${STATIC_IMAGE_URL}/${profilePic}`) : '';
  // const { theme } = useTheme();

  // follow and followers code start

  const [totalUserFollowers, setTotalUserFollowers] = useState(totalFollowers || 0);
  const [totalUserFollowing, setTotalUserFollowing] = useState(totalFollowing || 0);

  const [activeTab, setActiveTab] = useState('');
   const [isOpen, setIsOpen] = useState(false);
   const handleClose = () => {
    setIsOpen(false);
   }
   const handleOpen = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(true);
   }
  // follow and followers code end

  return (
    <>
      <div className={appClsx('w-full flex flex-col items-center md:items-start gap-1', cardClass)}>
        <UserProfile
          className="w-[100px] h-[100px] md:w-[100px] md:h-[100px]"
          textContainerClassName="text-3xl md:text-3xl"
          firstName={firstName}
          lastName={lastName}
          profilePicUrl={profilePic}
        />

        <h1
          className={appClsx(
            'text-[20px] mt-2 md:mt-3 text-text-primary-light dark:text-text-primary-dark font-semibold leading-[30px]',
            fullNameClass
          )}
        >
          {fullName}
        </h1>
        <span
          className={appClsx(
            'text-text-tertiary-light dark:text-text-tertiary-dark text-[14px] leading-[21px] ',
            userNameClass
          )}
        >
          {userName}
        </span>
        <Rating
          value={ratingValue}
          itemClassName={ratingTextClass}
          color={starColor}
          className={ratingClass}
          text={ratingText}
        />
        <div className="w-full flex flex-col-reverse gap-3 mt-3">
          {showFollowButton && (
            <Button
              onClick={followButtonHandler}
              buttonType={buttonType}
              className={appClsx(buttonClass, 'my-0 sm:max-w-full')}
            >
              {buttonText}
            </Button>
          )}
          <div className="w-full">
            {profileLink && (
              <Link className="text-xs break-all text-link-primary word-break-all" target="_blank" href={profileLink}>
                Visit Website
              </Link>
            )}

            {<p className="text-xs text-text-secondary-dark dark:text-text-primary-dark break-words">{bio}</p>}
          </div>
        </div>

        {!HIDE_SELLER_FLOW && showFollowingSection && (
          <div
            className={appClsx(
              'w-full flex gap-4 mt-1 md:mt-2 text-sm font-medium text-text-secondary-dark dark:text-text-primary-dark',
              followingSectionClass
            )}
          >
            <span className="cursor-pointer" onClick={() => handleOpen('followers')}>{`${
              totalUserFollowers || '0 '
            } followers`}</span>
            <span className="cursor-pointer" onClick={() => handleOpen('following')}>{`${
              totalUserFollowing || '0 '
            } following`}</span>
          </div>
        )}
      </div>
      {!HIDE_SELLER_FLOW && isOpen && <Model closeIconClassName='top-[26px]' className='sm:rounded-[12px] min-h-screen sm:min-h-fit rounded-none sm:h-[500px] max-w-screen sm:max-w-[460px] flex flex-col dark:bg-bg-secondary-dark' onClose={handleClose} >
        <FollowDetails setTotalUserFollowers={setTotalUserFollowers} setTotalUserFollowing={setTotalUserFollowing} title={activeTab === 'followers' ? 'Followers' : 'Following'}/>
        </Model>}
    </>
  );
};
export default NewProfileCard;
